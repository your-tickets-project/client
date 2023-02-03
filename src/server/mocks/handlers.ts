import {
  createMocks,
  RequestMethod,
  Query,
  Body,
  Headers,
} from 'node-mocks-http';
import { NextApiResponse } from 'next';
import { NextApiRequestExtended } from 'server/router';

interface RequestType {
  method?: RequestMethod;
  headers?: Headers;
  body?: Body;
  query?: Query;
  handler: (req: NextApiRequestExtended, res: NextApiResponse) => Promise<void>;
}

export const request = async ({
  method = 'GET',
  headers,
  body,
  query,
  handler,
}: RequestType) => {
  const { req, res }: { req: NextApiRequestExtended; res: NextApiResponse } =
    createMocks({ method, headers, body, query });

  await handler(req, res);

  return {
    statusCode: res.statusCode,
    // @ts-ignore
    body: res._getJSONData(),
  };
};
