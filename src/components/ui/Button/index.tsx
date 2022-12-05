import React from 'react';

interface Props {
  children: React.ReactNode;
  type?: 'primary';
  block?: boolean;
}

export const Button = ({ children, type, block }: Props) => {
  return (
    <button
      type="button"
      className={`ui-button ${type || ''} ${block ? 'block' : ''}`}
    >
      {children}
    </button>
  );
};
