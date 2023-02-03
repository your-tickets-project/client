// controllers
import {
  signIn,
  validateSignIn,
} from 'server/controllers/auth/auth.controller';
// router
import { errorHandler, router } from 'server/router';

export default router().post(validateSignIn, signIn).handler(errorHandler());
