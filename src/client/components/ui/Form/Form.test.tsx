import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form } from '.';
import { Button, Input } from 'client/components/ui';

describe('when the user sends the form without data', () => {
  it('should throw an error when form field is required but empty', async () => {
    render(
      <Form>
        <Form.Item
          label="Name"
          name="name"
          rules={{
            required: true,
          }}
        >
          <Input />
        </Form.Item>
        <Button htmlType="submit" type="primary" block>
          Submit
        </Button>
      </Form>
    );

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(
      await screen.findByText(/Name is a required field/i)
    ).toBeInTheDocument();
  });

  it('should throw when form field is required with a custom error message', async () => {
    const requiredMessage = 'custom error message';

    render(
      <Form>
        <Form.Item
          label="Name"
          name="name"
          rules={{
            required: true,
            requiredMessage,
          }}
        >
          <Input />
        </Form.Item>
        <Button htmlType="submit" type="primary" block>
          Submit
        </Button>
      </Form>
    );

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(await screen.findByText(requiredMessage)).toBeInTheDocument();
  });
});

describe('when the developer wants to validate the fields', () => {
  it('should valitate an email field', async () => {
    render(
      <Form>
        <Form.Item label="Email" name="email" rules={{ type: 'email' }}>
          <Input />
        </Form.Item>
      </Form>
    );

    const $emailField = screen.getByLabelText<HTMLInputElement>(/email/i);
    fireEvent.change($emailField, { target: { value: 'wrong email' } });

    await waitFor(() => {
      expect(
        screen.getByText(/email must be a valid email/i)
      ).toBeInTheDocument();
    });
  });

  it('should valitate a number field', async () => {
    render(
      <Form>
        <Form.Item label="Age" name="age" rules={{ type: 'number' }}>
          <Input />
        </Form.Item>
      </Form>
    );

    const $numberField = screen.getByLabelText<HTMLInputElement>(/age/i);
    fireEvent.change($numberField, { target: { value: 'not a number' } });

    expect(
      await screen.findByText(
        'age must be a `number` type, but the final value was: `NaN` (cast from the value `"not a number"`).'
      )
    ).toBeInTheDocument();
  });

  it('should validate fields with custom error messages', async () => {
    const emailMessage = 'Email field must be a valid email';
    const ageMessage = 'Age field must be a number';

    render(
      <Form>
        <Form.Item
          label="Email"
          name="email"
          rules={{ type: 'email', validationMessage: emailMessage }}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Age"
          name="age"
          rules={{ type: 'number', validationMessage: ageMessage }}
        >
          <Input />
        </Form.Item>
      </Form>
    );

    const $emailField = screen.getByLabelText<HTMLInputElement>(/email/i);
    fireEvent.change($emailField, { target: { value: 'wrong email' } });

    const $numberField = screen.getByLabelText<HTMLInputElement>(/age/i);
    fireEvent.change($numberField, { target: { value: 'not a number' } });

    expect(await screen.findByText(emailMessage)).toBeInTheDocument();
    expect(await screen.findByText(ageMessage)).toBeInTheDocument();
  });
});

describe('when the developer writes the same data twice in two differents fields', () => {
  it('should both fields with the same name attribute have the same data', () => {
    render(
      <Form>
        <Form.Item label="Name" name="name">
          <Input />
        </Form.Item>
        <Form.Item label="Name 2" name="name">
          <Input />
        </Form.Item>
      </Form>
    );

    const $field1 = screen.getByLabelText<HTMLInputElement>(/name/i);
    const $field2 = screen.getByLabelText<HTMLInputElement>(/name 2/i);

    $field1.value = 'name';

    expect($field2.value).toBe($field1.value);
  });
});

describe('when the user send the form with data', () => {
  it('should send the form with the correct data passing the validations', async () => {
    const handleFinish = jest.fn();
    const values = {
      email: 'test@test.com',
      first_name: 'first name',
      last_name: 'last name',
      password: '123456',
    };

    render(
      <Form onFinish={handleFinish}>
        <Form.Item
          label="Email"
          name="email"
          rules={{
            required: true,
            type: 'email',
          }}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="First name"
          name="first_name"
          rules={{ required: true, requiredMessage: 'First name is required' }}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Last name"
          name="last_name"
          rules={{ required: true, requiredMessage: 'Last name is required' }}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={{ required: true, requiredMessage: 'Password is required' }}
        >
          <Input />
        </Form.Item>
        <Button htmlType="submit" type="primary" block>
          Submit
        </Button>
      </Form>
    );

    const $emailField = screen.getByLabelText<HTMLInputElement>(/email/i);
    fireEvent.change($emailField, { target: { value: values.email } });

    const $firstNameField =
      screen.getByLabelText<HTMLInputElement>(/first name/i);
    fireEvent.change($firstNameField, { target: { value: values.first_name } });

    const $lastNameField =
      screen.getByLabelText<HTMLInputElement>(/last name/i);
    fireEvent.change($lastNameField, { target: { value: values.last_name } });

    const $passwordField = screen.getByLabelText<HTMLInputElement>(/password/i);
    fireEvent.change($passwordField, { target: { value: values.password } });

    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    await waitFor(() => {
      expect(handleFinish).toHaveBeenCalledWith(values);
    });
  });
});

describe('when the developer wants to validate a field with another field value', () => {
  it(`should render a custom error message in the field when tries to validate`, async () => {
    const message = 'passwords do not match';
    render(
      <Form>
        <Form.Item
          label="Password"
          name="password"
          rules={{
            required: true,
          }}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Repeat password"
          name="repeat_password"
          rules={{
            required: true,
            validator(formValues, value) {
              if (value !== formValues.password) {
                return {
                  isValid: false,
                  message,
                };
              }

              return {
                isValid: true,
              };
            },
          }}
        >
          <Input />
        </Form.Item>
      </Form>
    );

    await userEvent.type(screen.getByLabelText('Password'), '1234');
    await userEvent.type(screen.getByLabelText('Repeat password'), '123');

    await waitFor(() => {
      expect(screen.queryByText(message)).toBeInTheDocument();
    });
  });
});
