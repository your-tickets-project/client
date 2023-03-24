import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import BasicInfoPage from 'pages/manage/events/[id]/basic-info';
// fixtures
import {
  createEvent,
  createEventTag,
  createLocation,
} from 'fixtures/event.fixture';
// http status codes
import { OK_STATUS } from 'server/constants/http.status';
// mocks
import { rest } from 'msw';
import { server } from 'client/mocks/server';
import { PrivateWrapper } from 'client/mocks/Wrappers';

const eventData = {
  ...createEvent(),
  event_location: createLocation(),
  event_tag: [createEventTag({ name: 'custom tag' })],
};

jest.mock('next/router', () => ({
  useRouter() {
    return {
      isReady: true,
      asPath: '/event',
      push: jest.fn(),
      query: { id: eventData.id },
    };
  },
}));

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

describe('<BasicInfoPage/> success integration', () => {
  it(`should send the form successfully`, async () => {
    server.use(
      rest.get(`/event/basic-info/${eventData.id}`, async (req, res, ctx) => {
        return res(ctx.status(OK_STATUS), ctx.json(eventData));
      })
    );

    const message = 'Event updated.';
    server.use(
      rest.put(`/event/basic-info/${eventData.id}`, async (req, res, ctx) => {
        return res(ctx.status(OK_STATUS), ctx.json({ message }));
      })
    );

    render(<BasicInfoPage />, { wrapper: PrivateWrapper });

    const $titleField = await screen.findByLabelText(/title/i);
    const $venueNameField = screen.getByLabelText(/venue name/i);
    const $address1Field = screen.getByLabelText(/address 1/i);
    const $address2Field = screen.getByLabelText(/address 2/i);
    const $cityField = screen.getByLabelText(/city/i);
    const $stateField = screen.getByLabelText(/state/i);
    const $postalCodeField = screen.getByLabelText(/postal code/i);
    const $countryField = screen.getByLabelText(/country/i);

    expect($titleField).toHaveValue(eventData.title);
    expect($venueNameField).toHaveValue(eventData.event_location.venue_name);
    expect($address1Field).toHaveValue(eventData.event_location.address_1);
    expect($address2Field).toHaveValue('');
    expect($cityField).toHaveValue(eventData.event_location.city);
    expect($stateField).toHaveValue(eventData.event_location.state);
    expect($postalCodeField).toHaveValue(eventData.event_location.postal_code);
    expect($countryField).toHaveValue(eventData.event_location.country);

    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByText(message)).toBeInTheDocument();
    });
  }, 10_000);
});
