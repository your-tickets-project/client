import React, { useEffect, useState } from 'react';

interface Props {
  defaultValue?: string | number;
  placeholder?: string;
  options: {
    key: number;
    label: string;
    value: string | number;
    disabled?: boolean;
  }[];
  handleChange: (value: string | number) => void;
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
  defaultValue,
  placeholder,
  options,
  handleChange,
}: Props) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isShowOptions, setIsShowOptions] = useState(false);
  const [value, setValue] = useState(
    options.find((option) => option.value === defaultValue)?.value
  );

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    if (defaultValue === undefined) return;
    handleChange(defaultValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  return (
    <div className="ui-select" onClick={() => setIsShowOptions(!isShowOptions)}>
      <div className="selector">
        <div className={`value-container`}>
          {value !== undefined && (
            <div
              className={`value ${
                isShowOptions ? 'is-active' : 'is-not-active'
              }`}
            >
              {value}
            </div>
          )}
          {value === undefined && placeholder?.length && (
            <div className="placeholder">{placeholder}</div>
          )}
        </div>

        <div className="ui-select-icon">
          <SelectArrowIcon />
        </div>
      </div>
      <div
        className={`options ${isShowOptions ? 'is-active' : 'is-not-active'}`}
      >
        {options.map(({ key, label, value: optionValue }) => (
          <div
            key={key}
            className={`option ${
              optionValue === value ? 'is-active' : 'is-not-active'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setValue(optionValue);
              handleChange(optionValue);
              setIsShowOptions(false);
            }}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
};
