const getMondayTS = () => {
  const today = new Date();
  const dayDate = today.getDate();
  const month = today.getMonth();
  const year = today.getFullYear();
  return new Date(year, month, Math.floor(dayDate / 7) * 7);
};

const createDefaultHoursList = Array.from({ length: 24 }, (x, i) => i);

const weekTSPeriod = 1000 * 60 * 60 * 24 * 7;
const dayTSPeriod = 1000 * 60 * 60 * 24;

const getDaysOfWeekDefaultsWeek = [
  { number: 1, title: 'ПН' },
  { number: 2, title: 'ВТ' },
  { number: 3, title: 'СР' },
  { number: 4, title: 'ЧТ' },
  { number: 5, title: 'ПТ' },
  { number: 6, title: 'СБ' },
  { number: 7, title: 'ВС' },
];
export default { getMondayTS, createDefaultHoursList, weekTSPeriod, getDaysOfWeekDefaultsWeek, dayTSPeriod };
