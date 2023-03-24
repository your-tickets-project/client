import { request } from 'server/mocks/handlers';
import handler from 'pages/api/v1/event';
// fixtures
import {
  createEvent,
  createEventDetail,
  createEventTag,
  createEventTicketInfo,
  createLocation,
} from 'fixtures/event.fixture';
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
      event: createEvent(),
      event_detail: createEventDetail(),
      event_location: createLocation(),
      event_ticket_info: createEventTicketInfo(),
    };

    const eventData2 = {
      event: createEvent({ id: 2 }),
      event_detail: createEventDetail({ id: 2, event_id: 2 }),
      event_location: createLocation({ id: 2, event_id: 2 }),
      event_ticket_info: createEventTicketInfo({ id: 2, event_id: 2 }),
    };

    const eventData3 = {
      event: createEvent({ id: 3 }),
      event_detail: createEventDetail({ id: 3, event_id: 3 }),
      event_location: createLocation({ id: 3, event_id: 3 }),
      event_ticket_info: createEventTicketInfo({ id: 3, event_id: 3 }),
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
      {
        ...eventData2,
        event_tag: createEventTag({
          id: 3,
          event_id: 2,
          name: 'Jalisco events',
        }),
      },
      {
        ...eventData3,
        event_tag: createEventTag({
          id: null,
          event_id: null,
          name: null,
        }),
      },
    ];

    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve(RowData));
    const res = await request({ handler });

    expect(res.statusCode).toBe(OK_STATUS);
    expect(res.body).toEqual({
      events: [
        {
          ...eventData.event,
          event_detail: eventData.event_detail,
          event_location: eventData.event_location,
          event_ticket_info: eventData.event_ticket_info,
          event_tag: [RowData[0].event_tag, RowData[1].event_tag],
        },
        {
          ...eventData2.event,
          event_detail: eventData2.event_detail,
          event_location: eventData2.event_location,
          event_ticket_info: eventData2.event_ticket_info,
          event_tag: [RowData[2].event_tag],
        },
        {
          ...eventData3.event,
          event_detail: eventData3.event_detail,
          event_location: eventData3.event_location,
          event_ticket_info: eventData3.event_ticket_info,
          event_tag: [],
        },
      ],
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
