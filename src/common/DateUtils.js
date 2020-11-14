const getMondayTS = () => {
  const today = new Date();
  const dayDate = today.getDate();
  const dayNum = today.getDay();
  // console.log('dayNum', dayNum);
  // console.log('dayDate', dayDate);
  const month = today.getMonth();
  // console.log('monthDate', month);
  const year = today.getFullYear();
  return new Date(year, month, dayDate - dayNum + 1);
};

const monthsNames = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];

const createDefaultHoursList = Array.from({ length: 24 }, (x, i) => i);

const weekTSPeriod = 1000 * 60 * 60 * 24 * 7;
const dayTSPeriod = 1000 * 60 * 60 * 24;
const hourTSPeriod = 1000 * 60 * 60;

const getDaysOfWeekDefaultsWeek = [
  { number: 1, title: 'ПН' },
  { number: 2, title: 'ВТ' },
  { number: 3, title: 'СР' },
  { number: 4, title: 'ЧТ' },
  { number: 5, title: 'ПТ' },
  { number: 6, title: 'СБ' },
  { number: 7, title: 'ВС' },
];
export default {
  getMondayTS,
  createDefaultHoursList,
  weekTSPeriod,
  getDaysOfWeekDefaultsWeek,
  dayTSPeriod,
  hourTSPeriod,
  monthsNames,
};
