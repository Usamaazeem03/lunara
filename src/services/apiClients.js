import { supabase } from "./supabase";

export async function getClients(ownerId) {
  if (!ownerId) throw new Error("An owner is required to load clients.");
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
    throw new Error(clients.error.message || "Clients could not be loaded.");
  if (appointments.error)
    throw new Error(
      appointments.error.message || "Client appointments could not be loaded.",
    );
  return { clients: clients.data ?? [], appointments: appointments.data ?? [] };
}

export async function createClient({ owner_id, full_name, phone, email }) {
  if (!owner_id) throw new Error("An owner is required to add a client.");
  if (!full_name?.trim()) throw new Error("Full name is required.");
  const { error } = await supabase.from("profiles").insert([
    {
      owner_id,
      full_name: full_name.trim(),
      phone: phone?.trim() || null,
      email: email?.trim() || null,
      role: "client",
    },
  ]);
  if (error) throw new Error(error.message || "Unable to save the client.");
  return { success: true, message: "Client added." };
}
