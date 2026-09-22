import { supabase } from "./supabase";
import {
  normalizeSchedule,
  validateScheduleDay,
} from "../features/schedule/scheduleUtils";

const COLUMNS =
  "id, owner_id, day_of_week, day_name, is_open, open_time, close_time";

export async function getSchedule(ownerId) {
  if (!ownerId) throw new Error("Please sign in to load your schedule.");
  const { data, error } = await supabase
    .from("working_hours")
    .select(COLUMNS)
    .eq("owner_id", ownerId)
    .order("day_of_week", { ascending: true });
  if (error) throw new Error(error.message || "Unable to load working hours.");
  return normalizeSchedule(data ?? []);
}

export async function saveSchedule(ownerId, days) {
  if (!ownerId) throw new Error("Please sign in to save your schedule.");
  if (
    days.length !== 7 ||
    new Set(days.map((day) => day.day_of_week)).size !== 7 ||
    days.some(
      (day) =>
        !Number.isInteger(day.day_of_week) ||
        day.day_of_week < 0 ||
        day.day_of_week > 6,
    )
  ) {
    throw new Error("The schedule must contain each day of the week once.");
  }
  for (const day of days) {
    const validation = validateScheduleDay(day);
    if (validation !== true) throw new Error(`${day.day_name}: ${validation}`);
  }
  // Resolve row IDs from this owner's saved schedule, never from form input.
  const existing = await getSchedule(ownerId);
  const payload = normalizeSchedule(days).map((day) => {
    const savedId = existing.find(
      (row) => row.day_of_week === day.day_of_week,
    )?.id;
    return {
      ...(savedId != null ? { id: savedId } : {}),
      owner_id: ownerId,
      day_of_week: day.day_of_week,
      day_name: day.day_name,
      is_open: day.is_open,
      open_time: day.open_time || null,
      close_time: day.close_time || null,
    };
  });
  const { data, error } = await supabase
    .from("working_hours")
    .upsert(payload, { onConflict: "id", defaultToNull: false })
    .select(COLUMNS);
  if (error) throw new Error(error.message || "Unable to save working hours.");
  return normalizeSchedule(data);
}
