import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
// components
import { Card } from 'client/components/ui';
import Loader from 'client/components/app/Loader';
// helpers
import {
  currencyFormat,
  formatDate,
  formatShortLocation,
  formatTime,
  shimmer,
  toBase64,
} from 'client/helpers';
// interfaces
import { EventType } from 'interfaces';
// services
import { baseURL } from 'client/services';
// styles
import { breakPoints, colors, fluidFont } from 'client/styles/variables';

interface Props {
  events: EventType[];
}

export default function Cards({ events }: Props) {
  return (
    <>
      <div className="cards">
        <div className="row hg-32 vg-md-8">
          {events.length ? (
            events.map(
              ({
                event_detail: { cover_image_url: coverImageUrl },
                date_start: dateStart,
                event_location: location,
                event_ticket_info: eventTicketInfo,
                id,
                slug,
                title,
                time_start: timeStart,
              }) => (
                <div key={id} className="card col-12 col-md-6 col-xl-3">
                  <Link href={`/event/${slug}`}>
                    <Card
                      cover={
                        coverImageUrl ? (
                          <Image
                            alt="0"
                            blurDataURL={`data:image/svg+xml;base64,${toBase64(
                              shimmer('100%', '100%')
                            )}`}
                            fill={true}
                            placeholder="blur"
                            src={`${baseURL}/media/${coverImageUrl}`}
                            style={{ objectFit: 'cover' }}
                          />
                        ) : undefined
                      }
                      hoverable
                      style={{ height: '100%' }}
                    >
                      <p className="title">{title}</p>
                      <p className="date">{`${formatDate({
                        date: dateStart,
                      })}, ${formatTime({ time: timeStart })}`}</p>
                      <p className="location">
                        {formatShortLocation({ location })}
                      </p>
                      <p className="price">
                        {eventTicketInfo.type === 'free'
                          ? 'Free'
                          : currencyFormat(eventTicketInfo.price, 'USD')}
                      </p>
                    </Card>
                  </Link>
                </div>
              )
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

        @media (min-width: ${breakPoints.md}) {
          .cards .button-container {
            width: 40%;
          }
        }
      `}</style>
    </>
  );
}
