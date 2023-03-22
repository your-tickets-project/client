import { act, fireEvent, render, screen } from '@testing-library/react';
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
// http status codes
import { OK_STATUS } from 'server/constants/http.status';
// mocks
import { server } from 'client/mocks/server';
import { PrivateWrapper } from 'client/mocks/Wrappers';

jest.mock('next/router', () => ({
  useRouter() {
    return {
      query: { slug: 'valid-slug' },
      push: jest.fn(),
    };
  },
}));

beforeAll(() => {
  server.listen();
});

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

describe('<EventPage/> integration', () => {
  it(`should show event information`, async () => {
    render(<EventPage />, { wrapper: PrivateWrapper });

    const event = {
      ...createEvent(),
      event_detail: createEventDetail(),
      event_location: createLocation(),
      event_ticket_info: createEventTicketInfo(),
      event_tag: [createEventTag()],
    };

    server.use(
      rest.get(`/event/valid-slug`, async (req, res, ctx) => {
        return res(ctx.status(OK_STATUS), ctx.json({ event }));
      })
    );

    expect(
      await screen.findByRole('heading', { name: event.title })
    ).toBeInTheDocument();
  });

  it(`should show the modal only when the user is authenticated`, async () => {
    render(<EventPage />, { wrapper: PrivateWrapper });

    const event = {
      ...createEvent(),
      event_detail: createEventDetail(),
      event_location: createLocation(),
      event_ticket_info: createEventTicketInfo(),
      event_tag: [createEventTag()],
    };

    server.use(
      rest.get(`/event/valid-slug`, async (req, res, ctx) => {
        return res(ctx.status(OK_STATUS), ctx.json({ event }));
      })
    );

    fireEvent.click(
      await screen.findByRole('button', { name: /Get tickets/i })
    );

    expect(screen.getByTestId('ui-modal_overlay-element')).toBeInTheDocument();
  });

  it(`should register the user correctly when the event is free`, async () => {
    render(<EventPage />, { wrapper: PrivateWrapper });

    const authUser = createUser();

    const event = {
      ...createEvent(),
      event_detail: createEventDetail(),
      event_location: createLocation(),
      event_ticket_info: createEventTicketInfo(),
      event_tag: [createEventTag()],
    };

    server.use(
      rest.get(`/event/valid-slug`, async (req, res, ctx) => {
        return res(ctx.status(OK_STATUS), ctx.json({ event }));
      })
    );

    fireEvent.click(
      await screen.findByRole('button', { name: /Get tickets/i })
    );

    fireEvent.click(screen.getByRole('button', { name: /Checkout/i }));

    expect(
      await screen.findByRole('heading', { name: /contact information/i })
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/first name/i)).toHaveValue(
      authUser.first_name
    );

    expect(screen.getByLabelText(/last name/i)).toHaveValue(authUser.last_name);

    expect(screen.getByLabelText(/email/i)).toHaveValue(authUser.email);

    const $phoneNumberInput = screen.getByLabelText(/phone number/i);

    act(() => {
      fireEvent.change($phoneNumberInput, {
        target: { value: '12345678' },
      });
    });

    expect($phoneNumberInput).toHaveValue('12345678');

    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    expect(
      await screen.findByRole('heading', { name: /thanks for your order!/i })
    ).toBeInTheDocument();
  });
});
