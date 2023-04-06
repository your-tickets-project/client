import React from 'react';
import Link from 'next/link';
import toaster from 'react-hot-toast';
// components
import {
  MenuIcon,
  OptionsIcon,
  SearchIcon,
  SelectArrowIcon,
  UserIcon,
} from 'client/components/icons';
import { DropDown, Input } from 'client/components/ui';
// hooks
import useVW from 'client/hooks/useVW';
// store
import { AuthSelector, AppSelector } from 'client/store/selectors';
import { authLogOut } from 'client/store/actions/auth';
import { appShowDashboardOptions } from 'client/store/actions/app';
// styles
import { breakPoints, breakPointsPX, colors } from 'client/styles/variables';

interface Props {
  showDashboardIcon?: boolean;
}

interface ItemsType {
  href: string;
  content: string;
  style?: React.CSSProperties;
  handleClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

const itemStyle = {
  color: colors.grayFont,
  display: 'block',
  fontWeight: 'bold',
  padding: '1rem',
};

const links: ItemsType[] = [
  {
    href: '/organize',
    content: 'Organize',
    style: itemStyle,
  },
  {
    href: '/help',
    content: 'Help',
    style: itemStyle,
  },
  {
    href: '/create-event',
    content: 'Create an event',
    style: { ...itemStyle, color: colors.color2 },
  },
  {
    href: '/signin',
    content: 'Sign in',
    style: itemStyle,
  },
  {
    href: '/login',
    content: 'Log in',
    style: itemStyle,
  },
];

const authLinks: ItemsType[] = [
  {
    href: '/',
    content: 'Browse events',
    style: itemStyle,
  },
  {
    href: '/dashboard/events',
    content: 'Manage my events',
    style: itemStyle,
  },
  {
    href: '/account',
    content: 'Account settings',
    style: itemStyle,
  },
  {
    href: '/login',
    content: 'Log out',
    style: itemStyle,
    handleClick(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
      e.preventDefault();
      authLogOut();
      toaster.success('Logged out successfully.');
    },
  },
];

export default function Header({ showDashboardIcon }: Props) {
  const { isAuthenticated, user } = AuthSelector();
  const { isShowingDashboardOptions } = AppSelector();

  const vw = useVW();

  return (
    <>
      <header>
        <nav className="row vg-8">
          <div className="col-8 col-sm-6 row">
            <Link href="/" className="logo col-7 col-sm-8 col-md-6 col-lg-5">
              Yourtickets
            </Link>
            {!showDashboardIcon && (
              <div className="search col-5 col-sm-4 col-md-6 col-lg-7">
                {vw < breakPointsPX.md && (
                  <div className="search-button">
                    <SearchIcon />
                  </div>
                )}

                {vw >= breakPointsPX.md && (
                  <Input
                    placeholder="Search events"
                    addonBefore={<SearchIcon />}
                  />
                )}
              </div>
            )}
          </div>
          <div className="col-4 col-sm-6">
            {!isAuthenticated && (
              <>
                {vw < breakPointsPX.md && (
                  <div className="row" style={{ justifyContent: 'flex-end' }}>
                    <div className="col-6 col-sm-3">
                      <DropDown
                        items={links.map(
                          ({ href, content, style, handleClick }) => ({
                            key: href,
                            item: (
                              <Link
                                href={href}
                                style={{ ...style }}
                                onClick={handleClick}
                              >
                                {content}
                              </Link>
                            ),
                          })
                        )}
                        style={{ justifyContent: 'flex-end' }}
                      >
                        <div className="icon-container">
                          <span className="icon">
                            <MenuIcon />
                          </span>{' '}
                          Menu
                        </div>
                      </DropDown>
                    </div>
                  </div>
                )}

                {vw >= breakPointsPX.md && (
                  <div className="links">
                    {links.map(({ href, style, content, handleClick }) => (
                      <Link key={href} href={href} legacyBehavior>
                        <a
                          style={{ ...style, display: 'flex', padding: '0' }}
                          onClick={handleClick}
                        >
                          {content}
                        </a>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}

            {isAuthenticated && (
              <div
                className="row vg-sm-8"
                style={{ height: '100%', justifyContent: 'flex-end' }}
              >
                {showDashboardIcon && vw < breakPointsPX.md && (
                  <div
                    className="dashboard-icon-container col-6 col-sm-2"
                    onClick={() =>
                      appShowDashboardOptions({
                        isShowOptions: !isShowingDashboardOptions,
                      })
                    }
                  >
                    <div className="icon-container">
                      <div className="icon">
                        <OptionsIcon />
                      </div>
                    </div>
                  </div>
                )}

                {vw < breakPointsPX.sm && (
                  <div
                    className={`icon-container ${
                      showDashboardIcon ? 'col-6' : 'col-8'
                    }`}
                  >
                    <DropDown
                      items={authLinks.map(
                        ({ href, content, style, handleClick }) => ({
                          key: href,
                          item: (
                            <Link
                              href={href}
                              style={{ ...style }}
                              onClick={handleClick}
                            >
                              {content}
                            </Link>
                          ),
                        })
                      )}
                    >
                      <div className="icon">
                        <UserIcon />
                      </div>{' '}
                    </DropDown>
                  </div>
                )}

                {vw >= breakPointsPX.sm && (
                  <div
                    className={`${
                      showDashboardIcon ? 'col-6 col-sm-10' : 'col-12'
                    } col-md-12`}
                  >
                    <div className="links">
                      {vw >= breakPointsPX.md && (
                        <Link href="/create-event" legacyBehavior>
                          <a
                            style={{
                              color: colors.color2,
                              fontWeight: 'bold',
                              marginRight: '0.5rem',
                            }}
                          >
                            Create an event
                          </a>
                        </Link>
                      )}
                      <DropDown
                        items={authLinks.map(
                          ({ href, content, style, handleClick }) => ({
                            key: href,
                            item: (
                              <Link
                                href={href}
                                style={{ ...style }}
                                onClick={handleClick}
                              >
                                {content}
                              </Link>
                            ),
                          })
                        )}
                        style={{
                          justifyContent: 'flex-end',
                          width: vw >= breakPointsPX.md ? 'auto' : '100%',
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 'bold',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          {user?.email}
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              width: '28px',
                            }}
                          >
                            <SelectArrowIcon />
                          </div>{' '}
                        </div>
                      </DropDown>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>
      </header>
      <style jsx>{`
        header {
          border-bottom: 1px solid ${colors.gray};
          font-size: 12px;
          height: 70px;
          padding: 1rem 0.5rem;
        }

        nav.row {
          height: 100%;
        }

        .search {
          align-items: center;
          display: flex;
        }

        .search-button {
          background-color: ${colors.lightGray};
          border-radius: 50%;
          height: 40px;
          padding: 0.8rem;
          width: 40px;
        }

        .icon-container {
          align-items: center;
          cursor: pointer;
          display: flex;
          justify-content: center;
          height: 100%;
          transition: background-color 0.5s ease;
        }

        .icon {
          width: 28px;
        }

        .links {
          align-items: center;
          display: flex;
          height: 100%;
          justify-content: flex-end;
        }

        .links a {
          align-items: center;
          display: flex;
          height: 100%;
          justify-content: center;
          margin-right: 0.7rem;
          padding: 0 0.2rem;
          transition: background-color 0.5s ease;
        }

        @media (hover: hover) {
          .icon-container:hover {
            background-color: ${colors.lightGray};
          }

          .links a:hover {
            background-color: ${colors.lightGray};
          }
          .dashboard-icon-container:hover {
            background-color: ${colors.lightGray};
          }
        }

        @media (min-width: ${breakPoints.md}) {
          header {
            padding: 1rem;
          }
        }

        @media (min-width: ${breakPoints.lg}) {
          header {
            font-size: 14px;
          }

          .links a {
            margin-right: 1.5rem;
          }
        }

        @media (min-width: ${breakPoints.xl}) {
          .links a {
            margin-right: 2rem;
          }
        }
      `}</style>
    </>
  );
}
