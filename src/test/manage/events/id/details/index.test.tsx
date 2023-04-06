import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import EditDetailsPage from 'pages/manage/events/[id]/details';
// fixtures
import { createEventDetail } from 'fixtures/event.fixture';
// http status codes
import { OK_STATUS } from 'server/constants/http.status';
// mocks
import { rest } from 'msw';
import { server } from 'client/mocks/server';
import { PrivateWrapper } from 'client/mocks/Wrappers';

const eventData = {
  id: 1,
  event_detail: createEventDetail(),
};

jest.mock('next/router', () => ({
  useRouter() {
    return {
      isReady: true,
      asPath: `/manage/events/${eventData.id}/details`,
      push: jest.fn(),
      query: { id: eventData.id },
    };
  },
}));

const message = 'Event updated.';

const handleGetEventDetail = () =>
  rest.get(`/event/details/${eventData.id}`, async (req, res, ctx) => {
    return res(
      ctx.status(OK_STATUS),
      ctx.json({
        id: eventData.id,
        event_detail: {
          id: null,
          event_id: null,
          cover_image_url: null,
          description: null,
          summary: null,
        },
      })
    );
  });

const handlePostEventDetail = () =>
  rest.post(`/event/details/${eventData.id}`, async (req, res, ctx) => {
    return res(
      ctx.status(OK_STATUS),
      ctx.json({ message, insertId: eventData.event_detail.id })
    );
  });

const handlePutEventDetail = () =>
  rest.put(
    `/event/details/${eventData.id}/${eventData.event_detail.id}`,
    async (req, res, ctx) => {
      return res(ctx.status(OK_STATUS), ctx.json({ message }));
    }
  );

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

describe('<EditDetailsPage/> success integration', () => {
  it('should render correctly', async () => {
    server.use(handleGetEventDetail());
    render(<EditDetailsPage />, { wrapper: PrivateWrapper });
    expect(await screen.findByRole('heading', { name: /main event image/i }));
    expect(screen.getByRole('heading', { name: /summary/i }));
    expect(screen.getByRole('heading', { name: /description/i }));
  });

  it('should send the form successfully', async () => {
    server.use(
      handleGetEventDetail(),
      handlePostEventDetail(),
      handlePutEventDetail()
    );

    render(<EditDetailsPage />, { wrapper: PrivateWrapper });

    await screen.findByRole('heading', { name: /main event image/i });

    await act(async () => {
      const file = new File(['(⌐□_□)'], 'test.png', { type: 'image/png' });
      fireEvent.drop(document.querySelector('.ui-dragger_dragger')!, {
        dataTransfer: {
          files: [file],
        },
      });
    });

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/summary/i), {
        target: { value: 'summary' },
      });
      fireEvent.click(screen.getByRole('button', { name: /save/i }));
    });

    await waitFor(() => {
      expect(screen.getByText(message)).toBeInTheDocument();
    });
  });
});

describe('<EditDetailsPage/> check validations', () => {
  it('should validate Main event image required field', async () => {
    server.use(handleGetEventDetail());
    render(<EditDetailsPage />, { wrapper: PrivateWrapper });

    await screen.findByRole('heading', { name: /main event image/i });

    expect(
      screen.queryByText('Main event image is required.')
    ).not.toBeInTheDocument();

    document.querySelector('#event-form-layout')!.scrollTo = jest.fn();

    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(
        screen.getByText('Main event image is required.')
      ).toBeInTheDocument();
    });
  });

  it('should validate summary required field', async () => {
    server.use(handleGetEventDetail(), handlePostEventDetail());
    render(<EditDetailsPage />, { wrapper: PrivateWrapper });

    await screen.findByRole('heading', { name: /main event image/i });

    expect(
      screen.queryByText('Summary is a required field')
    ).not.toBeInTheDocument();

    await act(async () => {
      const file = new File(['(⌐□_□)'], 'test.png', { type: 'image/png' });
      fireEvent.drop(document.querySelector('.ui-dragger_dragger')!, {
        dataTransfer: {
          files: [file],
        },
      });
    });

    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(
        screen.getByText('Summary is a required field')
      ).toBeInTheDocument();
    });
  });
});
