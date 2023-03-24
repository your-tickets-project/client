// controllers
import { getEventBySlug } from 'server/controllers/event/event.controller';
// router
import { errorHandler, router } from 'server/router';

export default router().get(getEventBySlug).handler(errorHandler());
