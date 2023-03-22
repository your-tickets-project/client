import { request } from 'server/mocks/handlers';
import handler from 'pages/api/v1/auth/check-user';
// fixtures
import { createUser } from 'fixtures/user.fixture';
// http status codes
import {
  FORBIDDEN_STATUS,
  OK_STATUS,
  UNAUTHORIZED_STATUS,
} from 'server/constants/http.status';
// mocks
import { dbSelect } from 'server/database';
// utils
import { generateJWT } from 'server/utils';

jest.mock('server/database');

afterEach(() => {
  // @ts-ignore
  dbSelect.mockClear();
});

describe('POST route -- /api/v1/auth/check-user -- success request', () => {
  test('checks user successfully', async () => {
    const user = createUser();
    const token = generateJWT({ id: user.id });

    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([user]));

    const res = await request({
      handler,
      headers: { authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(OK_STATUS);
    expect(res.body).toEqual({
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      },
    });
  });
});

describe('POST route -- /api/v1/auth/check-user -- bad request', () => {
  test('authorization header not sent', async () => {
    const res = await request({ handler });

    expect(res.statusCode).toBe(UNAUTHORIZED_STATUS);
    expect(res.body).toEqual({
      error: 'Unauthorized',
      message: 'You must provide the authorization header',
      statusCode: UNAUTHORIZED_STATUS,
    });
  });

  test('authorization header does not contain the word Bearer before the token', async () => {
    const user = createUser();
    const token = generateJWT({ id: user.id });

    const res = await request({ handler, headers: { authorization: token } });

    expect(res.statusCode).toBe(FORBIDDEN_STATUS);
    expect(res.body).toEqual({
      error: 'Forbidden',
      message: 'The authorization header does not contain the word Bearer',
      statusCode: FORBIDDEN_STATUS,
    });
  });

  test('invalid token sent', async () => {
    const res = await request({
      handler,
      headers: { authorization: 'Bearer invalid-token' },
    });

    expect(res.statusCode).toBe(UNAUTHORIZED_STATUS);
    expect(res.body).toEqual({
      error: 'Unauthorized',
      message: 'Invalid token',
      statusCode: UNAUTHORIZED_STATUS,
    });
  });

  test('valid token sent with a user id that does not exist', async () => {
    const user = createUser();
    const token = generateJWT({ id: user.id });

    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([]));

    const res = await request({
      handler,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(res.statusCode).toBe(UNAUTHORIZED_STATUS);
    expect(res.body).toEqual({
      error: 'Unauthorized',
      message: 'Invalid token',
      statusCode: UNAUTHORIZED_STATUS,
    });
  });
});
