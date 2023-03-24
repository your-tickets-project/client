import React, { useEffect, useState } from 'react';
import Timepicker from 'react-time-picker/dist/entry.nostyle';

interface Props {
  error?: boolean;
  name?: string;
  value?: string;
  onChange?: (e: { target: { name?: string; value?: string } }) => void;
}

export const TimePicker = ({ error, name, value, onChange }: Props) => {
  const [timeValue, setTimeValue] = useState('');

  useEffect(() => {
    setTimeValue(value ?? '');
  }, [value]);

  return (
    <div className="ui-time-picker" data-testid="ui-time-picker-element">
      <Timepicker
        amPmAriaLabel="Select AM/PM"
        className={error ? 'error' : ''}
        clearAriaLabel="Clear value"
        clockAriaLabel="Toggle clock"
        disableClock
        format="hh:mm a"
        hourAriaLabel="Hour"
        minuteAriaLabel="Minute"
        name={name}
        nativeInputAriaLabel="Time"
        value={timeValue}
        onChange={
          onChange
            ? (time) => {
                if (!time) {
                  onChange({ target: { name, value: '' } });
                  return;
                }

                onChange({ target: { name, value: time as string } });
              }
            : undefined
        }
      />
    </div>
  );
};
