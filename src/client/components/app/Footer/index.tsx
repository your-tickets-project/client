import React from 'react';
import { useRouter } from 'next/router';
// hooks
import useVW from 'client/hooks/useVW';
// styles
import { breakPoints, colors, fluidFont } from 'client/styles/variables';

const options = [
  {
    title: 'Use Eventbrite',
    options: [
      'lorem ipsum',
      'lorem ipsum',
      'lorem ipsum',
      'lorem ipsum',
      'lorem ipsum',
      'lorem ipsum',
      'lorem ipsum',
      'lorem ipsum',
      'lorem ipsum',
      'lorem ipsum',
    ],
  },
  {
    title: 'Plan Events',
    options: [
      'lorem ipsum',
      'lorem ipsum',
      'lorem ipsum',
      'lorem ipsum',
      'lorem ipsum',
      'lorem ipsum',
      'lorem ipsum',
      'lorem ipsum',
      'lorem ipsum',
      'lorem ipsum',
    ],
  },
  {
    title: 'Find Events',
    options: [
      'lorem ipsum',
      'lorem ipsum',
      'lorem ipsum',
      'lorem ipsum',
      'lorem ipsum',
      'lorem ipsum',
    ],
  },
  {
    title: 'Connect with Us',
    options: [
      'lorem ipsum',
      'lorem ipsum',
      'lorem ipsum',
      'lorem ipsum',
      'lorem ipsum',
      'lorem ipsum',
    ],
  },
];

const asideLinks = [
  'How it Works •',
  'Pricing •',
  'Contact support •',
  'Contact sales •',
  'About •',
  'Blog •',
  'Help •',
  'About •',
  'Security •',
  'Terms •',
  'Privacy •',
  'Accessibility •',
];

export default function Footer() {
  const router = useRouter();
  const vw = useVW();

  return (
    <>
      <footer>
        {vw >= 768 && (
          <div className="options row">
            {options.map(({ title, options }, i) => (
              <div key={`${title}-${i}`} className="option col-3">
                <p>{title}</p>
                <ul>
                  {options.map((option, i) => (
                    <li key={`${option}-${i}`}>{option}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
        <aside className="row hg-16">
          <p className="title col-12 col-md-3">2022 © Yourtickets</p>
          <div className="links col-12 col-md-6">
            {asideLinks.map((link, i) => (
              <span key={`${link}-${i}`} className="link">
                {link}
              </span>
            ))}
          </div>
          <p className="title col-12 col-md-3">United States</p>
        </aside>
      </footer>
      <style jsx>{`
        footer {
          background-color: ${colors.color3};
          color: ${colors.white};
          margin-bottom: ${router.pathname === '/event/[slug]' ? '118px' : '0'};
          padding: 1rem;
        }

        .options {
          margin-bottom: 1rem;
        }

        .option p {
          font-weight: bold;
          text-align: center;
        }

        .option ul {
          list-style: none;
          padding: 0;
        }

        .option li {
          font-size: ${fluidFont.small};
          text-align: center;
          margin-bottom: 0.3rem;
        }

        aside .title {
          text-align: center;
        }

        aside .links {
          display: flex;
          flex-wrap: wrap;
          font-size: ${fluidFont.small};
          justify-content: center;
          row-gap: 0.4rem;
        }

        aside .links .link {
          margin-left: 0.4rem;
        }

        @media (min-width: ${breakPoints.md}) {
          footer {
            margin-bottom: 0;
          }
        }
      `}</style>
    </>
  );
}
