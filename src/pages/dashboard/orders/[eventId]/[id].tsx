import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
// components
import PrivateRoute from 'client/components/app/PrivateRoute';
import DashboardLayout from 'client/components/Layouts/DashboardLayout';
import CancelOrderModal from 'client/components/app/CancelOrderModal';
import Loader from 'client/components/app/Loader';
import { Button } from 'client/components/ui';
import {
  CalendarIcon,
  EmailIcon,
  LeftBackArrowIcon,
  LocationIcon,
  PrinterIcon,
  XIcon,
} from 'client/components/icons';
// helpers
import {
  formatCurrency,
  formatTime,
  getDateData,
  shimmer,
  toBase64,
} from 'client/helpers';
// services
import { baseURL } from 'client/services';
import {
  deleteOrder,
  getDownloadOrderTickets,
  getOrder,
} from 'client/services/orders.service';
// styles
import { colors } from 'client/styles/variables';

export default function ShowOrderPage() {
  return (
    <PrivateRoute>
      <DashboardLayout>
        <ShowOrderWrapper />
      </DashboardLayout>
    </PrivateRoute>
  );
}

const ShowOrderWrapper = () => {
  const router = useRouter();

  // booleans
  const [isLoading, setIsLoading] = useState(true);
  const [isShowModal, setIsShowModal] = useState(false);
  // data
  const [ids, setIds] = useState<{
    eventId: string | number;
    id: string | number;
  }>();
  const [order, setOrder] = useState<{
    id: string | number;
    unique_id: string | number;
    event_id: string | number;
    first_name: string;
    last_name: string;
    total: number;
    purchase_date: string;
    purchase_time: string;
    total_tickets: number;
    ticket_url: string;
    is_available: number;
    title: string;
    date_start: string;
    date_end: string;
    time_start: string;
    time_end: string;
    cover_image_url: string;
    venue_name: string;
  }>();

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (!router.isReady) return;

    const queryAPI = async () => {
      const { eventId, id } = router.query;
      try {
        const res = await getOrder({
          eventId: eventId as string,
          id: id as string,
        });
        setOrder(res.data);
        setIds({ eventId: res.data.event_id, id: res.data.unique_id });
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

  if (!order) {
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

  const formatDate = ({ date, time }: { date: string; time: string }) => {
    const d = getDateData({
      date,
      monthFormat: 'short',
      weekDayFormat: 'short',
    });
    const t = formatTime({ time, timeFormat: 'short' });
    return `${d.weekDay}, ${d.monthText} ${d.monthNumber}, ${d.year} ${t}`;
  };

  const handleCancelOrder = async ({
    eventId,
    id,
  }: {
    eventId: string | number;
    id: string | number;
  }) => {
    try {
      const res = await deleteOrder({ eventId, id });
      toast.success(res.data.message);
      setOrder((state) => ({ ...state!, is_available: 0 }));
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Internal server error.');
    }
    setIsShowModal(false);
  };

  const handleDownloadTickets = async () => {
    try {
      const res = await getDownloadOrderTickets({ key: order.ticket_url });
      const imageURL = URL.createObjectURL(res.data);
      const $link = document.createElement('a');
      $link.href = imageURL;
      $link.download = `${order.ticket_url}.pdf`;
      document.body.append($link);
      $link.click();
      $link.remove();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Internal server error.');
    }
  };

  return (
    <>
      <section className="container row hg-16">
        <Link href="/dashboard/orders">
          <Button type="link" icon={<LeftBackArrowIcon fill={colors.color2} />}>
            Back to your orders
          </Button>
        </Link>
        <h1 className={`${order.is_available ? 'col-12' : 'col-12 col-sm-10'}`}>
          Order #{order.unique_id}
        </h1>
        {!order.is_available && (
          <div className="col-12 col-sm-2">
            <p className="refunded-order">Refunded</p>
          </div>
        )}
        <div className="col-12 col-md-10 col-xl-8 row hg-8 vg-sm-8 hg-md-0">
          <div
            className="action col-12 col-sm-4 row"
            onClick={handleDownloadTickets}
          >
            <div className="action_icon-container col-2 col-sm-3 col-lg-2">
              <div className="action_icon">
                <PrinterIcon fill={colors.color2} />
              </div>
            </div>
            <div className="action_title col-8 col-sm-9 col-lg-10">
              Print ticket{order.total_tickets > 1 ? 's' : ''}
            </div>
          </div>
          {!!order.is_available && (
            <>
              <div className="action col-12 col-sm-4 row">
                <div className="action_icon-container col-2 col-sm-3 col-lg-2">
                  <div className="action_icon">
                    <EmailIcon fill={colors.color2} />
                  </div>
                </div>
                <p className="action_title col-8 col-sm-9 col-lg-10">
                  Resend confirmation
                </p>
              </div>
              <div
                className="action col-12 col-sm-4 row"
                onClick={() => setIsShowModal(true)}
              >
                <div className="action_icon-container col-2 col-sm-3 col-lg-2">
                  <div className="action_icon">
                    <XIcon fill={colors.color2} />
                  </div>
                </div>
                <p className="action_title col-8 col-sm-9 col-lg-10">
                  Cancel order
                </p>
              </div>
            </>
          )}
        </div>
      </section>
      <section className="container row hg-32 hg-md-0 vg-md-16">
        <div className="col-12 col-md-6 row hg-24">
          <div className="col-12">
            <div className="image-container">
              <Image
                alt="0"
                blurDataURL={`data:image/svg+xml;base64,${toBase64(
                  shimmer('100%', '100%')
                )}`}
                fill
                placeholder="blur"
                src={`${baseURL}/media/${order.cover_image_url}`}
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
          <div className="col-12">
            <h4>{order.title}</h4>
          </div>
          <div className="col-12 row hg-16">
            <div className="col-12 row">
              <div className="col-2 col-md-1">
                <div className="info-icon">
                  <LocationIcon />
                </div>
              </div>
              <div className="col-10 col-md-11">
                <p>{order.venue_name}</p>
              </div>
            </div>
            <div className="col-12 row">
              <div className="col-2 col-md-1">
                <div className="info-icon">
                  <CalendarIcon />
                </div>
              </div>
              <div className="col-10 col-md-11">
                <p>
                  {formatDate({
                    date: order.date_start,
                    time: order.time_start,
                  })}{' '}
                  -{' '}
                  {formatDate({
                    date: order.date_end,
                    time: order.time_end,
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="row hg-24 vg-8">
            <div className="col-12">
              <h4>Order Details</h4>
            </div>
            <div className="col-6">
              <h5 className="detail_title">Buyer name</h5>
              <p>
                {order.first_name} {order.last_name}
              </p>
            </div>
            <div className="col-6">
              <h5 className="detail_title">Order total</h5>
              <p>{formatCurrency(order.total, 'USD')}</p>
            </div>
            <div className="col-6">
              <h5 className="detail_title">Purchase date</h5>
              <p>
                {formatDate({
                  date: order.purchase_date,
                  time: order.purchase_time,
                })}
              </p>
            </div>
            <div className="col-6">
              <h5 className="detail_title">Ticket total</h5>
              <p>
                {order.total_tickets} ticket{order.total_tickets > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </section>
      <CancelOrderModal
        showModal={isShowModal}
        ids={ids}
        handleCancelOrder={handleCancelOrder}
        onCancel={() => setIsShowModal(false)}
      />
      <style jsx>{`
        section {
          margin-bottom: 2rem;
        }

        section:first-of-type {
          margin-top: 2rem;
        }

        p {
          margin: 0;
        }

        .refunded-order {
          align-items: center;
          background-color: ${colors.warning};
          border-radius: 5px;
          color: ${colors.white};
          display: flex;
          font-weight: bold;
          justify-content: flex-start;
          padding: 0.4rem;
          width: max-content;
        }

        .action {
          cursor: pointer;
        }

        .action_icon-container {
          align-items: center;
          display: flex;
          justify-content: center;
        }

        .action_icon {
          width: 20px;
        }

        .action_title {
          align-items: center;
          color: ${colors.color2};
          display: flex;
          font-weight: bold;
          justify-content: flex-start;
        }

        .image-container {
          height: 245px;
          position: relative;
          width: 100%;
        }

        .info-icon {
          width: 20px;
        }

        .detail_title {
          margin-bottom: 0.8rem;
        }

        @media (hover: hover) {
          .action:hover .action_title {
            text-decoration: underline;
          }
        }
      `}</style>
    </>
  );
};
