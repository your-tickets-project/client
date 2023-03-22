import React, { useEffect, useState } from 'react';
import Datepicker from 'react-date-picker/dist/entry.nostyle';

interface Props {
  error?: boolean;
  name?: string;
  value?: string;
  onChange?: (e: { target: { name?: string; value?: string } }) => void;
}

export const DatePicker = ({ error, name, value, onChange }: Props) => {
  const [dateValue, setDateValue] = useState<Date | undefined>();

  useEffect(() => {
    const date = new Date(`${value}T00:00:00`);
    if (date.toString() === 'Invalid Date') {
      setDateValue(undefined);
      return;
    }
    setDateValue(date);
  }, [value]);

  return (
    <div className="ui-date-picker" data-testid="ui-date-picker-element">
      <Datepicker
        className={error ? 'error' : ''}
        dayPlaceholder="dd"
        format="MM-dd-y"
        monthPlaceholder="mm"
        name={name}
        yearPlaceholder="yyyy"
        onChange={
          onChange
            ? (date: Date) => {
                if (!date) {
                  onChange({ target: { name, value: '' } });
                  return;
                }

                const year = date.getFullYear();
                const month = `0${date.getMonth() + 1}`.slice(-2);
                const day = `0${date.getDate()}`.slice(-2);
                onChange({
                  target: { name, value: `${year}-${month}-${day}` },
                });
              }
            : undefined
        }
        value={dateValue}
      />
    </div>
  );
};
