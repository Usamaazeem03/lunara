import { supabase } from "./supabase";

export async function getStaffRatingSummaries(ownerId) {
  const { data, error } = await supabase.rpc("get_staff_rating_summaries", {
    p_owner_id: String(ownerId),
  });
  if (error) throw new Error(error.message || "Unable to load staff ratings.");
  return new Map(
    (data ?? []).map((row) => [
      String(row.staff_id),
      {
        rating: Number(row.average_rating) || 0,
        rating_count: Number(row.rating_count) || 0,
      },
    ]),
  );
}

export async function rateStaffAppointment({ appointmentId, rating }) {
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new Error("Choose a rating from 1 to 5.");
  }
  const { error } = await supabase.rpc("rate_staff_appointment", {
    p_appointment_id: String(appointmentId),
    p_rating: rating,
  });
  if (error) throw new Error(error.message || "Unable to save your rating.");
}
