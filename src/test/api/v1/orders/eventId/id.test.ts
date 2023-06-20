import { request } from 'server/mocks/handlers';
import handler from 'pages/api/v1/orders/[eventId]/[id]';
// http status codes
import {
  BAD_REQUEST_STATUS,
  INTERNAL_SERVER_ERROR_STATUS,
  NOT_FOUND_STATUS,
  OK_STATUS,
} from 'server/constants/http.status';
// mocks
import { dbSelect, dbUpdate } from 'server/database';
import { createUser } from 'fixtures/user.fixture';
// utils
import { generateJWT } from 'server/utils';

jest.mock('server/database');

beforeEach(() => {
  // @ts-ignore
  dbSelect.mockReset();
  // @ts-ignore
  dbUpdate.mockReset();
});

const user = createUser();
const token = generateJWT({ id: user.id });

describe('GET route -- /api/v1/orders/[eventId]/[id] -- success request', () => {
  it('should return the data', async () => {
    const data = {
      id: 1,
      event_id: 1,
      first_name: 'test',
      last_name: 'test',
      total: 0,
      purchase_date: `2023-05-26T00:00:00`,
      purchase_time: '09:00:00',
      total_tickets: 2,
      is_available: 1,
      title: 'event title',
      date_start: `2023-05-26T00:00:00`,
      date_end: `2023-05-26T00:00:00`,
      time_start: '09:00:00',
      time_end: '21:00:00',
      cover_image_url: 'image-url',
      venue_name: 'venue_name',
    };

    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([user]));
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([data]));
    const res = await request({
      handler,
      headers: { authorization: `Bearer ${token}` },
      query: { eventId: data.event_id, id: data.id },
    });

    expect(res.statusCode).toBe(OK_STATUS);
    expect(res.body).toEqual(data);
  });
});

describe('GET route -- /api/v1/orders/[eventId]/[id] -- bad request', () => {
  it('should throw "Order id is required."', async () => {
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([user]));

    const res = await request({
      handler,
      headers: { authorization: `Bearer ${token}` },
      query: { eventId: 1 },
    });

    expect(res.statusCode).toBe(BAD_REQUEST_STATUS);
    expect(res.body).toEqual({
      error: 'Bad Request',
      message: 'Order id is required.',
      statusCode: BAD_REQUEST_STATUS,
    });
  });

  it('should throw "Event id is required."', async () => {
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
      message: 'Event id is required.',
      statusCode: BAD_REQUEST_STATUS,
    });
  });

  it('should throw "Order not found."', async () => {
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([user]));
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([]));
    const res = await request({
      handler,
      headers: { authorization: `Bearer ${token}` },
      query: { eventId: 1, id: 1 },
    });

    expect(res.statusCode).toBe(NOT_FOUND_STATUS);
    expect(res.body).toEqual({
      error: 'Not Found',
      message: 'Order not found.',
      statusCode: NOT_FOUND_STATUS,
    });
  });

  it('should throw "Internal server error"', async () => {
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([user]));
    // @ts-ignore
    dbSelect.mockImplementation(() => {
      throw new Error('test error');
    });

    const res = await request({
      handler,
      headers: { authorization: `Bearer ${token}` },
      query: { eventId: 1, id: 1 },
    });

    expect(res.statusCode).toBe(INTERNAL_SERVER_ERROR_STATUS);
    expect(res.body).toEqual({
      error: 'Internal Server Error',
      message: 'test error',
      statusCode: INTERNAL_SERVER_ERROR_STATUS,
    });
  });
});

describe('DELETE route -- /api/v1/orders/[eventId]/[id] -- success request', () => {
  it('should cancel the order', async () => {
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([user]));
    // @ts-ignore
    dbUpdate.mockReturnValueOnce(Promise.resolve({ affectedRows: 1 }));
    const res = await request({
      handler,
      method: 'DELETE',
      headers: { authorization: `Bearer ${token}` },
      query: { eventId: 1, id: 1 },
    });

    expect(res.statusCode).toBe(OK_STATUS);
    expect(res.body).toEqual({ message: 'Order canceled successfully.' });
  });
});

describe('DELETE route -- /api/v1/orders/[eventId]/[id] -- bad request', () => {
  it('should throw "Order id is required."', async () => {
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([user]));
    const res = await request({
      handler,
      method: 'DELETE',
      headers: { authorization: `Bearer ${token}` },
      query: { eventId: 1 },
    });

    expect(res.statusCode).toBe(BAD_REQUEST_STATUS);
    expect(res.body).toEqual({
      error: 'Bad Request',
      message: 'Order id is required.',
      statusCode: BAD_REQUEST_STATUS,
    });
  });

  it('should throw "Event id is required."', async () => {
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([user]));
    // @ts-ignore
    dbUpdate.mockReturnValueOnce(Promise.resolve({ affectedRows: 1 }));
    const res = await request({
      handler,
      method: 'DELETE',
      headers: { authorization: `Bearer ${token}` },
      query: { id: 1 },
    });

    expect(res.statusCode).toBe(BAD_REQUEST_STATUS);
    expect(res.body).toEqual({
      error: 'Bad Request',
      message: 'Event id is required.',
      statusCode: BAD_REQUEST_STATUS,
    });
  });

  it('should throw "Internal server error"', async () => {
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([user]));
    // @ts-ignore
    dbUpdate.mockImplementation(() => {
      throw new Error('test error');
    });

    const res = await request({
      handler,
      method: 'DELETE',
      headers: { authorization: `Bearer ${token}` },
      query: { id: 1, eventId: 1 },
    });

    expect(res.statusCode).toBe(INTERNAL_SERVER_ERROR_STATUS);
    expect(res.body).toEqual({
      error: 'Internal Server Error',
      message: 'test error',
      statusCode: INTERNAL_SERVER_ERROR_STATUS,
    });
  });
});
