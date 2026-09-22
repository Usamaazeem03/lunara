import { getPaymentMethod, paymentStatus } from "./paymentUtils.js";

export function getInvoiceData(appointment, currencyCode, salon = {}) {
  if (paymentStatus(appointment) !== "completed") {
    throw new Error("Invoices are available for completed appointments only.");
  }
  if (!appointment.id || !appointment.owner_id)
    throw new Error("This booking has no saved invoice reference.");
  if (!currencyCode)
    throw new Error(
      "Set your salon currency in Settings before downloading an invoice.",
    );
  const total = Number(appointment.price);
  if (appointment.price == null || !Number.isFinite(total) || total < 0)
    throw new Error("This booking has no valid invoice amount.");
  const discount = Math.max(0, Number(appointment.reward_discount) || 0);
  return {
    number: `INV-${appointment.id}`,
    appointmentId: String(appointment.id),
    salon: salon?.full_name || "Salon",
    salonPhone: salon?.phone || "",
    salonEmail: salon?.email || "",
    client: appointment.client_name || "Walk-in",
    phone: appointment.client_phone || "Not provided",
    email: appointment.client_email || "Not provided",
    date: appointment.appointment_date,
    time: appointment.appointment_time,
    service: appointment.service_name || "Salon service",
    staff: appointment.staff_name || "Not specified",
    method: getPaymentMethod(appointment),
    subtotal: total + discount,
    discount,
    total,
    currency: currencyCode,
  };
}
