export const formatPerthTime = (date: string | Date) => {
  return new Date(date).toLocaleString("en-AU", {
    timeZone: "Australia/Perth",
  });
};

export const formatPerthTimeShort = (date: string | Date) => {
  return new Date(date).toLocaleString("en-AU", {
    timeZone: "Australia/Perth",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatPerthDate = (date: string | Date, options?: Intl.DateTimeFormatOptions) => {
  return new Date(date).toLocaleDateString("en-AU", {
    timeZone: "Australia/Perth",
    ...options,
  });
};