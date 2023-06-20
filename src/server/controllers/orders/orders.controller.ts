import { NextApiResponse } from 'next';
import { NextHandler } from 'next-connect';
import { NextApiRequestExtended } from 'server/router';
// data
import {
  createOrder,
  findOrder,
  findOrders,
  removeOrder,
} from 'server/data/orders/orders.data';
// exceptions
import { BadRequestException } from 'server/exceptions';
// http status codes
import { CREATED_STATUS, OK_STATUS } from 'server/constants/http.status';
// utils
import { queryStringParams } from 'server/utils';
// validations
import {
  strictOptions,
  stripUnknownOptions,
} from 'server/validations/validationOptions';
import { CreateOrderDto } from 'server/validations/orders/create-order.dto';

/* GET
–––––––––––––––––––––––––––––––––––––––––––––––––– */
export const getOrders = async (
  req: NextApiRequestExtended,
  res: NextApiResponse
) => {
  const params = queryStringParams<{ q?: string }>(req.url);
  const data = await findOrders({
    q: params.q,
    userId: req.user!.id,
  });
  res.status(OK_STATUS).json(data);
};

export const getOrder = async (
  req: NextApiRequestExtended,
  res: NextApiResponse
) => {
  if (!req.query.id) {
    throw new BadRequestException('Order id is required.');
  }

  if (!req.query.eventId) {
    throw new BadRequestException('Event id is required.');
  }

  const data = await findOrder({
    eventId: req.query.eventId as string,
    id: req.query.id as string,
    userId: req.user!.id,
  });
  res.status(OK_STATUS).json(data);
};

/* POST
–––––––––––––––––––––––––––––––––––––––––––––––––– */
export const validateOrder = async (
  req: NextApiRequestExtended,
  res: NextApiResponse,
  next: NextHandler
) => {
  try {
    const validation = await CreateOrderDto.validate(req.body, strictOptions);
    req.body = await CreateOrderDto.validate(validation, stripUnknownOptions);
  } catch (err: any) {
    throw new BadRequestException('Invalid body.', err.errors);
  }

  await next();
};

export const postOrder = async (
  req: NextApiRequestExtended,
  res: NextApiResponse
) => {
  if (!req.query.eventId) {
    throw new BadRequestException('Event id is required.');
  }

  const data = await createOrder({
    data: req.body,
    eventId: req.query.eventId as string,
    userId: req.user!.id,
  });

  res
    .status(CREATED_STATUS)
    .json({ message: 'Order created successfully.', insertId: data.insertId });
};

/* DELETE
–––––––––––––––––––––––––––––––––––––––––––––––––– */
export const deleteOrder = async (
  req: NextApiRequestExtended,
  res: NextApiResponse
) => {
  if (!req.query.id) {
    throw new BadRequestException('Order id is required.');
  }

  if (!req.query.eventId) {
    throw new BadRequestException('Event id is required.');
  }

  await removeOrder({
    eventId: req.query.eventId as string,
    id: req.query.id as string,
    userId: req.user!.id,
  });

  res.status(OK_STATUS).json({ message: 'Order canceled successfully.' });
};
