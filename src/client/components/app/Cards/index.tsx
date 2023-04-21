/* eslint-disable camelcase */
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
// components
import Loader from 'client/components/app/Loader';
import { CalendarIcon } from 'client/components/icons';
import { Card } from 'client/components/ui';
// helpers
import {
  formatCurrency,
  formatShortLocation,
  formatTime,
  getDateData,
  shimmer,
  toBase64,
} from 'client/helpers';
// services
import { baseURL } from 'client/services';
// styles
import { breakPoints, colors, fluidFont } from 'client/styles/variables';

interface Props {
  events?: {
    id: number | string;
    slug: string;
    title: string;
    date_start: string;
    time_start: string;
    venue_name: string;
    city: string;
    state: string | null;
    cover_image_url: string;
    ticket_smallest_price: number;
  }[];
}

export default function Cards({ events }: Props) {
  const formatDate = ({ date }: { date: string }) => {
    const d = getDateData({
      date,
      monthFormat: 'short',
      weekDayFormat: 'short',
    });
    return `${d.weekDay}, ${d.monthText} ${d.day}, ${d.year}`;
  };

  return (
    <>
      <div className="cards">
        <div className="row hg-32 vg-md-8">
          {events ? (
            events.length ? (
              events.map(
                ({
                  id,
                  slug,
                  title,
                  date_start,
                  time_start,
                  cover_image_url,
                  city,
                  state,
                  ticket_smallest_price,
                  venue_name,
                }) => (
                  <div key={id} className="card col-12 col-md-6 col-xl-3">
                    <Link href={`/event/${slug}`}>
                      <Card
                        cover={
                          cover_image_url ? (
                            <Image
                              alt="0"
                              blurDataURL={`data:image/svg+xml;base64,${toBase64(
                                shimmer('100%', '100%')
                              )}`}
                              fill
                              placeholder="blur"
                              src={`${baseURL}/media/${cover_image_url}`}
                              style={{ objectFit: 'cover' }}
                            />
                          ) : undefined
                        }
                        hoverable
                        style={{ height: '100%' }}
                      >
                        <p className="title">{title}</p>
                        <p className="date">{`${formatDate({
                          date: date_start,
                        })}, ${formatTime({
                          time: time_start,
                          timeFormat: 'short',
                        })}`}</p>
                        <p className="location">
                          {formatShortLocation({
                            location: { city, state, venue_name },
                          })}
                        </p>
                        <p className="price">
                          {ticket_smallest_price === 0
                            ? 'Free'
                            : `From ${formatCurrency(
                                ticket_smallest_price,
                                'USD'
                              )}`}
                        </p>
                      </Card>
                    </Link>
                  </div>
                )
              )
            ) : (
              <div className="empty col-12">
                <div className="empty-icon">
                  <CalendarIcon />
                </div>
                <h3>No events in your area</h3>
                <p>Try a different location</p>
              </div>
            )
          ) : (
            <Loader />
          )}
        </div>
      </div>
      <style jsx>{`
        .cards div.row {
          background-color: ${colors.lightGray};
          padding: 0.8rem;
        }

        .card .title {
          color: ${colors.black};
          font-size: ${fluidFont.big};
          font-weight: bold;
        }

        .card .date {
          color: ${colors.color1};
          font-weight: bold;
        }

        .card .location,
        .card .price {
          color: ${colors.grayFont};
          font-weight: bold;
        }

        .cards .button-container {
          align-items: center;
          display: flex;
          justify-content: center;
          width: 60%;
          margin: 1rem auto;
        }

        .empty {
          align-items: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .empty-icon {
          width: 48px;
        }

        @media (min-width: ${breakPoints.md}) {
          .cards .button-container {
            width: 40%;
          }
        }
      `}</style>
    </>
  );
}
