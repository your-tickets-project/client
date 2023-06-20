import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
// components
import PrivateRoute from 'client/components/app/PrivateRoute';
import DashboardLayout from 'client/components/Layouts/DashboardLayout';
import Loader from 'client/components/app/Loader';
import { Button, Input, Modal, Select, Table } from 'client/components/ui';
import {
  EditIcon,
  GarbageTrashIcon,
  PhotoIcon,
  SearchIcon,
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
// services
import { baseURL } from 'client/services';
import {
  deleteEventDashboard,
  getEventsDashboard,
} from 'client/services/event.service';
// styles
import { breakPointsPX, colors } from 'client/styles/variables';

interface DataType {
  key: string | number;
  id: number;
  date_start: string;
  time_start: string;
  date_end: string;
  time_end: string;
  title: string;
  is_available: number;
  cancelled: number;
  venue_name: string;
  include_event_detail: number;
  cover_image_url: string | null;
  include_event_ticket_info: number;
  total_sold: number | null;
  total_quantity: number | null;
}

export default function DashboardEventsPage() {
  return (
    <PrivateRoute>
      <DashboardLayout>
        <DashboardEventsPageWrapper />
      </DashboardLayout>
    </PrivateRoute>
  );
}

const DashboardEventsPageWrapper = () => {
  const router = useRouter();
  const vw = useVW();
  // booleans
  const [isLoading, setIsLoading] = useState(true);
  const [isShowModal, setIsShowModal] = useState(false);
  // data
  const [data, setData] = useState<DataType[]>();
  const [event, setEvent] = useState<{ id: string | number; title: string }>();
  const [query, setQuery] = useState('');

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (!router.isReady) return;

    const queryAPI = async () => {
      try {
        const res = await getEventsDashboard({ query });
        setData(res.data.map((e) => ({ ...e, key: e.id })));
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

  if (!data) {
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

  const handleDelete = async ({ eventId }: { eventId: string | number }) => {
    try {
      const res = await deleteEventDashboard({ eventId });

      setData((state) =>
        state?.map((e) =>
          e.id === eventId ? { ...e, cancelled: 1, is_available: 0 } : e
        )
      );
      toast.success(res.data.message);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Internal server error.');
    }
    setIsShowModal(false);
  };

  const handleSearch = debounce(
    (e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value),
    800
  );

  return (
    <>
      <section className="container row hg-16 vg-md-8">
        <h1 className="col-12">Events</h1>
        <div className="col-12 col-md-4">
          <Input
            placeholder="Search events by event title or venue name"
            addonBefore={<SearchIcon />}
            style={{ height: '32px' }}
            onChange={handleSearch}
          />
        </div>
        <div className="col-12 col-md-4">
          <Select
            value="all"
            options={[
              { key: 1, label: 'Upcoming Events', value: 'upcoming' },
              { key: 2, label: 'Draft', value: 'draft' },
              { key: 3, label: 'Past Events', value: 'past' },
              { key: 4, label: 'All Events', value: 'all' },
            ]}
          />
        </div>
        <div className="col-12 col-md-4">
          <Link href="/create-event">
            <Button type="primary" block style={{ height: '32px' }}>
              Create event
            </Button>
          </Link>
        </div>
      </section>
      <section className="container">
        <Table
          columns={[
            {
              key: 1,
              dataIndex: 'event',
              title: 'Event',
              render(_, record: DataType) {
                return (
                  <div className="row hg-8 hg-md-0 vg-md-8">
                    {vw >= breakPointsPX.md && (
                      <div className="col-md-3 col-lg-2">
                        <div className="event_image-container">
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
                      <p className="event_venue-name">{record.venue_name}</p>
                      <p className="event_date">
                        {formatDate({ date: record.date_start })} at{' '}
                        {formatTime({
                          time: record.time_start,
                          timeFormat: 'short',
                        })}
                      </p>
                    </div>
                  </div>
                );
              },
            },
            {
              key: 2,
              dataIndex: 'sold',
              title: 'Sold',
              render(_, record: DataType) {
                if (
                  record.total_sold === null ||
                  record.total_quantity === null
                ) {
                  return <div style={{ textAlign: 'center' }}>-</div>;
                }

                return (
                  <div>{`${record.total_sold}/${record.total_quantity}`}</div>
                );
              },
            },
            {
              key: 3,
              dataIndex: 'gross',
              title: 'Gross',
              render() {
                return formatCurrency(0, 'USD');
              },
            },
            {
              key: 4,
              dataIndex: 'status',
              title: 'Status',
              render(_, record: DataType) {
                const status = {
                  color: 'red',
                  text: 'Not published',
                };
                if (record.is_available) {
                  status.color = 'green';
                  status.text = 'Published';
                }
                if (
                  !record.include_event_detail ||
                  !record.include_event_ticket_info
                ) {
                  status.color = 'gray';
                  status.text = 'Draft';
                }

                const now = new Date();
                const eventEnd = new Date(
                  `${record.date_end.split('T')[0]}T${record.time_end}`
                );
                if (now >= eventEnd) {
                  status.color = 'gray';
                  status.text = 'Event ended';
                }

                if (record.cancelled) {
                  status.color = 'red';
                  status.text = 'Canceled';
                }

                return (
                  <p>
                    <span
                      style={{
                        backgroundColor: status.color,
                        borderRadius: '50%',
                        display: 'inline-block',
                        height: '10px',
                        marginRight: '8px',
                        width: '10px',
                      }}
                    />{' '}
                    {status.text}
                  </p>
                );
              },
            },
            {
              key: 5,
              dataIndex: 'action',
              title: 'Actions',
              render(_, record: DataType) {
                const style = {
                  width: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                };

                return (
                  <div className="row hg-8">
                    <div className="col-12">
                      <Button
                        block
                        onClick={() =>
                          router.push(`/manage/events/${record.id}/basic-info`)
                        }
                      >
                        <div style={style}>
                          <EditIcon />
                        </div>
                      </Button>
                    </div>
                    <div className="col-12">
                      <Button
                        block
                        disabled={!!record.cancelled || !record.is_available}
                        onClick={
                          !!record.cancelled || !record.is_available
                            ? undefined
                            : () => {
                                setIsShowModal(true);
                                setEvent({
                                  id: record.id,
                                  title: record.title,
                                });
                              }
                        }
                      >
                        <div style={style}>
                          <GarbageTrashIcon />
                        </div>
                      </Button>
                    </div>
                  </div>
                );
              },
            },
          ]}
          dataSource={data}
          style={{ whiteSpace: 'nowrap' }}
        />
      </section>
      <Modal
        bodyStyle={{
          height: '30vh',
          overflowY: 'auto',
        }}
        contentStyle={{ maxWidth: '800px' }}
        footer={undefined}
        isShowModal={isShowModal}
        title={<h3>Cancel Event</h3>}
        onCancel={() => {
          setIsShowModal(false);
        }}
        onConfirm={
          event
            ? debounce(() => handleDelete({ eventId: event.id }), 800)
            : undefined
        }
      >
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              alignItems: 'center',
              backgroundColor: colors.lightGray,
              borderRadius: '50%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '1rem',
              width: '80px',
            }}
          >
            <GarbageTrashIcon />
          </div>
          <p style={{ textAlign: 'center' }}>
            Are you sure you want to cancel {event?.title}? This action cannot
            be undone.
          </p>
        </div>
      </Modal>
      <style jsx>{`
        section {
          margin-bottom: 2rem;
        }

        section:first-of-type {
          margin-top: 2rem;
        }

        .event_image-container {
          align-items: center;
          background-color: ${colors.lightGray};
          display: flex;
          height: 100%;
          justify-content: center;
          position: relative;
          width: 100%;
        }

        .event_image-blank {
          width: 30px;
        }

        .event_title {
          font-weight: bold;
          margin: 0 0 8px;
          white-space: normal;
        }

        .event_venue-name,
        .event_date {
          color: ${colors.grayFont};
          margin: 0;
          white-space: normal;
        }
      `}</style>
    </>
  );
};
