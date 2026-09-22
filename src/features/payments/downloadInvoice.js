import { jsPDF } from "jspdf";
import { getInvoiceData } from "./invoiceData.js";

// Canvas uses the browser's fonts so international client names render correctly.
export async function downloadAppointmentInvoice(
  appointment,
  currencyCode,
  salon,
) {
  const invoice = getInvoiceData(appointment, currencyCode, salon);
  await document.fonts?.ready;
  const canvas = document.createElement("canvas");
  canvas.width = 1240;
  canvas.height = 1754;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Your browser could not prepare the invoice.");
  const pdf = new jsPDF({ unit: "mm", format: "a4", compress: true });
  pdf.setProperties({
    title: `Invoice ${invoice.number}`,
    subject: "Completed salon appointment",
    author: invoice.salon,
  });
  const margin = 90;
  const width = canvas.width - margin * 2;
  let y = 0;
  let page = 1;

  function startPage() {
    ctx.fillStyle = "#fffdf9";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#2d2620";
    ctx.fillRect(margin, 70, width, 6);
    ctx.font = "600 44px sans-serif";
    ctx.fillText("INVOICE", margin, 145);
    ctx.font = "22px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(invoice.number, canvas.width - margin, 145);
    ctx.textAlign = "left";
    y = 210;
  }

  function finishPage() {
    ctx.font = "18px sans-serif";
    ctx.fillStyle = "#5f544b";
    ctx.fillText("Thank you for visiting.", margin, 1660);
    ctx.textAlign = "right";
    ctx.fillText(`Page ${page}`, canvas.width - margin, 1660);
    ctx.textAlign = "left";
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, 210, 297);
  }

  function ensureSpace(height) {
    if (y + height <= 1570) return;
    finishPage();
    pdf.addPage();
    page += 1;
    startPage();
  }

  function line(text, { size = 26, bold = false, color = "#2d2620" } = {}) {
    const font = `${bold ? "600 " : ""}${size}px sans-serif`;
    ctx.font = font;
    // Wrap by character to support both long email addresses and unspaced names.
    let current = "";
    const lines = [];
    for (const character of String(text)) {
      if (
        character === "\n" ||
        ctx.measureText(current + character).width > width
      ) {
        lines.push(current);
        current = character === "\n" ? "" : character;
      } else current += character;
    }
    lines.push(current);
    for (const value of lines) {
      ensureSpace(size + 18);
      ctx.font = font;
      ctx.fillStyle = color;
      ctx.fillText(value, margin, y);
      y += size + 14;
    }
  }

  function heading(text) {
    y += 24;
    ensureSpace(95);
    line(text.toUpperCase(), { size: 20, bold: true, color: "#5f544b" });
  }
  const money = (value) =>
    new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: invoice.currency,
      currencyDisplay: "code",
    }).format(value);

  startPage();
  line(invoice.salon, { size: 34, bold: true });
  if (invoice.salonPhone) line(invoice.salonPhone, { size: 22 });
  if (invoice.salonEmail) line(invoice.salonEmail, { size: 22 });
  heading("Client");
  line(invoice.client, { bold: true });
  line(`Phone: ${invoice.phone}`, { size: 23 });
  line(`Email: ${invoice.email}`, { size: 23 });
  heading("Completed visit");
  line(`Booking: ${invoice.appointmentId}`, { size: 23 });
  line(`Appointment date: ${invoice.date || "Not recorded"}`, { size: 23 });
  if (invoice.time) line(`Time: ${invoice.time.slice(0, 5)}`, { size: 23 });
  line(`Staff: ${invoice.staff}`, { size: 23 });
  heading("Service");
  line(invoice.service);
  heading("Amount");
  if (invoice.discount > 0) {
    line(`Subtotal: ${money(invoice.subtotal)}`, { size: 25 });
    line(`Reward discount: -${money(invoice.discount)}`, { size: 25 });
  }
  line(`Total: ${money(invoice.total)}`, { size: 34, bold: true });
  line(`Payment method: ${invoice.method}`, { size: 23 });
  finishPage();
  const safeId = invoice.appointmentId.replace(/[^a-zA-Z0-9_-]/g, "-");
  pdf.save(`Lunara-Invoice-${safeId}.pdf`);
}
