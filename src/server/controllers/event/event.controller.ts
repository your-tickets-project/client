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
} from 'server/data/event/event.data';
// exceptions
import { BadRequestException } from 'server/exceptions';
// http status codes
import { CREATED_STATUS, OK_STATUS } from 'server/constants/http.status';
// utils
import { queryStringParams } from 'server/utils';
// validations
import { validationsOptions } from 'server/validations/validationOptions';
import { EventBasicInfoDto, EventDetailDto } from 'server/validations/event';

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

  const event = await findEventBySlug({ slug: req.query.slug as string });
  res.status(OK_STATUS).json({ event });
};

export const getEventBasicInfo = async (
  req: NextApiRequestExtended,
  res: NextApiResponse
) => {
  if (!req.query.id) {
    throw new BadRequestException('Id is required.');
  }

  const data = await findEventBasicInfo({ eventId: req.query.id as string });
  res.status(OK_STATUS).json(data);
};

export const getEventDetail = async (
  req: NextApiRequestExtended,
  res: NextApiResponse
) => {
  if (!req.query.id) {
    throw new BadRequestException('Id is required.');
  }

  const data = await findEventDetail({ eventId: req.query.id as string });
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
    req.body = await EventBasicInfoDto.validate(req.body, validationsOptions);
  } catch (err: any) {
    throw new BadRequestException('Invalid body.', err.errors);
  }

  await next();
};

export const postEventBasicInfo = async (
  req: NextApiRequestExtended,
  res: NextApiResponse
) => {
  const data = await createEventBasicInfo({ data: req.body });
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
    req.body = await EventDetailDto.validate(req.body, validationsOptions);
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
  });
  res
    .status(CREATED_STATUS)
    .json({ message: 'Event updated.', insertId: data.insertId });
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

  const paramsObject = queryStringParams({ str: req.url?.split('?')[1] });
  if (!paramsObject?.event_detail_id) {
    throw new BadRequestException('event_detail_id param is required.');
  }

  await editEventDetail({
    data: req.body,
    eventDetailId: paramsObject.event_detail_id,
    eventId: req.query.id as string,
  });

  res.status(OK_STATUS).json({ message: 'Event updated.' });
};
