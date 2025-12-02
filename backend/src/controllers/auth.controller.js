import User from '../models/user.model.js';
import ApiError from '../utils/api-error.js';
import ApiResponse from '../utils/api-response.js';
import asyncHandler from '../utils/async-handler.js';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generate-token.js';
import Verification from '../models/verification.model.js';
import { sendVerificationEmail } from '../utils/resend.js';

export const signUp = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;
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
  const isEmailSent = await sendVerificationEmail(email, verificationToken);
  if (!isEmailSent.success) throw ApiError.internal();
  ApiResponse.created(
    res,
    newUser,
    'Verification email sent to your email address. Please check and verify your account'
  );
});

export const signIn = asyncHandler(async (req, res) => {
  res.send('Sign in');
});
