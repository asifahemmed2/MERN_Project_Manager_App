import { Router } from 'express';
import { validateRequest } from 'zod-express-middleware';
import {
  signInSchema,
  signUpSchema,
  verifySchema,
} from '../utils/validate-schema.js';
import { signIn, signUp, verifyEmail } from '../controllers/auth.controller.js';

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
  validateRequest(
    {
      body: signInSchema,
    },
  ),
  signIn
);

export default router;
