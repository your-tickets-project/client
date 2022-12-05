/// <reference types="styled-jsx" />
import type { AppProps } from 'next/app';
// styles
import globalStyles from 'styles/globals';
import 'styles/grid.css';
import 'styles/ui-components.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <style jsx global>
        {globalStyles}
      </style>
    </>
  );
}
