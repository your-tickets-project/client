import { request } from 'server/mocks/handlers';
import handler from 'pages/api/v1/ticket/[id]';
// http status codes
import {
  BAD_REQUEST_STATUS,
  INTERNAL_SERVER_ERROR_STATUS,
  NOT_FOUND_STATUS,
  OK_STATUS,
} from 'server/constants/http.status';
// mocks
import { dbSelect } from 'server/database';
import { createUser } from 'fixtures/user.fixture';
// utils
import { generateJWT } from 'server/utils';

jest.mock('server/database');

beforeEach(() => {
  // @ts-ignore
  dbSelect.mockReset();
});

const user = createUser();
const token = generateJWT({ id: user.id });

describe('GET route -- /api/v1/ticket/[id] -- success request', () => {
  it('should return the data', async () => {
    const data = [
      {
        orders: {
          id: 1,
          event_id: 1,
          purchase_date: `2023-05-26T00:00:00`,
          purchase_time: '09:00:00',
          first_name: 'test',
          last_name: 'test',
          email: 'test@test.test',
        },
        orders_ticket_info: {
          id: 1,
          ticket_amount: 2,
          total_price: 5,
        },
        event_ticket_info: { name: 'ticket name' },
        event: {
          title: 'event title',
          date_start: `2023-05-26T00:00:00`,
          time_start: `09:00:00`,
        },
        event_location: {
          venue_name: 'venue name',
          city: 'city',
          country: 'country',
        },
      },
      {
        orders: {
          id: 1,
          event_id: 1,
          purchase_date: `2023-05-26T00:00:00`,
          purchase_time: '09:00:00',
          first_name: 'test',
          last_name: 'test',
          email: 'test@test.test',
        },
        orders_ticket_info: {
          id: 2,
          ticket_amount: 1,
          total_price: 0,
        },
        event_ticket_info: { name: 'ticket name 2' },
        event: {
          title: 'event title',
          date_start: `2023-05-26T00:00:00`,
          time_start: `09:00:00`,
        },
        event_location: {
          venue_name: 'venue name',
          city: 'city',
          country: 'country',
        },
      },
    ];

    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([user]));
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve(data));
    const res = await request({
      handler,
      headers: { authorization: `Bearer ${token}` },
      query: { id: 1 },
    });

    expect(res.statusCode).toBe(OK_STATUS);
    expect(res.body).toEqual({
      ...data[0].orders,
      ...data[0].event,
      ...data[0].event_location,
      orders_ticket_info: [
        {
          ...data[0].orders_ticket_info,
          event_ticket_name: data[0].event_ticket_info.name,
        },
        {
          ...data[1].orders_ticket_info,
          event_ticket_name: data[1].event_ticket_info.name,
        },
      ],
    });
  });
});

describe('GET route -- /api/v1/ticket/[id] -- bad request', () => {
  it('should throw "Ticket id is required."', async () => {
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([user]));
    const res = await request({
      handler,
      headers: { authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(BAD_REQUEST_STATUS);
    expect(res.body).toEqual({
      error: 'Bad Request',
      message: 'Ticket id is required.',
      statusCode: BAD_REQUEST_STATUS,
    });
  });

  it('should throw "Ticket not found."', async () => {
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
      message: 'Ticket not found.',
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
      query: { id: 1 },
    });

    expect(res.statusCode).toBe(INTERNAL_SERVER_ERROR_STATUS);
    expect(res.body).toEqual({
      error: 'Internal Server Error',
      message: 'test error',
      statusCode: INTERNAL_SERVER_ERROR_STATUS,
    });
  });
});
