export const getDateData = ({
  date,
  monthFormat,
  weekDayFormat,
}: {
  date?: string;
  monthFormat?: 'long' | 'short' | 'narrow' | '2-digit';
  weekDayFormat?: 'long' | 'short' | 'narrow';
} = {}) => {
  let d = new Date();
  if (date) {
    d = new Date(date);
  }

  const data = {
    weekDay: '',
    day: '',
    monthText: '',
    monthNumber: '',
    year: '',
  };

  if (d.toString() === 'Invalid Date') {
    return data;
  }

  data.weekDay = new Intl.DateTimeFormat('en-US', {
    weekday: weekDayFormat,
  }).format(d);
  data.day = `0${d.getDate()}`.slice(-2);
  data.monthText = new Intl.DateTimeFormat('en-US', {
    month: monthFormat,
  }).format(d);
  data.monthNumber = `0${d.getMonth() + 1}`.slice(-2);
  data.year = d.getFullYear().toString();

  return data;
};
