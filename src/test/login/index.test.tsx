/* eslint-disable camelcase */
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { rest } from 'msw';
import LoginPage from 'pages/login';
// fixtures
import { createUser } from 'fixtures/user.fixture';
// http status codes
import {
  INTERNAL_SERVER_ERROR_STATUS,
  OK_STATUS,
} from 'server/constants/http.status';
// mocks
import { server } from 'client/mocks/server';
import { PublicWrapper } from 'client/mocks/Wrappers';

beforeAll(() => server.listen());

beforeEach(() => {
  render(<LoginPage />, { wrapper: PublicWrapper });
});

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

const submitForm = () => {
  const $emailField = screen.getByLabelText<HTMLInputElement>(/email/i);
  fireEvent.change($emailField, { target: { value: 'test@test.com' } });

  const $passwordField = screen.getByLabelText<HTMLInputElement>(/password/i);
  fireEvent.change($passwordField, { target: { value: '123456$' } });

  fireEvent.click(screen.getByRole('button', { name: /Send/i }));
};

describe('<LoginPage/> success integration', () => {
  it(`should send the form successfully`, async () => {
    server.use(
      rest.post(`auth/login`, async (req, res, ctx) => {
        const { id, email, first_name, last_name } = createUser();
        return res(
          ctx.status(OK_STATUS),
          ctx.json({
            accessToken: 'valid-token',
            message: 'Log in successfully.',
            user: { id, email, first_name, last_name },
          })
        );
      })
    );

    await act(() => {
      submitForm();
    });

    await waitFor(() => {
      expect(screen.getByText('Log in successfully.')).toBeInTheDocument();
    });
  }, 10_000);
});

describe('<LoginPage/> check validations', () => {
  it(`should validate required fields`, async () => {
    expect(
      screen.queryByText('Email is a required field')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('Password is a required field')
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Send/i }));

    await waitFor(() => {
      expect(screen.getByText('Email is a required field')).toBeInTheDocument();
      expect(
        screen.getByText('Password is a required field')
      ).toBeInTheDocument();
    });
  });

  it(`should validate a valid email`, async () => {
    expect(
      screen.queryByText(/email must be a valid email/i)
    ).not.toBeInTheDocument();

    const $emailField = screen.getByLabelText<HTMLInputElement>(/email/i);
    fireEvent.change($emailField, { target: { value: 'wrong email' } });
    fireEvent.click(screen.getByRole('button', { name: /Send/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/email must be a valid email/i)
      ).toBeInTheDocument();
    });
  });

  it(`should handle errors on form submit`, async () => {
    server.use(
      rest.post(`/auth/login`, async (req, res, ctx) => {
        return res(ctx.status(INTERNAL_SERVER_ERROR_STATUS));
      })
    );

    await act(() => {
      submitForm();
    });

    await waitFor(() => {
      expect(screen.getByText('Internal server error.')).toBeInTheDocument();
    });
  }, 10_000);
});
