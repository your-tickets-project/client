// controllers
import {
  getEventBasicInfo,
  putEventBasicInfo,
  validateEventBasicInfo,
} from 'server/controllers/event/event.controller';
// middlewares
import { authMiddleware } from 'server/middlewares';
// router
import { errorHandler, router } from 'server/router';

export default router()
  .use(authMiddleware)
  .get(getEventBasicInfo)
  .put(validateEventBasicInfo, putEventBasicInfo)
  .handler(errorHandler());
