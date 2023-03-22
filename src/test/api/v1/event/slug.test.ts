import { request } from 'server/mocks/handlers';
import handler from 'pages/api/event/[slug]';
// fixtures
import {
  createEvent,
  createEventTag,
  createEventTicketInfo,
  createLocation,
} from 'fixtures/event.fixture';
// http status codes
import {
  BAD_REQUEST_STATUS,
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

describe('GET route -- /api/event/[slug] -- success request', () => {
  test('returns the data', async () => {
    const eventData = {
      event: createEvent(),
      event_location: createLocation(),
      event_ticket_info: createEventTicketInfo(),
    };

    const RowData = [
      {
        ...eventData,
        event_tag: createEventTag({
          id: 1,
          event_id: 1,
          name: 'Mexico events',
        }),
      },
      {
        ...eventData,
        event_tag: createEventTag({
          id: 2,
          event_id: 1,
          name: 'Guadalajara events',
        }),
      },
    ];

    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve(RowData));

    const res = await request({
      handler,
      query: { slug: eventData.event.slug },
    });

    expect(res.statusCode).toBe(OK_STATUS);
    expect(res.body).toEqual({
      event: {
        ...eventData.event,
        event_location: eventData.event_location,
        event_ticket_info: eventData.event_ticket_info,
        event_tag: [RowData[0].event_tag, RowData[1].event_tag],
      },
    });
  });

  test('returns without data', async () => {
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([]));
    const res = await request({ handler, query: { slug: 'invalid-slug' } });

    expect(res.statusCode).toBe(OK_STATUS);
    expect(res.body).toEqual({
      event: null,
    });
  });
});

describe('GET route -- /api/event/[slug] -- bad request', () => {
  test('slug is required', async () => {
    const res = await request({ handler });

    expect(res.statusCode).toBe(BAD_REQUEST_STATUS);
    expect(res.body).toEqual({
      message: 'Slug is required',
      error: 'Bad Request',
      statusCode: BAD_REQUEST_STATUS,
    });
  });

  test('internal server error', async () => {
    // @ts-ignore
    dbSelect.mockImplementation(() => {
      throw new Error('test error');
    });

    const res = await request({ handler, query: { slug: 'valid-slug' } });

    expect(res.statusCode).toBe(INTERNAL_SERVER_ERROR_STATUS);
    expect(res.body).toEqual({
      error: 'Internal Server Error',
      message: 'test error',
      statusCode: INTERNAL_SERVER_ERROR_STATUS,
    });
  });
});
