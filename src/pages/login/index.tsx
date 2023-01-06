import React from 'react';
import { useRouter } from 'next/router';
import toaster from 'react-hot-toast';
// components
import { Button, Form, Input } from 'client/components/ui';
import Layout from 'client/components/Layout';
import Redirect from 'client/components/app/Redirect';
// redux
import { useSelector } from 'react-redux';
import { RootState } from 'client/store';
// services
import { login } from 'client/services/auth';
// store
import { authLogIn } from 'client/store/actions/auth';
// styles
import { breakPoints } from 'client/styles/variables';

interface FormTypes {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
}

export default function LogIn() {
  const router = useRouter();

  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const handleFinish = async (values: FormTypes) => {
    try {
      const res = await login(values);
      toaster.success(res.data.message);

      setTimeout(() => {
        authLogIn({ user: res.data.user, accessToken: res.data.accessToken });
        router.replace('/');
      }, 3000);
    } catch (error: any) {
      toaster.error(error?.response?.data?.message || 'Internal server error');
    }
  };

  if (isAuthenticated) return <Redirect to="/" />;

  return (
    <Layout>
      <h1>Log in</h1>
      <section className="container">
        <Form
          onFinish={handleFinish}
          initialValues={{
            email: '',
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
            <Input type="text" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={{ required: true, message: 'Password is required' }}
          >
            <Input type="password" />
          </Form.Item>
          <Button htmlType="submit" type="primary" block>
            Enviar
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
    </Layout>
  );
}
