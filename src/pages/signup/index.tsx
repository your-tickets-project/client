import React, { useState } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
// components
import { Button, Form, Input } from 'client/components/ui';
import PublicRoute from 'client/components/app/PublicRoute';
import PublicLayout from 'client/components/Layouts/PublicLayout';
// helpers
import { debounce } from 'client/helpers';
// services
import { signup } from 'client/services/auth.service';
// styles
import { breakPoints } from 'client/styles/variables';

interface FormTypes {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
}

export default function SignupPage() {
  const router = useRouter();

  const [isSending, setIsSending] = useState(false);

  const handleFinish = async (values: FormTypes) => {
    setIsSending(true);

    try {
      const res = await signup(values);
      toast.success(res.data.message);

      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (error: any) {
      setIsSending(false);
      toast.error(error?.response?.data?.message || 'Internal server error.');
    }
  };

  return (
    <PublicRoute>
      <PublicLayout>
        <h1>Sign up</h1>
        <section className="container">
          <Form
            onFinish={debounce(handleFinish, 800)}
            initialValues={{
              email: '',
              first_name: '',
              last_name: '',
              password: '',
            }}
          >
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
              rules={{
                required: true,
                message: 'First name is a required field',
              }}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Last name"
              name="last_name"
              rules={{
                required: true,
                message: 'Last name is a required field',
              }}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={{
                required: true,
                message: 'Password is a required field',
              }}
            >
              <Input />
            </Form.Item>
            <Button htmlType="submit" type="primary" block disabled={isSending}>
              Send
            </Button>
          </Form>
        </section>
        <style jsx>{`
          h1 {
            margin: 2rem 0;
            text-align: center;
          }

          @media (min-width: ${breakPoints.md}) {
            section {
              width: 60%;
            }
          }
        `}</style>
      </PublicLayout>
    </PublicRoute>
  );
}
