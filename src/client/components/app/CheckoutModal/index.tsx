import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
// components
import { CheckCircleIcon, PhotoIcon } from 'client/components/icons';
import {
  Button,
  Divider,
  Form,
  Input,
  Modal,
  Select,
} from 'client/components/ui';
import CountDownTimer from 'client/components/app/CountDownTimer';
// helpers
import {
  formatCurrency,
  formatShortLocation,
  formatTime,
  getDateData,
  shimmer,
  toBase64,
} from 'client/helpers';
// hooks
import useVW from 'client/hooks/useVW';
// interfaces
import {
  EventBasicInfoType,
  EventDetailType,
  EventLocationType,
  EventTagType,
  EventTicketInfoType,
  NullablePartial,
} from 'interfaces';
// services
import { baseURL } from 'client/services';
// store
import { AuthSelector } from 'client/store/selectors';
// styles
import {
  breakPoints,
  breakPointsPX,
  colors,
  fluidFont,
} from 'client/styles/variables';

interface Props {
  event: EventBasicInfoType & {
    event_location: EventLocationType;
    event_detail: NullablePartial<EventDetailType>;
    event_ticket_info: EventTicketInfoType[];
    event_tag: EventTagType[];
  };
  handleShowModal: (state: boolean) => void;
  isShowModal: boolean;
}

// eslint-disable-next-line no-unused-vars
enum CHECKOUT_STATES {
  // eslint-disable-next-line no-unused-vars
  PRE_SALE = 'pre_sale',
  // eslint-disable-next-line no-unused-vars
  CHECKOUT = 'checkout',
  // eslint-disable-next-line no-unused-vars
  SUCCESS = 'success',
}

export default function CheckoutModal({
  event,
  handleShowModal,
  isShowModal,
}: Props) {
  const router = useRouter();
  const { user } = AuthSelector();
  const vw = useVW();

  // booleans
  const [isLoading, setIsLoading] = useState(true);
  const [showLeave, setShowLeave] = useState(false);
  const [timeEnd, setTimeEnd] = useState(false);
  // data
  const [checkout, setCheckout] = useState<CHECKOUT_STATES>(
    CHECKOUT_STATES.PRE_SALE
  );
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalTickets, setTotalTickets] = useState(0);
  const [tickets, setTickets] = useState<
    { id: number | string; amount: number; name: string; price: number }[]
  >([]);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    setTotalPrice(tickets.reduce((acc, t) => acc + t.price, 0));
    setTotalTickets(tickets.reduce((acc, t) => acc + t.amount, 0));
  }, [isLoading, tickets]);

  const formatDate = ({ date }: { date: string }) => {
    const d = getDateData({
      date,
      monthFormat: 'short',
      weekDayFormat: 'short',
    });
    return `${d.weekDay}, ${d.monthText} ${d.day}, ${d.year}`;
  };

  const handleFinish = async (values: any) => {
    setCheckout(CHECKOUT_STATES.SUCCESS);
  };

  const handleCloseModal = () => {
    handleShowModal(false);

    setTimeout(() => {
      setShowLeave(false);
      setTimeEnd(false);
      setCheckout(CHECKOUT_STATES.PRE_SALE);
    }, 500);
  };

  const checkReleaseDate = (ticket: EventTicketInfoType) => {
    const nowDate = new Date();
    const startDate = new Date(
      `${ticket.sales_start.split('T')[0]}T${ticket.time_start}`
    );
    const endDate = new Date(
      `${ticket.sales_end.split('T')[0]}T${ticket.time_end}`
    );

    if (nowDate < startDate) {
      let text = 'Sales start';

      if (nowDate.getDate() === startDate.getDate()) {
        text += ' today';
      } else {
        const { monthText, day, year } = getDateData({
          date: `${ticket.sales_start.split('T')[0]}T${ticket.time_start}`,
          monthFormat: 'short',
        });

        text += ` on ${monthText} ${day}, ${year}`;
      }

      text += ` at ${formatTime({
        time: ticket.time_start,
        timeFormat: 'short',
      })}`;

      return (
        <p style={{ color: colors.grayFont, fontWeight: 'bold' }}>{text}</p>
      );
    }

    if (nowDate >= endDate) {
      return (
        <p style={{ color: colors.grayFont, fontWeight: 'bold' }}>
          Sales ended
        </p>
      );
    }

    return (
      <Select
        placeholder="N° tickets"
        value={0}
        options={[
          { key: 0, value: 0, label: '0' },
          ...Array.from(
            { length: ticket.maximum_quantity },
            (_, index) => index + 1
          )
            .filter((n) => n >= ticket.minimum_quantity)
            .map((n) => ({
              key: n,
              label: `${n}`,
              value: n,
            })),
        ]}
        onChange={(e) => {
          const value = +e.target.value;
          setTickets((state) => {
            if (value === 0) {
              return state.filter((t) => t.id !== ticket.id);
            }

            const data = {
              id: ticket.id,
              amount: value,
              name: ticket.name,
              price: value * ticket.price,
            };

            const found = state.findIndex((t) => t.id === ticket.id);
            if (found === -1) {
              return [...state, data];
            }

            return state.map((t) => (t.id === ticket.id ? data : t));
          });
        }}
      />
    );
  };

  return (
    <>
      <Modal
        bodyStyle={{ padding: '0', overflowY: 'auto' }}
        footer={null}
        isShowModal={isShowModal}
        onCancel={() => {
          if (checkout === CHECKOUT_STATES.CHECKOUT) {
            setShowLeave(true);
            return;
          }
          handleCloseModal();
        }}
      >
        <div className="modal row">
          <div className="ticket-info col-12 col-md-7">
            {checkout === CHECKOUT_STATES.PRE_SALE && (
              <>
                <div className="info-container">
                  <div className="title">
                    <h4>{event.title}</h4>
                    <p style={{ color: colors.grayFont, margin: '0.2rem 0' }}>
                      {formatDate({ date: event.date_start })}
                    </p>
                    <p style={{ color: colors.grayFont, margin: '0.2rem 0' }}>
                      {`${formatTime({
                        time: event.time_start,
                        timeFormat: 'short',
                      })} - ${formatTime({
                        time: event.time_end,
                        timeFormat: 'short',
                      })}`}
                    </p>
                  </div>
                  <div className="body">
                    {event.event_ticket_info.map((ticket) =>
                      ticket.visibility === 'visible' ? (
                        <React.Fragment key={ticket.id}>
                          <div className="row vg-8">
                            <div className="col-6">
                              <p className="ticket-name">{ticket.name}</p>
                              <p>
                                {ticket.price
                                  ? formatCurrency(ticket.price, 'USD')
                                  : 'Free'}
                              </p>
                            </div>
                            <div className="col-6">
                              {checkReleaseDate(ticket)}
                            </div>
                            <div className="col-12">
                              <p className="ticket-description">
                                {ticket.description}
                              </p>
                            </div>
                          </div>
                          <Divider />
                        </React.Fragment>
                      ) : null
                    )}
                    <p className="brand">
                      Offered by <span>YourTickets</span>
                    </p>
                  </div>
                </div>
                <div className="footer">
                  <p className="price">{formatCurrency(totalPrice, 'USD')}</p>
                  <Button
                    block
                    disabled={!tickets.length}
                    type="primary"
                    onClick={
                      tickets.length
                        ? () => setCheckout(CHECKOUT_STATES.CHECKOUT)
                        : undefined
                    }
                  >
                    Checkout
                  </Button>
                </div>
              </>
            )}

            {checkout === CHECKOUT_STATES.CHECKOUT && (
              <>
                <div className="info-container">
                  <div className="title">
                    <h4 style={{ textAlign: 'center' }}>Checkout</h4>
                    <p
                      style={{
                        color: colors.grayFont,
                        margin: '0.2rem 0',
                        textAlign: 'center',
                      }}
                    >
                      <CountDownTimer
                        minutes={30}
                        preffix="Time left"
                        onTimeEnd={() => setTimeEnd(true)}
                      />
                    </p>
                  </div>
                  <div className="body">
                    <Form
                      onFinish={handleFinish}
                      initialValues={{
                        first_name: user?.first_name ?? '',
                        last_name: user?.last_name ?? '',
                        email: user?.email ?? '',
                        phone_number: '',
                      }}
                    >
                      <h4 style={{ textAlign: 'center' }}>
                        Contact information
                      </h4>
                      <div style={{ marginTop: '1rem' }} className="row vg-8">
                        <div className="col-12 col-md-6">
                          <Form.Item
                            label="First name"
                            name="first_name"
                            rules={{
                              required: true,
                            }}
                          >
                            <Input />
                          </Form.Item>
                        </div>
                        <div className="col-12 col-md-6">
                          <Form.Item
                            label="Last name"
                            name="last_name"
                            rules={{
                              required: true,
                            }}
                          >
                            <Input />
                          </Form.Item>
                        </div>
                        <div className="col-12">
                          <Form.Item
                            label="Email"
                            name="email"
                            rules={{
                              required: true,
                              type: 'email',
                            }}
                          >
                            <Input />
                          </Form.Item>
                        </div>
                        <div className="col-12">
                          <Form.Item
                            label="Phone number"
                            name="phone_number"
                            rules={{
                              required: true,
                            }}
                          >
                            <Input />
                          </Form.Item>
                        </div>
                      </div>
                      <p className="brand">
                        Offered by <span>YourTickets</span>
                      </p>
                      <div className="footer">
                        <p className="price">
                          {formatCurrency(totalPrice, 'USD')}
                        </p>
                        <Button block type="primary" htmlType="submit">
                          Register
                        </Button>
                      </div>
                    </Form>
                  </div>
                </div>
              </>
            )}

            {checkout === CHECKOUT_STATES.SUCCESS && (
              <>
                <div className="info-container">
                  <div className="title">
                    <div style={{ height: '50px' }}>
                      <CheckCircleIcon fill={colors.success} />
                    </div>
                    <h4 style={{ marginTop: '.5rem', textAlign: 'center' }}>
                      thanks for your order!
                    </h4>
                    <p
                      style={{
                        color: colors.color1,
                        fontWeight: 'bold',
                        margin: '0',
                        marginTop: '.5rem',
                        textAlign: 'center',
                      }}
                    >
                      YourTickets
                    </p>
                  </div>
                  <div className="body">
                    <p style={{ margin: '0' }}>You&apos;re going to</p>
                    <h4 style={{ marginTop: '.2rem' }}>{event.title}</h4>
                    <div style={{ marginTop: '1rem' }} className="row hg-24">
                      <div className="col-12">
                        <p style={{ fontWeight: 'bold', margin: '0' }}>
                          {totalTickets} TICKET(S) SENT TO
                        </p>
                        <p style={{ margin: '0' }}>{user?.email}</p>
                      </div>
                      <div className="col-12">
                        <p style={{ fontWeight: 'bold', margin: '0' }}>
                          DATE AND TIME
                        </p>
                        <p style={{ margin: 0 }}>
                          {formatDate({ date: event.date_start })}
                        </p>
                      </div>
                      <div className="col-12">
                        <p style={{ fontWeight: 'bold', margin: '0' }}>
                          Location
                        </p>
                        <p style={{ margin: 0 }}>
                          {formatShortLocation({
                            location: event.event_location,
                          })}
                        </p>
                      </div>
                      <div className="col-12">
                        <p style={{ fontWeight: 'bold', margin: '0' }}>
                          Ticket number
                        </p>
                        <p style={{ margin: 0 }}>#123456789</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ height: '4.5rem' }} className="footer">
                  <Button
                    block
                    type="primary"
                    onClick={() => router.push(`/mytickets/1234567`)}
                  >
                    See ticket(s)
                  </Button>
                </div>
              </>
            )}
          </div>

          {vw >= breakPointsPX.md && (
            <div className="col-md-5">
              <div className="order-summary">
                <div className="order-summary_image">
                  {event.event_detail.cover_image_url ? (
                    <Image
                      src={`${baseURL}/media/${event.event_detail.cover_image_url}`}
                      alt="0"
                      fill
                      style={{ objectFit: 'cover' }}
                      placeholder="blur"
                      blurDataURL={`data:image/svg+xml;base64,${toBase64(
                        shimmer('100%', '100%')
                      )}`}
                    />
                  ) : (
                    <div className="order-summary_image_blank">
                      <PhotoIcon />
                    </div>
                  )}
                </div>
                {checkout !== CHECKOUT_STATES.SUCCESS && !!tickets.length && (
                  <div className="order-summary-info">
                    <p className="order-summary-title">Order Summary</p>
                    {tickets.map((ticket) => (
                      <div key={ticket.id} className="row vg-8">
                        <p className="col-8">
                          {ticket.amount} x {ticket.name}
                        </p>
                        <p className="col-4">
                          {ticket.price
                            ? formatCurrency(ticket.price, 'USD')
                            : 'Free'}
                        </p>
                      </div>
                    ))}
                    <div className="total row">
                      <p className="total-word col-8">Total</p>
                      <p className="total-price col-4">
                        {totalPrice
                          ? formatCurrency(totalPrice, 'USD')
                          : 'Free'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {showLeave && (
            <div className="full-size">
              <div className="content">
                <h3>Leave checkout?</h3>
                <p>
                  Are you sure you want to leave checkout? The items you have
                  selected may not be available later.
                </p>
                <div className="action row hg-16 vg-md-16">
                  <div className="col-12 col-md-6">
                    <Button block onClick={() => setShowLeave(false)}>
                      Stay
                    </Button>
                  </div>
                  <div className="col-12 col-md-6">
                    <Button block type="primary" onClick={handleCloseModal}>
                      Leave
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {timeEnd && (
            <div className="full-size">
              <div className="content">
                <h3>Time Limit Reached</h3>
                <p>
                  Your reservation has been released. Please re-start your
                  purchase.
                </p>
                <div className="action">
                  <Button type="link" block onClick={handleCloseModal}>
                    Back to tickets
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>
      <style jsx>{`
        .modal {
          height: 90vh;
          position: relative;
        }

        .ticket-info {
          height: 100%;
          position: relative;
        }

        .info-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          max-height: 100%;
        }

        .title {
          border-bottom: 1px solid ${colors.black};
          flex: 0 0 auto;
          padding: 0.8rem 2rem 0.8rem 0.8rem;
        }

        .body {
          flex: 1;
          height: 100%;
          margin-bottom: 6.75rem;
          overflow-y: auto;
          padding: 1.5rem 1rem 0;
        }

        .body .ticket-description {
          color: ${colors.grayFont};
          margin: 0;
        }

        .body .brand {
          color: ${colors.grayFont};
          margin-top: 2rem;
        }

        .body .brand span {
          font-size: ${fluidFont.big};
          font-weight: bold;
        }

        .body .ticket-name {
          font-size: ${fluidFont.big};
          font-weight: bold;
          margin: 0;
        }

        .footer {
          background-color: ${colors.white};
          border-top: 1px solid #000;
          bottom: 0;
          height: 6.75rem;
          left: 0;
          padding: 1rem 2rem;
          position: absolute;
          width: 100%;
        }

        .footer .price {
          color: ${colors.grayFont};
          font-size: ${fluidFont.big};
          font-weight: bold;
          margin-top: 0;
        }

        .order-summary {
          height: 100%;
        }

        .order-summary_image {
          align-items: center;
          background-color: ${colors.lightGray};
          display: flex;
          height: 40%;
          justify-content: center;
          position: relative;
        }

        .order-summary_image_blank {
          width: 30px;
        }

        .order-summary-info {
          height: 60%;
          overflow-y: auto;
          padding: 1.5rem 1rem;
        }

        .order-summary-title {
          font-weight: bold;
          margin-top: 0;
        }

        .order-summary-info .total-word,
        .order-summary-info .total-price {
          font-size: ${fluidFont.big};
          font-weight: bold;
        }

        .full-size {
          align-items: center;
          background-color: ${colors.white};
          bottom: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          left: 0;
          position: absolute;
          right: 0;
          top: 0;
          z-index: 2000;
        }

        .full-size .content {
          text-align: center;
          width: 80%;
        }

        .full-size .content p {
          color: ${colors.grayFont};
        }

        .full-size .content .action {
          margin-top: 1rem;
        }

        @media (min-width: ${breakPoints.md}) {
          .full-size .content {
            width: 60%;
          }
        }

        @media (min-width: ${breakPoints.lg}) {
          .full-size .content {
            width: 50%;
          }
        }
      `}</style>
    </>
  );
}
