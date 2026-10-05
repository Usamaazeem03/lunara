import { localizedError } from "../../../i18n/localizedError.js";
import i18n from "../../../i18n/i18n.js";
import {
  formatPassDate,
  formatPassTime,
  getBookingStatus,
} from "./bookingPassUtils.js";

const escapeXml = (value) =>
  String(value ?? "").replace(
    /[<>&"']/g,
    (char) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&apos;",
      })[char],
  );

export async function downloadBookingPass(appointment, priceLabel, qrElement) {
  if (!qrElement)
    throw localizedError("bookingPass.yourPassIsStillLoadingPleaseTryAgain");
  const qr = qrElement.cloneNode(true);
  qr.setAttribute("x", "190");
  qr.setAttribute("y", "190");
  qr.setAttribute("width", "340");
  qr.setAttribute("height", "340");
  const lines = [
    [i18n.t("bookingPass.guest"), appointment.client_name || i18n.t("common.guest")],
    [i18n.t("bookingPass.services"), appointment.service_name],
    [
      i18n.t("bookingPass.dateTime"),
      i18n.t("bookingPass.at2", { value1: formatPassDate(appointment.appointment_date), value2: formatPassTime(appointment.appointment_time) }),
    ],
    [i18n.t("bookingPass.stylist"), appointment.staff_name || i18n.t("common.anyAvailableStylist")],
    [
      i18n.t("bookingPass.durationTotal"),
      i18n.t("bookingPass.min2", { value1: appointment.duration_minutes || 0, value2: priceLabel }),
    ],
    [i18n.t("bookingPass.paymentPreference2"), appointment.payment_option || i18n.t("bookingPass.askTheSalon")],
    [i18n.t("bookingPass.appointmentId"), appointment.id],
  ];
  let y = 625;
  const text = lines
    .map(([label, value]) => {
      const chunks = String(value ?? "").match(/.{1,44}(?:\s|$)|.{1,44}/g) || [
        "-",
      ];
      let markup = `<text x="56" y="${y}" font-size="14" letter-spacing="2" fill="#756b60">${escapeXml(label)}</text>`;
      chunks.forEach((chunk, index) => {
        markup += `<text x="56" y="${y + 30 + index * 28}" font-size="22">${escapeXml(chunk.trim())}</text>`;
      });
      y += 64 + chunks.length * 28;
      return markup;
    })
    .join("");
  const height = y + 75;
  const status = getBookingStatus(appointment.status);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="${height}" viewBox="0 0 720 ${height}"><rect width="720" height="${height}" rx="32" fill="#fffdf9"/><g font-family="Arial, sans-serif" fill="#2d2620"><text x="360" y="65" text-anchor="middle" font-size="22" letter-spacing="7">LUNARA</text><text x="360" y="115" text-anchor="middle" font-size="36" font-weight="bold">Your appointment pass</text><text x="360" y="155" text-anchor="middle" font-size="18">${escapeXml(status.label)}</text>${new XMLSerializer().serializeToString(qr)}<path d="M40 565H680" stroke="#cfc5b9" stroke-dasharray="6 8"/>${text}<text x="360" y="${height - 55}" text-anchor="middle" font-size="16">Show your QR at the salon. Status is checked at scanning.</text><text x="360" y="${height - 28}" text-anchor="middle" font-size="14" fill="#756b60">Booking reference only. This is not a payment receipt.</text></g></svg>`;
  const url = URL.createObjectURL(
    new Blob([svg], { type: "image/svg+xml;charset=utf-8" }),
  );
  try {
    const image = new Image();
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = () =>
        reject(
          localizedError("bookingPass.couldNotSaveThePassYouCanTakeAScreenshot"),
        );
      image.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = 720;
    canvas.height = height;
    canvas.getContext("2d").drawImage(image, 0, 0);
    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/png"),
    );
    if (!blob)
      throw localizedError("bookingPass.couldNotSaveThePassPleaseTakeAScreenshot");
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `lunara-booking-${appointment.id}.png`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
  } finally {
    URL.revokeObjectURL(url);
  }
}
