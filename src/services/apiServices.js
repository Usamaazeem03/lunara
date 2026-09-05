import { supabase } from "./supabase";

const getServiceMutationError = (error, fallbackMessage) => {
  const errorText =
    `${error?.message ?? ""} ${error?.details ?? ""}`.toLowerCase();

  if (
    error?.code === "23503" &&
    errorText.includes("appointments_service_id_fkey")
  ) {
    const bookingConflict = new Error(
      "This service has existing bookings, so it cannot be deleted. Mark it inactive instead.",
    );
    bookingConflict.isServiceBookingConflict = true;
    return bookingConflict;
  }

  return new Error(error?.message || fallbackMessage);
};

// get services
export async function getServices(ownerId) {
  const { data, error } = await supabase
    .from("services")
    .select(
      "id, name, description, category, price, duration_minutes, is_active, owner_id, created_at",
    )
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    throw new Error("Services could not be loaded!");
  }

  return data;
}

// Get appointments for service statistics
export async function getAppointmentsByOwner(ownerId) {
  const { data, error } = await supabase
    .from("appointments")
    .select("service_id, status")
    .eq("owner_id", ownerId)
    .neq("status", "Cancelled");

  if (error) {
    throw new Error(error.message || "Appointments could not be loaded!");
  }

  return data ?? [];
}

// Create new service
export async function createService(payload) {
  const { data, error } = await supabase
    .from("services")
    .insert([payload])
    .select(
      "id, name, description, category, price, duration_minutes, is_active, owner_id",
    )
    .single();

  if (error) {
    throw new Error(error.message || "Unable to save the service.");
  }

  return { data, success: true, message: "Service added." };
}

// Update existing service
export async function updateService(serviceId, payload) {
  const { data, error } = await supabase
    .from("services")
    .update(payload)
    .eq("id", serviceId)
    .select(
      "id, name, description, category, price, duration_minutes, is_active, owner_id",
    )
    .single();

  if (error) {
    throw getServiceMutationError(error, "Unable to update the service.");
  }

  return { data, success: true, message: "Service updated." };
}

// Delete service
export async function deleteService(serviceId) {
  const { error } = await supabase
    .from("services")
    .delete()
    .eq("id", serviceId);

  if (error) {
    throw getServiceMutationError(error, "Unable to delete the service.");
  }

  return { success: true, message: "Service deleted." };
}
