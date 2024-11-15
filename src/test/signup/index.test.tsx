import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { rest } from 'msw';
import SignUp from 'pages/signup';
// http status codes
import {
  CREATED_STATUS,
  INTERNAL_SERVER_ERROR_STATUS,
} from 'server/constants/http.status';
// mocks
import { server } from 'client/mocks/server';
import { PublicWrapper } from 'client/mocks/Wrappers';

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

const submitForm = () => {
  const $emailField = screen.getByLabelText<HTMLInputElement>(/email/i);
  fireEvent.change($emailField, { target: { value: 'test@test.com' } });

  const $firstNameField =
    screen.getByLabelText<HTMLInputElement>(/first name/i);
  fireEvent.change($firstNameField, { target: { value: 'test' } });

  const $lastNameField = screen.getByLabelText<HTMLInputElement>(/last name/i);
  fireEvent.change($lastNameField, { target: { value: 'test' } });

  const $passwordField = screen.getByLabelText<HTMLInputElement>(/password/i);
  fireEvent.change($passwordField, { target: { value: '123456$' } });

  fireEvent.click(screen.getByRole('button', { name: /Send/i }));
};

describe('<SignUp/> success integration', () => {
  it(`should send the form successfully`, async () => {
    render(<SignUp />, { wrapper: PublicWrapper });

    server.use(
      rest.post(`/auth/signup`, async (req, res, ctx) => {
        return res(
          ctx.status(CREATED_STATUS),
          ctx.json({ message: 'User created successfully' })
        );
      })
    );

    await act(() => {
      submitForm();
    });

    await waitFor(() => {
      expect(screen.getByText('User created successfully')).toBeInTheDocument();
    });
  }, 10_000);
});

describe('<SignUp/> check validations', () => {
  it(`should validate required fields`, async () => {
    render(<SignUp />, { wrapper: PublicWrapper });

    expect(
      screen.queryByText('Email is a required field')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('First name is a required field')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('Last name is a required field')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('Password is a required field')
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Send/i }));

    await waitFor(() => {
      expect(screen.getByText('Email is a required field')).toBeInTheDocument();
      expect(
        screen.getByText('First name is a required field')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Last name is a required field')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Password is a required field')
      ).toBeInTheDocument();
    });
  });

  it(`should validate a valid email`, async () => {
    render(<SignUp />, { wrapper: PublicWrapper });

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
    render(<SignUp />, { wrapper: PublicWrapper });

    server.use(
      rest.post(`/auth/signup`, async (req, res, ctx) => {
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
