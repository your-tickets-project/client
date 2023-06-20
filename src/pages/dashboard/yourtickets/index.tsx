import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
// components
import PrivateRoute from 'client/components/app/PrivateRoute';
import DashboardLayout from 'client/components/Layouts/DashboardLayout';
import Loader from 'client/components/app/Loader';
import { Button, Input, Table } from 'client/components/ui';
import { EyeIcon, PhotoIcon, SearchIcon } from 'client/components/icons';
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
// services
import { baseURL } from 'client/services';
// styles
import { breakPointsPX, colors } from 'client/styles/variables';
import { getTickets } from 'client/services/ticket.service';

interface DataType {
  id: string | number;
  unique_id: string | number;
  event_id: string | number;
  title: string;
  cover_image_url: string;
  date_start: string;
  time_start: string;
  total: string | number;
  purchase_date: string;
  purchase_time: string;
}

export default function DashboardYourTicketsPage() {
  return (
    <PrivateRoute>
      <DashboardLayout>
        <DashboardYourTicketsPageWrapper />
      </DashboardLayout>
    </PrivateRoute>
  );
}

const DashboardYourTicketsPageWrapper = () => {
  const router = useRouter();
  const vw = useVW();

  // booleans
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  // data
  const [data, setData] = useState<DataType[]>();
  const [query, setQuery] = useState('');

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (!router.isReady) return;

    const queryAPI = async () => {
      setIsSearching(true);
      try {
        const res = await getTickets({ query });
        setData(res.data.map((e) => ({ ...e, key: e.id })));
        setIsSearching(false);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'Internal server error.');

        setTimeout(() => {
          router.replace('/');
        }, 3000);
      }
    };
    queryAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, router.isReady, query]);

  const formatDate = ({ date }: { date: string }) => {
    const d = getDateData({
      date,
      monthFormat: 'short',
      weekDayFormat: 'short',
    });
    return `${d.weekDay}, ${d.monthText} ${d.day}, ${d.year}`;
  };

  const Loading = () => (
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

  if (!data) {
    return <Loading />;
  }

  const handleSearch = debounce(
    (e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value),
    800
  );

  return (
    <>
      <section className="container row hg-16 vg-md-8">
        <h1 className="col-12">Your tickets</h1>
        <div className="col-12 col-md-5">
          <Input
            placeholder="Search by order number or event title"
            addonBefore={<SearchIcon />}
            style={{ height: '32px' }}
            onChange={handleSearch}
          />
        </div>
      </section>
      <section className="container">
        {isSearching ? (
          <Loading />
        ) : (
          <Table
            columns={[
              {
                key: 1,
                dataIndex: 'order',
                title: 'Order',
                render(_, record: DataType) {
                  return (
                    <Link
                      href={`/dashboard/yourtickets/${record.unique_id}`}
                      legacyBehavior
                    >
                      <a>
                        <div className="row hg-8 hg-md-0 vg-md-8">
                          {vw >= breakPointsPX.md && (
                            <div className="col-md-3 col-lg-2">
                              <div className="ticket_image-container">
                                {record.cover_image_url ? (
                                  <Image
                                    alt="0"
                                    blurDataURL={`data:image/svg+xml;base64,${toBase64(
                                      shimmer('100%', '100%')
                                    )}`}
                                    fill
                                    placeholder="blur"
                                    src={`${baseURL}/media/${record.cover_image_url}`}
                                    style={{ objectFit: 'cover' }}
                                  />
                                ) : (
                                  <div className="event_image-blank">
                                    <PhotoIcon />
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          <div className="col-12 col-md-9 col-lg-10">
                            <p className="event_title">{record.title}</p>
                            <p className="event_date">
                              {formatDate({ date: record.date_start })} at{' '}
                              {formatTime({
                                time: record.time_start,
                                timeFormat: 'short',
                              })}
                            </p>
                            <p className="ticket_purchase-date">
                              Order #{record.unique_id} of (
                              {formatCurrency(+record.total, 'USD')}) purchased
                              on {formatDate({ date: record.purchase_date })} at{' '}
                              {formatTime({
                                time: record.time_start,
                                timeFormat: 'short',
                              })}
                            </p>
                          </div>
                        </div>
                      </a>
                    </Link>
                  );
                },
              },
              {
                key: 5,
                dataIndex: 'action',
                title: 'Actions',
                render(_, record: any) {
                  const style = {
                    width: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  };

                  return (
                    <Button
                      block
                      onClick={() =>
                        router.push(
                          `/dashboard/yourtickets/${record.unique_id}`
                        )
                      }
                    >
                      <div style={style}>
                        <EyeIcon />
                      </div>
                    </Button>
                  );
                },
              },
            ]}
            dataSource={data}
            style={{ whiteSpace: 'nowrap' }}
          />
        )}
      </section>
      <style jsx>{`
        section {
          margin-bottom: 2rem;
        }

        section:first-of-type {
          margin-top: 2rem;
        }

        .ticket_image-container {
          align-items: center;
          background-color: ${colors.lightGray};
          display: flex;
          height: 100%;
          justify-content: center;
          position: relative;
          width: 100%;
        }

        .ticket_image-blank {
          width: 30px;
        }

        .event_title {
          font-weight: bold;
          margin: 0 0 8px;
          white-space: normal;
        }

        .event_date,
        .ticket_purchase-date {
          color: ${colors.grayFont};
          margin: 0;
          white-space: normal;
        }

        .event_date {
          margin-bottom: 0.5rem;
        }
      `}</style>
    </>
  );
};
