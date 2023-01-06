// controllers
import { checkUser } from 'server/controllers/auth/auth.controller';
// middlewares
import { authMiddleware } from 'server/middlewares';
// router
import router from 'server/router';

export default router().use(authMiddleware).get(checkUser);
