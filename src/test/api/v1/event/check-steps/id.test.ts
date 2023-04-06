/* eslint-disable camelcase */
import { request } from 'server/mocks/handlers';
import handler from 'pages/api/v1/event/check-steps/[id]';
// fixtures
import { createUser } from 'fixtures/user.fixture';
// http status codes
import {
  BAD_REQUEST_STATUS,
  NOT_FOUND_STATUS,
  OK_STATUS,
} from 'server/constants/http.status';
// mocks
import { dbDelete, dbInsert, dbSelect, dbUpdate } from 'server/database';
// utils
import { generateJWT } from 'server/utils';

jest.mock('server/database');

afterEach(() => {
  // @ts-ignore
  dbDelete.mockClear();
  // @ts-ignore
  dbSelect.mockClear();
  // @ts-ignore
  dbInsert.mockClear();
  // @ts-ignore
  dbUpdate.mockClear();
});

const user = createUser();
const token = generateJWT({ id: user.id });

describe('GET -- api/v1/event/check-steps/[id] -- success request', () => {
  it(`should return the data`, async () => {
    const id = 1;
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([user]));

    // @ts-ignore
    dbSelect.mockReturnValueOnce(
      Promise.resolve([
        {
          id,
          event_detail_amount: 1,
          event_ticket_info_amount: 1,
        },
      ])
    );

    const res = await request({
      handler,
      query: { id },
      headers: { authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(OK_STATUS);
    expect(res.body).toEqual({
      id,
      include_event_detail: true,
      include_event_ticket_info: true,
    });
  });
});

describe('GET -- api/v1/event/tickets/[id]/[ticketId] -- bad request', () => {
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
    dbSelect.mockReturnValueOnce(
      Promise.resolve([
        { id: null, event_detail_amount: 0, event_ticket_info_amount: 0 },
      ])
    );
    const res = await request({
      handler,
      query: { id: 1, ticketId: 1 },
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
