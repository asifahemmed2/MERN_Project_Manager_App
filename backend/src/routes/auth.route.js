import { Router } from 'express';
import { validateRequest } from 'zod-express-middleware';
import { signInSchema, signUpSchema } from '../utils/validate-schema.js';
import { signIn, signUp } from '../controllers/auth.controller.js';

const router = Router();

router.post(
  '/sign-up',
  validateRequest({
    body: signUpSchema,
  }),
  signUp
);
router.post('/sign-in',validateRequest({
  body: signInSchema
},
signIn
));


export default router;
