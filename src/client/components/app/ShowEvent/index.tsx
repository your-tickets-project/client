import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
// components
import CheckoutModal from 'client/components/app/CheckoutModal';
import MapWithMarker from 'client/components/googleMaps/MapWithMarker';
import { Button, Tag } from 'client/components/ui';
import {
  CalendarIcon,
  EmailIcon,
  FacebookIcon,
  HeartIcon,
  LinkedinIcon,
  LocationIcon,
  MessengerIcon,
  PhotoIcon,
  TwitterIcon,
  UploadIcon,
} from 'client/components/icons';
// helpers
import {
  formatLongLocation,
  formatTime,
  shimmer,
  toBase64,
  getDateData,
  formatCurrency,
} from 'client/helpers';
// interfaces
import {
  EventBasicInfoType,
  EventDetailType,
  EventLocationType,
  EventTagType,
  EventTicketInfoType,
  NullablePartial,
} from 'interfaces';
// services
import { baseURL } from 'client/services';
// store
import { AuthSelector } from 'client/store/selectors';
// styles
import { breakPoints, colors, fluidFont } from 'client/styles/variables';

interface Props {
  event: EventBasicInfoType & {
    event_location: EventLocationType;
    event_detail: NullablePartial<EventDetailType>;
    event_ticket_info: EventTicketInfoType[];
    event_tag: EventTagType[];
  } & { ticket_smallest_price: number };
  isPreview?: boolean;
}

export default function ShowEvent({ event, isPreview }: Props) {
  const router = useRouter();
  const { isAuthenticated } = AuthSelector();

  // booleans
  const [isShowModal, setIsShowModal] = useState(false);

  const formatDate = ({ date }: { date: string }) => {
    const d = getDateData({
      date,
      monthFormat: 'short',
      weekDayFormat: 'short',
    });
    return `${d.weekDay}, ${d.monthText} ${d.day}, ${d.year}`;
  };

  const getDayAndMonth = ({ date }: { date: string }) => {
    const d = getDateData({ date, monthFormat: 'short' });
    return `${d.monthText} ${d.day}`;
  };

  const formatPriceRange = () =>
    `From ${formatCurrency(event.ticket_smallest_price, 'USD')}`;

  return (
    <>
      <div className="banner">
        <div className="img-container">
          {event.event_detail.cover_image_url ? (
            <Image
              src={`${baseURL}/media/${event.event_detail.cover_image_url}`}
              alt="0"
              fill
              style={{ objectFit: 'cover' }}
              placeholder="blur"
              blurDataURL={`data:image/svg+xml;base64,${toBase64(
                shimmer('100%', '100%')
              )}`}
            />
          ) : (
            <div className="img-blank">
              <PhotoIcon />
            </div>
          )}
        </div>
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
            <p className="date">{getDayAndMonth({ date: event.date_start })}</p>
            <h3 className="title">{event.title}</h3>
            {event.event_detail.summary && (
              <p className="summary">{event.event_detail.summary}</p>
            )}
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
                        timeFormat: 'short',
                      })} - ${formatTime({
                        time: event.time_end,
                        timeFormat: 'short',
                      })}`}
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
              <MapWithMarker
                location={{
                  lat: +event.event_location.latitude,
                  lng: +event.event_location.longitude,
                }}
              />
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
        </div>
        <div className="aside-container col-12 col-md-4">
          <aside>
            <div className="get-tickets">
              <p className="title">{formatPriceRange()}</p>
              <Button
                block
                disabled={isPreview}
                type="primary"
                onClick={
                  isPreview
                    ? undefined
                    : () => {
                        if (!isAuthenticated) router.push('/login');
                        setIsShowModal(true);
                      }
                }
              >
                Get tickets
              </Button>
            </div>
          </aside>
        </div>
      </div>

      {isAuthenticated && !isPreview && (
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
          position: relati;
        }

        .banner .img-container {
          align-items: center;
          background-color: ${colors.lightGray};
          display: flex;
          height: 450px;
          justify-content: center;
          position: relative;
          width: 100%;
        }

        .banner .img-container .img-blank {
          width: 80px;
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
          height: 500px;
          margin-bottom: 2rem;
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
      `}</style>
    </>
  );
}
