import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import DashboardEventsPage from 'pages/dashboard/events';
// http status codes
import { OK_STATUS } from 'server/constants/http.status';
// mocks
import { rest } from 'msw';
import { server } from 'client/mocks/server';
import { PrivateWrapper } from 'client/mocks/Wrappers';

jest.mock('next/router', () => ({
  useRouter() {
    return {
      isReady: true,
      asPath: `/dashboard/events`,
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

const event1 = {
  id: 1,
  title: 'title-1',
  date_start: '1996-02-09T00:00:00',
  time_start: '13:00:00',
  date_end: '1996-02-09T00:00:00',
  time_end: '20:00:00',
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
  title: 'title-2',
  date_start: '1996-02-09T00:00:00',
  time_start: '13:00:00',
  date_end: '1996-02-09T00:00:00',
  time_end: '20:00:00',
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
  title: 'title-3',
  date_start: '1996-02-09T00:00:00',
  time_start: '13:00:00',
  date_end: '1996-02-09T00:00:00',
  time_end: '20:00:00',
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

const message = 'Event deleted successfully.';

const getEventsDashboard = () =>
  rest.get(`/event/dashboard`, async (req, res, ctx) => {
    return res(ctx.status(OK_STATUS), ctx.json(data));
  });

const deleteEventDashboard = () =>
  rest.delete(`/event/dashboard/${event1.id}`, async (req, res, ctx) => {
    return res(ctx.status(OK_STATUS), ctx.json({ message }));
  });

describe('<DashboardEventsPage/> success integration', () => {
  it('should render correctly', async () => {
    server.use(getEventsDashboard());
    render(<DashboardEventsPage />, { wrapper: PrivateWrapper });

    const $table = await screen.findByRole('table');
    expect($table).toBeInTheDocument();

    const $columnsHeaders = within($table).getAllByRole('columnheader');
    expect($columnsHeaders).toHaveLength(5);

    const [$event, $sold, $gross, $status, $actions] = $columnsHeaders;

    expect($event).toHaveTextContent(/event/i);
    expect($sold).toHaveTextContent(/sold/i);
    expect($gross).toHaveTextContent(/gross/i);
    expect($status).toHaveTextContent(/status/i);
    expect($actions).toHaveTextContent(/actions/i);
  });

  it('should delete an event', async () => {
    server.use(getEventsDashboard(), deleteEventDashboard());
    render(<DashboardEventsPage />, { wrapper: PrivateWrapper });

    const $table = await screen.findByRole('table');
    const $deleteButton = within($table).getAllByRole('button')[1];

    fireEvent.click($deleteButton);

    const $modal = document.querySelector('.ui-modal')! as HTMLElement;
    expect($modal).toBeInTheDocument();

    expect(
      within($modal).getByRole('heading', { name: /cancel event/i })
    ).toBeInTheDocument();

    expect(
      within($modal).getByText(
        `Are you sure you want to cancel ${event1.title}? This action cannot be undone.`
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
