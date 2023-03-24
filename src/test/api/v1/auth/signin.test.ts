import { request } from 'server/mocks/handlers';
import handler from 'pages/api/v1/auth/signin';
// fixtures
import { createUser } from 'fixtures/user.fixture';
// http status codes
import {
  BAD_REQUEST_STATUS,
  CREATED_STATUS,
} from 'server/constants/http.status';
// mocks
import { dbSelect } from 'server/database';

jest.mock('server/database');

afterEach(() => {
  // @ts-ignore
  dbSelect.mockClear();
});

describe('POST route -- /api/v1/auth/signin -- success request', () => {
  test('create a user successfully', async () => {
    const user = createUser();

    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([]));

    const res = await request({
      handler,
      method: 'POST',
      body: {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        password: user.password,
      },
    });

    expect(res.statusCode).toBe(CREATED_STATUS);
    expect(res.body).toEqual({ message: 'User created successfully.' });
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
      errors: [
        'email is a required field',
        'first_name is a required field',
        'last_name is a required field',
        'password is a required field',
      ],
    });
  });

  test('validate fields', async () => {
    const user = createUser({ email: 'wrong@test' });

    const res = await request({
      handler,
      method: 'POST',
      body: {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
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

  test('duplicate email sent', async () => {
    const user = createUser();

    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([user]));

    const res = await request({
      handler,
      method: 'POST',
      body: {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        password: user.password,
      },
    });

    expect(res.statusCode).toBe(BAD_REQUEST_STATUS);
    expect(res.body).toEqual({
      statusCode: BAD_REQUEST_STATUS,
      error: 'Bad Request',
      message: 'This email is already being used.',
    });
  });
});
