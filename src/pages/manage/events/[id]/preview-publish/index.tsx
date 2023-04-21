import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
// components
import PrivateRoute from 'client/components/app/PrivateRoute';
import DashboardLayout from 'client/components/Layouts/DashboardLayout';
import EventFormLayout from 'client/components/app/event/EventFormLayout';
import Loader from 'client/components/app/Loader';
import { Button, Divider } from 'client/components/ui';
import {
  LinkIcon,
  PhotoIcon,
  TicketIcon,
  UserIcon,
} from 'client/components/icons';
// helpers
import {
  debounce,
  formatCurrency,
  formatTime,
  getDateData,
  shimmer,
  toBase64,
} from 'client/helpers';
// hooks
import useVW from 'client/hooks/useVW';
// interfaces
import { EventPreviewPublishType } from 'interfaces';
// services
import { baseURL } from 'client/services';
import {
  getEventPreviewPublish,
  putPublishEvent,
} from 'client/services/event.service';
// store
import { AppSelector } from 'client/store/selectors';
// styles
import { breakPoints, breakPointsPX, colors } from 'client/styles/variables';

export default function PreviewPublishPage() {
  return (
    <PrivateRoute>
      <DashboardLayout>
        <PreviewPublishWrapper />
      </DashboardLayout>
    </PrivateRoute>
  );
}

const PreviewPublishWrapper = () => {
  const router = useRouter();
  const vw = useVW();

  const { canPublishEvent } = AppSelector();
  // booleans
  const [isLoading, setIsLoading] = useState(true);
  // data
  const [event, setEvent] = useState<EventPreviewPublishType>();

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (!router.isReady) return;

    const queryAPI = async () => {
      const { id } = router.query;
      try {
        const res = await getEventPreviewPublish({ eventId: id as string });
        setEvent(res.data);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'Internal server error.');

        setTimeout(() => {
          router.replace('/dashboard/events');
        }, 3000);
      }
    };
    queryAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, router.isReady]);

  if (!event) {
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

  const formatDate = ({ date }: { date: string }) => {
    const d = getDateData({
      date,
      monthFormat: 'short',
      weekDayFormat: 'short',
    });
    return `${d.weekDay}, ${d.monthText} ${d.day}, ${d.year}`;
  };

  const formatPriceRange = () => {
    if (
      event.ticket_smallest_price === null ||
      event.ticket_largest_price === null
    ) {
      return ' - ';
    }

    if (event.ticket_smallest_price === 0 && event.ticket_largest_price === 0) {
      return 'Free';
    }

    if (event.ticket_smallest_price === event.ticket_largest_price) {
      return `${formatCurrency(event.ticket_smallest_price, 'USD')}`;
    }

    return `${
      event.ticket_smallest_price
        ? formatCurrency(event.ticket_smallest_price, 'USD')
        : 'Free'
    } - ${formatCurrency(event.ticket_largest_price, 'USD')}`;
  };

  const handlePublish = async () => {
    try {
      const res = await putPublishEvent({
        eventId: event.id,
        data: { is_available: !event.is_available },
      });
      setEvent({ ...event, is_available: +!event.is_available });
      toast.success(res.data.message);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Internal server error.');
    }
  };

  return (
    <EventFormLayout>
      <div className="container" style={{ marginBottom: '2rem' }}>
        <div className="row hg-48">
          {vw >= breakPointsPX.md && (
            <div className="col-12">
              <h1>Check Your Event</h1>
            </div>
          )}

          <div className="col-12">
            <div className="card box-shadow row">
              <div className="col-12 col-lg-6">
                <div className="card_image">
                  {event.event_detail.cover_image_url ? (
                    <Image
                      src={`${baseURL}/media/${event.event_detail.cover_image_url}`}
                      alt={'image'}
                      fill
                      style={{ objectFit: 'cover' }}
                      placeholder="blur"
                      blurDataURL={`data:image/svg+xml;base64,${toBase64(
                        shimmer('100%', '100%')
                      )}`}
                    />
                  ) : (
                    <div className="card_image-blank">
                      <PhotoIcon />
                    </div>
                  )}
                </div>
              </div>
              <div className="col-12 col-lg-6">
                <div className="card_body">
                  <h3>{event.title}</h3>
                  <p>
                    {formatDate({ date: event.date_start })} at{' '}
                    {formatTime({
                      time: event.time_start,
                      timeFormat: 'short',
                    })}
                  </p>
                  <p>
                    {event.event_location.address_1},{' '}
                    {event.event_location.city}, {event.event_location.state}{' '}
                    {event.event_location.postal_code},{' '}
                    {event.event_location.country}
                  </p>
                  <div className="row">
                    <div className="col-6 row vg-8">
                      <div className="col-4 col-sm-3">
                        <div className="card_body_icon">
                          <TicketIcon />
                        </div>
                      </div>
                      <div className="col-8 col-sm-9">
                        <p>{formatPriceRange()}</p>
                      </div>
                    </div>
                    <div className="col-6 row vg-8">
                      <div className="col-4 col-sm-3">
                        <div className="card_body_icon">
                          <UserIcon />
                        </div>
                      </div>
                      <div className="col-8 col-sm-9">
                        <p>
                          {event.total_quantity !== null
                            ? event.total_quantity
                            : ' - '}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p>{event.event_detail.summary}</p>
                  <Divider />
                  <Link
                    href={`/manage/events/${event.id}/preview`}
                    legacyBehavior
                  >
                    <a className="card_body_link">
                      Preview your event
                      <span className="card_body_link_icon">
                        <LinkIcon fill={colors.color2} />
                      </span>
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <Button
              block
              disabled={!canPublishEvent}
              type="primary"
              onClick={
                canPublishEvent ? debounce(handlePublish, 800) : undefined
              }
            >
              {event.is_available === 0 ? 'Publish' : 'Unpublish'}
            </Button>
          </div>
        </div>
      </div>
      <style jsx>{`
        .card_image {
          align-items: center;
          background-color: ${colors.lightGray};
          display: flex;
          height: 300px;
          justify-content: center;
          position: relative;
          width: 100%;
        }

        .card_image-blank {
          width: 60px;
        }

        .card_body {
          padding: 1rem;
        }

        .card_body_icon {
          align-items: center;
          display: flex;
          height: 100%;
          justify-content: center;
          max-width: 40px;
          width: 100%;
        }

        .card_body_link {
          align-items: center;
          color: ${colors.color2};
          display: flex;
          justify-content: center;
          text-align: center;
        }

        .card_body_link_icon {
          align-items: center;
          display: inline-flex;
          justify-content: center;
          margin-left: 0.5rem;
          width: 30px;
        }

        @media (hover: hover) {
          .card_body_link:hover {
            text-decoration: underline;
          }
        }

        @media (min-width: ${breakPoints.lg}) {
          .card_image {
            height: 100%;
          }
        }
      `}</style>
    </EventFormLayout>
  );
};
