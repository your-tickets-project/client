import { render, screen } from '@testing-library/react';
import { rest } from 'msw';
import YourTicketPage from 'pages/dashboard/yourtickets/[id]';
// http status codes
import { OK_STATUS } from 'server/constants/http.status';
// mocks
import { server } from 'client/mocks/server';
import { PrivateWrapper } from 'client/mocks/Wrappers';

jest.mock('next/router', () => ({
  useRouter() {
    return {
      isReady: true,
      asPath: `/dashboard/yourtickets/1`,
      push: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
      query: {
        id: 1,
      },
    };
  },
}));

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

const ticket = {
  id: 1,
  event_id: 1,
  purchase_date: `2023-05-26T00:00:00`,
  purchase_time: '09:00:00',
  first_name: 'first name',
  last_name: 'last name',
  email: 'test@test.test',
  title: 'event title',
  date_start: `2023-05-26T00:00:00`,
  time_start: `09:00:00`,
  venue_name: 'venue name',
  city: 'city',
  country: 'country',
  orders_ticket_info: [
    {
      id: 1,
      ticket_amount: 2,
      total_price: 5,
      event_ticket_name: 'ticket name',
    },
    {
      id: 2,
      ticket_amount: 1,
      total_price: 0,
      event_ticket_name: 'ticket name 2',
    },
  ],
};

const getTicket = (t: typeof ticket) =>
  rest.get(`/ticket/${t.id}`, async (req, res, ctx) => {
    return res(ctx.status(OK_STATUS), ctx.json(t));
  });

describe('<YourTicketPage/> success integration', () => {
  it('should render correctly', async () => {
    server.use(getTicket(ticket));
    render(<YourTicketPage />, { wrapper: PrivateWrapper });

    expect(
      await screen.findByRole('heading', { name: `Order for ${ticket.title}` })
    );
    expect(
      screen.getByText(
        `${ticket.venue_name} • ${ticket.city}, ${ticket.country}`
      )
    ).toBeInTheDocument();
    expect(screen.getAllByText(ticket.first_name)[0]).toBeInTheDocument();
    expect(screen.getAllByText(ticket.last_name)[0]).toBeInTheDocument();
    expect(screen.getAllByText(ticket.email)[0]).toBeInTheDocument();
  });
});
