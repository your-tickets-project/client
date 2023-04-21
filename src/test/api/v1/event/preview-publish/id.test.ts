import { request } from 'server/mocks/handlers';
import handler from 'pages/api/v1/event/preview-publish/[id]';
// fixtures
import { createUser } from 'fixtures/user.fixture';
import {
  createEvent,
  createEventDetail,
  createLocation,
} from 'fixtures/event.fixture';
// http status codes
import {
  BAD_REQUEST_STATUS,
  NOT_FOUND_STATUS,
  OK_STATUS,
} from 'server/constants/http.status';
// interfaces
import { EventPreviewPublishType } from 'interfaces';
// mocks
import { dbSelect } from 'server/database';
// utils
import { generateJWT } from 'server/utils';

jest.mock('server/database');

afterEach(() => {
  // @ts-ignore
  dbSelect.mockClear();
});

const user = createUser();
const token = generateJWT({ id: user.id });

const event = createEvent();
const location = createLocation();
const eventDetail = createEventDetail();

const data: EventPreviewPublishType = {
  id: event.id,
  title: event.title,
  date_start: event.date_start,
  time_start: event.time_start,
  is_available: event.is_available,
  ticket_largest_price: 10,
  ticket_smallest_price: 0,
  total_quantity: 100,
  event_location: {
    address_1: location.address_1,
    city: location.city,
    state: location.state,
    country: location.country,
    postal_code: location.postal_code,
  },
  event_detail: {
    cover_image_url: eventDetail.cover_image_url,
    summary: eventDetail.summary,
  },
};

describe('GET -- api/v1/event/preview-publish/[id] -- success request', () => {
  it('should return the data', async () => {
    const id = 1;
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([user]));
    // @ts-ignore
    dbSelect.mockReturnValueOnce(
      Promise.resolve([
        {
          id: data.id,
          title: data.title,
          date_start: data.date_start,
          time_start: data.time_start,
          is_available: data.is_available,
          address_1: data.event_location.address_1,
          city: data.event_location.city,
          state: data.event_location.state,
          country: data.event_location.country,
          postal_code: data.event_location.postal_code,
          cover_image_url: data.event_detail.cover_image_url,
          summary: data.event_detail.summary,
          ticket_smallest_price: data.ticket_smallest_price,
          ticket_largest_price: data.ticket_largest_price,
          total_quantity: data.total_quantity,
        },
      ])
    );

    const res = await request({
      handler,
      query: { id },
      headers: { authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(OK_STATUS);
    expect(res.body).toEqual(data);
  });
});

describe('GET -- api/v1/event/preview-publish/[id] -- bad request', () => {
  it('should throw "Id is required."', async () => {
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

  it('should throw "Event not found."', async () => {
    const id = 1;
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([user]));
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([]));

    const res = await request({
      handler,
      query: { id },
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
