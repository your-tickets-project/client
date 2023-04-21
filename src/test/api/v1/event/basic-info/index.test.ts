import { request } from 'server/mocks/handlers';
import handler from 'pages/api/v1/event/basic-info';
// fixtures
import { createUser } from 'fixtures/user.fixture';
import { createEvent, createLocation } from 'fixtures/event.fixture';
// http status codes
import {
  BAD_REQUEST_STATUS,
  CREATED_STATUS,
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

describe('POST -- api/v1/event/basic-info -- success request', () => {
  it(`should create an event`, async () => {
    const event = createEvent();
    const location = createLocation();
    const body = {
      ...event,
      location: {
        ...location,
        latitude: +location.latitude,
        longitude: +location.longitude,
      },
    };
    const insertId = 1;

    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([user]));
    // @ts-ignore
    dbInsert.mockReturnValueOnce(Promise.resolve({ insertId }));
    const res = await request({
      handler,
      method: 'POST',
      headers: { authorization: `Bearer ${token}` },
      body,
    });

    expect(res.statusCode).toBe(CREATED_STATUS);
    expect(res.body).toEqual({
      message: 'Created successfully.',
      insertId,
    });
  });
});

describe('POST -- api/v1/event/basic-info -- bad request', () => {
  it(`should validate required fields`, async () => {
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([user]));
    const res = await request({
      handler,
      method: 'POST',
      headers: { authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(BAD_REQUEST_STATUS);
    expect(res.body).toEqual({
      statusCode: BAD_REQUEST_STATUS,
      error: 'Bad Request',
      message: 'Invalid body.',
      errors: [
        'title is a required field',
        'location is a required field',
        'date_start is a required field',
        'date_end is a required field',
        'time_start is a required field',
        'time_end is a required field',
      ],
    });
  });

  it(`should validate location required fields`, async () => {
    const body = { ...createEvent(), location: {} };

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
      statusCode: BAD_REQUEST_STATUS,
      error: 'Bad Request',
      message: 'Invalid body.',
      errors: [
        'location.venue_name is a required field',
        'location.address_1 is a required field',
        'location.city is a required field',
        'location.postal_code is a required field',
        'location.country is a required field',
        'location.latitude is a required field',
        'location.longitude is a required field',
      ],
    });
  });
});
