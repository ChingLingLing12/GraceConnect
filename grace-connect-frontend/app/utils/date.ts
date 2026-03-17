import { formatInTimeZone } from "date-fns-tz";

export const PERTH_TZ = "+08:00";

export const formatPerthDateTime = (value?: string | Date | null) => {
  if (!value) return "—";

  const d = new Date(value);
  if (isNaN(d.getTime())) return "—";

  return formatInTimeZone(d, PERTH_TZ, "dd/MM/yyyy, hh:mm:ss a");
};

export const formatPerthDate = (
  value?: string | Date | null,
  options?: Intl.DateTimeFormatOptions
) => {
  if (!value) return "—";

  const d = new Date(value);
  if (isNaN(d.getTime())) return "—";

  if (options) {
    return new Intl.DateTimeFormat("en-AU", {
      timeZone: "Etc/GMT-8",
      ...options,
    }).format(d);
  }

  return formatInTimeZone(d, PERTH_TZ, "dd/MM/yyyy");
};

export const formatPerthTime = (value?: string | Date | null) => {
  if (!value) return "—";

  const d = new Date(value);
  if (isNaN(d.getTime())) return "—";

  return formatInTimeZone(d, PERTH_TZ, "hh:mm:ss a");
};