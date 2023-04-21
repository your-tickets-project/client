import { request } from 'server/mocks/handlers';
import handler from 'pages/api/v1/event/dashboard';
// fixtures
import { createUser } from 'fixtures/user.fixture';
// http status codes
import { OK_STATUS } from 'server/constants/http.status';
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

const event1 = {
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
  is_available: 1,
  include_event_detail: 1,
  include_event_ticket_info: 1,
  total_sold: 0,
  total_quantity: 150,
};

const event2 = {
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
  is_available: 1,
  include_event_detail: 1,
  include_event_ticket_info: 1,
  total_sold: 0,
  total_quantity: 150,
};

const event3 = {
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
  is_available: 1,
  include_event_detail: 1,
  include_event_ticket_info: 1,
  total_sold: 0,
  total_quantity: 150,
};

const data = [event1, event2, event3];

describe('GET -- api/v1/event/dashboard -- success request', () => {
  it('should return the data', async () => {
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([user]));
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve(data));

    const res = await request({
      handler,
      headers: { authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(OK_STATUS);
    expect(res.body).toEqual(data);
  });
});
