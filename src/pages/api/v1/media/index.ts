// controllers
import { postMedia } from 'server/controllers/media/media.controller';
// middlewares
import { authMiddleware, multerMiddleware } from 'server/middlewares';
// router
import { errorHandler, router } from 'server/router';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default router()
  // @ts-ignore
  .use(authMiddleware, multerMiddleware)
  .post(postMedia)
  .handler(errorHandler());
