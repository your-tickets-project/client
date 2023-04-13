/* eslint-disable camelcase */
import { request } from 'server/mocks/handlers';
import handler from 'pages/api/v1/event/preview/[id]';
// fixtures
import { createUser } from 'fixtures/user.fixture';
import {
  createEvent,
  createEventDetail,
  createEventTag,
  createEventTicketInfo,
  createLocation,
} from 'fixtures/event.fixture';
// http status codes
import {
  BAD_REQUEST_STATUS,
  NOT_FOUND_STATUS,
  OK_STATUS,
} from 'server/constants/http.status';
// interfaces
import {
  EventBasicInfoType,
  EventDetailType,
  EventLocationType,
  EventTagType,
  EventTicketInfoType,
  NullablePartial,
} from 'interfaces';
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

const { user_id, ...event } = createEvent();
const event_location = createLocation();
const event_detail = createEventDetail();
const event_ticket_info = createEventTicketInfo();
const event_tag = createEventTag({ event_id: 1, id: 1, name: 'name' }) as any;

const data: EventBasicInfoType & {
  event_location: EventLocationType;
  event_detail: NullablePartial<EventDetailType>;
  event_ticket_info: EventTicketInfoType[];
  event_tag: EventTagType[];
} = {
  ...event,
  event_location,
  event_detail,
  event_ticket_info: [event_ticket_info],
  event_tag: [event_tag],
};

describe('GET -- api/v1/event/preview/[id] -- success request', () => {
  it('should return the data', async () => {
    const id = 1;
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([user]));
    // @ts-ignore
    dbSelect.mockReturnValueOnce(
      Promise.resolve([
        {
          event,
          event_location,
          event_detail,
          event_ticket_info,
          event_tag,
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
