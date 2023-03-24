import React from 'react';

interface Props {
  disabled?: boolean;
  error?: boolean;
  maxLength?: number;
  name?: string;
  placeholder?: string;
  showCount?: boolean;
  style?: React.CSSProperties;
  textAreaRef?: React.LegacyRef<HTMLTextAreaElement>;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
}

export const TextArea = ({
  disabled,
  error,
  textAreaRef,
  maxLength,
  name,
  placeholder,
  showCount,
  style,
  value,
  onChange,
}: Props) => {
  return (
    <div className="ui-textarea">
      <textarea
        className={`ui-textarea_textarea ${disabled ? 'disabled' : ''} ${
          error ? 'error' : ''
        }`}
        data-testid="ui-textarea_textarea-element"
        disabled={disabled}
        id={name}
        maxLength={maxLength}
        name={name}
        placeholder={placeholder}
        ref={textAreaRef}
        style={style}
        value={
          maxLength && value && value.length > maxLength
            ? value.slice(0, maxLength)
            : value
        }
        onChange={disabled ? undefined : onChange}
      />
      {showCount && (
        <div className="ui-textarea_counter-container">
          <span className="ui-textarea_counter">
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
