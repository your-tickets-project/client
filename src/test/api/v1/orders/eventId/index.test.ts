import { request } from 'server/mocks/handlers';
import handler from 'pages/api/v1/orders/[eventId]';
// http status codes
import {
  BAD_REQUEST_STATUS,
  CREATED_STATUS,
  INTERNAL_SERVER_ERROR_STATUS,
} from 'server/constants/http.status';
// mocks
import { dbSelect, dbUpdate, dbInsert } from 'server/database';
import { createUser } from 'fixtures/user.fixture';
// utils
import { generateJWT } from 'server/utils';

jest.mock('server/database');

afterEach(() => {
  // @ts-ignore
  dbSelect.mockReset();
  // @ts-ignore
  dbUpdate.mockReset();
  // @ts-ignore
  dbInsert.mockReset();
});

const user = createUser();
const token = generateJWT({ id: user.id });

const body = {
  first_name: 'test',
  last_name: 'test',
  email: 'test@test.test',
  purchase_date: '2023-05-26T00:00:00',
  purchase_time: '09:00:00',
  tickets: [
    { id: 1, amount: 2, price: 5 },
    { id: 2, amount: 1, price: 0 },
  ],
};

describe('POST route -- /api/v1/orders/[eventId] -- success request', () => {
  it('should create an order', async () => {
    const insertId = 1;
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([user]));
    // @ts-ignore
    dbSelect.mockReturnValueOnce(
      Promise.resolve([
        {
          event: {
            title: 'title',
            date_start: `2023-05-26T00:00:00`,
            time_start: '09:00:00',
            date_end: `2023-05-26T00:00:00`,
            time_end: '21:00:00',
          },
          event_location: {
            venue_name: 'venue name',
            address_1: 'address 1',
            city: 'city',
            postal_code: '0000',
            country: 'country',
          },
          event_detail: { cover_image_url: 'hash' },
          event_ticket_info: { id: 1, name: 'general admission' },
          '': { remaining: 5 },
        },
        {
          event: {
            title: 'title',
            date_start: `2023-05-26T00:00:00`,
            time_start: '09:00:00',
            date_end: `2023-05-26T00:00:00`,
            time_end: '21:00:00',
          },
          event_location: {
            venue_name: 'venue name',
            address_1: 'address 1',
            city: 'city',
            postal_code: '0000',
            country: 'country',
          },
          event_detail: { cover_image_url: 'hash' },
          event_ticket_info: { id: 2, name: 'vip' },
          '': { remaining: 5 },
        },
      ])
    );
    // @ts-ignore
    dbUpdate.mockReturnValue(Promise.resolve({ affectedRows: 1 }));
    // @ts-ignore
    dbInsert.mockReturnValue(Promise.resolve({ affectedRows: 1, insertId }));
    const res = await request({
      handler,
      headers: { authorization: `Bearer ${token}` },
      query: { eventId: 1 },
      method: 'POST',
      body,
    });

    expect(res.statusCode).toBe(CREATED_STATUS);
    expect(res.body).toEqual({
      message: 'Order created successfully.',
      insertId,
    });
  });
});

describe('POST route -- /api/v1/orders/[eventId] -- bad request', () => {
  it('should throw "Event id is required."', async () => {
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([user]));

    const res = await request({
      handler,
      headers: { authorization: `Bearer ${token}` },
      query: {},
      method: 'POST',
      body,
    });

    expect(res.statusCode).toBe(BAD_REQUEST_STATUS);
    expect(res.body).toEqual({
      error: 'Bad Request',
      message: 'Event id is required.',
      statusCode: 400,
    });
  });

  it('should throw "All general admission tickets sold."', async () => {
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([user]));
    // @ts-ignore
    dbSelect.mockReturnValueOnce(
      Promise.resolve([
        {
          event: {
            title: 'title',
            date_start: `2023-05-26T00:00:00`,
            time_start: '09:00:00',
            date_end: `2023-05-26T00:00:00`,
            time_end: '21:00:00',
          },
          event_location: {
            venue_name: 'venue name',
            address_1: 'address 1',
            city: 'city',
            postal_code: '0000',
            country: 'country',
          },
          event_detail: { cover_image_url: 'hash' },
          event_ticket_info: { id: 1, name: 'general admission' },
          '': { remaining: 0 },
        },
      ])
    );
    const res = await request({
      handler,
      headers: { authorization: `Bearer ${token}` },
      query: { eventId: 1 },
      method: 'POST',
      body,
    });

    expect(res.statusCode).toBe(BAD_REQUEST_STATUS);
    expect(res.body).toEqual({
      error: 'Bad Request',
      message: 'All general admission tickets sold.',
      statusCode: BAD_REQUEST_STATUS,
    });
  });

  it('should throw "Only 1 general admission ticket left."', async () => {
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([user]));
    // @ts-ignore
    dbSelect.mockReturnValueOnce(
      Promise.resolve([
        {
          event: {
            title: 'title',
            date_start: `2023-05-26T00:00:00`,
            time_start: '09:00:00',
            date_end: `2023-05-26T00:00:00`,
            time_end: '21:00:00',
          },
          event_location: {
            venue_name: 'venue name',
            address_1: 'address 1',
            city: 'city',
            postal_code: '0000',
            country: 'country',
          },
          event_detail: { cover_image_url: 'hash' },
          event_ticket_info: { id: 1, name: 'general admission' },
          '': { remaining: 1 },
        },
      ])
    );
    const res = await request({
      handler,
      headers: { authorization: `Bearer ${token}` },
      query: { eventId: 1 },
      method: 'POST',
      body,
    });

    expect(res.statusCode).toBe(BAD_REQUEST_STATUS);
    expect(res.body).toEqual({
      error: 'Bad Request',
      message: 'Only 1 general admission ticket left.',
      statusCode: BAD_REQUEST_STATUS,
    });
  });

  it('should validate required fields', async () => {
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([user]));

    const res = await request({
      handler,
      headers: { authorization: `Bearer ${token}` },
      query: { eventId: 1 },
      method: 'POST',
    });

    expect(res.statusCode).toBe(BAD_REQUEST_STATUS);
    expect(res.body).toEqual({
      error: 'Bad Request',
      errors: [
        'first_name is a required field',
        'last_name is a required field',
        'email is a required field',
        'purchase_date is a required field',
        'purchase_time is a required field',
        'tickets is a required field',
      ],
      message: 'Invalid body.',
      statusCode: 400,
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
      query: { eventId: 1 },
      method: 'POST',
      body,
    });

    expect(res.statusCode).toBe(INTERNAL_SERVER_ERROR_STATUS);
    expect(res.body).toEqual({
      error: 'Internal Server Error',
      message: 'test error',
      statusCode: INTERNAL_SERVER_ERROR_STATUS,
    });
  });
});
