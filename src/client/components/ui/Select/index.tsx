import React, { useEffect, useRef, useState } from 'react';

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

export const Select = ({
  value,
  name,
  options,
  placeholder,
  onChange,
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    options.find((option) => option.value === value)
  );

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    window.addEventListener('click', (e) => {
      if (!e.target) return;
      // @ts-ignore
      if (!ref.current?.contains(e.target)) setIsActive(false);
    });
  }, [isLoading]);

  return (
    <div className="ui-select" ref={ref}>
      <div
        className="ui-select_container"
        onClick={() => setIsActive(!isActive)}
      >
        <input
          type="text"
          className={`ui-select_input ${isActive ? 'active' : 'not-active'}`}
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
        <div className="ui-select_icon">
          <SelectArrowIcon />
        </div>
      </div>

      {!!options.length && (
        <ul
          className={`ui-select_options ${isActive ? 'active' : 'not-active'}`}
        >
          {options.map((option) => (
            <li
              key={option.key}
              className={`ui-select_option ${
                option.label === selectedOption?.label ? 'active' : 'not-active'
              }`}
              onClick={() => {
                setSelectedOption(option);
                setIsActive(false);
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

const SelectArrowIcon = (props: { fill?: string }) => (
  <svg viewBox="0 0 24 24" xmlSpace="preserve" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="m7 10.2 5 5 5-5-1.4-1.4-3.6 3.6-3.6-3.6z"
    />
  </svg>
);
