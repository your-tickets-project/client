import React from 'react';

interface Props {
  children: React.ReactNode;
  type?: 'primary';
  htmlType?: 'button' | 'reset' | 'submit';
  block?: boolean;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
}

export const Button = ({
  children,
  type,
  htmlType,
  block,
  style,
  onClick,
}: Props) => {
  return (
    <button
      type={htmlType ?? 'button'}
      className={`ui-button ${type || ''} ${block ? 'block' : ''}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
