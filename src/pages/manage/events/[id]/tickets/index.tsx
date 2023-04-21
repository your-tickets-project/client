/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
// components
import PrivateRoute from 'client/components/app/PrivateRoute';
import DashboardLayout from 'client/components/Layouts/DashboardLayout';
import EventFormLayout from 'client/components/app/event/EventFormLayout';
import Loader from 'client/components/app/Loader';
import {
  Button,
  DatePicker,
  Form,
  FormType,
  Input,
  Modal,
  Select,
  Table,
  TextArea,
  TimePicker,
} from 'client/components/ui';
import { EditIcon, GarbageTrashIcon } from 'client/components/icons';
// helpers
import {
  formatCurrency,
  debounce,
  formatTime,
  getDateData,
} from 'client/helpers';
// hooks
import useVW from 'client/hooks/useVW';
// interfaces
import { EventTicketInfoType, ShowEventTicketInfoType } from 'interfaces';
// services
import {
  deleteEventTicket,
  getEventTicket,
  getEventTickets,
  postEventTicket,
  putEventTicket,
  putPublishEvent,
} from 'client/services/event.service';
// styles
import { breakPointsPX, colors } from 'client/styles/variables';

interface DataSource extends ShowEventTicketInfoType {
  key: string | number;
}

interface FormValues {
  description?: string;
  maximum_quantity: number;
  minimum_quantity: number;
  name: string;
  price: number;
  quantity: number;
  sales_end: string;
  sales_start: string;
  time_end: string;
  time_start: string;
  visibility: string;
}

// eslint-disable-next-line no-unused-vars
enum TYPES_STATES {
  // eslint-disable-next-line no-unused-vars
  PAID = 'paid',
  // eslint-disable-next-line no-unused-vars
  FREE = 'free',
}

// eslint-disable-next-line no-unused-vars
enum ACTION_STATES {
  // eslint-disable-next-line no-unused-vars
  ADD = 'Add',
  // eslint-disable-next-line no-unused-vars
  DELETE = 'Delete',
  // eslint-disable-next-line no-unused-vars
  EDIT = 'Edit',
}

export default function TicketsPage() {
  return (
    <PrivateRoute>
      <DashboardLayout>
        <TicketsWrapper />
      </DashboardLayout>
    </PrivateRoute>
  );
}

const TicketsWrapper = () => {
  const router = useRouter();
  const vw = useVW();

  // booleans
  const [isLoading, setIsLoading] = useState(true);
  const [isShowModal, setIsShowModal] = useState(false);
  // data
  const [eventInfo, setEventInfo] = useState<{
    id: string | number;
    is_available: number;
  }>();
  const [data, setData] = useState<DataSource[]>([]);
  const [ticketAction, setTicketAction] = useState<{
    action: ACTION_STATES;
    name?: string;
    ticketId?: number;
  }>({ action: ACTION_STATES.ADD });

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (!router.isReady) return;

    const queryAPI = async () => {
      const { id } = router.query;
      try {
        const res = await getEventTickets({ eventId: id as string });
        setEventInfo({ id: res.data.id, is_available: res.data.is_available });
        setData(
          res.data.event_tickets_info.map((ticket) => ({
            ...ticket,
            key: ticket.id,
          }))
        );
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'Internal server error.');

        setTimeout(() => {
          router.replace('/dashboard/events');
        }, 3000);
      }
    };
    queryAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, router.isReady]);

  if (!eventInfo) {
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

  const handleDeleteConfirm = async () => {
    if (!ticketAction.ticketId) return;

    try {
      const res = await deleteEventTicket({
        eventId: eventInfo.id,
        ticketId: ticketAction.ticketId,
      });
      if (eventInfo.is_available && data.length - 1 === 0) {
        await putPublishEvent({
          eventId: eventInfo.id as string,
          data: { is_available: false },
        });
      }

      toast.success(res.data.message);
      setData((state) =>
        state.filter(({ id }) => id !== ticketAction.ticketId)
      );
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Internal server error.');
    }
    setIsShowModal(false);
  };

  return (
    <EventFormLayout>
      <div className="container">
        <div className="row hg-48">
          {vw >= breakPointsPX.md && (
            <div className="col-12">
              <h1>Tickets</h1>
            </div>
          )}
          <div className="col-12">
            <Button
              block
              type="primary"
              onClick={() => {
                setTicketAction({
                  action: ACTION_STATES.ADD,
                  name: undefined,
                  ticketId: undefined,
                });
                setIsShowModal(true);
              }}
            >
              Add tickets
            </Button>
          </div>
          <div className="col-12">
            <Table
              columns={[
                { key: 1, dataIndex: 'name', title: 'Name' },
                {
                  key: 2,
                  dataIndex: 'saleDate',
                  title: 'Sale date',
                  render(_, record: DataSource) {
                    const nowDate = new Date();
                    const startDate = new Date(
                      `${record.sales_start.split('T')[0]}T${record.time_start}`
                    );
                    const endDate = new Date(
                      `${record.sales_end.split('T')[0]}T${record.time_end}`
                    );

                    const status = {
                      started: {
                        color: 'green',
                        name: 'On sale',
                        text: 'Ends',
                      },
                      ended: {
                        color: 'gray',
                        name: 'Ended',
                        text: '',
                      },
                      scheduled: {
                        color: 'yellow',
                        name: 'Scheduled',
                        text: 'Starts',
                      },
                    };

                    let type: 'scheduled' | 'started' | 'ended' = 'scheduled';
                    if (nowDate >= startDate) type = 'started';
                    if (nowDate >= endDate) type = 'ended';

                    let text = '';
                    if (type === 'scheduled') {
                      text = 'Starts';
                      if (nowDate.getDate() === startDate.getDate()) {
                        text += ' today';
                      } else {
                        const { monthText, day, year } = getDateData({
                          date: `${record.sales_start.split('T')[0]}T${
                            record.time_start
                          }`,
                          monthFormat: 'short',
                        });

                        text += ` on ${monthText} ${day}, ${year}`;
                      }

                      text += ` at ${formatTime({
                        time: record.time_start,
                        timeFormat: 'short',
                      })}`;
                    }

                    if (type === 'started') {
                      text = 'Ends';
                      if (nowDate.getDate() === startDate.getDate()) {
                        text += ' today';
                      } else {
                        const { monthText, day, year } = getDateData({
                          date: `${record.sales_end.split('T')[0]}T${
                            record.time_end
                          }`,
                          monthFormat: 'short',
                        });

                        text += ` ${monthText} ${day}, ${year}`;
                      }

                      text += ` at ${formatTime({
                        time: record.time_end,
                        timeFormat: 'short',
                      })}`;
                    }

                    if (type === 'ended') {
                      text = 'Ended';
                      const { monthText, day, year } = getDateData({
                        date: `${record.sales_end.split('T')[0]}T${
                          record.time_end
                        }`,
                        monthFormat: 'short',
                      });

                      text += ` ${monthText} ${day}, ${year}`;
                      text += ` at ${formatTime({
                        time: record.time_end,
                        timeFormat: 'short',
                      })}`;
                    }

                    return (
                      <>
                        <p style={{ margin: '0 0 8px' }}>
                          <span
                            style={{
                              backgroundColor: status[type].color,
                              borderRadius: '50%',
                              display: 'inline-block',
                              height: '10px',
                              marginRight: '8px',
                              width: '10px',
                            }}
                          />{' '}
                          {status[type].name}
                        </p>
                        <p style={{ margin: '0' }}>{text}</p>
                      </>
                    );
                  },
                },
                { key: 3, dataIndex: 'visibility', title: 'Visibility' },
                {
                  key: 4,
                  dataIndex: 'sold',
                  title: 'Sold',
                  render(value, record: DataSource) {
                    return `${value} / ${record.quantity}`;
                  },
                },
                {
                  key: 5,
                  dataIndex: 'price',
                  title: 'Price',
                  render(value: number, record: DataSource) {
                    return record.type === TYPES_STATES.FREE
                      ? 'Free'
                      : formatCurrency(value, 'USD');
                  },
                },
                {
                  key: 6,
                  dataIndex: 'actions',
                  title: 'Actions',
                  render(_, record: DataSource) {
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
                            onClick={() => {
                              setTicketAction({
                                action: ACTION_STATES.EDIT,
                                name: undefined,
                                ticketId: record.id,
                              });
                              setIsShowModal(true);
                            }}
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
                              setTicketAction({
                                action: ACTION_STATES.DELETE,
                                name: record.name,
                                ticketId: record.id,
                              });
                              setIsShowModal(true);
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
          </div>
        </div>
      </div>
      <Modal
        bodyStyle={{
          height:
            ticketAction.action === ACTION_STATES.DELETE ? '30vh' : '70vh',
          overflowY: 'auto',
        }}
        contentStyle={{ maxWidth: '800px' }}
        footer={ticketAction.action === ACTION_STATES.DELETE ? undefined : null}
        isShowModal={isShowModal}
        title={<h3>{ticketAction.action} Ticket</h3>}
        onCancel={() => setIsShowModal(false)}
        onConfirm={
          ticketAction.action === ACTION_STATES.DELETE
            ? debounce(handleDeleteConfirm, 800)
            : undefined
        }
      >
        {ticketAction.action === ACTION_STATES.DELETE ? (
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
              Are you sure you want to delete {ticketAction.name}? This action
              cannot be undone.
            </p>
          </div>
        ) : (
          <EditUpdateForm
            eventId={eventInfo.id}
            ticketId={ticketAction.ticketId}
            onAfterFinish={() => setIsShowModal(false)}
          />
        )}
      </Modal>
    </EventFormLayout>
  );
};

const EditUpdateForm = ({
  eventId,
  ticketId,
  onAfterFinish,
}: {
  eventId: number | string;
  ticketId?: number | string;
  onAfterFinish: () => void;
}) => {
  const router = useRouter();

  // booleans
  const [isLoading, setIsLoading] = useState(true);
  const [checkInitialValues, setCheckInitialValues] = useState(false);
  const [isSending, setIsSending] = useState(false);
  // data
  const [form, setForm] = useState<FormType>();
  const [formValues, setFormValues] = useState<EventTicketInfoType>();
  const [type, setType] = useState<TYPES_STATES>(TYPES_STATES.PAID);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (ticketId === undefined) {
      setCheckInitialValues(true);
      return;
    }

    const queryAPI = async () => {
      try {
        const res = await getEventTicket({ eventId, ticketId });
        const { event_ticket_info } = res.data;
        setFormValues({
          ...event_ticket_info,
          sales_start: event_ticket_info.sales_start.split('T')[0],
          sales_end: event_ticket_info.sales_end.split('T')[0],
        });
        setType(event_ticket_info.type as TYPES_STATES);
        setCheckInitialValues(true);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'Internal server error.');
        onAfterFinish();
      }
    };
    queryAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const handleFinish = debounce(async (values: FormValues) => {
    if (type === TYPES_STATES.PAID && values.price === 0) return;

    setIsSending(true);
    try {
      const payload = {
        data: {
          ...values,
          price: type === TYPES_STATES.FREE ? 0 : values.price,
          type,
        },
        eventId,
      };
      if (ticketId === undefined) {
        const res = await postEventTicket(payload);
        toast.success(res.data.message);
      } else {
        const res = await putEventTicket({
          ...payload,
          ticketId,
        });
        toast.success(res.data.message);
      }

      setTimeout(() => {
        router.reload();
      }, 3000);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Internal server error.');
      onAfterFinish();
    }
  }, 800);

  if (!checkInitialValues) {
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

  return (
    <Form
      extraOffsetTop={95}
      initialValues={
        formValues
          ? { ...formValues, description: formValues.description || '' }
          : { visibility: 'visible' }
      }
      parentScrollToSelector={'.ui-modal_body'}
      onFinish={handleFinish}
      onForm={setForm}
    >
      <div className="container">
        <div className="row hg-24">
          <div className="col-12 row hg-16 vg-sm-16">
            <div className="col-12 col-sm-6">
              <Button
                block
                style={
                  type === TYPES_STATES.PAID
                    ? { borderColor: colors.color2, color: colors.color2 }
                    : undefined
                }
                onClick={() => {
                  form?.setFieldValue('price', '', true);
                  setType(TYPES_STATES.PAID);
                }}
              >
                Paid
              </Button>
            </div>
            <div className="col-12 col-sm-6">
              <Button
                block
                style={
                  type === TYPES_STATES.FREE
                    ? { borderColor: colors.color2, color: colors.color2 }
                    : undefined
                }
                onClick={() => {
                  form?.setFieldValue('price', '', false);
                  setType(TYPES_STATES.FREE);
                }}
              >
                Free
              </Button>
            </div>
          </div>

          <div className="col-12 row">
            <div className="col-12">
              <Form.Item
                label="Name"
                name="name"
                rules={{
                  required: true,
                  max: 50,
                }}
              >
                <Input />
              </Form.Item>
            </div>

            <div className="col-12">
              <Form.Item
                label="Available quantity"
                name="quantity"
                rules={{
                  required: true,
                  type: 'number',
                  message: 'Available quantity must be a number',
                  max: 500_000,
                  min: 1,
                }}
              >
                <Input />
              </Form.Item>
            </div>

            <div className="col-12">
              <Form.Item
                label="Price"
                name="price"
                rules={
                  type === TYPES_STATES.FREE
                    ? {
                        disabled: true,
                      }
                    : {
                        required: true,
                        type: 'number',
                        message: 'Price must be a number',
                        max: 1_000_000,
                        min: 1,
                      }
                }
              >
                <Input step="0.01" />
              </Form.Item>
            </div>

            <div className="col-12 row">
              <div className="col-12 col-sm-6">
                <Form.Item
                  label="Sales starts"
                  name="sales_start"
                  rules={{
                    required: true,
                  }}
                >
                  <DatePicker />
                </Form.Item>
              </div>
              <div className="col-12 col-sm-6">
                <Form.Item
                  label="Start time"
                  name="time_start"
                  rules={{
                    required: true,
                  }}
                >
                  <TimePicker />
                </Form.Item>
              </div>
            </div>

            <div className="col-12 row">
              <div className="col-12 col-sm-6">
                <Form.Item
                  label="Sales ends"
                  name="sales_end"
                  rules={{
                    required: true,
                    validator(value: string, formValues: FormValues) {
                      if (
                        formValues.sales_start &&
                        formValues.time_start &&
                        formValues.time_end
                      ) {
                        const startDate = new Date(
                          `${formValues.sales_start}T${formValues.time_start}`
                        );
                        const endDate = new Date(
                          `${value}T${formValues.time_end}`
                        );

                        if (startDate >= endDate) {
                          return {
                            isValid: false,
                            message:
                              'Start date can not be greater than or equal to End date',
                          };
                        }

                        const nowDate = new Date();
                        if (nowDate >= endDate) {
                          return {
                            isValid: false,
                            message: 'End date cannot be in the past',
                          };
                        }
                      }
                      return {
                        isValid: true,
                      };
                    },
                  }}
                >
                  <DatePicker />
                </Form.Item>
              </div>
              <div className="col-12 col-sm-6">
                <Form.Item
                  label="End time"
                  name="time_end"
                  rules={{
                    required: true,
                  }}
                >
                  <TimePicker />
                </Form.Item>
              </div>
            </div>

            <div className="col-12">
              <Form.Item
                label="Description"
                name="description"
                rules={{ max: 2500 }}
              >
                <TextArea
                  style={{
                    height: '68px',
                    resize: 'none',
                  }}
                />
              </Form.Item>
            </div>
            <div className="col-12">
              <Form.Item label="Visibility" name="visibility">
                <Select
                  options={[
                    { key: 1, label: 'Visible', value: 'visible' },
                    { key: 2, label: 'Hidden', value: 'hidden' },
                  ]}
                />
              </Form.Item>
            </div>

            <div className="col-12 row vg-sm-8">
              <div className="col-12">
                <p
                  style={{
                    fontWeight: 'bold',
                    marginBottom: '8px',
                    marginTop: '0',
                  }}
                >
                  Tickets per order
                </p>
              </div>
              <div className="col-12 col-sm-6">
                <Form.Item
                  label="Minimun quantity"
                  name="minimum_quantity"
                  rules={{
                    required: true,
                    type: 'number',
                    message: 'Minimum quantity must be a number',
                    max: 100,
                    min: 1,
                    validator(value: number, formValues: FormValues) {
                      if (value > formValues.maximum_quantity) {
                        return {
                          isValid: false,
                          message:
                            'Minimum quantity must be less than or equal to max',
                        };
                      }

                      return { isValid: true };
                    },
                  }}
                >
                  <Input />
                </Form.Item>
              </div>
              <div className="col-12 col-sm-6">
                <Form.Item
                  label="Maximum quantity"
                  name="maximum_quantity"
                  rules={{
                    required: true,
                    type: 'number',
                    message: 'Maximum quantity must be a number',
                    max: 100,
                    min: 1,
                    validator(value: number, formValues: FormValues) {
                      if (value < formValues.minimum_quantity) {
                        return {
                          isValid: false,
                          message:
                            'Maximum quantity must be greater than or equal to min',
                        };
                      }

                      return { isValid: true };
                    },
                  }}
                >
                  <Input />
                </Form.Item>
              </div>
            </div>

            <div className="col-12">
              <Button
                block
                disabled={isSending}
                htmlType="submit"
                style={{ marginTop: '1rem' }}
                type="primary"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
};
