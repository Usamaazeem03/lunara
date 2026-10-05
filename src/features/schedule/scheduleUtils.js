import i18n from "../../i18n/i18n.js";
export const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function getDefaultSchedule() {
  return DAYS_OF_WEEK.map((day_name, day_of_week) => ({
    day_of_week,
    day_name,
    is_open: day_of_week !== 0,
    open_time: day_of_week === 6 ? "10:00" : "09:00",
    close_time: day_of_week === 6 ? "16:00" : "18:00",
  }));
}

export function normalizeSchedule(rows = []) {
  return getDefaultSchedule().map((day) => {
    const saved = rows.find(
      (row) => Number(row.day_of_week) === day.day_of_week,
    );
    return {
      ...day,
      ...saved,
      day_of_week: day.day_of_week,
      day_name: day.day_name,
      open_time: (saved?.open_time ?? day.open_time).slice(0, 5),
      close_time: (saved?.close_time ?? day.close_time).slice(0, 5),
    };
  });
}

export function validateScheduleDay(day) {
  if (!day.is_open) return true;
  const validTime = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
  if (!validTime.test(day.open_time) || !validTime.test(day.close_time))
    return i18n.t("schedule.enterOpeningAndClosingTimes");
  return (
    day.close_time > day.open_time || i18n.t("schedule.closingTimeMustBeAfterOpeningTime")
  );
}

export function getSchedulePreview(schedule, today = new Date()) {
  return Array.from({ length: 14 }, (_, offset) => {
    const date = new Date(today);
    date.setDate(today.getDate() + offset);
    if (!schedule.find((day) => day.day_of_week === date.getDay())?.is_open)
      return null;
    return {
      key: date.toDateString(),
      label: date.toLocaleDateString(i18n.resolvedLanguage, {
        weekday: "long",
        month: "short",
        day: "2-digit",
      }),
    };
  }).filter(Boolean);
}
