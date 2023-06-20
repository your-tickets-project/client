import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { rest } from 'msw';
import ShowOrderPage from 'pages/dashboard/orders/[eventId]/[id]';
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
      asPath: `/dashboard/orders/1/1`,
      push: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
      query: {
        eventId: 1,
        id: 1,
      },
    };
  },
}));

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

const d = getDateData();

const order = {
  id: 1,
  unique_id: 1,
  event_id: 1,
  first_name: 'test',
  last_name: 'test',
  total: 0,
  purchase_date: `${d.year}-${d.monthNumber}-${d.day}T00:00:00`,
  purchase_time: '09:00:00',
  total_tickets: 2,
  is_available: 1,
  title: 'event title',
  date_start: `${d.year}-${d.monthNumber}-${d.day}T00:00:00`,
  date_end: `${d.year}-${d.monthNumber}-${d.day}T00:00:00`,
  time_start: '09:00:00',
  time_end: '21:00:00',
  cover_image_url: 'image-url',
  venue_name: 'venue_name',
};

const message = 'Order canceled successfully.';

const getOrder = (o: typeof order) =>
  rest.get(`/orders/${o.event_id}/${o.id}`, async (req, res, ctx) => {
    return res(ctx.status(OK_STATUS), ctx.json(o));
  });

const deleteOrder = () =>
  rest.delete(
    `/orders/${order.event_id}/${order.id}`,
    async (req, res, ctx) => {
      return res(ctx.status(OK_STATUS), ctx.json({ message }));
    }
  );

describe('<ShowOrderPage/> success integration', () => {
  it('should render correctly', async () => {
    server.use(getOrder(order));
    render(<ShowOrderPage />, { wrapper: PrivateWrapper });

    expect(await screen.findByRole('heading', { name: `Order #${order.id}` }));
    expect(screen.getByText(order.title)).toBeInTheDocument();
    expect(screen.getByText(order.venue_name)).toBeInTheDocument();
    expect(
      screen.getByText(`${order.first_name} ${order.last_name}`)
    ).toBeInTheDocument();
    expect(screen.getByText(`${order.total_tickets} tickets`));
  });

  it('should render a refunded order', async () => {
    server.use(getOrder({ ...order, is_available: 0 }));
    render(<ShowOrderPage />, { wrapper: PrivateWrapper });

    expect(await screen.findByRole('heading', { name: `Order #${order.id}` }));
    expect(screen.getByText(/Refunded/i)).toBeInTheDocument();
  });

  it('should cancel an order', async () => {
    server.use(getOrder(order), deleteOrder());
    render(<ShowOrderPage />, { wrapper: PrivateWrapper });

    expect(
      await screen.findByRole('heading', { name: `Order #${order.unique_id}` })
    );
    fireEvent.click(screen.getByText(/cancel order/i));

    const $modal = document.querySelector('.ui-modal')! as HTMLElement;
    expect($modal).toBeInTheDocument();

    expect(
      within($modal).getByRole('heading', { name: /cancel order/i })
    ).toBeInTheDocument();

    expect(
      within($modal).getByText(
        `Are you sure you want to cancel this order #${order.unique_id}? This action cannot be undone.`
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
