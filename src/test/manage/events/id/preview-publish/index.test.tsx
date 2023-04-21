import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import PreviewPublishPage from 'pages/manage/events/[id]/preview-publish';
// fixtures
import {
  createEvent,
  createEventDetail,
  createLocation,
} from 'fixtures/event.fixture';
// http status codes
import {
  INTERNAL_SERVER_ERROR_STATUS,
  OK_STATUS,
} from 'server/constants/http.status';
// interfaces
import { EventPreviewPublishType } from 'interfaces';
// mocks
import { rest } from 'msw';
import { server } from 'client/mocks/server';
import { PrivateWrapper } from 'client/mocks/Wrappers';

const data: EventPreviewPublishType = {
  ...createEvent(),
  ticket_largest_price: 10,
  ticket_smallest_price: 0,
  total_quantity: 100,
  event_location: createLocation(),
  event_detail: createEventDetail(),
};

jest.mock('next/router', () => ({
  useRouter() {
    return {
      isReady: true,
      asPath: `/manage/events/${data.id}/preview-publish`,
      push: jest.fn(),
      query: { id: data.id },
    };
  },
}));

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

describe('<BasicInfoPage/> success integration', () => {
  it('should render successfully', async () => {
    server.use(
      rest.get(`/event/preview-publish/${data.id}`, async (req, res, ctx) => {
        return res(ctx.status(OK_STATUS), ctx.json(data));
      })
    );

    render(<PreviewPublishPage />, { wrapper: PrivateWrapper });

    expect(
      await screen.findByRole('heading', { name: /Check Your Event/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /publish/i })
    ).toBeInTheDocument();
  });

  it('should publish the event', async () => {
    server.use(
      rest.get(`/event/preview-publish/${data.id}`, async (req, res, ctx) => {
        return res(ctx.status(OK_STATUS), ctx.json(data));
      })
    );

    const message = 'Event published successfully.';
    server.use(
      rest.put(`/event/publish/${data.id}`, async (req, res, ctx) => {
        return res(ctx.status(OK_STATUS), ctx.json({ message }));
      })
    );

    render(<PreviewPublishPage />, { wrapper: PrivateWrapper });

    const $publishButton = await screen.findByRole('button', {
      name: 'Publish',
    });
    fireEvent.click($publishButton);

    await waitFor(() => {
      expect(screen.getByText(message)).toBeInTheDocument();
    });
  });

  it('should unpublish the event', async () => {
    server.use(
      rest.get(`/event/preview-publish/${data.id}`, async (req, res, ctx) => {
        return res(
          ctx.status(OK_STATUS),
          ctx.json({ ...data, is_available: 1 })
        );
      })
    );

    const message = 'Event unpublished successfully.';
    server.use(
      rest.put(`/event/publish/${data.id}`, async (req, res, ctx) => {
        return res(ctx.status(OK_STATUS), ctx.json({ message }));
      })
    );

    render(<PreviewPublishPage />, { wrapper: PrivateWrapper });

    const $unpublishButton = await screen.findByRole('button', {
      name: 'Unpublish',
    });
    fireEvent.click($unpublishButton);

    await waitFor(() => {
      expect(screen.getByText(message)).toBeInTheDocument();
    });
  });
});

describe('<BasicInfoPage/> check validations', () => {
  it('should throw "Internal server error."', async () => {
    server.use(
      rest.get(`/event/preview-publish/${data.id}`, async (req, res, ctx) => {
        return res(ctx.status(INTERNAL_SERVER_ERROR_STATUS));
      })
    );

    render(<PreviewPublishPage />, { wrapper: PrivateWrapper });

    expect(
      await screen.findByText('Internal server error.')
    ).toBeInTheDocument();
  });
});
