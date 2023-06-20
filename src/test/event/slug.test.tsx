import { fireEvent, render, screen, within } from '@testing-library/react';
import { rest } from 'msw';
import EventPage from 'pages/event/[slug]';
// fixtures
import {
  createEvent,
  createEventDetail,
  createEventTag,
  createEventTicketInfo,
  createLocation,
} from 'fixtures/event.fixture';
import { createUser } from 'fixtures/user.fixture';
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
      query: { slug: 'valid-slug' },
      isReady: true,
      push: jest.fn(),
      replace: jest.fn(),
    };
  },
}));

beforeAll(() => {
  server.listen();
});

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

const d = getDateData();
const now = `${d.year}-${d.monthNumber}-${d.day}T00:00:00.000Z`;

const data = {
  ...createEvent(),
  event_detail: createEventDetail(),
  event_location: createLocation(),
  event_ticket_info: [
    createEventTicketInfo({ sales_start: now, sales_end: now }),
  ],
  event_tag: [createEventTag()],
};

const getEvent = () =>
  rest.get(`/event/valid-slug`, async (req, res, ctx) => {
    return res(ctx.status(OK_STATUS), ctx.json(data));
  });

const postOrder = () =>
  rest.post(`/orders/${data.id}`, async (req, res, ctx) => {
    return res(
      ctx.status(OK_STATUS),
      ctx.json({
        message: 'Order created successfully.',
        insertId: 1,
      })
    );
  });

describe('<EventPage/> integration', () => {
  it(`should show event information`, async () => {
    render(<EventPage />, { wrapper: PrivateWrapper });

    server.use(getEvent());

    expect(
      await screen.findByRole('heading', { name: data.title })
    ).toBeInTheDocument();
  });

  it(`should show the modal only when the user is authenticated`, async () => {
    render(<EventPage />, { wrapper: PrivateWrapper });

    server.use(getEvent());

    const $getTicketsButton = await screen.findByRole('button', {
      name: /Get tickets/i,
    });

    fireEvent.click($getTicketsButton);

    expect(screen.getByTestId('ui-modal_overlay-element')).toBeInTheDocument();
  });

  it(`should register the user correctly when the event is free`, async () => {
    render(<EventPage />, { wrapper: PrivateWrapper });

    const authUser = createUser();
    server.use(getEvent(), postOrder());

    const $getTicketsButton = await screen.findByRole('button', {
      name: /Get tickets/i,
    });

    fireEvent.click($getTicketsButton);

    const $modal = screen.getByTestId('ui-modal_overlay-element');
    expect($modal).toBeInTheDocument();

    expect(
      within($modal).getByRole('button', { name: /Checkout/i })
    ).toBeDisabled();

    const $ticketsAmount = within($modal).getAllByRole('combobox');
    expect($ticketsAmount).toHaveLength(1);

    fireEvent.click($ticketsAmount[0]);

    const $ticketsAmountList = within($modal).getAllByRole('list');
    expect($ticketsAmountList).toHaveLength(1);
    expect($ticketsAmountList[0]).toBeVisible();

    const $ticketOptions = within($ticketsAmountList[0]).getAllByRole(
      'listitem'
    );
    expect($ticketOptions).toHaveLength(11);

    fireEvent.click($ticketOptions[1]);

    expect(
      within($modal).getByRole('button', { name: /Checkout/i })
    ).not.toBeDisabled();

    fireEvent.click(within($modal).getByRole('button', { name: /Checkout/i }));

    expect(
      await within($modal).findByRole('heading', {
        name: /contact information/i,
      })
    ).toBeInTheDocument();

    expect(within($modal).getByLabelText(/first name/i)).toHaveValue(
      authUser.first_name
    );

    expect(within($modal).getByLabelText(/last name/i)).toHaveValue(
      authUser.last_name
    );

    expect(within($modal).getByLabelText(/email/i)).toHaveValue(authUser.email);

    fireEvent.click(within($modal).getByRole('button', { name: /Register/i }));

    expect(
      await within($modal).findByRole('heading', {
        name: /thanks for your order!/i,
      })
    ).toBeInTheDocument();
  });
});
