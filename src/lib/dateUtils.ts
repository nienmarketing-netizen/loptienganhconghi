export const VIETNAMESE_DAYS = [
  "Chủ Nhật",
  "Thứ Hai",
  "Thứ Ba",
  "Thứ Tư",
  "Thứ Năm",
  "Thứ Sáu",
  "Thứ Bảy",
];

/**
 * Returns the Vietnamese day of week for a given Date object.
 */
export function getVietnameseDayOfWeek(date: Date): string {
  return VIETNAMESE_DAYS[date.getDay()];
}

/**
 * Formats or corrects any string containing a Vietnamese date (dd/mm/yyyy)
 * to ensure that the day of the week (Thứ / Chủ Nhật) is 100% accurate.
 * e.g., "15/09/2026" is verified to be "Thứ Ba, 15/09/2026", never "Chủ Nhật".
 */
export function formatWithCorrectDayOfWeek(text: string): string {
  if (!text) return "";
  let result = text;

  // Normalize year if missing (e.g. 15/09 -> 15/09/2026)
  result = result.replace(/(\b\d{1,2}\/\d{1,2})\b(?!\/\d{2,4})/g, "$1/2026");

  // Match: (Thứ [X]|Chủ Nhật)? followed by dd/mm/yyyy
  result = result.replace(
    /(?:(Thứ\s+[A-Za-zÀ-ỹ]+|Chủ\s+Nhật)[,\s]*)?(\b\d{1,2})\/(\d{1,2})\/(\d{4}\b)/gi,
    (match, existingDay, dStr, mStr, yStr) => {
      const day = parseInt(dStr, 10);
      const month = parseInt(mStr, 10);
      const year = parseInt(yStr, 10);
      const dateObj = new Date(year, month - 1, day);
      if (isNaN(dateObj.getTime())) return match;

      const correctDay = VIETNAMESE_DAYS[dateObj.getDay()];
      const formattedDate = `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`;

      if (existingDay) {
        return `${correctDay}, ${formattedDate}`;
      }
      return formattedDate;
    }
  );

  return result;
}

/**
 * Takes a date string (e.g. "19/09/2026") and ensures it includes
 * the accurate Vietnamese day of the week (e.g. "Thứ Bảy, 19/09/2026").
 */
export function formatDateWithDayOfWeek(dateStr: string): string {
  if (!dateStr) return "";
  let text = dateStr.replace(/(\b\d{1,2}\/\d{1,2})\b(?!\/\d{2,4})/g, "$1/2026");

  // If already prefixed with a day of week, ensure it is factually correct
  if (/(Thứ\s+[A-Za-zÀ-ỹ]+|Chủ\s+Nhật)/i.test(text)) {
    return formatWithCorrectDayOfWeek(text);
  }

  // If it doesn't have day of week prefix, parse dd/mm/yyyy and prepend day of week
  const match = text.match(/(\b\d{1,2})\/(\d{1,2})\/(\d{4}\b)/);
  if (match) {
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);
    const dateObj = new Date(year, month - 1, day);
    if (!isNaN(dateObj.getTime())) {
      const correctDay = VIETNAMESE_DAYS[dateObj.getDay()];
      const formattedDate = `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`;
      return text.replace(match[0], `${correctDay}, ${formattedDate}`);
    }
  }

  return text;
}

