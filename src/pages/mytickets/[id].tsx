import React from 'react';
import Link from 'next/link';
// components
import { Button, Divider } from 'client/components/ui';
import { LeftBackArrowIcon } from 'client/components/icons';
import PublicLayout from 'client/components/Layouts/PublicLayout';
// store
import { AuthSelector } from 'client/store/selectors';
// styles
import { colors } from 'client/styles/variables';
import Redirect from 'client/components/app/Redirect';

export default function TicketPage() {
  const { user, isAuthenticated } = AuthSelector();

  const BackButton = () => {
    return (
      <Link href="/">
        <Button type="link" icon={<LeftBackArrowIcon fill={colors.color2} />}>
          Back to current orders
        </Button>
      </Link>
    );
  };

  if (!isAuthenticated) return <Redirect to="/" />;

  return (
    <PublicLayout>
      <section className="container">
        <BackButton />
        <h1>
          Order for{' '}
          <Link href={`/event/recrea-academy`} legacyBehavior>
            <a className="event">Recrea Academy 2022 Presencial</a>
          </Link>
        </h1>
        <p className="order">Free order #1234567 on Tue, Dec 27, 2022</p>
        <p className="location">Reforma • Ciudad de México, CMX</p>
      </section>

      <Divider />

      <section className="container">
        <div className="information row hg-40 vg-md-8">
          <div className="col-12 col-md-4">
            <div className="cancel-button">
              <Button block>Cancel order</Button>
            </div>
            <div className="contact-button">
              <Button block>Contact organizer</Button>
            </div>
          </div>
          <div className="contact-information col-12 col-md-8">
            <h3>Contact information</h3>
            <Divider />
            <div className="contact-field">
              <p className="label">Firts name</p>
              <p className="value">{user?.first_name}</p>
            </div>
            <div className="contact-field">
              <p className="label">Last name</p>
              <p className="value">{user?.last_name}</p>
            </div>
            <div className="contact-field">
              <p className="label">Email</p>
              <p className="value">{user?.email}</p>
            </div>
          </div>
        </div>
        <BackButton />
      </section>
      <style jsx>{`
        section {
          margin-bottom: 2rem;
          margin-top: 2rem;
        }

        h1 {
          margin-top: 1rem;
        }

        h1 a {
          color: ${colors.color2};
        }

        h1 a:hover {
          text-decoration: underline;
        }

        p.order {
          color: ${colors.grayFont};
          font-weight: bold;
        }

        .information {
          margin-bottom: 1rem;
        }

        .contact-button {
          margin-top: 1rem;
        }

        h3 {
          text-align: center;
        }

        .contact-field:not(:last-of-type) {
          margin-bottom: 1.5rem;
        }

        .contact-field p {
          margin: 0.2rem 0;
        }

        .contact-field p.label {
          font-weight: bold;
        }

        .contact-field p.value {
          color: ${colors.grayFont};
        }
      `}</style>
    </PublicLayout>
  );
}
