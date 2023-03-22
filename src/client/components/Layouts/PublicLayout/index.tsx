import React from 'react';
import Head from 'next/head';
// components
import Header from 'client/components/app/Header';
import Footer from 'client/components/app/Footer';

interface Props {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: Props) {
  return (
    <>
      <Head>
        <title>Yourtickets</title>
        <meta name="description" content="Yourtickets" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
