// controllers
import {
  postEventBasicInfo,
  validateEventBasicInfo,
} from 'server/controllers/event/event.controller';
// middlewares
import { authMiddleware } from 'server/middlewares';
// router
import { errorHandler, router } from 'server/router';

export default router()
  .use(authMiddleware)
  .post(validateEventBasicInfo, postEventBasicInfo)
  .handler(errorHandler());
