// controllers
import { logIn, validateLogIn } from 'server/controllers/auth/auth.controller';
// router
import { errorHandler, router } from 'server/router';

export default router().post(validateLogIn, logIn).handler(errorHandler());
