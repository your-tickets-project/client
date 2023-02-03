import React from 'react';
import { Toaster } from 'react-hot-toast';
// redux
import { Provider } from 'react-redux';
import { store } from 'client/store';

interface Props {
  children: React.ReactNode;
  isAuthenticated?: boolean;
}

export default function PublicWrapper({ children }: Props) {
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
}
