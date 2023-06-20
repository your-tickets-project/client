import React from 'react';
// components
import { Modal } from 'client/components/ui';
import { GarbageTrashIcon } from 'client/components/icons';
// helpers
import { debounce } from 'client/helpers';
// styles
import { colors } from 'client/styles/variables';

interface Props {
  ids?: {
    eventId: string | number;
    id: string | number;
  };
  showModal: boolean;
  handleCancelOrder: (ids: {
    eventId: string | number;
    id: string | number;
  }) => Promise<void>;
  onCancel: () => void;
}

export default function CancelOrderModal({
  ids,
  showModal,
  handleCancelOrder,
  onCancel,
}: Props) {
  return (
    <Modal
      bodyStyle={{
        height: '30vh',
        overflowY: 'auto',
      }}
      contentStyle={{ maxWidth: '800px' }}
      footer={undefined}
      isShowModal={showModal}
      title={<h3>Cancel Order</h3>}
      onCancel={onCancel}
      onConfirm={
        ids
          ? debounce(
              () =>
                handleCancelOrder({
                  eventId: ids.eventId,
                  id: ids.id,
                }),
              800
            )
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
          Are you sure you want to cancel this order #{ids?.id}? This action
          cannot be undone.
        </p>
      </div>
    </Modal>
  );
}
