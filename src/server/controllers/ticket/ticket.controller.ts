import { NextApiResponse } from 'next';
import { NextApiRequestExtended } from 'server/router';
// data
import { findTicket, findTickets } from 'server/data/ticket/ticket.data';
// exceptions
import { BadRequestException } from 'server/exceptions';
// http status codes
import { OK_STATUS } from 'server/constants/http.status';
// utils
import { queryStringParams } from 'server/utils';

/* GET
–––––––––––––––––––––––––––––––––––––––––––––––––– */
export const getTickets = async (
  req: NextApiRequestExtended,
  res: NextApiResponse
) => {
  const params = queryStringParams<{ q?: string }>(req.url);
  const data = await findTickets({ userId: req.user!.id, q: params.q });
  res.status(OK_STATUS).json(data);
};

export const getTicket = async (
  req: NextApiRequestExtended,
  res: NextApiResponse
) => {
  if (!req.query.id) {
    throw new BadRequestException('Ticket id is required.');
  }

  const data = await findTicket({
    userId: req.user!.id,
    ticketId: req.query.id as string,
  });
  res.status(OK_STATUS).json(data);
};
