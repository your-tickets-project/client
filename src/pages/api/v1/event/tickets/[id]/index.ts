// controllers
import {
  getEventTickets,
  postEventTicket,
  validateEventTicket,
} from 'server/controllers/event/event.controller';
// middlewares
import { authMiddleware } from 'server/middlewares';
// router
import { errorHandler, router } from 'server/router';

export default router()
  .use(authMiddleware)
  .get(getEventTickets)
  .post(validateEventTicket, postEventTicket)
  .handler(errorHandler());
