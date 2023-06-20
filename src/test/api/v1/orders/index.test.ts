import { request } from 'server/mocks/handlers';
import handler from 'pages/api/v1/orders';
// http status codes
import {
  INTERNAL_SERVER_ERROR_STATUS,
  OK_STATUS,
} from 'server/constants/http.status';
// mocks
import { dbSelect } from 'server/database';
import { createUser } from 'fixtures/user.fixture';
// utils
import { generateJWT } from 'server/utils';

jest.mock('server/database');

afterEach(() => {
  // @ts-ignore
  dbSelect.mockReset();
});

const user = createUser();
const token = generateJWT({ id: user.id });

const order1 = {
  id: 1,
  event_id: 1,
  first_name: 'test',
  last_name: 'test',
  purchase_date: `2023-05-22T00:00:00`,
  purchase_time: '09:00:00',
  total: 5,
  title: 'test title',
};

const order2 = {
  id: 2,
  event_id: 1,
  first_name: 'test 2',
  last_name: 'test 2',
  purchase_date: `2023-05-22T00:00:00`,
  purchase_time: '09:00:00',
  total: 0,
  title: 'test title 2',
};

const order3 = {
  id: 3,
  event_id: 1,
  first_name: 'test 3',
  last_name: 'test 3',
  purchase_date: `2023-05-22T00:00:00`,
  purchase_time: '09:00:00',
  total: 0,
  title: 'test title 3',
};

describe('GET route -- /api/v1/orders -- success request', () => {
  it('should return the data', async () => {
    const rowData = [order1, order2, order3];

    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([user]));
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve(rowData));
    const res = await request({
      handler,
      headers: { authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(OK_STATUS);
    expect(res.body).toEqual(rowData);
  });

  it('should return the filtered data', async () => {
    const rowData = [order3];

    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve([user]));
    // @ts-ignore
    dbSelect.mockReturnValueOnce(Promise.resolve(rowData));
    const res = await request({
      handler,
      headers: { authorization: `Bearer ${token}` },
      url: `/api/v1/orders?q=${order3.first_name}`,
    });

    expect(res.statusCode).toBe(OK_STATUS);
    expect(res.body).toEqual(rowData);
  });
});

describe('GET route -- /api/v1/orders -- bad request', () => {
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
    });

    expect(res.statusCode).toBe(INTERNAL_SERVER_ERROR_STATUS);
    expect(res.body).toEqual({
      error: 'Internal Server Error',
      message: 'test error',
      statusCode: INTERNAL_SERVER_ERROR_STATUS,
    });
  });
});
