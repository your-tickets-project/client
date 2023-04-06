export const dayAndMonth = ({ date }: { date: string }) => {
  const d = new Date(date);
  if (d.toString() === 'Invalid Date') {
    return date.toString();
  }

  const day = `0${d.getDate()}`.slice(-2);
  const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(d);

  return `${month} ${day}`;
};
