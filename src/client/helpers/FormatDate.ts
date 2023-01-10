export const formatDate = ({ date }: { date: string }) => {
  const d = new Date(date);
  if (d.toString() === 'Invalid Date') {
    return date;
  }

  const weekDay = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
  }).format(d);
  const day = d.getDate();
  const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(d);
  const year = d.getFullYear();

  return `${weekDay}, ${month} ${day}, ${year}`;
};
