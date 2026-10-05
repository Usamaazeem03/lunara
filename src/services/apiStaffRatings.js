import { localizedError } from "../i18n/localizedError.js";
import i18n from "../i18n/i18n.js";
import { supabase } from "./supabase";

export async function getStaffRatingSummaries(ownerId) {
  const { data, error } = await supabase.rpc("get_staff_rating_summaries", {
    p_owner_id: String(ownerId),
  });
  if (error) throw new Error(error.message || i18n.t("services.unableToLoadStaffRatings"));
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
    throw localizedError("services.chooseARatingFrom1To5");
  }
  const { error } = await supabase.rpc("rate_staff_appointment", {
    p_appointment_id: String(appointmentId),
    p_rating: rating,
  });
  if (error) throw new Error(error.message || i18n.t("services.unableToSaveYourRating"));
}
