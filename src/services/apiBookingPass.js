import { supabase } from "./supabase.js";
import { parseBookingReference } from "../features/Appointments/bookingPass/bookingPassUtils.js";

const PASS_FIELDS =
  "id, owner_id, client_id, client_name, service_name, staff_id, staff_name, appointment_date, appointment_time, duration_minutes, price, status, payment_option, reward_discount";

export async function getClientBookingPasses() {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!user) throw new Error("Please sign in to view your appointments.");
  const { data, error } = await supabase
    .from("appointments")
    .select(PASS_FIELDS)
    .eq("client_id", user.id)
    .order("appointment_date", { ascending: false })
    .order("appointment_time", { ascending: false });
  if (error)
    throw new Error("Your appointments could not be loaded. Please try again.");
  const { data: ratings, error: ratingError } = await supabase
    .from("staff_ratings")
    .select("appointment_id, rating")
    .eq("client_id", user.id);
  if (ratingError)
    throw new Error("Your ratings could not be loaded. Please try again.");
  const ratingsByAppointment = new Map(
    (ratings ?? []).map((row) => [String(row.appointment_id), row.rating]),
  );
  return (data ?? []).map((appointment) => ({
    ...appointment,
    staff_rating: ratingsByAppointment.get(String(appointment.id)) ?? null,
  }));
}

export async function verifyBookingPass(reference, ownerId) {
  const parsed = parseBookingReference(reference);
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!user || !ownerId || user.id !== ownerId) {
    throw new Error("Sign in to the salon owner account to verify a booking.");
  }
  if (parsed.ownerId !== ownerId) {
    throw new Error("This booking belongs to a different salon.");
  }
  const { data, error } = await supabase
    .from("appointments")
    .select(`${PASS_FIELDS}, service_id, notes`)
    .eq("id", parsed.appointmentId)
    .eq("owner_id", ownerId)
    .maybeSingle();
  if (error)
    throw new Error(
      "Could not verify this booking. Check your connection and try again.",
    );
  if (!data)
    throw new Error("No matching appointment was found in your salon.");
  return data;
}
