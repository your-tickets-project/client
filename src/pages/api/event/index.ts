// controllers
import { getEvents } from 'server/controllers/event/event.controller';
// router
import { errorHandler, router } from 'server/router';

export default router().get(getEvents).handler(errorHandler());
