import React from 'react';

interface Props {
  addonBefore?: React.ReactNode;
  disabled?: boolean;
  error?: boolean;
  inputRef?: React.LegacyRef<HTMLInputElement>;
  max?: number | string;
  maxLength?: number;
  min?: number | string;
  name?: string;
  placeholder?: string;
  showCount?: boolean;
  step?: number | string;
  style?: React.CSSProperties;
  type?: 'text' | 'number';
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export const Input = ({
  addonBefore,
  disabled,
  error,
  inputRef,
  max,
  maxLength,
  min,
  name,
  placeholder,
  showCount,
  step,
  style,
  type,
  value,
  onChange,
}: Props) => {
  return (
    <div className="ui-input">
      {addonBefore && (
        <span className="ui-input_addon-before">{addonBefore}</span>
      )}
      <input
        className={`ui-input_input ${error ? 'error' : ''} ${
          disabled ? 'disabled' : ''
        }`}
        data-testid="ui-input_input-element"
        disabled={disabled}
        id={name}
        max={max}
        maxLength={maxLength}
        min={min}
        name={name}
        placeholder={placeholder}
        ref={inputRef}
        step={step}
        style={{
          ...style,
          paddingLeft: addonBefore !== undefined ? '44px' : undefined,
        }}
        type={type || 'text'}
        value={
          maxLength && value && value.length > maxLength
            ? value.slice(0, maxLength)
            : value
        }
        onChange={disabled ? undefined : onChange}
      />
      {showCount && (
        <div className="ui-input_counter-container">
          <span className="ui-input_counter">
            {value && maxLength && value.length > maxLength
              ? maxLength
              : value?.length || 0}
            {maxLength ? ` / ${maxLength}` : ''}
          </span>
        </div>
      )}
    </div>
  );
};
