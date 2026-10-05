import { localizedError } from "../i18n/localizedError.js";
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
  if (!user) throw localizedError("booking.pleaseSignInToViewYourAppointments");
  const { data, error } = await supabase
    .from("appointments")
    .select(PASS_FIELDS)
    .eq("client_id", user.id)
    .order("appointment_date", { ascending: false })
    .order("appointment_time", { ascending: false });
  if (error)
    throw localizedError("booking.yourAppointmentsCouldNotBeLoadedPleaseTryAgain");
  const { data: ratings, error: ratingError } = await supabase
    .from("staff_ratings")
    .select("appointment_id, rating")
    .eq("client_id", user.id);
  if (ratingError)
    throw localizedError("booking.yourRatingsCouldNotBeLoadedPleaseTryAgain");
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
    throw localizedError("booking.signInToTheSalonOwnerAccountToVerifyA");
  }
  if (parsed.ownerId !== ownerId) {
    throw localizedError("booking.thisBookingBelongsToADifferentSalon");
  }
  const { data, error } = await supabase
    .from("appointments")
    .select(`${PASS_FIELDS}, service_id, notes`)
    .eq("id", parsed.appointmentId)
    .eq("owner_id", ownerId)
    .maybeSingle();
  if (error)
    throw localizedError("booking.couldNotVerifyThisBookingCheckYourConnectionAndTry");
  if (!data)
    throw localizedError("booking.noMatchingAppointmentWasFoundInYourSalon");
  return data;
}
