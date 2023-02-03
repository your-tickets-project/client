/// <reference types="styled-jsx" />
import type { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
// components
import AuthGuard from 'client/components/app/AuthGuard';
// redux
import { Provider } from 'react-redux';
import { store } from 'client/store';
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
