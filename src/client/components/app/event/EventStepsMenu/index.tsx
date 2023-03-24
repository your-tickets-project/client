import React, { useState } from 'react';
import Link from 'next/link';
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
// styles
import { breakPoints, breakPointsPX, colors } from 'client/styles/variables';

interface Props {
  activeStep: 'basic-info' | 'details' | 'tickets' | 'preview-publish';
  eventId: number | string;
}

const steps = [
  {
    href: 'basic-info',
    Icon: () => <CheckCircleIcon fill="#000" />,
    title: 'Basic info',
  },
  {
    href: 'details',
    Icon: TwoCircleIcon,
    title: 'Details',
  },
  {
    href: 'tickets',
    Icon: ThreeCircleIcon,
    title: 'Tickets',
  },
  {
    href: 'preview-publish',
    Icon: FourCircleIcon,
    title: 'Publish',
  },
];

export default function EventStepsMenu({ activeStep, eventId }: Props) {
  const vw = useVW();
  const [showMenu, setShowMenu] = useState(false);

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
                <h3>{steps.find(({ href }) => href === activeStep)?.title}</h3>
              </div>
            </div>
          </div>
        )}
        {(showMenu || vw >= breakPointsPX.md) && (
          <aside onClick={() => setShowMenu(false)}>
            <div className="menu">
              {steps.map(({ href, Icon, title }) => (
                <Link
                  href={`/manage/events/${eventId}/${href}`}
                  key={title}
                  legacyBehavior
                >
                  <a>
                    <div
                      key={title}
                      className={`step row ${
                        activeStep === href ? 'is-active' : 'is-not-active'
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

        .step.is-active {
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
