export const formatAmount = (num: number): string => {
  return "IDR " + new Intl.NumberFormat("id-ID").format(num);
};
