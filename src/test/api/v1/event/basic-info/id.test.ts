/* eslint-disable camelcase */
import { request } from 'server/mocks/handlers';
import handler from 'pages/api/v1/event/basic-info/[id]';
// fixtures
import { createUser } from 'fixtures/user.fixture';
import {
  createEvent,
  createEventTag,
  createLocation,
} from 'fixtures/event.fixture';
// http status codes
import {
  BAD_REQUEST_STATUS,
  NOT_FOUND_STATUS,
  OK_STATUS,
} from 'server/constants/http.status';
// mocks
import { dbSelect, dbUpdate } from 'server/database';
// utils
import { generateJWT } from 'server/utils';

jest.mock('server/database');

afterEach(() => {
  // @ts-ignore
  dbSelect.mockClear();
  // @ts-ignore
  dbUpdate.mockClear();
});

const user = createUser();
const token = generateJWT({ id: user.id });
const event = createEvent();
const location = createLocation();
const body = {
  ...event,
  location,
};

describe('GET -- api/v1/event/basic-info/[id] -- success request', () => {
  it(`should return the data`, async () => {
    const event = createEvent();
    const event_location = createLocation();

    const rowData = [
      {
        event,
        event_location,
        event_tag: createEventTag(),
      },
      {
        event,
        event_location,
        event_tag: createEventTag({ id: 2, name: 'tag 2' }),
      },
    ];
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([user]));
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve(rowData));

    const res = await request({
      handler,
      headers: { authorization: `Bearer ${token}` },
      query: { id: 1 },
    });

    expect(res.statusCode).toBe(OK_STATUS);
    expect(res.body).toEqual({
      ...event,
      event_location,
      event_tag: [rowData[0].event_tag, rowData[1].event_tag],
    });
  });
});

describe('GET -- api/v1/event/basic-info/[id] -- bad request', () => {
  it(`should throw Id is required.`, async () => {
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

  it(`should throw Event not found.`, async () => {
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([user]));
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([]));

    const res = await request({
      handler,
      headers: { authorization: `Bearer ${token}` },
      query: { id: 1 },
    });

    expect(res.statusCode).toBe(NOT_FOUND_STATUS);
    expect(res.body).toEqual({
      error: 'Not Found',
      message: 'Event not found.',
      statusCode: NOT_FOUND_STATUS,
    });
  });
});

describe('PUT -- api/v1/event/basic-info/[id] -- success request', () => {
  it(`should update the data`, async () => {
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([user]));
    // @ts-ignore
    dbUpdate.mockReturnValueOnce(Promise.resolve({ affectedRows: 1 }));

    const res = await request({
      handler,
      method: 'PUT',
      headers: { authorization: `Bearer ${token}` },
      query: { id: event.id },
      body,
    });

    expect(res.statusCode).toBe(OK_STATUS);
    expect(res.body).toEqual({ message: 'Event updated.' });
  });
});

describe('PUT -- api/v1/event/basic-info/[id] -- bad request', () => {
  it(`should throw Id is required.`, async () => {
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([user]));

    const res = await request({
      handler,
      method: 'PUT',
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

  it(`should throw Event not found.`, async () => {
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([user]));
    // @ts-ignore
    dbUpdate.mockReturnValueOnce(Promise.resolve({ affectedRows: 0 }));

    const res = await request({
      handler,
      method: 'PUT',
      headers: { authorization: `Bearer ${token}` },
      query: { id: event.id },
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
