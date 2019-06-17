export function NorwegianDate(date): string {
  const tmpDate = new Date(date);
  return (
    tmpDate.getDate().toString() +
    '.' +
    (tmpDate.getMonth() + 1).toString() +
    '.' +
    tmpDate.getFullYear().toString()
  );
}
