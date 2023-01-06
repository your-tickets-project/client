import React from 'react';

export interface Props {
  addonBefore?: React.ReactNode;
  error?: boolean;
  name?: string;
  placeholder?: string;
  style?: React.CSSProperties;
  type: 'text' | 'search' | 'password' | 'email';
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export const Input = ({
  addonBefore,
  error,
  name,
  placeholder,
  style,
  type,
  value,
  onChange,
}: Props) => {
  return (
    <div className="ui-input" style={style}>
      {addonBefore && (
        <span className="addon-before" style={{ width: '20%' }}>
          {addonBefore}
        </span>
      )}
      <input
        className={`input ${error ? 'ui-input-error' : ''}`}
        name={name}
        placeholder={placeholder}
        style={{ paddingLeft: addonBefore !== undefined ? '20%' : undefined }}
        type={type}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};
