export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export const formatTelephone = (value: string): string => {
  if (!value) return '';
  const numbers = value.replace(/\D/g, '');
  const truncated = numbers.slice(0, 11);
  if (truncated.length <= 2) return truncated.replace(/^(\d*)/, '($1');
  if (truncated.length <= 6) return truncated.replace(/^(\d{2})(\d*)/, '($1) $2');
  if (truncated.length <= 10) return truncated.replace(/^(\d{2})(\d{4})(\d*)/, '($1) $2-$3');
  return truncated.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
};