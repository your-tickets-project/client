/* eslint-disable camelcase */
import { request } from 'server/mocks/handlers';
import handler from 'pages/api/v1/event/details/[id]/[detailId]';
// fixtures
import { createUser } from 'fixtures/user.fixture';
import { createEventDetail } from 'fixtures/event.fixture';
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
const event_detail = createEventDetail();
const body = { ...event_detail };

describe('PUT -- api/v1/event/details/[id]/[detailId] -- success request', () => {
  it(`should update the data`, async () => {
    const id = 1;
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([user]));
    // @ts-ignore
    dbUpdate.mockReturnValueOnce(Promise.resolve({ affectedRows: 1 }));

    const res = await request({
      handler,
      method: 'PUT',
      query: { id, detailId: event_detail.id },
      headers: { authorization: `Bearer ${token}` },
      body,
    });

    expect(res.statusCode).toBe(OK_STATUS);
    expect(res.body).toEqual({ message: 'Event updated.' });
  });
});

describe('PUT -- api/v1/event/details/[id]/[detailId] -- bad request', () => {
  it(`should throw "Id is required."`, async () => {
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

  it(`should "Detail id is required."`, async () => {
    const id = 1;
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([user]));

    const res = await request({
      handler,
      method: 'PUT',
      query: { id },
      headers: { authorization: `Bearer ${token}` },
      body,
    });

    expect(res.statusCode).toBe(BAD_REQUEST_STATUS);
    expect(res.body).toEqual({
      error: 'Bad Request',
      message: 'Detail id is required.',
      statusCode: BAD_REQUEST_STATUS,
    });
  });

  it(`should throw "Event not found."`, async () => {
    const id = 1;
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([user]));
    // @ts-ignore
    dbUpdate.mockReturnValueOnce(Promise.resolve({ affectedRows: 0 }));

    const res = await request({
      handler,
      method: 'PUT',
      query: { id, detailId: event_detail.id },
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
