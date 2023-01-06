// controllers
import {
  signIn,
  validateSignIn,
} from 'server/controllers/auth/auth.controller';
// router
import router from 'server/router';

export default router().use(validateSignIn).post(signIn);
