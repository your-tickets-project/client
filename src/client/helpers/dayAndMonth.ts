export const dayAndMonth = ({ date }: { date: string }) => {
  const d = new Date(date);
  if (d.toString() === 'Invalid Date') {
    return date;
  }

  const day = d.getDate();
  const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(d);

  return `${month} ${day}`;
};
