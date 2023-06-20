// controllers
import { getOrders } from 'server/controllers/orders/orders.controller';
// middlewares
import { authMiddleware } from 'server/middlewares';
// router
import { errorHandler, router } from 'server/router';

export default router()
  .use(authMiddleware)
  .get(getOrders)
  .handler(errorHandler());
