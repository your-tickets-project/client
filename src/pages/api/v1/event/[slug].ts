// controllers
import { getEvent } from 'server/controllers/event/event.controller';
// router
import { errorHandler, router } from 'server/router';

export default router().get(getEvent).handler(errorHandler());
