export function formatCurrency(value: number) {
  return `Rs. ${new Intl.NumberFormat("en-PK").format(value)}`;
}

export function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}
