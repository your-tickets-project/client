import React from 'react';
import Link from 'next/link';
// components
import { MenuIcon, SearchIcon } from 'components/icons';
import { DropDown, Input } from 'components/ui';
// hooks
import useVW from 'hooks/useVW';
// styles
import { breakPoints, colors } from 'styles/variables';

const linkStyle = {
  color: colors.grayFont,
  fontWeight: 'bold',
};

const links = [
  {
    href: '/organize',
    content: 'Organize',
    style: linkStyle,
  },
  {
    href: '/help',
    content: 'Help',
    style: linkStyle,
  },
  {
    href: '/create',
    content: 'Create an event',
    style: { ...linkStyle, color: colors.color2 },
  },
  {
    href: '/sign-up',
    content: 'Sign up',
    style: linkStyle,
  },
  {
    href: '/log-in',
    content: 'Log in',
    style: linkStyle,
  },
];

export default function Header() {
  const vw = useVW();
  return (
    <>
      <header>
        <nav className="row vg-8">
          <div className="col-8 col-md-6 row vg-8">
            <Link href="/" className="logo col-7 col-sm-6 col-md-6 col-lg-5">
              Yourtickets
            </Link>
            <div className="search col-5 col-sm-3 col-md-6 col-lg-7">
              {vw !== null && (
                <>
                  {vw < 768 ? (
                    <div className="search-button">
                      <SearchIcon />
                    </div>
                  ) : (
                    <Input
                      type="search"
                      placeholder="Search events"
                      addonBefore={<SearchIcon />}
                    />
                  )}
                </>
              )}
            </div>
          </div>
          <div className="col-4 col-md-6">
            {vw !== null && (
              <>
                {vw < 768 ? (
                  <DropDown
                    items={links.map(({ href, content, style }) => ({
                      key: href,
                      label: (
                        <Link
                          href={href}
                          style={{ ...style, marginBottom: '.8rem' }}
                        >
                          {content}
                        </Link>
                      ),
                    }))}
                  >
                    <div className="mobile-icon">
                      <span className="icon">
                        <MenuIcon />
                      </span>{' '}
                      Menu
                    </div>
                  </DropDown>
                ) : (
                  <div className="links">
                    {links.map(({ href, style, content }) => (
                      <Link key={href} href={href} legacyBehavior>
                        <a style={{ ...style }}>{content}</a>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </nav>
      </header>
      <style jsx>{`
        header {
          font-size: 14px;
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

        @media (min-width: ${breakPoints.md}) {
          header {
            padding: 1rem;
          }

          .links {
            align-items: center;
            display: flex;
            height: 100%;
            justify-content: flex-end;
          }

          .links a {
            margin-right: 0.7rem;
          }
        }

        @media (min-width: ${breakPoints.lg}) {
          .links a {
            margin-right: 2rem;
          }
        }

        @media (min-width: ${breakPoints.xl}) {
          .links a {
            margin-right: 2.5rem;
          }
        }
      `}</style>
    </>
  );
}
