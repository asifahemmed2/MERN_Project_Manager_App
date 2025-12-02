import { Router } from 'express';
import { validateRequest } from 'zod-express-middleware';
import {
  emailSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
  verifySchema,
} from '../utils/validate-schema.js';
import { resetPasswordRequest, signIn, signUp, verifyEmail, verifyResetPasswordTokenAndResetPassword } from '../controllers/auth.controller.js';


const router = Router();

router.post(
  '/sign-up',
  validateRequest({
    body: signUpSchema,
  }),
  signUp
);
router.post(
  '/verify-email',
  validateRequest({
    body: verifySchema,
  }),
  verifyEmail
);

router.post(
  '/sign-in',
  validateRequest({
    body: signInSchema,
  }),
  signIn
);

router.post(
  '/reset-password-request',
  validateRequest({
    body: emailSchema,
  }),
  resetPasswordRequest
);

router.post(
  '/reset-password',
  validateRequest({
    body: resetPasswordSchema,
  }),
  verifyResetPasswordTokenAndResetPassword
);

export default router;
