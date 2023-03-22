import { request } from 'server/mocks/handlers';
import handler from 'pages/api/v1/auth/login';
// fixtures
import { createUser } from 'fixtures/user.fixture';
// http status codes
import { BAD_REQUEST_STATUS, OK_STATUS } from 'server/constants/http.status';
// mocks
import { dbSelect } from 'server/database';
// utils
import { hashPassword } from 'server/utils';

jest.mock('server/database');

afterEach(() => {
  // @ts-ignore
  dbSelect.mockClear();
});

describe('POST route -- /api/v1/auth/signin -- success request', () => {
  test('log in successfully', async () => {
    const user = createUser();
    const securePassword = await hashPassword({ password: user.password });

    // @ts-ignore
    dbSelect.mockReturnValueOnce(
      Promise.resolve([{ ...user, password: securePassword }])
    );

    const res = await request({
      handler,
      method: 'POST',
      body: {
        email: user.email,
        password: user.password,
      },
    });

    expect(res.statusCode).toBe(OK_STATUS);
    expect(res.body).toEqual({
      accessToken: expect.any(String),
      message: 'Log in successfully.',
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      },
    });
  });
});

describe('POST route -- /api/v1/auth/signin -- bad request', () => {
  test('empty body sent', async () => {
    const res = await request({ handler, method: 'POST', body: {} });

    expect(res.statusCode).toBe(BAD_REQUEST_STATUS);
    expect(res.body).toEqual({
      statusCode: BAD_REQUEST_STATUS,
      message: 'Invalid body.',
      error: 'Bad Request',
      errors: ['email is a required field', 'password is a required field'],
    });
  });

  test('validate fields', async () => {
    const user = createUser({ email: 'wrong@test' });

    const res = await request({
      handler,
      method: 'POST',
      body: {
        email: user.email,
        password: user.password,
      },
    });

    expect(res.statusCode).toBe(BAD_REQUEST_STATUS);
    expect(res.body).toEqual({
      statusCode: BAD_REQUEST_STATUS,
      message: 'Invalid body.',
      error: 'Bad Request',
      errors: ['email must be a valid email'],
    });
  });

  test('email sent not found', async () => {
    const user = createUser();

    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([]));

    const res = await request({
      handler,
      method: 'POST',
      body: {
        email: user.email,
        password: user.password,
      },
    });

    expect(res.statusCode).toBe(BAD_REQUEST_STATUS);
    expect(res.body).toEqual({
      statusCode: BAD_REQUEST_STATUS,
      error: 'Bad Request',
      message: 'Invalid email or password.',
    });
  });

  test('password sent does not match', async () => {
    const user = createUser();
    const securePassword = await hashPassword({
      password: 'different@password',
    });

    // @ts-ignore
    dbSelect.mockReturnValueOnce(
      Promise.resolve([{ ...user, password: securePassword }])
    );

    const res = await request({
      handler,
      method: 'POST',
      body: {
        email: user.email,
        password: user.password,
      },
    });

    expect(res.statusCode).toBe(BAD_REQUEST_STATUS);
    expect(res.body).toEqual({
      statusCode: BAD_REQUEST_STATUS,
      error: 'Bad Request',
      message: 'Invalid email or password.',
    });
  });
});
