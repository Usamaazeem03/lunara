import i18n from "../i18n/i18n.js";
import { supabase } from "./supabase";
import { createAppointmentTransport } from "./appointmentTransport.js";

// Enable only after deploying/testing the function. Remove the transitional
// direct transport alongside audited database enforcement before OTP goes live.
const createAppointment = createAppointmentTransport(
  supabase,
  import.meta.env.VITE_APPOINTMENT_TRANSPORT || "direct",
);

export async function createOwnerAppointment(appointmentPayload) {
  return createAppointment("owner", appointmentPayload);
}

export async function createPublicAppointment(
  appointmentPayload,
  verification,
) {
  return createAppointment("public", appointmentPayload, verification);
}

// Load appointments for an owner. Statistics can exclude cancelled rows.
export async function getAppointmentsByOwner(
  ownerId,
  includeCancelled = false,
) {
  let query = supabase.from("appointments").select("*").eq("owner_id", ownerId);

  if (!includeCancelled) {
    query = query.neq("status", "Cancelled");
  }

  const { data, error } = await query;

  if (error) {
    const appointmentError = new Error(
      error.message || i18n.t("services.appointmentsCouldNotBeLoaded"),
    );
    Object.assign(appointmentError, error);
    throw appointmentError;
  }

  return data ?? [];
}

// Confirm an appointment
export async function confirmAppointment(appointmentId) {
  const { data, error } = await supabase
    .from("appointments")
    .update({ status: "Confirmed" })
    .eq("id", appointmentId)
    .select("*")
    .single();
  return { data, error };
}
// Complete an appointment
export async function completeAppointment(appointmentId) {
  const { data, error } = await supabase
    .from("appointments")
    .update({ status: "Completed" })
    .eq("id", appointmentId)
    .select("*")
    .single();
  return { data, error };
}

// Delete an appointment
export async function deleteAppointment(appointmentId) {
  const { data, error } = await supabase
    .from("appointments")
    .delete()
    .eq("id", appointmentId)
    .select("*")
    .single();
  return { data, error };
}
