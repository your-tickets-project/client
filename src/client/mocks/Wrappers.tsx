import React from 'react';
import { Toaster } from 'react-hot-toast';
// components
import AuthGuard from 'client/components/app/AuthGuard';
// store
import { Provider } from 'react-redux';
import { store } from 'client/store';

interface Props {
  children: React.ReactNode;
  isAuthenticated?: boolean;
}

export const PrivateWrapper = ({ children }: Props) => {
  return (
    <Provider store={store}>
      <AuthGuard>
        <Toaster
          position="top-center"
          containerStyle={{ top: '12%', textAlign: 'center' }}
          toastOptions={{ duration: 2500 }}
        />
        {children}
      </AuthGuard>
    </Provider>
  );
};

export const PublicWrapper = ({ children }: Props) => {
  return (
    <Provider store={store}>
      <Toaster
        position="top-center"
        containerStyle={{ top: '12%', textAlign: 'center' }}
        toastOptions={{ duration: 2500 }}
      />
      {children}
    </Provider>
  );
};
