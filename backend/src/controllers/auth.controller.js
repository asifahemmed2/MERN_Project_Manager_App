import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import Verification from '../models/verification.model.js';
import { sendVerificationEmail } from '../services/resend.js';
import ApiError from '../utils/api-error.js';
import ApiResponse from '../utils/api-response.js';
import asyncHandler from '../utils/async-handler.js';
import generateToken from '../utils/generate-token.js';
import aj from '../services/arcjet.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../utils/env.js';

export const signUp = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;
  const decision = await aj.protect(req, { email });
  console.log('Arcjet decision', decision.isDenied());
  if (decision.isDenied()) throw ApiError.forbidden('Invalid email address');
  const existingUser = await User.findOne({ email });
  if (existingUser) throw ApiError.badRequest('User already exists');
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = await User.create({ email, password: hashedPassword, name });
  const verificationToken = generateToken(
    { userId: newUser._id, purpose: 'email-verification' },
    '1h'
  );
  await Verification.create({
    userId: newUser._id,
    token: verificationToken,
    expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000),
  });
  const isEmailSent = await sendVerificationEmail(email, "verify-email" ,verificationToken);
  if (!isEmailSent.success) throw ApiError.internal();
  ApiResponse.created(
    res,
    newUser,
    'Verification email sent to your email address. Please check and verify your account'
  );
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.body;
  const payload = jwt.verify(token, JWT_SECRET);
  if (!payload) throw ApiError.unauthorized();
  const { userId, purpose } = payload;
  if (purpose !== 'email-verification') throw ApiError.unauthorized();
  const verification = await Verification.findOne({
    userId,
    token,
  });
  if (!verification) throw ApiError.unauthorized();
  const isTokenExpired = verification.expiresAt < new Date();
  if (isTokenExpired) throw ApiError.unauthorized('Token expired');
  const user = await User.findById(userId);
  if (!user) throw ApiError.unauthorized();
  if (user.isEmailVerified) throw ApiError.badRequest('Email already verified');
  user.isEmailVerified = true;
  await user.save();
  await Verification.findByIdAndDelete(verification._id);
  ApiResponse.success(res, user, 'Email verified successfully');
});

export const signIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw ApiError.unauthorized('Invalid email or password');
  if (!user.isEmailVerified) {
    const existingVerification = await Verification.findOne({
      userId: user._id,
    });

    if (existingVerification && existingVerification.expiresAt > new Date())
      throw ApiError.unauthorized('Email not verified');

    await Verification.findByIdAndDelete(existingVerification._id);
    const verificationToken = generateToken(
      { userId: user._id, purpose: 'email-verification' },
      '1h'
    );
    await Verification.create({
      userId: user._id,
      token: verificationToken,
      expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000),
    });
    const isEmailSent = await sendVerificationEmail(email, "verify-email", verificationToken);
    if (!isEmailSent.success) throw ApiError.internal();
    ApiResponse.created(
      res,
      'Verification email sent to your email address. Please check and verify your account'
    );
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw ApiError.badRequest('Invalid credentials');
  const token = generateToken({ userId: user._id, purpose: 'login' }, '7d');
  user.lastLogin = new Date();
  await user.save();
  const userData = user.toObject();
  delete userData.password;
  const data = { userData, token };
  ApiResponse.success(res, data, 'Login successful');
});

export const resetPasswordRequest = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw ApiError.badRequest('User not found');
  if (!user.isEmailVerified) throw ApiError.badRequest('Email not verified');
  const existingVerification = await Verification.findOne({
    userId: user._id,
  });
  if (existingVerification && existingVerification.expiresAt > new Date())
    throw ApiError.badRequest('Reset password request has already sent');
  if (existingVerification && existingVerification.expiresAt < new Date()) {
    await Verification.findByIdAndDelete(existingVerification._id);
  }
  const resetPasswordToken = generateToken(
    { userId: user._id, purpose: 'reset-password' },
    '15m'
  );

  await Verification.create({
    userId: user._id,
    token: resetPasswordToken,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
  });
  const isEmailSent = await sendVerificationEmail(email,"reset-password", resetPasswordToken);
  if (!isEmailSent) throw ApiError.internal("Email couldn't be sent");
  ApiResponse.success(res, null, 'Reset password request sent successfully');
});

export const verifyResetPasswordTokenAndResetPassword = asyncHandler(
  async (req, res) => {
    const { token, newPassword, confirmPassword } = req.body;
    const payload = jwt.verify(token, JWT_SECRET);
    if (!payload) throw ApiError.unauthorized();
    const { userId, purpose } = payload;
    if (purpose !== 'reset-password') throw ApiError.unauthorized();
    const verification = await Verification.findOne({
      userId,
      token,
    });
    if (!verification) throw ApiError.unauthorized();
    const isTokenExpired = verification.expiresAt < new Date();
    if (isTokenExpired) throw ApiError.unauthorized('Token expired');
    const user = await User.findById(userId);
    if (!user) throw ApiError.unauthorized();
    if (newPassword !== confirmPassword)
      throw ApiError.badRequest('Passwords do not match');
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashPassword;
    await user.save();
    await Verification.findByIdAndDelete(verification._id);
    ApiResponse.success(res, null, 'Password reset successfully');
  }
);
