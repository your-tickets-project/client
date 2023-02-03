export const formatDate = ({ date }: { date: Date }) => {
  const d = new Date(date);
  if (d.toString() === 'Invalid Date') {
    return date.toString();
  }

  const weekDay = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
  }).format(d);
  const day = d.getDate();
  const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(d);
  const year = d.getFullYear();

  return `${weekDay}, ${month} ${day}, ${year}`;
};
