import { request } from 'server/mocks/handlers';
import handler from 'pages/api/v1/event/dashboard/[id]';
// mocks
import { createUser } from 'fixtures/user.fixture';
import { dbSelect, dbUpdate } from 'server/database';
import { generateJWT } from 'server/utils';
import {
  BAD_REQUEST_STATUS,
  NOT_FOUND_STATUS,
  OK_STATUS,
} from 'server/constants/http.status';

jest.mock('server/database');

afterEach(() => {
  // @ts-ignore
  dbSelect.mockClear();
  // @ts-ignore
  dbUpdate.mockClear();
});

const user = createUser();
const token = generateJWT({ id: user.id });

describe('DELETE -- api/v1/event/dashboard/[id] -- success request', () => {
  it('should return the data', async () => {
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([user]));
    // @ts-ignore
    dbUpdate.mockReturnValue({ affectedRows: 1 });

    const res = await request({
      handler,
      method: 'DELETE',
      query: { id: 1 },
      headers: { authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(OK_STATUS);
    expect(res.body).toEqual({ message: 'Event successfully cancelled.' });
  });
});

describe('DELETE -- api/v1/event/dashboard/[id] -- bad request', () => {
  it('should return "Id is required."', async () => {
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([user]));

    const res = await request({
      handler,
      method: 'DELETE',
      headers: { authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(BAD_REQUEST_STATUS);
    expect(res.body).toEqual({
      error: 'Bad Request',
      message: 'Id is required.',
      statusCode: BAD_REQUEST_STATUS,
    });
  });

  it('should return "Event not found."', async () => {
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([user]));
    // @ts-ignore
    dbUpdate.mockReturnValue({ affectedRows: 0 });

    const res = await request({
      handler,
      method: 'DELETE',
      query: { id: 1 },
      headers: { authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(NOT_FOUND_STATUS);
    expect(res.body).toEqual({
      error: 'Not Found',
      message: 'Event not found.',
      statusCode: NOT_FOUND_STATUS,
    });
  });
});
