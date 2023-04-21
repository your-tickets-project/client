import { request } from 'server/mocks/handlers';
import handler from 'pages/api/v1/event';
// http status codes
import {
  INTERNAL_SERVER_ERROR_STATUS,
  OK_STATUS,
} from 'server/constants/http.status';
// mocks
import { dbSelect } from 'server/database';

jest.mock('server/database');

afterEach(() => {
  // @ts-ignore
  dbSelect.mockClear();
});

describe('GET route -- /api/v1/event -- success request', () => {
  test('returns the data', async () => {
    const eventData = {
      id: 1,
      slug: 'slug-1',
      title: 'title-1',
      date_start: '1996-02-09T00:00:00',
      time_start: '13:00:00',
      venue_name: 'venue_name-1',
      city: 'city-1',
      state: 'state-1',
      cover_image_url: 'url-1',
      ticket_smallest_price: 1,
    };

    const eventData2 = {
      id: 2,
      slug: 'slug-2',
      title: 'title-2',
      date_start: '1996-02-09T00:00:00',
      time_start: '13:00:00',
      venue_name: 'venue_name-2',
      city: 'city-2',
      state: 'state-2',
      cover_image_url: 'url-2',
      ticket_smallest_price: 1,
    };

    const eventData3 = {
      id: 3,
      slug: 'slug-3',
      title: 'title-3',
      date_start: '1996-02-09T00:00:00',
      time_start: '13:00:00',
      venue_name: 'venue_name-3',
      city: 'city-3',
      state: 'state-3',
      cover_image_url: 'url-3',
      ticket_smallest_price: 1,
    };

    const RowData = [eventData, eventData2, eventData3];

    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve(RowData));
    const res = await request({ handler });

    expect(res.statusCode).toBe(OK_STATUS);
    expect(res.body).toEqual({
      events: RowData,
    });
  });

  test('returns without data', async () => {
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([]));
    const res = await request({ handler });

    expect(res.statusCode).toBe(OK_STATUS);
    expect(res.body).toEqual({ events: [] });
  });
});

describe('GET route -- /api/v1/event -- bad request', () => {
  test('internal server error', async () => {
    // @ts-ignore
    dbSelect.mockImplementation(() => {
      throw new Error('test error');
    });

    const res = await request({ handler });

    expect(res.statusCode).toBe(INTERNAL_SERVER_ERROR_STATUS);
    expect(res.body).toEqual({
      error: 'Internal Server Error',
      message: 'test error',
      statusCode: INTERNAL_SERVER_ERROR_STATUS,
    });
  });
});
