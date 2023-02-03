import { NextApiResponse } from 'next';
import { NextApiRequestExtended } from 'server/router';
// data
import { findEvent, findEvents } from 'server/data/event/event.data';
// exceptions
import { BadRequestException } from 'server/exceptions';
// http status codes
import { OK_STATUS } from 'server/constants/http.status';

export const getEvents = async (
  req: NextApiRequestExtended,
  res: NextApiResponse
) => {
  const events = await findEvents();
  res.status(OK_STATUS).json({ events });
};

export const getEvent = async (
  req: NextApiRequestExtended,
  res: NextApiResponse
) => {
  if (!req.query.slug) {
    throw new BadRequestException('Slug is required');
  }

  const event = await findEvent({ slug: req.query.slug as string });
  res.status(OK_STATUS).json({ event });
};
