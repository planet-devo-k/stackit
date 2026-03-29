export const getKSTDateString = (date) => {
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstDate = new Date(date.getTime() + kstOffset);

  return kstDate.toISOString().split("T")[0];
};
