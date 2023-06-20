// controllers
import {
  postOrder,
  validateOrder,
} from 'server/controllers/orders/orders.controller';
// middlewares
import { authMiddleware } from 'server/middlewares';
// router
import { errorHandler, router } from 'server/router';

export default router()
  .use(authMiddleware)
  .post(validateOrder, postOrder)
  .handler(errorHandler());
