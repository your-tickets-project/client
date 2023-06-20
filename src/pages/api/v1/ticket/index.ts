// controllers
import { getTickets } from 'server/controllers/ticket/ticket.controller';
// middlewares
import { authMiddleware } from 'server/middlewares';
// router
import { errorHandler, router } from 'server/router';

export default router()
  .use(authMiddleware)
  .get(getTickets)
  .handler(errorHandler());
