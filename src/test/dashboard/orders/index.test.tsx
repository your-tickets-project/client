import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { rest } from 'msw';
import DashboardOrdersPage from 'pages/dashboard/orders';
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
      asPath: `/dashboard/orders`,
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

const order1 = {
  id: 1,
  unique_id: 1,
  event_id: 1,
  first_name: 'test',
  last_name: 'test',
  purchase_date: `${d.year}-${d.monthNumber}-${d.day}T00:00:00`,
  purchase_time: '09:00:00',
  total: 5,
  title: 'test title',
};

const order2 = {
  id: 2,
  unique_id: 2,
  event_id: 1,
  first_name: 'test 2',
  last_name: 'test 2',
  purchase_date: `${d.year}-${d.monthNumber}-${d.day}T00:00:00`,
  purchase_time: '09:00:00',
  total: 0,
  title: 'test title 2',
};

const order3 = {
  id: 3,
  unique_id: 3,
  event_id: 1,
  first_name: 'test 3',
  last_name: 'test 3',
  purchase_date: `${d.year}-${d.monthNumber}-${d.day}T00:00:00`,
  purchase_time: '09:00:00',
  total: 0,
  title: 'test title 3',
};

const data = [order1, order2, order3];

const message = 'Order canceled successfully.';

const getOrders = () =>
  rest.get(`/orders`, async (req, res, ctx) => {
    const q = req.url.searchParams.get('q');
    return res(
      ctx.status(OK_STATUS),
      ctx.json(q === order3.first_name ? [order3] : data)
    );
  });

const deleteOrder = () =>
  rest.delete(
    `/orders/${order1.event_id}/${order1.id}`,
    async (req, res, ctx) => {
      return res(ctx.status(OK_STATUS), ctx.json({ message }));
    }
  );

describe('<DashboardOrdersPage/> success integration', () => {
  it('should render correctly', async () => {
    server.use(getOrders());
    render(<DashboardOrdersPage />, { wrapper: PrivateWrapper });

    const $table = await screen.findByRole('table');
    expect($table).toBeInTheDocument();

    const $columnsHeaders = within($table).getAllByRole('columnheader');
    expect($columnsHeaders).toHaveLength(6);

    const [$order, $event, $buyer, $date, $total, $actions] = $columnsHeaders;

    expect($order).toHaveTextContent(/order/i);
    expect($event).toHaveTextContent(/event/i);
    expect($buyer).toHaveTextContent(/buyer/i);
    expect($date).toHaveTextContent(/date/i);
    expect($total).toHaveTextContent(/total/i);
    expect($actions).toHaveTextContent(/actions/i);

    const $tableBody = within(screen.getByRole('table')).getAllByRole('cell');
    expect($tableBody).toHaveLength(18);
  });

  it('should filter the orders by order number, event title or buyer name', async () => {
    server.use(getOrders());
    render(<DashboardOrdersPage />, { wrapper: PrivateWrapper });

    const $table = await screen.findByRole('table');
    expect($table).toBeInTheDocument();

    const $searchInput = screen.getByRole('textbox');

    fireEvent.change($searchInput, { target: { value: order3.first_name } });
    expect($searchInput).toHaveValue(order3.first_name);

    await waitFor(
      () => {
        const $tableBody = within(screen.getByRole('table')).getAllByRole(
          'cell'
        );

        expect($tableBody).toHaveLength(6);

        const [$orderId] = $tableBody;
        expect($orderId).toHaveTextContent(String(order3.unique_id));
      },
      { timeout: 2000 }
    );
  });

  it('should cancel an order', async () => {
    server.use(getOrders(), deleteOrder());
    render(<DashboardOrdersPage />, { wrapper: PrivateWrapper });

    const $table = await screen.findByRole('table');
    const $deleteButton = within($table).getAllByRole('button')[1];

    fireEvent.click($deleteButton);

    const $modal = document.querySelector('.ui-modal')! as HTMLElement;
    expect($modal).toBeInTheDocument();

    expect(
      within($modal).getByRole('heading', { name: /cancel order/i })
    ).toBeInTheDocument();

    expect(
      within($modal).getByText(
        `Are you sure you want to cancel this order #${order1.unique_id}? This action cannot be undone.`
      )
    ).toBeInTheDocument();

    fireEvent.click(within($modal).getByRole('button', { name: /confirm/i }));

    await waitFor(
      () => {
        expect(screen.getByText(message)).toBeInTheDocument();
      },
      { timeout: 5_000 }
    );
  }, 10_000);
});
