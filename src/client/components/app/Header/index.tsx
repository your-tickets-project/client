import React from 'react';
import Link from 'next/link';
// components
import {
  MenuIcon,
  SearchIcon,
  SelectArrowIcon,
  UserIcon,
} from 'client/components/icons';
import { DropDown, Input } from 'client/components/ui';
// hooks
import useVW from 'client/hooks/useVW';
// redux
import { useSelector } from 'react-redux';
import { RootState } from 'client/store';
import { authLogOut } from 'client/store/actions/auth';
// styles
import { breakPoints, colors } from 'client/styles/variables';

interface ItemsType {
  href: string;
  content: string;
  style?: React.CSSProperties;
  handleClick?: () => void;
}

const itemStyle = {
  color: colors.grayFont,
  fontWeight: 'bold',
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
    href: '/create',
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
    href: '/browse',
    content: 'Browse events',
    style: itemStyle,
  },
  {
    href: '/home',
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
    handleClick() {
      authLogOut();
    },
  },
];

export default function Header() {
  const vw = useVW();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  return (
    <>
      <header>
        <nav className="row vg-8">
          <div className="col-8 col-sm-7 col-md-6 row vg-8">
            <Link href="/" className="logo col-7 col-sm-6 col-md-6 col-lg-5">
              Yourtickets
            </Link>
            <div className="search col-5 col-sm-3 col-md-6 col-lg-7">
              {vw !== null && vw >= 768 && (
                <Input
                  type="search"
                  placeholder="Search events"
                  addonBefore={<SearchIcon />}
                  style={{ backgroundColor: colors.lightGray }}
                />
              )}

              {(vw === null || vw < 768) && (
                <div className="search-button">
                  <SearchIcon />
                </div>
              )}
            </div>
          </div>
          <div className="col-4 col-sm-5 col-md-6">
            {!isAuthenticated && (
              <>
                {(vw === null || vw < 768) && (
                  <DropDown
                    items={links.map(
                      ({ href, content, style, handleClick }) => ({
                        key: href,
                        item: (
                          <Link
                            href={href}
                            style={{ ...style, marginBottom: '.8rem' }}
                            onClick={handleClick}
                          >
                            {content}
                          </Link>
                        ),
                      })
                    )}
                    style={{ justifyContent: 'flex-end' }}
                  >
                    <div className="mobile-icon">
                      <span className="icon">
                        <MenuIcon />
                      </span>{' '}
                      Menu
                    </div>
                  </DropDown>
                )}

                {vw !== null && vw >= 768 && (
                  <div className="links">
                    {links.map(({ href, style, content, handleClick }) => (
                      <Link key={href} href={href} legacyBehavior>
                        <a style={{ ...style }} onClick={handleClick}>
                          {content}
                        </a>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}

            {isAuthenticated && (
              <>
                {(vw === null || vw < 576) && (
                  <DropDown
                    items={authLinks.map(
                      ({ href, content, style, handleClick }) => ({
                        key: href,
                        item: (
                          <Link
                            href={href}
                            style={{ ...style, marginBottom: '.8rem' }}
                            onClick={handleClick}
                          >
                            {content}
                          </Link>
                        ),
                      })
                    )}
                    style={{ justifyContent: 'flex-end' }}
                  >
                    <div className="mobile-icon">
                      <span className="icon">
                        <UserIcon />
                      </span>{' '}
                    </div>
                  </DropDown>
                )}

                {vw !== null && vw >= 576 && (
                  <div className="links">
                    {vw >= 768 && (
                      <Link href="/create" legacyBehavior>
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
                              style={{ ...style, marginBottom: '.8rem' }}
                              onClick={handleClick}
                            >
                              {content}
                            </Link>
                          ),
                        })
                      )}
                      style={{
                        justifyContent: 'flex-end',
                        width: vw >= 768 ? 'auto' : '100%',
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
                )}
              </>
            )}
          </div>
        </nav>
      </header>
      <style jsx>{`
        header {
          font-size: 12px;
          padding: 1rem 0.5rem;
        }

        nav.row {
          height: 100%;
        }

        .search {
          align-items: center;
          display: flex;
          justify-content: center;
        }

        .search-button {
          background-color: ${colors.lightGray};
          border-radius: 50%;
          height: 40px;
          padding: 0.8rem;
          width: 40px;
        }

        .mobile-icon {
          align-items: center;
          display: flex;
          font-weight: bold;
          justify-content: center;
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
          .links a:hover {
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
