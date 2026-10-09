const moneyFormatter = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" });

export const formatMoney = (amount: number) => moneyFormatter.format(amount);

export const formatDate = (date: Date, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("es-MX", options).format(date);

export const formatDay = (iso: string) =>
  formatDate(new Date(iso), { day: "numeric", month: "short", year: "numeric" });

export const formatTime = (iso: string) =>
  formatDate(new Date(iso), { hour: "2-digit", minute: "2-digit" });

export const formatDateTime = (date: Date) =>
  formatDate(date, { dateStyle: "medium", timeStyle: "short" });

export const formatLongDateTime = (date: Date) =>
  formatDate(date, { dateStyle: "long", timeStyle: "short" });

export const formatToday = (date: Date) =>
  formatDate(date, { weekday: "long", day: "numeric", month: "long", year: "numeric" }).replace(
    /^./,
    (c) => c.toUpperCase(),
  );

export const formatMaskedCard = (masked: string) => `${masked.slice(0, 4)} ****** ${masked.slice(-4)}`;
