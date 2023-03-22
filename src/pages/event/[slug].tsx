import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
// components
import { Button, Divider, Tag } from 'client/components/ui';
import {
  BikeIcon,
  BusIcon,
  CalendarIcon,
  CarIcon,
  EmailIcon,
  FacebookIcon,
  HeartIcon,
  LinkedinIcon,
  LocationIcon,
  MessengerIcon,
  TwitterIcon,
  UploadIcon,
  WalkIcon,
} from 'client/components/icons';
import PublicLayout from 'client/components/Layouts/PublicLayout';
import CheckoutModal from 'client/components/app/CheckoutModal';
// helpers
import {
  dayAndMonth,
  formatDate,
  formatLongLocation,
  formatTime,
  shimmer,
  toBase64,
} from 'client/helpers';
// interfaces
import { EventType } from 'interfaces';
// services
import { getEventBySlug } from 'client/services/event.service';
// store
import { AuthSelector } from 'client/store/selectors';
// styles
import { breakPoints, colors, fluidFont } from 'client/styles/variables';

export default function EventPage() {
  const router = useRouter();
  const { isAuthenticated } = AuthSelector();

  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<EventType | undefined>(undefined);
  const [isShowModal, setIsShowModal] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    if (loading) return;

    const queryAPI = async () => {
      const { slug } = router.query;

      try {
        const res = await getEventBySlug({ slug: slug as string });
        setEvent(res.data.event);
      } catch (error) {
        router.replace('/');
      }
    };
    queryAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  if (!event) return null;

  return (
    <PublicLayout>
      <div className="banner">
        <Image
          src={event.event_detail.cover_image_url}
          alt="0"
          width={1800}
          height={700}
          style={{ width: '100%', height: 'auto' }}
          placeholder="blur"
          blurDataURL={`data:image/svg+xml;base64,${toBase64(
            shimmer('100%', '100%')
          )}`}
        />
        <div className="actions-buttons container">
          <div className="icon like-button">
            <HeartIcon />
          </div>
          <div className="icon like-button">
            <UploadIcon />
          </div>
        </div>
      </div>

      <div className="container row vg-md-8">
        <div className="col-12 col-md-8">
          <section className="event-title">
            <p className="date">{dayAndMonth({ date: event.date_start })}</p>
            <h3 className="title">{event.title}</h3>
            {event.event_detail.summary && (
              <p className="summary">{event.event_detail.summary}</p>
            )}
            <p className="sponsor">
              Secretaria de Educación del Estado de Jalisco
            </p>
            <div className="followers row vg-8">
              <div className="followers-info col-6 col-sm-4 col-lg-3">
                21033 followers
              </div>
              <div className="col-6 col-sm-4 col-md-3">
                <Button block>Follow</Button>
              </div>
            </div>
          </section>

          <section className="location">
            <h3>When and where</h3>
            <div className="when-where row">
              <div className="when col-12 col-md-6 row vg-8">
                <div className="col-3 col-sm-2">
                  <div className="icon">
                    <CalendarIcon fill={colors.color2} />
                  </div>
                </div>
                <div className="col-9 col-sm-10">
                  <p className="title">Date and time</p>
                  <div className="info">
                    <p>{formatDate({ date: event.date_start })}</p>
                    <p>
                      {`${formatTime({
                        time: event.time_start,
                      })} - ${formatTime({ time: event.time_end })}`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="where col-12 col-md-6 row vg-8">
                <div className="col-3 col-sm-2">
                  <div className="icon">
                    <LocationIcon fill={colors.color2} />
                  </div>
                </div>
                <div className="col-9 col-sm-10">
                  <p className="title">Location</p>
                  <div className="info">
                    <p>
                      {formatLongLocation({ location: event.event_location })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="map">
              <Image
                src="/example/map.jpg"
                alt="0"
                width={1200}
                height={800}
                style={{ width: '100%', height: 'auto' }}
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${toBase64(
                  shimmer('100%', '100%')
                )}`}
              />
            </div>

            <div className="transports">
              <h4>How to get there</h4>
              <div className="row">
                <div className="transport-icon col-3">
                  <CarIcon fill={colors.color2} />
                </div>
                <div className="transport-icon col-3">
                  <WalkIcon fill={colors.color2} />
                </div>
                <div className="transport-icon col-3">
                  <BusIcon fill={colors.color2} />
                </div>
                <div className="transport-icon col-3">
                  <BikeIcon fill={colors.color2} />
                </div>
              </div>
            </div>
          </section>

          {event.event_detail.description && (
            <section className="information">
              <h3>About this event</h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: event.event_detail.description,
                }}
              />
            </section>
          )}

          <section className="tags">
            <h3>Tags</h3>
            <div className="tags-container">
              {event.event_tag.map(({ name, id }) => (
                <div key={id} className="tag">
                  <Tag hoverable>{name}</Tag>
                </div>
              ))}
            </div>
          </section>

          <section className="share">
            <h3>Share with friends</h3>
            <div className="row">
              <div className="share-icon col-2">
                <FacebookIcon />
              </div>
              <div className="share-icon col-2">
                <MessengerIcon />
              </div>
              <div className="share-icon col-2">
                <LinkedinIcon />
              </div>
              <div className="share-icon col-2">
                <TwitterIcon />
              </div>
              <div className="share-icon col-2">
                <EmailIcon />
              </div>
            </div>
          </section>

          <Divider />

          <section className="sponsor">
            <h4 className="title">
              Secretaria de Educación del Estado de Jalisco
            </h4>
            <p className="event">{event.title}</p>
            <div className="actions row">
              <div className="col-6">
                <Button block>Follow</Button>
              </div>
              <div className="col-6">
                <Button block style={{ border: 'none' }}>
                  Contact
                </Button>
              </div>
            </div>
          </section>
        </div>
        <div className="aside-container col-12 col-md-4">
          <aside>
            <div className="get-tickets">
              <p className="title">{event.event_ticket_info.price || 'Free'}</p>
              <Button
                type="primary"
                block
                onClick={() => {
                  if (!isAuthenticated) router.push('/login');
                  setIsShowModal(true);
                }}
              >
                Get tickets
              </Button>
            </div>
          </aside>
        </div>
      </div>

      {isAuthenticated && (
        <CheckoutModal
          event={event}
          handleShowModal={(state) => setIsShowModal(state)}
          isShowModal={isShowModal}
        />
      )}

      <style jsx>{`
        h3 {
          font-weight: bold;
          margin-bottom: 2rem;
        }

        section {
          margin-bottom: 2rem;
        }

        .banner {
          margin-bottom: 1rem;
          margin-top: 2rem;
        }

        .banner .actions-buttons {
          align-items: center;
          display: flex;
          justify-content: flex-end;
          margin-top: 1rem;
        }

        .banner .icon {
          background-color: ${colors.lightGray};
          border-radius: 50%;
          cursor: pointer;
          height: 40px;
          padding: 0.6rem;
          width: 40px;
        }

        .banner .icon:first-of-type {
          margin-right: 1rem;
        }

        @media (min-width: ${breakPoints.md}) {
          .banner {
            margin-left: auto;
            margin-right: auto;
            width: 80%;
          }
        }

        .aside-container {
          position: relative;
        }

        aside {
          background-color: ${colors.white};
          bottom: 0;
          height: 118px;
          left: 0;
          position: fixed;
          width: 100vw;
        }

        aside .get-tickets {
          border: 1px solid ${colors.gray};
          box-shadow: 0 1px 2px -2px rgb(0 0 0 / 16%),
            0 3px 6px 0 rgb(0 0 0 / 12%), 0 5px 12px 4px rgb(0 0 0 / 9%);
          padding: 1rem;
        }

        aside .get-tickets .title {
          font-weight: bold;
          text-align: center;
        }

        @media (min-width: ${breakPoints.md}) {
          aside {
            height: auto;
            left: 0;
            position: sticky;
            top: 20px;
            width: auto;
          }
        }

        .event-title .date,
        .event-title .summary {
          font-size: ${fluidFont.big};
          font-weight: bold;
        }

        .event-title .sponsor {
          color: ${colors.color2};
          font-size: ${fluidFont.big};
        }

        .event-title .followers-info {
          align-items: center;
          color: ${colors.grayFont};
          display: flex;
          font-size: ${fluidFont.normal};
          justify-content: center;
        }

        .location .when-where {
          margin-bottom: 2rem;
        }

        .location .icon {
          background-color: ${colors.lightGray};
          height: 40px;
          padding: 0.4rem;
        }

        .location .title {
          font-weight: bold;
        }

        .location .info {
          color: ${colors.grayFont};
        }

        .location .map {
          margin-bottom: 2rem;
        }

        .location .transports h4 {
          color: ${colors.grayFont};
          font-weight: bold;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .location .transports .row {
          height: 30px;
          margin-left: auto;
          margin-right: auto;
          width: 80%;
        }

        .transports .transport-icon {
          height: 100%;
        }

        .tags .tags-container {
          display: flex;
          flex-wrap: wrap;
          row-gap: 1rem;
        }

        .tags .tags-container .tag {
          margin-right: 1rem;
        }

        .share .row {
          height: 30px;
        }

        .share .share-icon {
          height: 100%;
        }

        @media (min-width: ${breakPoints.md}) {
          .share .row {
            width: 80%;
          }
        }

        .sponsor .title {
          color: ${colors.color2};
          font-size: ${fluidFont.normal};
          font-weight: bold;
          text-align: center;
        }

        .sponsor .event {
          text-align: center;
        }

        .sponsor .actions {
          margin-left: auto;
          margin-right: auto;
          width: 60%;
        }
      `}</style>
    </PublicLayout>
  );
}
