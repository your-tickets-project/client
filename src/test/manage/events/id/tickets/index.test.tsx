import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TicketsPage from 'pages/manage/events/[id]/tickets';
// fixtures
import { createEventTicketInfo } from 'fixtures/event.fixture';
// helpers
import { getDate } from 'client/helpers';
// http status codes
import { OK_STATUS } from 'server/constants/http.status';
// mocks
import { rest } from 'msw';
import { server } from 'client/mocks/server';
import { PrivateWrapper } from 'client/mocks/Wrappers';

const eventTicket1 = createEventTicketInfo({
  id: 1,
  type: 'free',
  name: 'general admission',
  quantity: 200,
  sold: 0,
  price: 0,
  sales_start: `${getDate()}T04:00:00.000Z`,
  sales_end: `${getDate()}T04:00:00.000Z`,
  time_start: '09:00:00',
  time_end: '21:00:00',
  visibility: 'visible',
});

const eventTicket2 = createEventTicketInfo({
  id: 2,
  type: 'paid',
  name: 'vip',
  quantity: 100,
  sold: 0,
  price: 5,
  sales_start: `${getDate()}T04:00:00.000Z`,
  sales_end: `${getDate()}T04:00:00.000Z`,
  time_start: '09:00:00',
  time_end: '21:00:00',
  visibility: 'visible',
});

const eventData = {
  id: 1,
  event_tickets_info: [eventTicket1, eventTicket2],
};

jest.mock('next/router', () => ({
  useRouter() {
    return {
      isReady: true,
      asPath: `/manage/events/${eventData.id}/tickets`,
      push: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
      query: { id: eventData.id },
    };
  },
}));

const message = 'Event updated.';

const handleGetTickets = () =>
  rest.get(`/event/tickets/${eventData.id}`, async (req, res, ctx) => {
    return res(
      ctx.status(OK_STATUS),
      ctx.json({
        id: eventData.id,
        event_tickets_info: eventData.event_tickets_info,
      })
    );
  });

const handleGetTicket = () =>
  rest.get(
    `/event/tickets/${eventData.id}/${eventData.event_tickets_info[0].id}`,
    async (req, res, ctx) => {
      return res(
        ctx.status(OK_STATUS),
        ctx.json({
          id: eventData.id,
          event_ticket_info: eventTicket1,
        })
      );
    }
  );

const handlePutTicket = () =>
  rest.put(
    `/event/tickets/${eventData.id}/${eventData.event_tickets_info[0].id}`,
    async (req, res, ctx) => {
      return res(ctx.status(OK_STATUS), ctx.json({ message }));
    }
  );

const handleDeleteTicket = () =>
  rest.delete(
    `/event/tickets/${eventData.id}/${eventData.event_tickets_info[0].id}`,
    async (req, res, ctx) => {
      return res(ctx.status(OK_STATUS), ctx.json({ message }));
    }
  );

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

describe('<TicketsPage/> success integration', () => {
  it('should render correctly', async () => {
    server.use(handleGetTickets());
    render(<TicketsPage />, { wrapper: PrivateWrapper });

    const $table = await screen.findByRole('table');
    expect($table).toBeInTheDocument();

    const $columnsHeaders = within($table).getAllByRole('columnheader');
    expect($columnsHeaders).toHaveLength(6);

    const [$name, $saleDate, $visibility, $sold, $price, $actions] =
      $columnsHeaders;

    expect($name).toHaveTextContent(/name/i);
    expect($saleDate).toHaveTextContent(/sale date/i);
    expect($visibility).toHaveTextContent(/visibility/i);
    expect($sold).toHaveTextContent(/sold/i);
    expect($price).toHaveTextContent(/price/i);
    expect($actions).toHaveTextContent(/actions/i);
  });

  it('should delete a ticket', async () => {
    server.use(handleGetTickets(), handleDeleteTicket());
    render(<TicketsPage />, { wrapper: PrivateWrapper });

    const $table = await screen.findByRole('table');
    const $deleteButton = within($table).getAllByRole('button')[1];

    fireEvent.click($deleteButton);

    const $modal = document.querySelector('.ui-modal')! as HTMLElement;
    expect($modal).toBeInTheDocument();

    expect(
      within($modal).getByRole('heading', { name: /delete ticket/i })
    ).toBeInTheDocument();

    expect(
      within($modal).getByText(
        `Are you sure you want to delete ${eventData.event_tickets_info[0].name}? This action cannot be undone.`
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

  it('should edit a ticket', async () => {
    server.use(handleGetTickets(), handleGetTicket(), handlePutTicket());
    render(<TicketsPage />, { wrapper: PrivateWrapper });

    const $table = await screen.findByRole('table');
    const $editButton = within($table).getAllByRole('button')[0];

    fireEvent.click($editButton);

    const $modal = document.querySelector('.ui-modal')! as HTMLElement;
    expect($modal).toBeInTheDocument();

    expect(
      within($modal).getByRole('heading', { name: /edit ticket/i })
    ).toBeInTheDocument();

    expect(await within($modal).findByRole('form')).toBeInTheDocument();

    expect(within($modal).getByLabelText(/name/i)).toHaveValue(
      eventData.event_tickets_info[0].name
    );
    expect(within($modal).getByLabelText('Available quantity')).toHaveValue(
      eventData.event_tickets_info[0].quantity
    );
    expect(within($modal).getByLabelText(/price/i)).toBeDisabled();
    expect(within($modal).getByLabelText(/description/i)).toHaveValue(
      eventData.event_tickets_info[0].description
    );
    expect(within($modal).getByLabelText('Minimun quantity')).toHaveValue(
      eventData.event_tickets_info[0].minimum_quantity
    );
    expect(within($modal).getByLabelText('Maximum quantity')).toHaveValue(
      eventData.event_tickets_info[0].maximum_quantity
    );

    await act(() => {
      fireEvent.change(within($modal).getByLabelText(/name/i), {
        target: { value: 'new value' },
      });
      fireEvent.click(within($modal).getByRole('button', { name: /save/i }));
    });
    const $message = await screen.findAllByText(message);
    expect($message[0]).toBeInTheDocument();
  }, 10_000);

  it('should not disable the price input if is a paid ticket', async () => {
    server.use(handleGetTickets());
    render(<TicketsPage />, { wrapper: PrivateWrapper });

    const $addTicketButton = await screen.findByRole('button', {
      name: /Add tickets/i,
    });

    await userEvent.click($addTicketButton);

    const $modal = document.querySelector('.ui-modal')! as HTMLElement;
    expect($modal).toBeInTheDocument();

    const $priceField = within($modal).getByLabelText(/price/i);
    expect($priceField).not.toBeDisabled();
  });
});

describe('<TicketsPage/> validations', () => {
  it('should validate add, edit ticket form required fields', async () => {
    server.use(handleGetTickets());
    render(<TicketsPage />, { wrapper: PrivateWrapper });

    const $addTicketButton = await screen.findByRole('button', {
      name: /Add tickets/i,
    });

    fireEvent.click($addTicketButton);

    const $modal = document.querySelector('.ui-modal')! as HTMLElement;
    expect($modal).toBeInTheDocument();

    fireEvent.click(within($modal).getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByText(/Name is a required field/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Available quantity must be a number/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Price must be a number/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Sales starts is a required field/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Start time is a required field/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Start time is a required field/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Sales ends is a required field/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/End time is a required field/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/End time is a required field/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Minimum quantity must be a number/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Maximum quantity must be a number/i)
      ).toBeInTheDocument();
    });
  }, 10_000);
});
