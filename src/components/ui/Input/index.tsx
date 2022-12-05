import React from 'react';

interface Props {
  type: 'text' | 'search';
  placeholder: string;
  addonBefore: React.ReactNode;
}

export const Input = ({ type, placeholder, addonBefore }: Props) => {
  return (
    <div className="ui-input">
      <span className="addon-before">{addonBefore}</span>
      <input type={type} className="input" placeholder={placeholder} />
    </div>
  );
};
