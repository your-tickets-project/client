// controllers
import { deleteEventDashboard } from 'server/controllers/event/event.controller';
// middlewares
import { authMiddleware } from 'server/middlewares';
// router
import { errorHandler, router } from 'server/router';

export default router()
  .use(authMiddleware)
  .delete(deleteEventDashboard)
  .handler(errorHandler());
