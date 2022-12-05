import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
// components
import { Button } from 'components/ui';
import {
  CalendarIcon,
  HeartIcon,
  LocationIcon,
  UploadIcon,
} from 'components/icons';
import Layout from 'components/Layout';
// helpers
import { shimmer, toBase64 } from 'helpers';
// interfaces
import { EventType } from 'interfaces';
// services
import { getEventData } from 'services/events';
// styles
import { colors, fluidFont } from 'styles/variables';

export default function Event() {
  const router = useRouter();
  const [event, setEvent] = useState<null | EventType>(null);

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
      <div className="banner container">
        <Image
          src={event.src}
          alt="0"
          width={700}
          height={700}
          style={{ width: '100%', height: 'auto' }}
          placeholder="blur"
          blurDataURL={`data:image/svg+xml;base64,${toBase64(
            shimmer('100%', '100%')
          )}`}
        />
        <div className="actions-buttons">
          <div className="icon like-button">
            <HeartIcon />
          </div>
          <div className="icon like-button">
            <UploadIcon />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12 col-md-8">
          <section className="info container">
            <p className="date">{dayAndMonth({ date: event.fromDate })}</p>
            <h3 className="title">{event.title}</h3>
            {event.sub_title && <p className="sub-title">{event.sub_title}</p>}
            {event.sponsor && <p className="sponsor">{event.sponsor}</p>}
            {event.followers && (
              <div className="followers row vertical-gutter-8">
                <div className="followers-info col-6 col-sm-4 col-lg-3">
                  {event.followers} followers
                </div>
                <div className="col-6 col-sm-4 col-md-3">
                  <Button block>Follow</Button>
                </div>
              </div>
            )}
          </section>

          <section className="when-where container">
            <h3>When and where</h3>
            <div className="row">
              <div className="when col-12 col-md-6 row vertical-gutter-8">
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

              <div className="where col-12 col-md-6 row vertical-gutter-8">
                <div className="col-3 col-sm-2">
                  <div className="icon">
                    <LocationIcon fill={colors.color2} />
                  </div>
                </div>
                <div className="col-9 col-sm-10">
                  <p className="title">Location</p>
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
            </div>
          </section>
        </div>
        <aside className="col-12 col-md-4">aside</aside>
      </div>
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
          width: 80%;
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

        .info .date,
        .info .sub-title {
          font-size: ${fluidFont.big};
          font-weight: bold;
        }

        .info .sponsor {
          color: ${colors.color2};
          font-size: ${fluidFont.big};
        }

        .info .followers-info {
          align-items: center;
          color: ${colors.grayFont};
          display: flex;
          font-size: ${fluidFont.normal};
          justify-content: center;
        }

        .when-where .icon {
          background-color: ${colors.lightGray};
          height: 40px;
          padding: 0.4rem;
        }

        .when-where .title {
          font-weight: bold;
        }

        .when-where .info {
          color: ${colors.grayFont};
        }
      `}</style>
    </Layout>
  );
}
