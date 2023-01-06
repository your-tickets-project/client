import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { UserType } from 'interfaces';

export interface NextApiRequestExtended extends NextApiRequest {
  user: UserType | null;
}

export default function router() {
  return nextConnect<NextApiRequestExtended, NextApiResponse>({
    // onError(error, req, res) {
    //   res.status(501).json({ message: error.message });
    // },
    onNoMatch(req, res) {
      res.status(405).json({ message: 'Method not allowed' });
    },
  });
}
