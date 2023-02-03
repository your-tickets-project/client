import React, { useEffect, useState } from 'react';

interface Props {
  value?: string | number;
  name?: string;
  options: {
    key: number;
    label: string;
    value: string | number;
    disabled?: boolean;
  }[];
  placeholder?: string;
  onChange?: (e: { target: { name?: string; value: string | number } }) => void;
}

const SelectArrowIcon = (props: { fill?: string }) => (
  <svg viewBox="0 0 24 24" xmlSpace="preserve" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="m7 10.2 5 5 5-5-1.4-1.4-3.6 3.6-3.6-3.6z"
    />
  </svg>
);

export const Select = ({
  value,
  name,
  options,
  placeholder,
  onChange,
}: Props) => {
  const [loading, setIsLoaded] = useState(false);
  const [isShowOptions, setIsShowOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    options.find((option) => option.value === value)
  );

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!loading) return;
    if (value === undefined || selectedOption === undefined) return;
    onChange?.({ target: { name, value: selectedOption.value } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return (
    <div className="ui-select">
      <div
        className="ui-select-container"
        onClick={() => setIsShowOptions(!isShowOptions)}
      >
        <input
          type="text"
          className={`ui-select-input ${
            isShowOptions ? 'is-active' : 'is-not-active'
          }`}
          placeholder={placeholder}
          value={selectedOption?.label}
          id={name}
          name={name}
          role="combobox"
          aria-controls={undefined}
          aria-expanded={undefined}
          readOnly
          disabled
        />
        <div className="ui-select-icon">
          <SelectArrowIcon />
        </div>
      </div>

      {!!options.length && (
        <ul
          className={`ui-select-options ${
            isShowOptions ? 'is-active' : 'is-not-active'
          }`}
        >
          {options.map((option) => (
            <li
              key={option.key}
              className={`ui-select-option ${
                option.label === selectedOption?.label
                  ? 'is-active'
                  : 'is-not-active'
              }`}
              onClick={() => {
                setSelectedOption(option);
                setIsShowOptions(false);
                onChange?.({ target: { name, value: option.value } });
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
