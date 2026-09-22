import {
  getAppointmentDate,
  getAppointmentAmount,
  getDateRangeConfig,
} from "./reportsUtils.js";
import { isCompletedAppointment } from "../Appointments/appointmentStatsUtils.js";

export function buildRevenueSeries(appointments, dateRange, grouping = "day") {
  const range = getDateRangeConfig(dateRange);
  const buckets = new Map();
  const dayKey = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const keyFor = (date, start) => {
    if (grouping === "month") return date.getMonth();
    const days = Math.round(
      (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
        Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())) /
        86400000,
    );
    return grouping === "week" ? Math.floor(days / 7) : days;
  };
  for (
    let date = new Date(range.start);
    date <= range.end;
    date.setDate(date.getDate() + 1)
  ) {
    const key = keyFor(date, range.start);
    if (!buckets.has(key))
      buckets.set(key, {
        label: date.toLocaleDateString(undefined, {
          month: "short",
          ...(grouping !== "month" && { day: "numeric" }),
        }),
        date: dayKey(date),
        current: 0,
        previous: 0,
      });
  }
  for (const appointment of appointments) {
    if (!isCompletedAppointment(appointment)) continue;
    const date = getAppointmentDate(appointment);
    if (!date) continue;
    const current = date >= range.start && date <= range.end;
    const previous = date >= range.previousStart && date <= range.previousEnd;
    if (!current && !previous) continue;
    const key = keyFor(date, current ? range.start : range.previousStart);
    const bucket = buckets.get(key);
    if (bucket)
      bucket[current ? "current" : "previous"] +=
        getAppointmentAmount(appointment);
  }
  return [...buckets.values()];
}
