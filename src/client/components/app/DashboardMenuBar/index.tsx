import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
// components
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
// styles
import { breakPoints, breakPointsPX, colors } from 'client/styles/variables';

const dashboardLinks = [
  {
    Icon: CalendarIcon,
    title: 'Event',
    href: '/dashboard/events',
    tag: 'event',
  },
  {
    Icon: InvoiceIcon,
    title: 'Orders',
    href: '/dashboard/orders',
    tag: 'order',
  },
  {
    Icon: TicketIcon,
    title: 'Your Tickets',
    href: '/dashboard/tickets',
    tag: 'ticket',
  },
  {
    Icon: DollarIcon,
    title: 'Finance',
    href: '/dashboard/finance',
    tag: 'finance',
  },
];

export default function DashboardMenuBar() {
  const { asPath } = useRouter();
  const { isShowingDashboardOptions } = AppSelector();
  const vw = useVW();

  return (
    <>
      {(isShowingDashboardOptions || vw >= breakPointsPX.md) && (
        <aside>
          <div className="container row vg-8 hg-48 vg-sm-32 vg-md-0 hg-md-32">
            {dashboardLinks.map(({ href, Icon, title, tag }) => (
              <div key={href} className="col-6 col-sm-4 col-md-12">
                <Link href={href} legacyBehavior>
                  <a
                    className={`dashboard-option ${
                      asPath.includes(tag) ? 'active' : 'not-active'
                    }`}
                  >
                    <div className={`dashboard-option-icon`}>
                      <Icon
                        fill={asPath.includes(tag) ? colors.white : undefined}
                      />
                    </div>
                    <p className="dashboard-option-title box-md-shadow">
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
}
