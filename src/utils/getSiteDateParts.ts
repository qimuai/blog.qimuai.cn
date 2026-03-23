import { SITE } from "@/config";

const siteDateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: SITE.timezone,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const getPartValue = (
  parts: Intl.DateTimeFormatPart[],
  type: Intl.DateTimeFormatPartTypes
) => parts.find(part => part.type === type)?.value ?? "";

const getSiteDateParts = (date: Date | string) => {
  const parts = siteDateFormatter.formatToParts(new Date(date));
  const year = getPartValue(parts, "year");
  const month = getPartValue(parts, "month");
  const day = getPartValue(parts, "day");

  return {
    year,
    month,
    day,
    monthKey: `${year}-${month}`,
    dateKey: `${year}-${month}-${day}`,
  };
};

export default getSiteDateParts;
