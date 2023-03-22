import React from 'react';

interface Props {
  error?: boolean;
  textAreaRef?: React.LegacyRef<HTMLTextAreaElement>;
  maxLength?: number;
  name?: string;
  placeholder?: string;
  showCount?: boolean;
  style?: React.CSSProperties;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
}

// TODO: test
export const TextArea = ({
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
        className={`ui-textarea_textarea ${error ? 'error' : ''}`}
        data-testid="ui-textarea_textarea-element"
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
        onChange={onChange}
      />
      {showCount && maxLength && (
        <div className="ui-textarea_counter-container">
          <span className="ui-textarea_counter">
            {value && value.length > maxLength ? maxLength : value?.length || 0}
            /{maxLength}
          </span>
        </div>
      )}
    </div>
  );
};
