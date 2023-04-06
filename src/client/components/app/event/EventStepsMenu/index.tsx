import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import toaster from 'react-hot-toast';
// components
import {
  CheckCircleIcon,
  FourCircleIcon,
  HamburguerMenuIcon,
  ThreeCircleIcon,
  TwoCircleIcon,
} from 'client/components/icons';
// hooks
import useVW from 'client/hooks/useVW';
// services
import { getCheckSteps } from 'client/services/event.service';
// styles
import { breakPoints, breakPointsPX, colors } from 'client/styles/variables';

export default function EventStepsMenu() {
  const router = useRouter();
  const vw = useVW();
  // booleans
  const [isLoading, setIsLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  // data
  const [eventId, setEventId] = useState<string | number | undefined>();
  const [steps, setSteps] = useState<
    {
      href: string;
      Icon: (props: { fill?: string | undefined }) => any;
      title: string;
    }[]
  >([]);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (!router.isReady) return;

    const queryAPI = async () => {
      const { id } = router.query;
      try {
        const res = await getCheckSteps({ eventId: id as string });
        setEventId(res.data.id);
        setSteps([
          {
            href: `/manage/events/${res.data.id}/basic-info`,
            Icon: () => <CheckCircleIcon fill="#000" />,
            title: 'Basic info',
          },
          {
            href: `/manage/events/${res.data.id}/details`,
            Icon: () =>
              res.data.include_event_detail ? (
                <CheckCircleIcon fill="#000" />
              ) : (
                <TwoCircleIcon />
              ),
            title: 'Details',
          },
          {
            href: `/manage/events/${res.data.id}/tickets`,
            Icon: () =>
              res.data.include_event_ticket_info ? (
                <CheckCircleIcon fill="#000" />
              ) : (
                <ThreeCircleIcon />
              ),
            title: 'Tickets',
          },
          {
            href: `/manage/events/${res.data.id}/preview-publish`,
            Icon: FourCircleIcon,
            title: 'Publish',
          },
        ]);
      } catch (error: any) {
        toaster.error(
          error?.response?.data?.message || 'Internal server error.'
        );

        setTimeout(() => {
          router.replace('/dashboard/events');
        }, 3000);
      }
    };
    queryAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, router.isReady]);

  if (!eventId) return null;

  return (
    <>
      <nav className="container">
        {vw < breakPointsPX.md && (
          <div className="mobile-menu row">
            <div className="col-2">
              <div className="icon-container">
                <div
                  className="icon mobile-menu_icon"
                  onClick={() => setShowMenu(!showMenu)}
                >
                  <HamburguerMenuIcon />
                </div>
              </div>
            </div>
            <div className="col-10">
              <div className="title-container">
                <h3>
                  {steps.find(({ href }) => href === router.asPath)?.title}
                </h3>
              </div>
            </div>
          </div>
        )}
        {(showMenu || vw >= breakPointsPX.md) && (
          <aside onClick={() => setShowMenu(false)}>
            <div className="menu">
              {steps.map(({ href, Icon, title }) => (
                <Link href={href} key={title} legacyBehavior>
                  <a>
                    <div
                      key={title}
                      className={`step row ${
                        router.asPath === href ? 'active' : 'not-active'
                      }`}
                    >
                      <div className="col-2">
                        <div className="icon-container">
                          <div className="icon">
                            <Icon />
                          </div>
                        </div>
                      </div>
                      <div className="col-10">
                        <div className="title-container">{title}</div>
                      </div>
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          </aside>
        )}
      </nav>
      <style jsx>{`
        nav {
          padding: 0.5rem;
        }

        .icon-container {
          align-items: center;
          display: flex;
          justify-content: center;
        }

        .icon {
          align-items: center;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          justify-content: center;
          width: 25px;
        }

        .mobile-menu_icon {
          justify-content: flex-start;
          transition: 0.3s ease background-color;
          width: 45px;
        }

        .title-container {
          align-items: center;
          display: flex;
          height: 100%;
          justify-content: flex-start;
        }

        aside {
          background-color: ${colors.transparentBlack};
          bottom: 0;
          left: 0;
          position: absolute;
          right: 0;
          top: 0;
          z-index: 3000;
        }

        .menu {
          background-color: ${colors.lightGray};
          display: flex;
          flex-direction: column;
          height: 100%;
          justify-content: center;
          width: 60%;
        }

        .step {
          cursor: pointer;
          margin-bottom: 1rem;
          padding: 0.5rem 0;
        }

        .step.active {
          background-color: ${colors.white};
        }

        @media (hover: hover) {
          .mobile-menu_icon:hover {
            background-color: ${colors.lightGray};
          }

          .step:hover {
            background-color: ${colors.gray};
          }
        }

        @media (min-width: ${breakPoints.md}) {
          nav {
            border-left: 1px solid ${colors.gray};
            height: 100%;
            padding: 0;
            width: 100%;
          }

          aside {
            background-color: transparent;
            height: 100%;
            position: static;
          }

          .menu {
            padding: 0.5rem;
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}
