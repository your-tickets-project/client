/* eslint-disable camelcase */
import { request } from 'server/mocks/handlers';
import handler from 'pages/api/v1/event/details/[id]';
// fixtures
import { createUser } from 'fixtures/user.fixture';
import { createEventDetail } from 'fixtures/event.fixture';
// http status codes
import {
  BAD_REQUEST_STATUS,
  CREATED_STATUS,
  NOT_FOUND_STATUS,
  OK_STATUS,
} from 'server/constants/http.status';
// mocks
import { dbInsert, dbSelect } from 'server/database';
// utils
import { generateJWT } from 'server/utils';

jest.mock('server/database');

afterEach(() => {
  // @ts-ignore
  dbSelect.mockClear();
  // @ts-ignore
  dbInsert.mockClear();
});

const user = createUser();
const token = generateJWT({ id: user.id });
const event_detail = createEventDetail();
const body = { ...event_detail };

describe('GET -- api/v1/event/details/[id] -- success request', () => {
  it(`should return the data`, async () => {
    const id = 1;
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([user]));
    // @ts-ignore
    dbSelect.mockReturnValueOnce(
      Promise.resolve([{ event: { id }, event_detail }])
    );
    const res = await request({
      handler,
      query: { id },
      headers: { authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(OK_STATUS);
    expect(res.body).toEqual({ id, event_detail });
  });
});

describe('GET -- api/v1/event/details/[id] -- bad request', () => {
  it(`should throw "Id is required."`, async () => {
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([user]));
    const res = await request({
      handler,
      headers: { authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(BAD_REQUEST_STATUS);
    expect(res.body).toEqual({
      error: 'Bad Request',
      message: 'Id is required.',
      statusCode: BAD_REQUEST_STATUS,
    });
  });

  it(`should throw "Event not found."`, async () => {
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([user]));
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([]));
    const res = await request({
      handler,
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

describe('POST -- api/v1/event/details/[id] -- success request', () => {
  it(`should create the data`, async () => {
    const id = 1;
    const insertId = 1;
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([user]));
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([{ id }]));
    // @ts-ignore
    dbInsert.mockReturnValueOnce(Promise.resolve({ insertId }));

    const res = await request({
      handler,
      method: 'POST',
      query: { id },
      headers: { authorization: `Bearer ${token}` },
      body,
    });

    expect(res.statusCode).toBe(CREATED_STATUS);
    expect(res.body).toEqual({
      message: 'Event updated.',
      insertId,
    });
  });
});

describe('POST -- api/v1/event/details/[id] -- bad request', () => {
  it(`should validate all fields`, async () => {
    const id = 1;
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([user]));

    const res = await request({
      handler,
      method: 'POST',
      query: { id },
      headers: { authorization: `Bearer ${token}` },
      body: { cover_image_url: 123, summary: 123, description: 123 },
    });

    expect(res.statusCode).toBe(BAD_REQUEST_STATUS);
    expect(res.body).toEqual({
      statusCode: BAD_REQUEST_STATUS,
      error: 'Bad Request',
      message: 'Invalid body.',
      errors: [
        'cover_image_url must be a `string` type, but the final value was: `123` (cast from the value `"/example/0.webp"`).',
        'summary must be a `string` type, but the final value was: `123` (cast from the value `"test summary"`).',
        'description must be a `string` type, but the final value was: `123` (cast from the value `"<p>test description.</p>"`).',
      ],
    });
  });

  it(`should throw "Id is required."`, async () => {
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([user]));

    const res = await request({
      handler,
      method: 'POST',
      headers: { authorization: `Bearer ${token}` },
      body,
    });

    expect(res.statusCode).toBe(BAD_REQUEST_STATUS);
    expect(res.body).toEqual({
      error: 'Bad Request',
      message: 'Id is required.',
      statusCode: BAD_REQUEST_STATUS,
    });
  });

  it(`should throw "Event not found."`, async () => {
    const id = 1;
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([user]));
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([]));

    const res = await request({
      handler,
      method: 'POST',
      query: { id },
      headers: { authorization: `Bearer ${token}` },
      body,
    });

    expect(res.statusCode).toBe(NOT_FOUND_STATUS);
    expect(res.body).toEqual({
      error: 'Not Found',
      message: 'Event not found.',
      statusCode: NOT_FOUND_STATUS,
    });
  });
});
