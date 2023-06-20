import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import toast from 'react-hot-toast';
// components
import PrivateRoute from 'client/components/app/PrivateRoute';
import PublicLayout from 'client/components/Layouts/PublicLayout';
import { Button, Divider } from 'client/components/ui';
import { LeftBackArrowIcon } from 'client/components/icons';
// services
import { getTicket } from 'client/services/ticket.service';
// styles
import { colors } from 'client/styles/variables';
import Loader from 'client/components/app/Loader';
import { formatCurrency, formatTime, getDateData } from 'client/helpers';

export default function YourTicketPage() {
  return (
    <PrivateRoute>
      <PublicLayout>
        <YourTicketPageWrapper />
      </PublicLayout>
    </PrivateRoute>
  );
}

interface DataType {
  id: string | number;
  unique_id: string | number;
  event_id: string | number;
  purchase_date: string;
  purchase_time: string;
  first_name: string;
  last_name: string;
  email: string;
  title: string;
  date_start: string;
  time_start: string;
  venue_name: string;
  city: string;
  country: string;
  orders_ticket_info: {
    id: number;
    ticket_amount: number;
    total_price: number;
    event_ticket_name: string;
  }[];
}

const YourTicketPageWrapper = () => {
  const router = useRouter();

  // booleans
  const [isLoading, setIsLoading] = useState(true);
  // data
  const [data, setData] = useState<DataType>();

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (!router.isReady) return;

    const queryAPI = async () => {
      const { id } = router.query;
      try {
        const res = await getTicket({ id: id as string });
        setData(res.data);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'Internal server error.');

        setTimeout(() => {
          router.replace('/');
        }, 3000);
      }
    };
    queryAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, router.isReady]);

  const formatDate = ({ date }: { date: string }) => {
    const d = getDateData({
      date,
      monthFormat: 'short',
      weekDayFormat: 'short',
    });
    return `${d.weekDay}, ${d.monthText} ${d.day}, ${d.year}`;
  };

  const BackButton = () => {
    return (
      <Link href="/dashboard/yourtickets">
        <Button type="link" icon={<LeftBackArrowIcon fill={colors.color2} />}>
          Back to your tickets
        </Button>
      </Link>
    );
  };

  if (!data) {
    return (
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          height: '100%',
          justifyContent: 'center',
        }}
      >
        <Loader />
      </div>
    );
  }

  return (
    <>
      <section className="container">
        <BackButton />
        <h1>
          Order for{' '}
          <Link href={`/event/recrea-academy`} legacyBehavior>
            <a className="event">{data.title}</a>
          </Link>
        </h1>
        <p className="order">
          Order #{data.unique_id} bought on{' '}
          {formatDate({ date: data.purchase_date })} at{' '}
          {formatTime({
            time: data.purchase_time,
            timeFormat: 'short',
          })}
        </p>
        <p className="order">
          Event information: start on {formatDate({ date: data.date_start })} at{' '}
          {formatTime({
            time: data.time_start,
            timeFormat: 'short',
          })}
        </p>
        <p className="location">
          {data.venue_name} • {data.city}, {data.country}
        </p>
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
          <div className="contact-information col-12 col-md-8 row hg-16">
            {data.orders_ticket_info.map((order) => (
              <div key={order.id} className="col-12">
                <h3 className="event-ticket-name">
                  {order.ticket_amount > 1 ? `(${order.ticket_amount}X)` : ''}{' '}
                  {order.event_ticket_name}
                </h3>
                <h5>Contact information</h5>
                <Divider />
                <div className="row hg-16">
                  <div className="col-12 col-md-6">
                    <div className="contact-field">
                      <p className="label">Firts name</p>
                      <p className="value">{data.first_name}</p>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="contact-field">
                      <p className="label">Last name</p>
                      <p className="value">{data.last_name}</p>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="contact-field">
                      <p className="label">Email</p>
                      <p className="value">{data.email}</p>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="contact-field">
                      <p className="label">Number of tickets</p>
                      <p className="value">{order.ticket_amount}</p>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="contact-field">
                      <p className="label">Total price</p>
                      <p className="value">
                        {formatCurrency(order.total_price, 'USD')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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

        h3.event-ticket-name {
          margin-bottom: 1.5rem;
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
    </>
  );
};
