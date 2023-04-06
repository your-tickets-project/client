import { request } from 'server/mocks/handlers';
import handler from 'pages/api/v1/event/tickets/[id]';
// fixtures
import { createEventTicketInfo } from 'fixtures/event.fixture';
import { createUser } from 'fixtures/user.fixture';
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
const body = createEventTicketInfo();

describe('GET -- api/v1/event/tickets/[id] -- success request', () => {
  it(`should return the data`, async () => {
    const id = 1;
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([user]));

    const rowData = [
      {
        event: { id },
        event_ticket_info: {
          id: 1,
          type: 'free',
          name: 'general admission',
          quantity: 200,
          sold: 0,
          price: 0,
          sales_start: '2023-04-15T04:00:00.000Z',
          sales_end: '2023-04-15T04:00:00.000Z',
          time_start: '09:00:00',
          time_end: '21:00:00',
          visibility: 'visible',
        },
      },
      {
        event: { id },
        event_ticket_info: {
          id: 2,
          type: 'paid',
          name: 'vip',
          quantity: 100,
          sold: 0,
          price: 5,
          sales_start: '2023-04-15T04:00:00.000Z',
          sales_end: '2023-04-15T04:00:00.000Z',
          time_start: '09:00:00',
          time_end: '21:00:00',
          visibility: 'visible',
        },
      },
    ];
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve(rowData));

    const res = await request({
      handler,
      query: { id },
      headers: { authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(OK_STATUS);
    expect(res.body).toEqual({
      id,
      event_tickets_info: [
        rowData[0].event_ticket_info,
        rowData[1].event_ticket_info,
      ],
    });
  });
});

describe('GET -- api/v1/event/tickets/[id] -- bad request', () => {
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

describe('POST -- api/v1/event/tickets/[id] -- success request', () => {
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
    });
  });
});

describe('POST -- api/v1/event/tickets/[id] -- bad request', () => {
  it(`should validate all fields`, async () => {
    const id = 1;
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([user]));

    const res = await request({
      handler,
      method: 'POST',
      query: { id },
      headers: { authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(BAD_REQUEST_STATUS);
    expect(res.body).toEqual({
      statusCode: BAD_REQUEST_STATUS,
      error: 'Bad Request',
      message: 'Invalid body.',
      errors: [
        'maximum_quantity is a required field',
        'minimum_quantity is a required field',
        'name is a required field',
        'price is a required field',
        'quantity is a required field',
        'sales_end is a required field',
        'sales_start is a required field',
        'time_end is a required field',
        'time_start is a required field',
        'type is a required field',
        'type value must be "free" or "paid"',
        'visibility is a required field',
        'visibility value must be "visible" or "hidden"',
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
