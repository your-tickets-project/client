/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import toast from 'react-hot-toast';
// components
import DashboardLayout from 'client/components/Layouts/DashboardLayout';
import PrivateRoute from 'client/components/app/PrivateRoute';
import Loader from 'client/components/app/Loader';
import CancelOrderModal from 'client/components/app/CancelOrderModal';
import { Button, Input, Table } from 'client/components/ui';
import {
  EditIcon,
  GarbageTrashIcon,
  SearchIcon,
} from 'client/components/icons';
// helpers
import {
  debounce,
  formatCurrency,
  formatTime,
  getDateData,
} from 'client/helpers';
// services
import { deleteOrder, getOrders } from 'client/services/orders.service';
// styles
import { colors } from 'client/styles/variables';

interface DataType {
  key: string | number;
  unique_id: string | number;
  event_id: string | number;
  event: string;
  buyer: string;
  date: string;
  total: string | number;
}

export default function DashboardOrdersPage() {
  return (
    <PrivateRoute>
      <DashboardLayout>
        <DashboardOrdersPageWrapper />
      </DashboardLayout>
    </PrivateRoute>
  );
}

const DashboardOrdersPageWrapper = () => {
  const router = useRouter();

  // booleans
  const [isLoading, setIsLoading] = useState(true);
  const [isShowModal, setIsShowModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  // data
  const [data, setData] = useState<DataType[]>();
  const [ids, setIds] = useState<{
    eventId: string | number;
    id: string | number;
  }>();
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
        const res = await getOrders({ query });
        setData(
          res.data.map((order) => {
            const d = getDateData({
              date: order.purchase_date,
              monthFormat: 'short',
              weekDayFormat: 'short',
            });

            return {
              key: order.id,
              id: order.id,
              unique_id: order.unique_id,
              event_id: order.event_id,
              event: order.title,
              buyer: `${order.first_name} ${order.last_name}`,
              date: `${d.monthText} ${d.monthNumber}, ${formatTime({
                time: order.purchase_time,
                timeFormat: 'short',
              })}`,
              total: formatCurrency(+order.total, 'USD'),
            };
          })
        );
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

  const handleCancelOrder = async ({
    eventId,
    id,
  }: {
    eventId: string | number;
    id: string | number;
  }) => {
    try {
      const res = await deleteOrder({ eventId, id });

      setData((state) => state?.filter((e) => e.unique_id !== id));
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

  if (!data) {
    return <Loading />;
  }

  return (
    <>
      <section className="container row hg-16 vg-md-8">
        <h1 className="col-12">Orders</h1>
        <div className="col-12 col-md-5">
          <Input
            placeholder="Search by order number, event title or buyer name"
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
                      href={`/dashboard/orders/${record.event_id}/${record.unique_id}`}
                      legacyBehavior
                    >
                      <a className="link-order-id">
                        <p>#{record.unique_id}</p>
                      </a>
                    </Link>
                  );
                },
              },
              {
                key: 2,
                dataIndex: 'event',
                title: 'Event',
              },
              {
                key: 3,
                dataIndex: 'buyer',
                title: 'Buyer',
              },
              {
                key: 4,
                dataIndex: 'date',
                title: 'Date',
              },
              {
                key: 5,
                dataIndex: 'total',
                title: 'Total',
              },
              {
                key: 6,
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
                            router.push(
                              `/dashboard/orders/${record.event_id}/${record.unique_id}`
                            )
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
                          onClick={() => {
                            setIsShowModal(true);
                            setIds({
                              eventId: record.event_id,
                              id: record.unique_id,
                            });
                          }}
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
        )}
      </section>
      <CancelOrderModal
        showModal={isShowModal}
        ids={ids}
        handleCancelOrder={handleCancelOrder}
        onCancel={() => setIsShowModal(false)}
      />
      <style jsx>{`
        section {
          margin-bottom: 2rem;
        }

        section:first-of-type {
          margin-top: 2rem;
        }

        .link-order-id {
          color: ${colors.color2};
        }

        @media (hover: hover) {
          .link-order-id:hover {
            text-decoration: underline;
          }
        }
      `}</style>
    </>
  );
};
