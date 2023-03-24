import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import BasicInfoForm from '.';
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

jest.mock('next/router', () => ({
  useRouter() {
    return {
      asPath: '/event',
      push: jest.fn(),
    };
  },
}));

beforeAll(() => {
  server.listen();
});

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

const eventData = {
  ...createEvent(),
  event_location: createLocation(),
  event_tag: [
    createEventTag({ name: 'custom tag' }) as {
      id: number;
      name: string;
      event_id: number;
    },
  ],
};

describe('<BasicInfoForm/> send form correctly', () => {
  it(`should send the form successfully`, async () => {
    const message = 'Event updated.';
    server.use(
      rest.put(`/event/basic-info/${eventData.id}`, async (req, res, ctx) => {
        return res(ctx.status(OK_STATUS), ctx.json({ message }));
      })
    );

    render(<BasicInfoForm eventData={eventData} />);

    const $titleField = screen.getByLabelText(/title/i);
    const $tagField = screen.getByPlaceholderText(/Add search/i);
    const $tagButton = screen.getByRole('button', { name: /add/i });
    const $venueNameField = screen.getByLabelText(/venue name/i);
    const $address1Field = screen.getByLabelText(/address 1/i);
    const $address2Field = screen.getByLabelText(/address 2/i);
    const $cityField = screen.getByLabelText(/city/i);
    const $stateField = screen.getByLabelText(/state/i);
    const $postalCodeField = screen.getByLabelText(/postal code/i);
    const $countryField = screen.getByLabelText(/country/i);
    const $eventStartsField = document.querySelector(
      'input[name="date_start"]'
    );
    const $eventStartTimeField = document.querySelector(
      'input[name="time_start"]'
    );
    const $eventEndsField = document.querySelector('input[name="date_end"]');
    const $eventEndTimeField = document.querySelector('input[name="time_end"]');

    await act(() => {
      fireEvent.change($tagField, {
        target: { value: 'custom tag 2' },
      });
      fireEvent.click($tagButton);
    });

    expect($titleField).toHaveValue(eventData.title);
    expect(screen.getByText('custom tag')).toBeInTheDocument();
    expect(screen.getByText('custom tag 2')).toBeInTheDocument();
    expect($venueNameField).toHaveValue(eventData.event_location.venue_name);
    expect($address1Field).toHaveValue(eventData.event_location.address_1);
    expect($address2Field).toHaveValue('');
    expect($cityField).toHaveValue(eventData.event_location.city);
    expect($stateField).toHaveValue(eventData.event_location.state);
    expect($postalCodeField).toHaveValue(eventData.event_location.postal_code);
    expect($countryField).toHaveValue(eventData.event_location.country);
    expect($eventStartsField).toHaveValue(eventData.date_start);
    expect($eventStartTimeField).toHaveValue(eventData.time_start.slice(0, -3));
    expect($eventEndsField).toHaveValue(eventData.date_end);
    expect($eventEndTimeField).toHaveValue(eventData.time_end.slice(0, -3));
  }, 10_000);
});

describe('<BasicInfoForm/> check validations', () => {
  it(`should validate required fields`, async () => {
    render(<BasicInfoForm />);

    await act(() => {
      fireEvent.click(screen.getByRole('button', { name: /save/i }));
    });

    await waitFor(() => {
      expect(
        screen.getByText(/Event title is a required field/i)
      ).toBeInTheDocument();

      expect(
        screen.getByText(/Event starts is a required field/i)
      ).toBeInTheDocument();

      expect(
        screen.getByText(/Start time is a required field/i)
      ).toBeInTheDocument();

      expect(
        screen.getByText(/Event ends is a required field/i)
      ).toBeInTheDocument();

      expect(
        screen.getByText(/End time is a required field/i)
      ).toBeInTheDocument();
    });
  }, 10_000);
});
