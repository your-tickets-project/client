import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
// components
import Cards from 'client/components/app/Cards';
import { Button } from 'client/components/ui';
import {
  ControlIcon,
  GlassIcon,
  HandBagIcon,
  HeartIcon,
  MaskIcon,
  MusicIcon,
  PhotoIcon,
  ShoesIcon,
} from 'client/components/icons';
// services
import { getEvents } from 'client/services/event.service';
// styles
import { breakPoints, colors, fluidFont } from 'client/styles/variables';

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
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<
    {
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
    }[]
  >();

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const queryAPI = async () => {
      try {
        const res = await getEvents();
        setEvents(res.data.events);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'Internal server error.');
      }
    };
    queryAPI();
  }, [isLoading]);

  return (
    <>
      <h3>Check out treding categories</h3>
      <div className="category-cards row vg-8 hg-8">
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

      <section>
        <h3>Events in Mexico</h3>
        <Cards events={events} />
      </section>

      <section>
        <h3>More events</h3>
        <Cards events={events} />
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
      `}</style>
    </>
  );
}
