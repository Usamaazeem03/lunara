import { localizedError } from "../i18n/localizedError.js";
import i18n from "../i18n/i18n.js";
import { supabase } from "./supabase";

export async function getClients(ownerId) {
  if (!ownerId) throw localizedError("clients.anOwnerIsRequiredToLoadClients");
  const [clients, appointments] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, auth_id, full_name, phone, email, owner_id, avatar_img")
      .eq("role", "client")
      .eq("owner_id", ownerId)
      .order("full_name", { ascending: true }),
    supabase
      .from("appointments")
      .select(
        "id, client_id, client_name, client_phone, client_email, appointment_date, appointment_time, service_name, staff_name, duration_minutes, price, status, notes, reward_discount, reward_code, reward_profile_id",
      )
      .eq("owner_id", ownerId),
  ]);
  if (clients.error)
    throw new Error(clients.error.message || i18n.t("clients.clientsCouldNotBeLoaded"));
  if (appointments.error)
    throw new Error(
      appointments.error.message || i18n.t("clients.clientAppointmentsCouldNotBeLoaded"),
    );
  return { clients: clients.data ?? [], appointments: appointments.data ?? [] };
}

export async function createClient({ owner_id, full_name, phone, email }) {
  if (!owner_id) throw localizedError("clients.anOwnerIsRequiredToAddAClient");
  if (!full_name?.trim()) throw localizedError("common.fullNameIsRequired");
  const { error } = await supabase.from("profiles").insert([
    {
      owner_id,
      full_name: full_name.trim(),
      phone: phone?.trim() || null,
      email: email?.trim() || null,
      role: "client",
    },
  ]);
  if (error) throw new Error(error.message || i18n.t("clients.unableToSaveTheClient"));
  return { success: true, message: i18n.t("clients.clientAdded") };
}
