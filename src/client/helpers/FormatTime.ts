export const formatTime = ({
  fromDate,
  toDate,
}: {
  fromDate: string;
  toDate: string;
}) => {
  const d = new Date(fromDate);
  const d2 = new Date(toDate);
  if (d.toString() === 'Invalid Date' || d2.toString() === 'Invalid Date') {
    return `${fromDate} ${toDate}`;
  }

  const fromTime = d.toLocaleTimeString();
  const toTime = d2.toLocaleTimeString();

  return `${fromTime.toUpperCase()} - ${toTime.toUpperCase()}`;
};
