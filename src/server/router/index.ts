import { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
// exceptions
import { InternalServerErrorException } from 'server/exceptions';
// http status codes
import { METHOD_NOT_ALLOWED } from 'server/constants/http.status';
// interfaces
import { MulterFileType, UserType } from 'interfaces';

export interface NextApiRequestExtended extends NextApiRequest {
  user: UserType | null;
  files?: MulterFileType[];
}

export const errorHandler = () => ({
  onError(error: any, req: NextApiRequestExtended, res: NextApiResponse) {
    if (error.statusCode === undefined || error.error === undefined) {
      const internalServerError = new InternalServerErrorException();
      error.statusCode = internalServerError.statusCode;
      error.error = internalServerError.error;
    }

    const errorObj: {
      statusCode: number;
      error: string;
      message?: string;
      errors?: string[];
    } = {
      statusCode: error.statusCode,
      error: error.error,
    };

    if (error.message) {
      errorObj.message = error.message;
    }

    if (error.errors) {
      errorObj.errors = error.errors;
    }

    res.status(error.statusCode).json(errorObj);
  },
  onNoMatch(req: NextApiRequestExtended, res: NextApiResponse) {
    res.status(METHOD_NOT_ALLOWED).json({ message: 'Method Not Allowed' });
  },
});

export const router = () => {
  return createRouter<NextApiRequestExtended, NextApiResponse>();
};
