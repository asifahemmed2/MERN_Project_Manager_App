import User from "../models/user.model.js";
import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";
import asyncHandler from "../utils/async-handler.js";
import bcrypt from "bcryptjs";

export const signUp = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;
  const existingUser = await User.findOne({ email });
  if(existingUser) throw ApiError.badRequest("User already exists");
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await User.create({ email, password: hashedPassword, name });
  ApiResponse.created(res, user, "Verification email sent to your email address. Please check and verify your account");
});

export const signIn = asyncHandler(async (req, res) => {
  res.send('Sign in');
})
