// controllers
import {
  deleteEventTicket,
  getEventTicket,
  putEventTicket,
  validateEventTicket,
} from 'server/controllers/event/event.controller';
// middlewares
import { authMiddleware } from 'server/middlewares';
// router
import { errorHandler, router } from 'server/router';

export default router()
  .use(authMiddleware)
  .get(getEventTicket)
  .put(validateEventTicket, putEventTicket)
  .delete(deleteEventTicket)
  .handler(errorHandler());
