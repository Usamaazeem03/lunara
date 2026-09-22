import { supabase } from "./supabase";

const PAYMENT_FIELDS =
  "id, owner_id, client_id, client_name, client_phone, client_email, service_name, staff_name, appointment_date, appointment_time, duration_minutes, price, reward_discount, reward_original_price, status, payment_method, payment_option, notes";
const PAGE_SIZE = 1000;

export async function getPayments(ownerId) {
  if (!ownerId) throw new Error("Please sign in to load payments.");
  const appointments = [];
  for (let offset = 0; ; offset += PAGE_SIZE) {
    const { data, error } = await supabase
      .from("appointments")
      .select(PAYMENT_FIELDS)
      .eq("owner_id", ownerId)
      .order("id", { ascending: true })
      .range(offset, offset + PAGE_SIZE - 1);
    if (error) throw new Error(error.message || "Unable to load payments.");
    appointments.push(...(data ?? []));
    if (!data || data.length < PAGE_SIZE) return appointments;
  }
}
