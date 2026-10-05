import { localizedError } from "../../i18n/localizedError.js";
import i18n from "../../i18n/i18n.js";
import { getPaymentMethod, paymentStatus } from "./paymentUtils.js";

export function getInvoiceData(appointment, currencyCode, salon = {}) {
  if (paymentStatus(appointment) !== "completed") {
    throw localizedError("payments.invoicesAreAvailableForCompletedAppointmentsOnly");
  }
  if (!appointment.id || !appointment.owner_id)
    throw localizedError("payments.thisBookingHasNoSavedInvoiceReference");
  if (!currencyCode)
    throw localizedError("payments.setYourSalonCurrencyInSettingsBeforeDownloadingAnInvoice");
  const total = Number(appointment.price);
  if (appointment.price == null || !Number.isFinite(total) || total < 0)
    throw localizedError("payments.thisBookingHasNoValidInvoiceAmount");
  const discount = Math.max(0, Number(appointment.reward_discount) || 0);
  return {
    number: `INV-${appointment.id}`,
    appointmentId: String(appointment.id),
    salon: salon?.full_name || i18n.t("common.salon"),
    salonPhone: salon?.phone || "",
    salonEmail: salon?.email || "",
    client: appointment.client_name || i18n.t("common.walkIn"),
    phone: appointment.client_phone || i18n.t("common.notProvided"),
    email: appointment.client_email || i18n.t("common.notProvided"),
    date: appointment.appointment_date,
    time: appointment.appointment_time,
    service: appointment.service_name || i18n.t("payments.salonService"),
    staff: appointment.staff_name || i18n.t("payments.notSpecified"),
    method: getPaymentMethod(appointment),
    subtotal: total + discount,
    discount,
    total,
    currency: currencyCode,
  };
}
