const getYears = (initialYear, finalYear) => {
  const result = [];
  for (let i = initialYear; i <= finalYear; i++) {
    result.push(i);
  }
  return result;
};

export default getYears;
