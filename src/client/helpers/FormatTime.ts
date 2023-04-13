import { getDateData } from './getDateData';

export const formatTime = ({
  time,
  timeFormat,
}: {
  time: string;
  timeFormat?: 'long' | 'short' | 'full' | 'medium';
}) => {
  const d = getDateData();
  const today = `${d.year}-${d.monthNumber}-${d.day}`;
  const date = new Date(`${today}T${time}`);

  return new Intl.DateTimeFormat('en', {
    timeStyle: timeFormat,
  }).format(date);
};
