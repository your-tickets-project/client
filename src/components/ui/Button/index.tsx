import React from 'react';

interface Props {
  children: React.ReactNode;
  type?: 'primary';
  block?: boolean;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
}

export const Button = ({ children, type, block, style, onClick }: Props) => {
  return (
    <button
      type="button"
      className={`ui-button ${type || ''} ${block ? 'block' : ''}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
