import { supabase } from "./supabase";

// Create new Appointment
export async function createAppointment(appointmentPayload) {
  const { data, error } = await supabase
    .from("appointments")
    .insert(appointmentPayload)
    .select("*");
  return { data, error };
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
      error.message || "Appointments could not be loaded!",
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
