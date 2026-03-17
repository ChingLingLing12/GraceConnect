// utils/date.ts
import { formatInTimeZone, toZonedTime } from "date-fns-tz";

export const PERTH_TZ = "Australia/Perth";

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

  return new Intl.DateTimeFormat("en-AU", {
    timeZone: PERTH_TZ,
    ...options,
  }).format(d);
};

export const formatPerthShortDate = (value?: string | Date | null) => {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "—";

  return formatInTimeZone(d, PERTH_TZ, "d MMM");
};

export const formatPerthWeekLabel = (value?: string | Date | null) => {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "—";

  return formatInTimeZone(d, PERTH_TZ, "EEE d MMM yyyy");
};

export const getPerthNow = () => toZonedTime(new Date(), PERTH_TZ);