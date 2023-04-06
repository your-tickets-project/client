import { getDate } from './getDate';

export const formatTime = ({ time }: { time: string }) => {
  const today = getDate();
  const date = new Date(`${today}T${time}`);

  return new Intl.DateTimeFormat('en', {
    timeStyle: 'short',
  }).format(date);
};
