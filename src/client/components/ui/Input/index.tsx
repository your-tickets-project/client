import React from 'react';

export interface Props {
  addonBefore?: React.ReactNode;
  error?: boolean;
  name?: string;
  placeholder?: string;
  style?: React.CSSProperties;
  type: 'text' | 'search' | 'password' | 'email' | 'number';
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
        <span className="ui-input-addon-before" style={{ width: '20%' }}>
          {addonBefore}
        </span>
      )}
      <input
        className={`ui-input-input ${error ? 'error' : ''}`}
        name={name}
        id={name}
        placeholder={placeholder}
        style={{ paddingLeft: addonBefore !== undefined ? '20%' : undefined }}
        type={type}
        value={value}
        onChange={onChange}
        data-testid="ui-input-input-element"
      />
    </div>
  );
};
