/* eslint-disable camelcase */
export const createEvent = ({
  id = 1,
  user_id = 1,
  title = 'test title',
  slug = 'test-slug',
  date_start = '1996-02-09',
  date_end = '1996-02-09',
  time_start = '13:00:00',
  time_end = '18:00:00',
  is_available = 0,
} = {}) => ({
  id,
  user_id,
  title,
  slug,
  date_start,
  date_end,
  time_start,
  time_end,
  is_available,
});

export const createEventDetail = ({
  id = 1,
  event_id = 1,
  cover_image_url = '/example/0.webp',
  summary = 'test summary',
  description = '<p>test description.</p>',
} = {}) => ({ id, event_id, cover_image_url, summary, description });

export const createLocation = ({
  id = 1,
  event_id = 1,
  venue_name = 'test venue',
  address_1 = 'test address 1',
  address_2 = null,
  city = 'test city',
  state = 'test state',
  postal_code = '0000',
  country = 'test country',
  latitude = '10.6423814',
  longitude = '-71.6103239',
} = {}) => ({
  id,
  event_id,
  venue_name,
  address_1,
  address_2,
  city,
  state,
  postal_code,
  country,
  latitude,
  longitude,
});

export const createEventTicketInfo = ({
  id = 1,
  event_id = 1,
  type = 'free',
  name = 'General admission - test',
  quantity = 100,
  price = 0,
  sold = 0,
  sales_start = '1996-02-01T04:00:00.000Z',
  sales_end = '1996-02-08T04:00:00.000Z',
  time_start = '00:00:00',
  time_end = '23:59:59',
  description = '',
  minimum_quantity = 1,
  maximum_quantity = 10,
  visibility = 'visible',
} = {}) => ({
  id,
  event_id,
  type,
  name,
  quantity,
  price,
  sold,
  sales_start,
  sales_end,
  time_start,
  time_end,
  description,
  maximum_quantity,
  minimum_quantity,
  visibility,
});

export const createEventTag = ({
  id = 1,
  event_id = 1,
  name = 'tag',
}: {
  id?: number | null;
  event_id?: number | null;
  name?: string | null;
} = {}) => ({
  id,
  event_id,
  name,
});
