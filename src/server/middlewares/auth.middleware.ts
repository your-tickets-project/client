import { NextApiResponse } from 'next';
import { NextHandler } from 'next-connect';
import { NextApiRequestExtended } from 'server/router';
// data
import { findUserById } from 'server/data/user/user.data';
// exceptions
import { ForbiddenException, UnauthorizedException } from 'server/exceptions';
// utils
import { verifyJWT } from 'server/utils';

export const authMiddleware = async (
  req: NextApiRequestExtended,
  res: NextApiResponse,
  next: NextHandler
) => {
  req.user = null;

  const { authorization } = req.headers;

  if (!authorization) {
    throw new UnauthorizedException(
      'You must provide the authorization header'
    );
  }

  const authToken = authorization;
  const [init, token] = authToken.split(' ');

  if (init !== 'Bearer') {
    throw new ForbiddenException(
      'The authorization header does not contain the word Bearer'
    );
  }

  try {
    const payload = verifyJWT(token) as {
      id: number;
      iat: number;
      exp: number;
    };

    const authUser = await findUserById({ id: payload.id });
    if (!authUser) {
      throw new Error();
    }

    req.user = authUser;
  } catch (error) {
    throw new UnauthorizedException('Invalid token');
  }
  await next();
};
