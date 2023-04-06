/* eslint-disable camelcase */
import { request } from 'server/mocks/handlers';
import handler from 'pages/api/v1/event/tickets/[id]/[ticketId]';
// fixtures
import { createEventTicketInfo } from 'fixtures/event.fixture';
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
const body = createEventTicketInfo();

describe('GET -- api/v1/event/tickets/[id]/[ticketId] -- success request', () => {
  it(`should return the data`, async () => {
    const id = 1;
    const event_ticket_info = createEventTicketInfo();
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([user]));

    const rowData = [
      {
        event: { id },
        event_ticket_info,
      },
    ];
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve(rowData));

    const res = await request({
      handler,
      query: { id, ticketId: event_ticket_info.id },
      headers: { authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(OK_STATUS);
    expect(res.body).toEqual({
      id,
      event_ticket_info: rowData[0].event_ticket_info,
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

  it(`should throw "Ticket id is required."`, async () => {
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([user]));
    const res = await request({
      handler,
      headers: { authorization: `Bearer ${token}` },
      query: { id: 1 },
    });

    expect(res.statusCode).toBe(BAD_REQUEST_STATUS);
    expect(res.body).toEqual({
      error: 'Bad Request',
      message: 'Ticket id is required.',
      statusCode: BAD_REQUEST_STATUS,
    });
  });

  it(`should throw "Ticket not found."`, async () => {
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([user]));
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([]));
    const res = await request({
      handler,
      query: { id: 1, ticketId: 1 },
      headers: { authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(NOT_FOUND_STATUS);
    expect(res.body).toEqual({
      error: 'Not Found',
      message: 'Ticket not found.',
      statusCode: NOT_FOUND_STATUS,
    });
  });
});

describe('PUT -- api/v1/event/tickets/[id]/[ticketId] -- success request', () => {
  it(`should update the data`, async () => {
    const id = 1;
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([user]));
    // @ts-ignore
    dbUpdate.mockReturnValueOnce(Promise.resolve({ affectedRows: 1 }));

    const res = await request({
      handler,
      method: 'PUT',
      query: { id, ticketId: body.id },
      headers: { authorization: `Bearer ${token}` },
      body,
    });

    expect(res.statusCode).toBe(OK_STATUS);
    expect(res.body).toEqual({ message: 'Event updated.' });
  });
});

describe('PUT -- api/v1/event/tickets/[id]/[ticketId] -- bad request', () => {
  it(`should validate all fields`, async () => {
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([user]));

    const res = await request({
      handler,
      method: 'PUT',
      query: { id: 1, ticketId: 1 },
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
      body,
      headers: { authorization: `Bearer ${token}` },
      method: 'PUT',
    });

    expect(res.statusCode).toBe(BAD_REQUEST_STATUS);
    expect(res.body).toEqual({
      error: 'Bad Request',
      message: 'Id is required.',
      statusCode: BAD_REQUEST_STATUS,
    });
  });

  it(`should throw "Ticket id is required."`, async () => {
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([user]));
    const res = await request({
      handler,
      body,
      headers: { authorization: `Bearer ${token}` },
      method: 'PUT',
      query: { id: 1 },
    });

    expect(res.statusCode).toBe(BAD_REQUEST_STATUS);
    expect(res.body).toEqual({
      error: 'Bad Request',
      message: 'Ticket id is required.',
      statusCode: BAD_REQUEST_STATUS,
    });
  });

  it(`should throw "Ticket not found."`, async () => {
    const id = 1;
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([user]));
    // @ts-ignore
    dbUpdate.mockReturnValueOnce(Promise.resolve({ affectedRows: 0 }));

    const res = await request({
      handler,
      method: 'PUT',
      query: { id, ticketId: body.id },
      headers: { authorization: `Bearer ${token}` },
      body,
    });

    expect(res.statusCode).toBe(NOT_FOUND_STATUS);
    expect(res.body).toEqual({
      error: 'Not Found',
      message: 'Ticket not found.',
      statusCode: NOT_FOUND_STATUS,
    });
  });
});

describe('DELETE -- api/v1/event/tickets/[id]/[ticketId] -- success request', () => {
  it(`should delete the data`, async () => {
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([user]));
    // @ts-ignore
    dbDelete.mockReturnValueOnce(Promise.resolve({ affectedRows: 1 }));

    const res = await request({
      handler,
      method: 'DELETE',
      query: { id: 1, ticketId: 1 },
      headers: { authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(OK_STATUS);
    expect(res.body).toEqual({ message: 'Event updated.' });
  });
});

describe('DELETE -- api/v1/event/tickets/[id]/[ticketId] -- bad request', () => {
  it(`should throw "Id is required."`, async () => {
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([user]));
    const res = await request({
      handler,
      headers: { authorization: `Bearer ${token}` },
      method: 'DELETE',
    });

    expect(res.statusCode).toBe(BAD_REQUEST_STATUS);
    expect(res.body).toEqual({
      error: 'Bad Request',
      message: 'Id is required.',
      statusCode: BAD_REQUEST_STATUS,
    });
  });

  it(`should throw "Ticket id is required."`, async () => {
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([user]));
    const res = await request({
      handler,
      headers: { authorization: `Bearer ${token}` },
      method: 'DELETE',
      query: { id: 1 },
    });

    expect(res.statusCode).toBe(BAD_REQUEST_STATUS);
    expect(res.body).toEqual({
      error: 'Bad Request',
      message: 'Ticket id is required.',
      statusCode: BAD_REQUEST_STATUS,
    });
  });

  it(`should throw "Ticket not found."`, async () => {
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([user]));
    // @ts-ignore
    dbDelete.mockReturnValueOnce(Promise.resolve({ affectedRows: 0 }));

    const res = await request({
      handler,
      method: 'DELETE',
      query: { id: 1, ticketId: 1 },
      headers: { authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(NOT_FOUND_STATUS);
    expect(res.body).toEqual({
      error: 'Not Found',
      message: 'Ticket not found.',
      statusCode: NOT_FOUND_STATUS,
    });
  });
});
