export function numberFormat(value: number, currency?: string) {
  const number = new Intl.NumberFormat("en-US").format(value);

  if (currency) return `${currency} ${number}`;

  return number;
}
