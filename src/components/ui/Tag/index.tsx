import React from 'react';

interface Props {
  children: React.ReactNode;
}

export const Tag = ({ children }: Props) => {
  return <div className="ui-tag">{children}</div>;
};
