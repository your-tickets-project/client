import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { rest } from 'msw';
import DashboardYourTicketsPage from 'pages/dashboard/yourtickets';
// helpers
import { getDateData } from 'client/helpers';
// http status codes
import { OK_STATUS } from 'server/constants/http.status';
// mocks
import { server } from 'client/mocks/server';
import { PrivateWrapper } from 'client/mocks/Wrappers';

jest.mock('next/router', () => ({
  useRouter() {
    return {
      isReady: true,
      asPath: `/dashboard/yourtickets`,
      push: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
      query: {},
    };
  },
}));

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

const d = getDateData();

const ticket1 = {
  id: 1,
  event_id: 1,
  title: 'event title',
  cover_image_url: '/assets/example.jpg',
  date_start: `${d.year}-${d.monthNumber}-${d.day}T00:00:00`,
  time_start: '09:00:00',
  total: 10,
  purchase_date: `${d.year}-${d.monthNumber}-${d.day}T00:00:00`,
  purchase_time: '09:00:00',
};

const ticket2 = {
  id: 2,
  event_id: 2,
  title: 'event title 2',
  cover_image_url: '/assets/example.jpg',
  date_start: `${d.year}-${d.monthNumber}-${d.day}T00:00:00`,
  time_start: '09:00:00',
  total: 5,
  purchase_date: `${d.year}-${d.monthNumber}-${d.day}T00:00:00`,
  purchase_time: '09:00:00',
};

const ticket3 = {
  id: 3,
  event_id: 3,
  title: 'event title 3',
  cover_image_url: '/assets/example.jpg',
  date_start: `${d.year}-${d.monthNumber}-${d.day}T00:00:00`,
  time_start: '09:00:00',
  total: 9.99,
  purchase_date: `${d.year}-${d.monthNumber}-${d.day}T00:00:00`,
  purchase_time: '09:00:00',
};

const data = [ticket1, ticket2, ticket3];

const getTickets = () =>
  rest.get(`/ticket`, async (req, res, ctx) => {
    const q = req.url.searchParams.get('q');
    return res(
      ctx.status(OK_STATUS),
      ctx.json(q === String(ticket3.id) ? [ticket3] : data)
    );
  });

describe('<DashboardYourTicketsPage/> success integration', () => {
  it('should render correctly', async () => {
    server.use(getTickets());
    render(<DashboardYourTicketsPage />, { wrapper: PrivateWrapper });

    const $table = await screen.findByRole('table');
    expect($table).toBeInTheDocument();

    const $columnsHeaders = within($table).getAllByRole('columnheader');
    expect($columnsHeaders).toHaveLength(2);

    const [$order, $actions] = $columnsHeaders;

    expect($order).toHaveTextContent(/order/i);
    expect($actions).toHaveTextContent(/actions/i);

    const $tableBody = within(screen.getByRole('table')).getAllByRole('cell');
    expect($tableBody).toHaveLength(6);
  });

  it('should filter the orders by order number, event title or buyer name', async () => {
    server.use(getTickets());
    render(<DashboardYourTicketsPage />, { wrapper: PrivateWrapper });

    const $table = await screen.findByRole('table');
    expect($table).toBeInTheDocument();

    const $searchInput = screen.getByRole('textbox');

    fireEvent.change($searchInput, { target: { value: String(ticket3.id) } });
    expect($searchInput).toHaveValue(String(ticket3.id));

    await waitFor(
      () => {
        const $tableBody = within(screen.getByRole('table')).getAllByRole(
          'cell'
        );

        expect($tableBody).toHaveLength(2);

        const [$orderId] = $tableBody;
        expect($orderId).toHaveTextContent(String(ticket3.id));
      },
      { timeout: 2000 }
    );
  });
});
