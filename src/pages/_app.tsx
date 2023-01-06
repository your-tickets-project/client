/// <reference types="styled-jsx" />
import React, { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import toast, { Toaster } from 'react-hot-toast';
import { Provider, useSelector } from 'react-redux';
import { RootState, store } from 'client/store';
import { authLogOut, authCheckUser } from 'client/store/actions/auth';
// services
import { checkUser } from 'client/services/auth';
// styles
import globalStyles from 'client/styles/globals';
import 'client/styles/grid.css';
import 'client/styles/ui-components.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <AuthGuard>
        <Toaster
          position="top-center"
          containerStyle={{ top: '12%', textAlign: 'center' }}
          toastOptions={{ duration: 2500 }}
        />
        <Component {...pageProps} />
        <style jsx global>
          {globalStyles}
        </style>
      </AuthGuard>
    </Provider>
  );
}

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (!accessToken) return;
    const queryAPI = async () => {
      try {
        const res = await checkUser();
        authCheckUser({ user: res.data.user });
      } catch (error: any) {
        authLogOut();
        toast.error(error?.response?.data?.message || 'Internal server error');
      }
    };
    queryAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  return <>{children}</>;
};
