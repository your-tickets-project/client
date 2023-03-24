// controllers
import {
  deleteMedia,
  getMedia,
} from 'server/controllers/media/media.controller';
// middlewares
import { authMiddleware } from 'server/middlewares';
// router
import { errorHandler, router } from 'server/router';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default router()
  .get(getMedia)
  .delete(authMiddleware, deleteMedia)
  .handler(errorHandler());
