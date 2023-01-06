import { NextApiResponse } from 'next';
import { NextHandler } from 'next-connect';
import { NextApiRequestExtended } from 'server/router';
// data
import { findById } from 'server/data';
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
    return res.status(401).json({
      message: 'There is not token in the request',
    });
  }

  const authToken = authorization as string;
  const [init, token] = authToken.split(' ');

  if (init !== 'Bearer') {
    return res
      .status(403)
      .json({ messsage: 'The Authorization header does not contain Bearer' });
  }

  try {
    const payload = verifyJWT(token) as {
      id: number;
      iat: number;
      exp: number;
    };
    req.user = await findById({ id: payload.id });
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
