import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
// components
import { Button, Divider, Modal, Select, Tag } from 'components/ui';
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
} from 'components/icons';
import Layout from 'components/Layout';
// helpers
import { shimmer, toBase64 } from 'helpers';
// hooks
import useVW from 'hooks/useVW';
// interfaces
import { EventType } from 'interfaces';
// services
import { getEventData } from 'services/events';
// styles
import { breakPoints, colors, fluidFont } from 'styles/variables';

export default function Event() {
  const router = useRouter();
  const vw = useVW();
  const [event, setEvent] = useState<null | EventType>(null);
  const [isShowModal, setIsShowModal] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;
    const { slug } = router.query;
    const queryAPI = async () => {
      try {
        const res = await getEventData({ slug: slug as string });
        if (!res.data) {
          router.replace('/');
          return;
        }

        setEvent(res.data);
      } catch (error) {
        // console.log(error);
      }
    };
    queryAPI();
  }, [router]);

  const dayAndMonth = ({ date }: { date: string }) => {
    const d = new Date(date);
    if (d.toString() === 'Invalid Date') {
      return date;
    }

    const day = d.getDate();
    const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(
      d
    );

    return `${month} ${day}`;
  };

  const formatDate = ({ date }: { date: string }) => {
    const d = new Date(date);
    if (d.toString() === 'Invalid Date') {
      return date;
    }

    const weekDay = new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
    }).format(d);
    const day = d.getDate();
    const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(
      d
    );
    const year = d.getFullYear();

    return `${weekDay}, ${month} ${day}, ${year}`;
  };

  const formatTime = ({
    fromDate,
    toDate,
  }: {
    fromDate: string;
    toDate: string;
  }) => {
    const d = new Date(fromDate);
    const d2 = new Date(toDate);
    if (d.toString() === 'Invalid Date' || d2.toString() === 'Invalid Date') {
      return `${fromDate} ${toDate}`;
    }

    const fromTime = d.toLocaleTimeString();
    const toTime = d2.toLocaleTimeString();

    return `${fromTime.toUpperCase()} - ${toTime.toUpperCase()}`;
  };

  if (!event) return null;

  return (
    <Layout>
      <div className="banner">
        <Image
          src={event.src}
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
            <p className="date">{dayAndMonth({ date: event.fromDate })}</p>
            <h3 className="title">{event.title}</h3>
            {event.sub_title && <p className="sub-title">{event.sub_title}</p>}
            {event.sponsor && <p className="sponsor">{event.sponsor}</p>}
            {event.followers && (
              <div className="followers row vg-8">
                <div className="followers-info col-6 col-sm-4 col-lg-3">
                  {event.followers} followers
                </div>
                <div className="col-6 col-sm-4 col-md-3">
                  <Button block>Follow</Button>
                </div>
              </div>
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
                    <p>{formatDate({ date: event.fromDate })}</p>
                    <p>
                      {formatTime({
                        fromDate: event.fromDate,
                        toDate: event.toDate,
                      })}
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
                    <p>{event.long_location}</p>
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

          <section className="information">
            <h3>About this event</h3>
            <p>{event.information}</p>
            {event.announcement && (
              <Image
                src={event.announcement}
                alt="0"
                width={1200}
                height={700}
                style={{ width: '100%', height: 'auto' }}
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${toBase64(
                  shimmer('100%', '100%')
                )}`}
              />
            )}
          </section>

          <section className="tags">
            <h3>Tags</h3>
            <div className="tags-container">
              {event.tags.map((tag, i) => (
                <div key={`${tag}-i`} className="tag">
                  <Tag>{tag}</Tag>
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
            <h4 className="title">{event.sponsor}</h4>
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
              <p className="title">
                {`${event.price.toLowerCase() === 'free' ? '' : 'From'} ${
                  event.price
                }`}
              </p>
              <Button
                type="primary"
                block
                onClick={() => {
                  setIsShowModal(true);
                }}
              >
                Get tickets
              </Button>
            </div>
          </aside>
        </div>
      </div>

      <Modal
        title={null}
        footer={null}
        isShowModal={isShowModal}
        onCancel={() => setIsShowModal(false)}
      >
        <div className="modal row">
          <div className="ticket-info col-12 col-md-7">
            <div className="title">
              <h4>{event.title}</h4>
              <div className="info">
                <p>{formatDate({ date: event.fromDate })}</p>
                <p>
                  {formatTime({
                    fromDate: event.fromDate,
                    toDate: event.toDate,
                  })}
                </p>
              </div>
            </div>
            <div className="body">
              <div className="row vg-8">
                <div className="col-7">
                  <h4>{event.ticket_description}</h4>
                  <p>{event.price}</p>
                </div>
                <div className="col-5">
                  <Select
                    placeholder="N° tickets"
                    options={[
                      { key: 1, label: '1', value: '1' },
                      { key: 2, label: '2', value: '2' },
                      { key: 3, label: '3', value: '3' },
                      { key: 4, label: '4', value: '4' },
                      { key: 5, label: '5', value: '5' },
                    ]}
                    handleChange={(value) => console.log(value)}
                  />
                </div>
              </div>
              {event.event_ticket_description && (
                <p className="ticket-description">
                  {event.event_ticket_description}
                </p>
              )}
              <p className="brand">
                Offered by <span>YourTickets</span>
              </p>
            </div>
            <div className="footer">
              <p className="price">
                {event.price.toLowerCase() === 'free'
                  ? event.price
                  : `$${event.price}`}
              </p>
              <Button block type="primary">
                Check out
              </Button>
            </div>
          </div>
          {vw !== null && vw >= 768 && (
            <div className="col-md-5">
              <div className="order-summary">
                <div>
                  <Image
                    src={event.src}
                    alt="0"
                    width={1800}
                    height={700}
                    style={{ width: '100%', height: '50%' }}
                    placeholder="blur"
                    blurDataURL={`data:image/svg+xml;base64,${toBase64(
                      shimmer('100%', '100%')
                    )}`}
                  />
                </div>
                <div className="order-summary-info">
                  <p className="order-summary-title">Order Summary</p>
                  <div className="row">
                    <p className="col-8">1 x {event.ticket_description}</p>
                    <p className="col-4">
                      {event.price.toLowerCase() === 'free'
                        ? '$0.00'
                        : event.price}
                    </p>
                  </div>
                  <div className="total row">
                    <p className="total-word col-8">Total</p>
                    <p className="total-price col-4">
                      {event.price.toLowerCase() === 'free'
                        ? '$0.00'
                        : event.price}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>
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
        .event-title .sub-title {
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

        .modal {
          height: 90vh;
        }

        .modal .ticket-info {
          position: relative;
        }

        .modal .title {
          border-bottom: 1px solid ${colors.black};
          padding: 0.8rem 1.5rem 0.8rem 0.8rem;
        }

        .modal .title .info {
          margin-top: 0.5rem;
        }

        .modal .title .info p {
          color: ${colors.grayFont};
          margin: 0.2rem 0;
        }

        .modal .body {
          overflow-y: auto;
          padding: 2rem 0.4rem 0;
        }

        .modal .body .ticket-description {
          color: ${colors.grayFont};
          margin-top: 0;
        }

        .modal .body .brand {
          color: ${colors.grayFont};
          margin-top: 5rem;
        }

        .modal .body .brand span {
          font-size: ${fluidFont.big};
          font-weight: bold;
        }

        .modal .ticket-info .footer {
          border-top: 1px solid #000;
          bottom: 0;
          left: 0;
          padding: 1rem 2rem;
          position: absolute;
          width: 100%;
        }

        .modal .footer .price {
          color: ${colors.grayFont};
          font-size: ${fluidFont.big};
          font-weight: bold;
          margin-top: 0;
        }

        .modal .order-summary {
          background-color: ${colors.lightGray};
          height: 100%;
        }

        .modal .order-summary-info {
          padding: 1.5rem 1rem;
        }

        .modal .order-summary-title {
          font-weight: bold;
          margin-top: 0;
        }

        .modal .order-summary-info .total {
          margin-top: 4rem;
        }

        .modal .order-summary-info .total-word,
        .modal .order-summary-info .total-price {
          font-size: ${fluidFont.big};
          font-weight: bold;
        }
      `}</style>
    </Layout>
  );
}
