import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Script from 'next/script';
import Link from 'next/link';
// components
import Header from 'client/components/app/Header';
import {
  CalendarIcon,
  DollarIcon,
  InvoiceIcon,
  TicketIcon,
} from 'client/components/icons';
// hooks
import useVW from 'client/hooks/useVW';
// store
import { AppSelector } from 'client/store/selectors';
import { appShowDashboardOptions } from 'client/store/actions/app';
// styles
import { breakPoints, breakPointsPX, colors } from 'client/styles/variables';

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

const DashboardMenuBar = () => {
  const router = useRouter();
  const { isShowingDashboardOptions } = AppSelector();

  const vw = useVW();
  const [isLoading, setIsLoading] = useState(true);
  const [links, setLinks] = useState<
    {
      Icon: (props: { fill?: string | undefined }) => any;
      title: string;
      href: string;
      urlList: string[];
    }[]
  >([]);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (!router.isReady) return;

    const { query } = router;

    setLinks([
      {
        Icon: CalendarIcon,
        title: 'Event',
        href: '/dashboard/events',
        urlList: [
          '/create-event',
          '/dashboard/events',
          `/manage/events/${query.id}/basic-info`,
          `/manage/events/${query.id}/details`,
          `/manage/events/${query.id}/tickets`,
          `/manage/events/${query.id}/preview-publish`,
        ],
      },
      {
        Icon: InvoiceIcon,
        title: 'Orders',
        href: '/dashboard/orders',
        urlList: [
          '/dashboard/orders',
          `/dashboard/orders/${query.eventId}/${query.id}`,
        ],
      },
      {
        Icon: TicketIcon,
        title: 'Your Tickets',
        href: '/dashboard/yourtickets',
        urlList: [`/dashboard/yourtickets`],
      },
      {
        Icon: DollarIcon,
        title: 'Finance',
        href: '/dashboard/finance',
        urlList: [],
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, router.isReady]);

  return (
    <>
      {(isShowingDashboardOptions || vw >= breakPointsPX.md) && (
        <aside>
          <div className="container row vg-8 hg-48 vg-sm-32 vg-md-0 hg-md-32">
            {links.map(({ href, Icon, title, urlList }) => (
              <div
                key={href}
                className="col-6 col-sm-4 col-md-12"
                onClick={() =>
                  appShowDashboardOptions({
                    isShowOptions: !isShowingDashboardOptions,
                  })
                }
              >
                <Link href={href} legacyBehavior>
                  <a
                    className={`dashboard-option ${
                      urlList.includes(router.asPath) ? 'active' : 'not-active'
                    }`}
                  >
                    <div className={`dashboard-option-icon`}>
                      <Icon
                        fill={
                          urlList.includes(router.asPath)
                            ? colors.white
                            : undefined
                        }
                      />
                    </div>
                    <p className="dashboard-option-title box-shadow-md">
                      {title}
                    </p>
                  </a>
                </Link>
              </div>
            ))}
          </div>
        </aside>
      )}
      <style jsx>{`
        aside {
          background-color: ${colors.white};
          left: 0;
          padding: 3rem 0;
          position: absolute;
          top: 71px;
          width: 100vw;
          z-index: 3000;
        }

        .dashboard-option {
          align-items: center;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0.5rem;
        }

        .dashboard-option-icon {
          border-radius: 5px;
          padding: 0.5rem;
          width: 50px;
        }

        .dashboard-option.active .dashboard-option-icon {
          background-color: ${colors.color2};
        }

        .dashboard-option-title {
          color: ${colors.black};
          margin-bottom: 0;
          margin-top: 1rem;
        }

        @media (hover: hover) {
          .dashboard-option.not-active:hover {
            background-color: ${colors.lightGray};
          }
        }

        @media (min-width: ${breakPoints.md}) {
          aside {
            align-items: center;
            background-color: ${colors.lightGray};
            display: flex;
            height: 100%;
            justify-content: center;
            padding: 0.5rem;
            position: static;
            width: 100%;
          }

          .dashboard-option {
            position: relative;
            padding: 0;
            max-width: 50px;
          }

          .dashboard-option-icon {
            width: 100%;
          }

          .dashboard-option-title {
            background-color: ${colors.white};
            border-radius: 5px;
            left: 130%;
            margin: 0;
            opacity: 0;
            padding: 0.5rem;
            pointer-events: none;
            position: absolute;
            top: 10%;
            width: max-content;
            z-index: 5;
          }

          @media (hover: hover) {
            .dashboard-option-icon:hover {
              background-color: ${colors.white};
            }

            .dashboard-option:hover .dashboard-option-title {
              opacity: 1;
              pointer-events: auto;
            }
          }
        }
      `}</style>
    </>
  );
};
