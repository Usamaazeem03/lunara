import { getStaffRatingSummaries } from "./apiStaffRatings";
import { supabase } from "./supabase.js";

export async function getBookingStaff(ownerId) {
  if (!ownerId) return [];
  const { data, error } = await supabase
    .from("staff")
    .select(
      "id, name, image, role, rating, appointments_count, is_on_shift, owner_id",
    )
    .eq("owner_id", ownerId)
    .order("name", { ascending: true });
  if (error) throw error;
  const ratings = await getStaffRatingSummaries(ownerId);
  return (data ?? []).map((member) => ({
    ...member,
    ...(ratings.get(String(member.id)) ?? { rating: 0, rating_count: 0 }),
  }));
}

export async function getBookingWorkingHours(ownerId) {
  if (!ownerId) return [];
  const { data, error } = await supabase
    .from("working_hours")
    .select("*")
    .eq("owner_id", ownerId)
    .order("day_of_week", { ascending: true });
  if (error) throw error;
  return data ?? [];
}
