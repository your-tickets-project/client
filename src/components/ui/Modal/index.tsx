import React, { useEffect, useState } from 'react';

interface Props {
  children: React.ReactNode;
  title: React.ReactNode;
  footer: React.ReactNode;
  isShowModal: boolean;
  onCancel: () => void;
}

const XIcon = (props: { fill?: string }) => (
  <svg viewBox="64 64 896 896" aria-hidden="true" {...props}>
    <path d="m563.8 512 262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z" />
  </svg>
);

export const Modal = ({
  title,
  children,
  footer,
  isShowModal,
  onCancel,
}: Props) => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!isShowModal) return;
    setActive(true);
  }, [isShowModal]);

  if (!isShowModal) return null;

  return (
    <div
      className="ui-modal"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setActive(false);

          setTimeout(() => {
            onCancel();
          }, 300);
        }
      }}
    >
      <div
        className={`ui-modal-content ${active ? 'is-active' : 'is-not-active'}`}
      >
        <div
          className="ui-modal-icon"
          onClick={() => {
            setActive(false);

            setTimeout(() => {
              onCancel();
            }, 300);
          }}
        >
          <XIcon />
        </div>
        {title && <div className="ui-modal-title">{title}</div>}
        <div className="ui-modal-body">{children}</div>
        {footer && <div className="ui-modal-footer">footer</div>}
      </div>
    </div>
  );
};
