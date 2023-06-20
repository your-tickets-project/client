import { NextApiResponse } from 'next';
import { NextHandler } from 'next-connect';
import { NextApiRequestExtended } from 'server/router';
// data
import {
  createEventBasicInfo,
  createEventDetail,
  editEventDetail,
  findEventBySlug,
  findEventBasicInfo,
  findEventDetail,
  findEvents,
  editEventBasicInfo,
  findEventTickets,
  findCheckSteps,
  removeEventTicket,
  createEventTicket,
  findEventTicket,
  editEventTicket,
  findEventPreview,
  findEventPreviewPublish,
  editPublishEvent,
  findEventsDashboard,
  cancelEventDashboard,
} from 'server/data/event/event.data';
// exceptions
import { BadRequestException } from 'server/exceptions';
// http status codes
import { CREATED_STATUS, OK_STATUS } from 'server/constants/http.status';
// validations
import {
  strictOptions,
  stripUnknownOptions,
} from 'server/validations/validationOptions';
import {
  EventBasicInfoDto,
  EventDetailDto,
  EventTicketDto,
} from 'server/validations/event';
import { PublishDto } from 'server/validations/event/publish.dto';
import { queryStringParams } from 'server/utils';

/* GET
–––––––––––––––––––––––––––––––––––––––––––––––––– */
export const getEvents = async (
  req: NextApiRequestExtended,
  res: NextApiResponse
) => {
  const events = await findEvents();
  res.status(OK_STATUS).json({ events });
};

export const getEventBySlug = async (
  req: NextApiRequestExtended,
  res: NextApiResponse
) => {
  if (!req.query.slug) {
    throw new BadRequestException('Slug is required.');
  }

  const data = await findEventBySlug({ slug: req.query.slug as string });
  res.status(OK_STATUS).json(data);
};

export const getCheckSteps = async (
  req: NextApiRequestExtended,
  res: NextApiResponse
) => {
  if (!req.query.id) {
    throw new BadRequestException('Id is required.');
  }

  const data = await findCheckSteps({
    eventId: req.query.id as string,
    userId: req.user!.id,
  });
  res.status(OK_STATUS).json(data);
};

export const getEventBasicInfo = async (
  req: NextApiRequestExtended,
  res: NextApiResponse
) => {
  if (!req.query.id) {
    throw new BadRequestException('Id is required.');
  }

  const data = await findEventBasicInfo({
    eventId: req.query.id as string,
    userId: req.user!.id,
  });
  res.status(OK_STATUS).json(data);
};

export const getEventDetail = async (
  req: NextApiRequestExtended,
  res: NextApiResponse
) => {
  if (!req.query.id) {
    throw new BadRequestException('Id is required.');
  }

  const data = await findEventDetail({
    eventId: req.query.id as string,
    userId: req.user!.id,
  });
  res.status(OK_STATUS).json(data);
};

export const getEventTickets = async (
  req: NextApiRequestExtended,
  res: NextApiResponse
) => {
  if (!req.query.id) {
    throw new BadRequestException('Id is required.');
  }

  const data = await findEventTickets({
    eventId: req.query.id as string,
    userId: req.user!.id,
  });
  res.status(OK_STATUS).json(data);
};

export const getEventTicket = async (
  req: NextApiRequestExtended,
  res: NextApiResponse
) => {
  if (!req.query.id) {
    throw new BadRequestException('Id is required.');
  }

  if (!req.query.ticketId) {
    throw new BadRequestException('Ticket id is required.');
  }

  const data = await findEventTicket({
    eventId: req.query.id as string,
    ticketId: req.query.ticketId as string,
    userId: req.user!.id,
  });
  res.status(OK_STATUS).json(data);
};

export const getEventPreviewPublish = async (
  req: NextApiRequestExtended,
  res: NextApiResponse
) => {
  if (!req.query.id) {
    throw new BadRequestException('Id is required.');
  }

  const data = await findEventPreviewPublish({
    eventId: req.query.id as string,
    userId: req.user!.id,
  });
  res.status(OK_STATUS).json(data);
};

export const getEventPreview = async (
  req: NextApiRequestExtended,
  res: NextApiResponse
) => {
  if (!req.query.id) {
    throw new BadRequestException('Id is required.');
  }

  const data = await findEventPreview({
    eventId: req.query.id as string,
    userId: req.user!.id,
  });
  res.status(OK_STATUS).json(data);
};

export const getEventsDashboard = async (
  req: NextApiRequestExtended,
  res: NextApiResponse
) => {
  const params = queryStringParams<{ q?: string }>(req.url);
  const data = await findEventsDashboard({
    q: params.q,
    userId: req.user!.id,
  });
  res.status(OK_STATUS).json(data);
};

/* POST
–––––––––––––––––––––––––––––––––––––––––––––––––– */
export const validateEventBasicInfo = async (
  req: NextApiRequestExtended,
  res: NextApiResponse,
  next: NextHandler
) => {
  try {
    const validation = await EventBasicInfoDto.validate(
      req.body,
      strictOptions
    );
    req.body = await EventBasicInfoDto.validate(
      validation,
      stripUnknownOptions
    );
  } catch (err: any) {
    throw new BadRequestException('Invalid body.', err.errors);
  }

  await next();
};

export const postEventBasicInfo = async (
  req: NextApiRequestExtended,
  res: NextApiResponse
) => {
  const data = await createEventBasicInfo({
    data: req.body,
    userId: req.user!.id,
  });
  res
    .status(CREATED_STATUS)
    .json({ message: 'Created successfully.', insertId: data.insertId });
};

export const validateEventDetail = async (
  req: NextApiRequestExtended,
  res: NextApiResponse,
  next: NextHandler
) => {
  try {
    const validation = await EventDetailDto.validate(req.body, strictOptions);
    req.body = await EventDetailDto.validate(validation, stripUnknownOptions);
  } catch (err: any) {
    throw new BadRequestException('Invalid body.', err.errors);
  }

  await next();
};

export const postEventDetail = async (
  req: NextApiRequestExtended,
  res: NextApiResponse
) => {
  if (!req.query.id) {
    throw new BadRequestException('Id is required.');
  }

  const data = await createEventDetail({
    data: req.body,
    eventId: req.query.id as string,
    userId: req.user!.id,
  });
  res
    .status(CREATED_STATUS)
    .json({ message: 'Event updated.', insertId: data.insertId });
};

export const validateEventTicket = async (
  req: NextApiRequestExtended,
  res: NextApiResponse,
  next: NextHandler
) => {
  try {
    const validation = await EventTicketDto.validate(req.body, strictOptions);
    req.body = await EventTicketDto.validate(validation, stripUnknownOptions);
  } catch (err: any) {
    throw new BadRequestException('Invalid body.', err.errors);
  }

  await next();
};

export const postEventTicket = async (
  req: NextApiRequestExtended,
  res: NextApiResponse
) => {
  if (!req.query.id) {
    throw new BadRequestException('Id is required.');
  }

  await createEventTicket({
    data: req.body,
    eventId: req.query.id as string,
    userId: req.user!.id,
  });
  res.status(CREATED_STATUS).json({ message: 'Event updated.' });
};

/* PUT
–––––––––––––––––––––––––––––––––––––––––––––––––– */
export const putEventBasicInfo = async (
  req: NextApiRequestExtended,
  res: NextApiResponse
) => {
  if (!req.query.id) {
    throw new BadRequestException('Id is required.');
  }

  await editEventBasicInfo({
    data: req.body,
    eventId: req.query.id as string,
    userId: req.user!.id,
  });

  res.status(OK_STATUS).json({ message: 'Event updated.' });
};

export const putEventDetail = async (
  req: NextApiRequestExtended,
  res: NextApiResponse
) => {
  if (!req.query.id) {
    throw new BadRequestException('Id is required.');
  }

  if (!req.query.detailId) {
    throw new BadRequestException('Detail id is required.');
  }

  await editEventDetail({
    data: req.body,
    eventDetailId: req.query.detailId as string,
    eventId: req.query.id as string,
    userId: req.user!.id,
  });

  res.status(OK_STATUS).json({ message: 'Event updated.' });
};

export const putEventTicket = async (
  req: NextApiRequestExtended,
  res: NextApiResponse
) => {
  if (!req.query.id) {
    throw new BadRequestException('Id is required.');
  }

  if (!req.query.ticketId) {
    throw new BadRequestException('Ticket id is required.');
  }

  await editEventTicket({
    data: req.body,
    eventId: req.query.id as string,
    ticketId: req.query.ticketId as string,
    userId: req.user!.id,
  });
  res.status(OK_STATUS).json({ message: 'Event updated.' });
};

export const validatePublishEvent = async (
  req: NextApiRequestExtended,
  res: NextApiResponse,
  next: NextHandler
) => {
  try {
    const validation = await PublishDto.validate(req.body, strictOptions);
    req.body = await PublishDto.validate(validation, stripUnknownOptions);
  } catch (err: any) {
    throw new BadRequestException('Invalid body.', err.errors);
  }

  await next();
};

export const putPublishEvent = async (
  req: NextApiRequestExtended,
  res: NextApiResponse
) => {
  if (!req.query.id) {
    throw new BadRequestException('Id is required.');
  }

  await editPublishEvent({
    data: req.body,
    eventId: req.query.id as string,
    userId: req.user!.id,
  });

  res.status(OK_STATUS).json({
    message: `Event ${
      req.body.is_available ? 'published' : 'not published'
    } successfully.`,
  });
};

/* DELETE
–––––––––––––––––––––––––––––––––––––––––––––––––– */
export const deleteEventTicket = async (
  req: NextApiRequestExtended,
  res: NextApiResponse
) => {
  if (!req.query.id) {
    throw new BadRequestException('Id is required.');
  }

  if (!req.query.ticketId) {
    throw new BadRequestException('Ticket id is required.');
  }

  await removeEventTicket({
    eventId: req.query.id as string,
    ticketId: req.query.ticketId as string,
    userId: req.user!.id,
  });

  res.status(OK_STATUS).json({ message: 'Event updated.' });
};

export const deleteEventDashboard = async (
  req: NextApiRequestExtended,
  res: NextApiResponse
) => {
  if (!req.query.id) {
    throw new BadRequestException('Id is required.');
  }

  await cancelEventDashboard({
    eventId: req.query.id as string,
    userId: req.user!.id,
  });

  res.status(OK_STATUS).json({ message: 'Event successfully cancelled.' });
};
