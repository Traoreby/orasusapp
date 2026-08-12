export function formatNumber(num: number | string | null | undefined): string {
  if (num === null || num === undefined || Number.isNaN(Number(num))) return '0';
  return new Intl.NumberFormat('fr-FR').format(Number(num));
}

export function formatCurrency(num: number | string | null | undefined): string {
  if (num === null || num === undefined || Number.isNaN(Number(num))) return '0 FCFA';
  return new Intl.NumberFormat('fr-FR').format(Number(num)) + ' FCFA';
}
