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
import { formatDate, formatTime, shimmer, toBase64 } from 'client/helpers';
// redux
import { useSelector } from 'react-redux';
import { RootState } from 'client/store';
// styles
import { colors, fluidFont } from 'client/styles/variables';

interface Props {
  event: EventType;
  handleShowModal: (state: boolean) => void;
  isShowModal: boolean;
}

type CheckoutType = 'pre_sale' | 'checkout' | 'success';

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
  const vw = useVW();
  const { user } = useSelector((state: RootState) => state.auth);

  const [ticketsNumber, setTicketsNumber] = useState(1);
  const [checkout, setCheckout] = useState<CheckoutType>(
    CHECKOUT_STATES.PRE_SALE
  );

  const handleFinish = async (values: any) => {
    setCheckout(CHECKOUT_STATES.SUCCESS);
  };

  return (
    <>
      <Modal
        title={null}
        footer={null}
        isShowModal={isShowModal}
        onCancel={() => {
          setCheckout(CHECKOUT_STATES.PRE_SALE);
          handleShowModal(false);
        }}
      >
        <div className="modal row">
          <div className="ticket-info col-12 col-md-7">
            {checkout === CHECKOUT_STATES.PRE_SALE && (
              <>
                <div className="title">
                  <h4>{event.title}</h4>
                  <p style={{ color: colors.grayFont, margin: '0.2rem 0' }}>
                    {formatDate({ date: event.fromDate })}
                  </p>
                  <p style={{ color: colors.grayFont, margin: '0.2rem 0' }}>
                    {formatTime({
                      fromDate: event.fromDate,
                      toDate: event.toDate,
                    })}
                  </p>
                </div>
                <div className="body">
                  <div className="row vg-8">
                    <div className="col-7">
                      <h4>{event.ticket_description}</h4>
                      <p>{event.price}</p>
                    </div>
                    <div className="col-5">
                      <Select
                        placeholder="N° tickets"
                        defaultValue={'1'}
                        options={[
                          { key: 1, label: '1', value: '1' },
                          { key: 2, label: '2', value: '2' },
                          { key: 3, label: '3', value: '3' },
                          { key: 4, label: '4', value: '4' },
                          { key: 5, label: '5', value: '5' },
                        ]}
                        handleChange={(value) => setTicketsNumber(+value)}
                      />
                    </div>
                  </div>
                  {event.event_ticket_description && (
                    <p className="ticket-description">
                      {event.event_ticket_description}
                    </p>
                  )}
                  <p className="brand">
                    Offered by <span>YourTickets</span>
                  </p>
                </div>
                <div className="footer">
                  <p className="price">
                    {event.price.toLowerCase() === 'free'
                      ? event.price
                      : `$${event.price}`}
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
                <div className="title">
                  <h4 style={{ textAlign: 'center' }}>Checkout</h4>
                  <p
                    style={{
                      color: colors.grayFont,
                      margin: '0.2rem 0',
                      textAlign: 'center',
                    }}
                  >
                    <CountDownTimer minutes={1} />
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
                    <h4 style={{ textAlign: 'center' }}>Contact information</h4>
                    <div style={{ marginTop: '1rem' }} className="row vg-8">
                      <div className="col-12 col-md-6">
                        <Form.Item
                          label="First name"
                          name="first_name"
                          rules={{
                            required: true,
                            type: 'string',
                            message: 'First name is required',
                          }}
                        >
                          <Input type="text" />
                        </Form.Item>
                      </div>
                      <div className="col-12 col-md-6">
                        <Form.Item
                          label="Last name"
                          name="last_name"
                          rules={{
                            required: true,
                            type: 'string',
                            message: 'Last name is required',
                          }}
                        >
                          <Input type="text" />
                        </Form.Item>
                      </div>
                      <div className="col-12">
                        <Form.Item
                          label="Email"
                          name="email"
                          rules={{
                            required: true,
                            type: 'email',
                            message: 'email is required',
                          }}
                        >
                          <Input type="email" />
                        </Form.Item>
                      </div>
                      <div className="col-12">
                        <Form.Item
                          label="Phone number"
                          name="phone_number"
                          rules={{
                            required: true,
                            type: 'string',
                            message: 'Phone number is required',
                          }}
                        >
                          <Input type="text" />
                        </Form.Item>
                      </div>
                    </div>
                    <p className="brand">
                      Offered by <span>YourTickets</span>
                    </p>
                    <div className="footer">
                      <p className="price">
                        {event.price.toLowerCase() === 'free'
                          ? event.price
                          : `$${event.price}`}
                      </p>
                      <Button block type="primary" htmlType="submit">
                        Register
                      </Button>
                    </div>
                  </Form>
                </div>
              </>
            )}

            {checkout === CHECKOUT_STATES.SUCCESS && (
              <>
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
                        {formatDate({ date: event.fromDate })}
                      </p>
                    </div>
                    <div className="col-12">
                      <p style={{ fontWeight: 'bold', margin: '0' }}>
                        Location
                      </p>
                      <p style={{ margin: 0 }}>{event.short_location}</p>
                    </div>
                    <div className="col-12">
                      <p style={{ fontWeight: 'bold', margin: '0' }}>
                        Ticket number
                      </p>
                      <p style={{ margin: 0 }}>#123456789</p>
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

          {vw !== null && vw >= 768 && (
            <div className="col-md-5">
              <div className="order-summary">
                <div>
                  <Image
                    src={event.src}
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
                    <div className="row">
                      <p className="col-8">
                        {ticketsNumber} x {event.ticket_description}
                      </p>
                      <p className="col-4">
                        {event.price.toLowerCase() === 'free'
                          ? '$0.00'
                          : event.price}
                      </p>
                    </div>
                    <div className="total row">
                      <p className="total-word col-8">Total</p>
                      <p className="total-price col-4">
                        {event.price.toLowerCase() === 'free'
                          ? '$0.00'
                          : event.price}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Modal>
      <style jsx>{`
        .modal {
          height: 90vh;
        }

        .modal .ticket-info {
          position: relative;
        }

        .modal .title {
          border-bottom: 1px solid ${colors.black};
          padding: 0.8rem 2rem 0.8rem 0.8rem;
        }

        .modal .body {
          height: 400px;
          overflow-y: auto;
          padding: 1.5rem 1rem 0;
        }

        .modal .body .ticket-description {
          color: ${colors.grayFont};
          margin-top: 0;
        }

        .modal .body .brand {
          color: ${colors.grayFont};
          margin-top: 2rem;
        }

        .modal .body .brand span {
          font-size: ${fluidFont.big};
          font-weight: bold;
        }

        .modal .ticket-info .footer {
          background-color: ${colors.white};
          border-top: 1px solid #000;
          bottom: 0;
          height: 6.75rem;
          left: 0;
          padding: 1rem 2rem;
          position: absolute;
          width: 100%;
        }

        .modal .footer .price {
          color: ${colors.grayFont};
          font-size: ${fluidFont.big};
          font-weight: bold;
          margin-top: 0;
        }

        .modal .order-summary {
          background-color: ${colors.lightGray};
          height: 100%;
        }

        .modal .order-summary-info {
          padding: 1.5rem 1rem;
        }

        .modal .order-summary-title {
          font-weight: bold;
          margin-top: 0;
        }

        .modal .order-summary-info .total {
          margin-top: 4rem;
        }

        .modal .order-summary-info .total-word,
        .modal .order-summary-info .total-price {
          font-size: ${fluidFont.big};
          font-weight: bold;
        }
      `}</style>
    </>
  );
}
