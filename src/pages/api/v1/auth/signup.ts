// controllers
import {
  signup,
  validateSignup,
} from 'server/controllers/auth/auth.controller';
// router
import { errorHandler, router } from 'server/router';

export default router().post(validateSignup, signup).handler(errorHandler());
