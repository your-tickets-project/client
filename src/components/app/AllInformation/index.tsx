import React, { useEffect, useState } from 'react';
import Image from 'next/image';
// components
import {
  ControlIcon,
  GlassIcon,
  HandBagIcon,
  HeartIcon,
  MaskIcon,
  MusicIcon,
  PhotoIcon,
  ShoesIcon,
} from 'components/icons';
import { Button, Card } from 'components/ui';
// helpers
import { shimmer, toBase64 } from 'helpers';
// interfaces
import { EventType } from 'interfaces';
// services
import { getEventsData } from 'services/events';
// styles
import { breakPoints, colors, fluidFont } from 'styles/variables';
import Link from 'next/link';

const categoryCards = [
  {
    key: 1,
    title: 'Music',
    Icon: MusicIcon,
  },
  {
    key: 2,
    title: 'Performing & visual art',
    Icon: MaskIcon,
  },
  {
    key: 3,
    title: 'Holiday',
    Icon: PhotoIcon,
  },
  {
    key: 4,
    title: 'Health',
    Icon: HeartIcon,
  },
  {
    key: 5,
    title: 'Hobbies',
    Icon: ControlIcon,
  },
  {
    key: 6,
    title: 'Business',
    Icon: HandBagIcon,
  },
  {
    key: 7,
    title: 'Food & Drink',
    Icon: GlassIcon,
  },
  {
    key: 8,
    title: 'Sports & Fitness',
    Icon: ShoesIcon,
  },
];

export default function AllInformation() {
  const [events, setEvents] = useState<EventType[]>([]);

  useEffect(() => {
    const queryAPI = async () => {
      try {
        const res = await getEventsData();
        setEvents(res.data);
      } catch (error) {
        // console.log(error);
      }
    };
    queryAPI();
  }, []);

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
    const time = d.toLocaleTimeString();

    return `${weekDay}, ${month} ${day}, ${time.toUpperCase()}`;
  };

  return (
    <>
      <h3>Check out treding categories</h3>
      <div className="category-cards row vertical-gutter-8 horizontal-gutter-8">
        {categoryCards.map(({ key, Icon, title }) => (
          <div key={key} className="category-card col-12 col-md-3 row">
            <div className="icon-container col-2 col-md-4">
              <div className="icon">
                <Icon fill={colors.color1} />
              </div>
            </div>
            <div className="title col-10 col-md-8">{title}</div>
          </div>
        ))}
      </div>

      <section className="cards">
        <h3>Events in Mexico</h3>
        <div className="row horizontal-gutter-32 vertical-gutter-8">
          {events.map(({ src, title, fromDate, location, price, slug }, i) => (
            <div key={`${src}-${i}`} className="card col-12 col-md-6 col-xl-3">
              <Link href={`/event/${slug}`}>
                <Card
                  cover={
                    src ? (
                      <Image
                        src={src}
                        alt="0"
                        width={700}
                        height={700}
                        style={{ width: '100%', height: 'auto' }}
                        placeholder="blur"
                        blurDataURL={`data:image/svg+xml;base64,${toBase64(
                          shimmer('100%', '100%')
                        )}`}
                      />
                    ) : undefined
                  }
                  hoverable
                  style={{ height: '100%' }}
                >
                  <p className="title">{title}</p>
                  <p className="date">{formatDate({ date: fromDate })}</p>
                  <p className="location">{location}</p>
                  <p className="price">{price}</p>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="cards">
        <h3>More events</h3>
        <div className="row horizontal-gutter-32 vertical-gutter-8">
          {events.map(({ src, title, fromDate, location, price, slug }, i) => (
            <div key={`${src}-${i}`} className="card col-12 col-md-6 col-xl-3">
              <Link href={`/event/${slug}`}>
                <Card
                  cover={
                    src ? (
                      <Image
                        src={src}
                        alt="0"
                        width={700}
                        height={700}
                        style={{ width: '100%', height: 'auto' }}
                        placeholder="blur"
                        blurDataURL={`data:image/svg+xml;base64,${toBase64(
                          shimmer('100%', '100%')
                        )}`}
                      />
                    ) : undefined
                  }
                  hoverable
                  style={{ height: '100%' }}
                >
                  <p className="title">{title}</p>
                  <p className="date">{formatDate({ date: fromDate })}</p>
                  <p className="location">{location}</p>
                  <p className="price">{price}</p>
                </Card>
              </Link>
            </div>
          ))}
        </div>
        <div className="button-container">
          <Button block>See More</Button>
        </div>
      </section>
      <style jsx>{`
        h3 {
          margin-bottom: 2rem;
        }

        section {
          margin-bottom: 2rem;
        }

        .category-cards {
          margin-bottom: 2rem;
        }

        .category-card {
          cursor: pointer;
        }

        .category-card .icon-container {
          align-items: center;
          background-color: #fdf7f5;
          display: flex;
          justify-content: center;
        }

        .category-card .icon {
          align-items: center;
          display: flex;
          height: 80%;
          justify-content: center;
          width: 80%;
        }

        .category-card .title {
          align-items: center;
          background-color: ${colors.lightGray};
          color: ${colors.lightBlack};
          display: flex;
          font-size: ${fluidFont.small};
          font-weight: bold;
          height: 100%;
          padding: 1rem;
        }

        @media (min-width: ${breakPoints.sm}) {
          .category-card .icon {
            height: 50%;
            width: 50%;
          }
        }

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
