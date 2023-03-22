import React from 'react';
import Head from 'next/head';
import Script from 'next/script';
// components
import Header from 'client/components/app/Header';
import DashboardMenuBar from 'client/components/app/DashboardMenuBar';

interface Props {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  return (
    <>
      <Head>
        <title>Yourtickets</title>
        <meta name="description" content="Yourtickets" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Script
        defer
        type="text/javascript"
        src="https://unpkg.com/trix@2.0.0/dist/trix.umd.min.js"
      />
      <Header showDashboardIcon />
      <main
        className="row"
        style={{
          height: `calc(100vh - 70px)`,
        }}
      >
        <div className="col-md-1" style={{ height: '100%', maxWidth: '72px' }}>
          <DashboardMenuBar />
        </div>
        <div
          className={`col-12 col-md-11`}
          id="dashboard-layout"
          style={{ flex: '1', height: '100%', overflow: 'auto' }}
        >
          {children}
        </div>
      </main>
      <style jsx global>{`
        body {
          overflow-y: hidden;
        }
      `}</style>
    </>
  );
}
