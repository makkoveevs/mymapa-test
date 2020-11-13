const getMondayTS = () => {
  const today = new Date();
  const dayDate = today.getDate();
  const month = today.getMonth();
  const year = today.getFullYear();
  return new Date(year, month, Math.floor(dayDate / 7) * 7);
};

export default { getMondayTS };
