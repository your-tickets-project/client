import React, { useEffect, useState } from 'react';
import { Button } from '../index';

interface Props {
  bodyStyle?: React.CSSProperties;
  children: React.ReactNode;
  footer?: React.ReactNode;
  isShowModal: boolean;
  maskClosable?: boolean;
  overlayStyle?: React.CSSProperties;
  title?: React.ReactNode;
  onCancel?: () => void;
  onConfirm?: () => void;
}

export const Modal = ({
  bodyStyle,
  children,
  footer,
  isShowModal,
  maskClosable = false,
  overlayStyle,
  title,
  onCancel,
  onConfirm,
}: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (!isShowModal) {
      setActive(false);
      setTimeout(() => {
        setShowModal(false);
      }, 500);
    } else {
      setShowModal(true);
      setTimeout(() => {
        setActive(true);
      }, 200);
    }
  }, [isShowModal]);

  if (!showModal) return null;

  return (
    <div className="ui-modal">
      <div
        className="ui-modal_overlay"
        style={overlayStyle}
        onClick={(e) => {
          if (!maskClosable) return;
          if (e.target !== e.currentTarget) return;
          onCancel?.();
        }}
        data-testid="ui-modal_overlay-element"
      >
        <div className={`ui-modal_content ${active ? 'active' : 'not-active'}`}>
          <div className="ui-modal_icon" onClick={onCancel}>
            <XIcon />
          </div>
          {title && <div className="ui-modal_title">{title}</div>}
          <div className="ui-modal_body" style={bodyStyle}>
            {children}
          </div>
          {footer === undefined && (
            <div className="ui-modal_footer">
              <div className="ui-modal_default-footer">
                <div className="ui-modal_cancel-button">
                  <Button onClick={onCancel}>cancel</Button>
                </div>
                <div className="ui-modal_confirm-button">
                  <Button type="primary" onClick={onConfirm}>
                    confirm
                  </Button>
                </div>
              </div>
            </div>
          )}
          {footer && <div className="ui-modal_footer">{footer}</div>}
        </div>
      </div>
    </div>
  );
};

const XIcon = (props: { fill?: string }) => (
  <svg viewBox="64 64 896 896" aria-hidden="true" {...props}>
    <title>close-icon</title>
    <path d="m563.8 512 262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z" />
  </svg>
);
