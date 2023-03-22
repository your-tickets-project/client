import {
  createMocks,
  RequestMethod,
  Query,
  Body,
  Headers,
  Params,
} from 'node-mocks-http';
import { NextApiResponse } from 'next';
import { NextApiRequestExtended } from 'server/router';

interface RequestType {
  body?: Body;
  headers?: Headers;
  method?: RequestMethod;
  query?: Query;
  params?: Params;
  url?: string;
  handler: (req: NextApiRequestExtended, res: NextApiResponse) => Promise<void>;
}

export const request = async ({
  body,
  headers,
  method = 'GET',
  params,
  query,
  url,
  handler,
}: RequestType) => {
  // @ts-ignore
  const { req, res }: { req: NextApiRequestExtended; res: NextApiResponse } =
    createMocks({ method, headers, body, query, params, url });

  await handler(req, res);

  return {
    statusCode: res.statusCode,
    // @ts-ignore
    body: res._getJSONData(),
  };
};
