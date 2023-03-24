import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
// components
import { CheckCircleIcon } from 'client/components/icons';
import { Button, Form, Input, Modal, Select } from 'client/components/ui';
import CountDownTimer from 'client/components/app/CountDownTimer';
// hooks
import useVW from 'client/hooks/useVW';
// interfaces
import { EventType } from 'interfaces';
import {
  formatDate,
  formatShortLocation,
  formatTime,
  shimmer,
  toBase64,
} from 'client/helpers';
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
  event: EventType;
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

type CheckoutType =
  | CHECKOUT_STATES.PRE_SALE
  | CHECKOUT_STATES.CHECKOUT
  | CHECKOUT_STATES.SUCCESS;

export default function CheckoutModal({
  event,
  handleShowModal,
  isShowModal,
}: Props) {
  const router = useRouter();
  const vw = useVW();
  const { user } = AuthSelector();

  const [ticketsNumber, setTicketsNumber] = useState(1);
  const [checkout, setCheckout] = useState<CheckoutType>(
    CHECKOUT_STATES.PRE_SALE
  );
  const [showLeave, setShowLeave] = useState(false);
  const [timeEnd, setTimeEnd] = useState(false);

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

  return (
    <>
      <Modal
        bodyStyle={{ padding: '0' }}
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
                      })} - ${formatTime({ time: event.time_end })}`}
                    </p>
                  </div>
                  <div className="body">
                    <div className="row vg-8">
                      <div className="col-7">
                        <h4>{event.event_ticket_info.name}</h4>
                        <p>{event.event_ticket_info.price || 'Free'}</p>
                      </div>
                      <div className="col-5">
                        <Select
                          placeholder="N° tickets"
                          value="1"
                          options={[
                            { key: 1, label: '1', value: '1' },
                            { key: 2, label: '2', value: '2' },
                            { key: 3, label: '3', value: '3' },
                            { key: 4, label: '4', value: '4' },
                            { key: 5, label: '5', value: '5' },
                          ]}
                          onChange={(e) => setTicketsNumber(+e.target.value)}
                        />
                      </div>
                    </div>
                    {event.event_ticket_info.description && (
                      <p className="ticket-description">
                        {event.event_ticket_info.description}
                      </p>
                    )}
                    <p className="brand">
                      Offered by <span>YourTickets</span>
                    </p>
                  </div>
                </div>
                <div className="footer">
                  <p className="price">
                    {event.event_ticket_info.price || 'Free'}
                  </p>
                  <Button
                    block
                    type="primary"
                    onClick={() => setCheckout(CHECKOUT_STATES.CHECKOUT)}
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
                              type: 'string',
                              requiredMessage: 'First name is a required field',
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
                              type: 'string',
                              requiredMessage: 'Last name is a required field',
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
                              type: 'string',
                              requiredMessage:
                                'Phone number is a required field',
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
                          {event.event_ticket_info.price || 'Free'}
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
                    <p style={{ margin: '0' }}>You go to</p>
                    <h4 style={{ marginTop: '.2rem' }}>{event.title}</h4>
                    <div style={{ marginTop: '1rem' }} className="row hg-24">
                      <div className="col-12">
                        <p style={{ fontWeight: 'bold', margin: '0' }}>
                          {ticketsNumber} TICKET(S) SENT TO
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
                <div>
                  <Image
                    src={event.event_detail.cover_image_url}
                    alt="0"
                    width={1800}
                    height={700}
                    style={{ width: '100%', height: '50%' }}
                    placeholder="blur"
                    blurDataURL={`data:image/svg+xml;base64,${toBase64(
                      shimmer('100%', '100%')
                    )}`}
                  />
                </div>
                {checkout !== CHECKOUT_STATES.SUCCESS && (
                  <div className="order-summary-info">
                    <p className="order-summary-title">Order Summary</p>
                    <div className="row vg-8">
                      <p className="col-8">
                        {ticketsNumber} x {event.event_ticket_info.name}
                      </p>
                      <p className="col-4">
                        {event.event_ticket_info.price || 'Free'}
                      </p>
                    </div>
                    <div className="total row">
                      <p className="total-word col-8">Total</p>
                      <p className="total-price col-4">
                        {event.event_ticket_info.price || 'Free'}
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
          max-height: 100%;
        }

        .title {
          border-bottom: 1px solid ${colors.black};
          flex: 0 0 auto;
          padding: 0.8rem 2rem 0.8rem 0.8rem;
        }

        .body {
          flex: 1;
          margin-bottom: 6.75rem;
          overflow-y: auto;
          padding: 1.5rem 1rem 0;
        }

        .body .ticket-description {
          color: ${colors.grayFont};
          margin-top: 0;
        }

        .body .brand {
          color: ${colors.grayFont};
          margin-top: 2rem;
        }

        .body .brand span {
          font-size: ${fluidFont.big};
          font-weight: bold;
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
          background-color: ${colors.lightGray};
          height: 100%;
        }

        .order-summary-info {
          padding: 1.5rem 1rem;
        }

        .order-summary-title {
          font-weight: bold;
          margin-top: 0;
        }

        .order-summary-info .total {
          margin-top: 4rem;
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
