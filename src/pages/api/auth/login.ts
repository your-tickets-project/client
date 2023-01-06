// controllers
import { logIn, validateLogIn } from 'server/controllers/auth/auth.controller';
// router
import router from 'server/router';

export default router().use(validateLogIn).post(logIn);
