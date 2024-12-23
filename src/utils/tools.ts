export const numberSlicer = (number: number) => {
  return new Intl.NumberFormat("tr-TR", {
    currency: "TRY",
    minimumFractionDigits: 2,
  }).format(number);
};

export function days_between(date1: Date | null, date2: Date | null) {
  // The number of milliseconds in one day

  if (!date1 || !date2) return 0;

  const ONE_DAY = 1000 * 60 * 60 * 24;

  // Calculate the difference in milliseconds
  const differenceMs = Math.abs(
    new Date(date1).getTime() - new Date(date2).getTime()
  );

  // Convert back to days and return
  return Math.round(differenceMs / ONE_DAY);
}
