import {
  getDateRangeConfig,
  getAppointmentDate,
  getAppointmentAmount,
  getClientKey,
} from "./reportsUtils.js";
import { isCompletedAppointment } from "../Appointments/appointmentStatsUtils.js";
import { formatCurrency } from "../../utils/currency.js";

const isoDate = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
export function buildReport(data) {
  const {
    dateRange,
    reportData,
    currencyCode,
    statCards,
    servicePopularity,
    staffPerformance,
    paymentMethods,
  } = data;
  const { start, end } = getDateRangeConfig(dateRange);
  const money = (value) => formatCurrency(value, currencyCode);
  const aggregate = (monthly) => {
    const groups = new Map();
    reportData.currentAppointments
      .filter(isCompletedAppointment)
      .forEach((appointment) => {
        const date = getAppointmentDate(appointment);
        if (!date) return;
        const key = isoDate(date).slice(0, monthly ? 7 : 10);
        const row = groups.get(key) ?? { count: 0, revenue: 0 };
        row.count++;
        row.revenue += getAppointmentAmount(appointment);
        groups.set(key, row);
      });
    return [...groups]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, row]) => [date, String(row.count), money(row.revenue)]);
  };
  const currentClients = new Set(
    reportData.currentAppointments.map(getClientKey),
  );
  const returningClients = currentClients.size - reportData.newClients;
  const sections = [
    {
      title: "Daily Sales Report",
      headers: [
        "Date",
        "Completed visits",
        `Revenue (${currencyCode || "salon currency"})`,
      ],
      rows: aggregate(false),
    },
    {
      title: "Monthly Revenue Report",
      headers: [
        "Month",
        "Completed visits",
        `Revenue (${currencyCode || "salon currency"})`,
      ],
      rows: aggregate(true),
    },
    {
      title: "Staff Performance Report",
      headers: ["Staff member", "Completed revenue"],
      rows: staffPerformance.map((row) => [row.name, money(row.value)]),
    },
    {
      title: "Client Retention Report",
      headers: ["Metric", "Value"],
      rows: [
        ["Unique clients", String(currentClients.size)],
        ["New clients", String(reportData.newClients)],
        ["Returning clients", String(Math.max(0, returningClients))],
        [
          "Returning client share",
          `${currentClients.size ? ((Math.max(0, returningClients) / currentClients.size) * 100).toFixed(1) : 0}%`,
        ],
      ],
    },
    {
      title: "Service Popularity",
      headers: ["Category", "Booking share"],
      rows: servicePopularity.map((row) => [
        row.label,
        `${row.displayValue ?? row.value}%`,
      ]),
    },
    {
      title: "Payment Methods",
      headers: ["Method", "Revenue", "Share"],
      rows: paymentMethods.map((row) => [
        row.label,
        row.value,
        `${row.percent}%`,
      ]),
    },
  ];
  return {
    title: "Reports & Analytics",
    period: `${isoDate(start)} to ${isoDate(end)}`,
    generated: new Date().toLocaleString(),
    filename: `lunara-reports-${isoDate(start)}-${isoDate(end)}`,
    stats: statCards,
    sections,
  };
}

function saveBlob(blob, name) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
export function serializeCsv(rows) {
  const cell = (value) => {
    const text = String(value ?? "");
    const safe = /^[\s]*[=+@-]/.test(text) ? `'${text}` : text;
    return `"${safe.replaceAll('"', '""')}"`;
  };
  return "\uFEFF" + rows.map((row) => row.map(cell).join(",")).join("\r\n");
}
export function downloadCsv(report, label) {
  const section = report.sections.find((item) => item.title === label);
  if (!section) throw new Error("Unknown report");
  saveBlob(
    new Blob(
      [
        serializeCsv([
          [label],
          ["Period", report.period],
          ["Generated", report.generated],
          [],
          section.headers,
          ...section.rows,
        ]),
      ],
      { type: "text/csv;charset=utf-8" },
    ),
    `${report.filename}-${label.toLowerCase().replaceAll(" ", "-")}.csv`,
  );
}

// Render a dedicated report at 3x resolution without depending on viewport size or DOM screenshots.
export async function downloadPng(report) {
  await document.fonts.ready;
  const width = 1120;
  const pages = [];
  let sections = [],
    rowCount = 0;
  // Keep each image within safe canvas dimensions, even for large teams.
  for (const section of report.sections) {
    const rows = section.rows.length
      ? section.rows
      : [["No data for this period"]];
    for (let index = 0; index < rows.length; index += 36) {
      const chunk = rows.slice(index, index + 36);
      if (rowCount + chunk.length + 3 > 60 && sections.length) {
        pages.push(sections);
        sections = [];
        rowCount = 0;
      }
      sections.push({
        ...section,
        title: section.title + (index ? " (continued)" : ""),
        rows: chunk,
      });
      rowCount += chunk.length + 3;
    }
  }
  if (sections.length) pages.push(sections);
  for (const [pageIndex, page] of pages.entries()) {
    const height =
      390 +
      page.reduce((sum, section) => sum + 100 + section.rows.length * 36, 0);
    const canvas = document.createElement("canvas");
    canvas.width = width * 3;
    canvas.height = height * 3;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas unavailable");
    ctx.scale(3, 3);
    ctx.fillStyle = "#faf7f2";
    ctx.fillRect(0, 0, width, height);
    const text = (
      value,
      x,
      y,
      size = 15,
      color = "#302821",
      maxWidth = width - 96,
    ) => {
      ctx.font = `${size >= 22 ? "600" : "400"} ${size}px Arial, sans-serif`;
      ctx.fillStyle = color;
      let fitted = String(value);
      while (ctx.measureText(fitted).width > maxWidth && fitted.length > 1)
        fitted = fitted.slice(0, -2) + "�";
      ctx.fillText(fitted, x, y);
    };
    text("LUNARA / BUSINESS REPORT", 48, 48, 15, "#806c59");
    text(report.title, 48, 96, 34);
    text(report.period, 48, 129, 17);
    text(
      `Generated ${report.generated} � ${pageIndex + 1}/${pages.length}`,
      48,
      158,
      13,
    );
    report.stats.forEach((stat, i) => {
      const x = 48 + i * 260;
      ctx.fillStyle = "#eee5d9";
      ctx.fillRect(x, 185, 245, 104);
      text(stat.title, x + 16, 215, 14, "#806c59", 213);
      text(stat.value, x + 16, 256, 26, "#302821", 213);
    });
    let y = 335;
    for (const section of page) {
      text(section.title, 48, y, 22);
      y += 20;
      const columnWidth = (width - 96) / section.headers.length;
      ctx.fillStyle = "#e6dacb";
      ctx.fillRect(48, y, width - 96, 36);
      section.headers.forEach((header, i) =>
        text(
          header,
          60 + i * columnWidth,
          y + 24,
          14,
          "#302821",
          columnWidth - 24,
        ),
      );
      y += 36;
      section.rows.forEach((row, rowIndex) => {
        ctx.fillStyle = rowIndex % 2 ? "#f3ede5" : "#ffffff";
        ctx.fillRect(48, y, width - 96, 36);
        row.forEach((value, i) =>
          text(
            value,
            60 + i * columnWidth,
            y + 24,
            14,
            "#302821",
            columnWidth - 24,
          ),
        );
        y += 36;
      });
      y += 44;
    }
    text(
      "Revenue: completed appointments only. Returning clients first booked before this period.",
      48,
      height - 25,
      12,
    );
    const blob = await new Promise((resolve, reject) =>
      canvas.toBlob(
        (result) =>
          result ? resolve(result) : reject(new Error("PNG export failed")),
        "image/png",
      ),
    );
    saveBlob(
      blob,
      `${report.filename}${pages.length > 1 ? `-${pageIndex + 1}` : ""}.png`,
    );
    canvas.width = 0;
    canvas.height = 0;
  }
}

const escapeHtml = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );
export async function printReport(report) {
  const frame = document.createElement("iframe");
  frame.title = "Printable business report";
  frame.style.cssText = "position:fixed;width:0;height:0;border:0";
  document.body.append(frame);
  const doc = frame.contentDocument;
  doc.open();
  doc.write(
    `<!doctype html><html><head><title>${escapeHtml(report.filename)}</title><style>@page{size:A4;margin:16mm}body{font:12px Arial;color:#302821}h1{font-size:28px}h2{font-size:18px;margin-top:26px;break-after:avoid}p{color:#806c59}.stats{display:flex;gap:12px;margin:24px 0}.stat{flex:1;border:1px solid #cbb9a6;padding:12px}.stat strong{display:block;font-size:19px;margin-top:8px}table{width:100%;border-collapse:collapse;table-layout:fixed}th,td{text-align:left;padding:9px;border-bottom:1px solid #ddd;overflow-wrap:anywhere}th{background:#eee5d9}thead{display:table-header-group}tr{break-inside:avoid}footer{margin-top:24px;font-size:10px}</style></head><body><p>LUNARA / BUSINESS REPORT</p><h1>${escapeHtml(report.title)}</h1><p>${escapeHtml(report.period)} � Generated ${escapeHtml(report.generated)}</p><div class="stats">${report.stats.map((stat) => `<div class="stat">${escapeHtml(stat.title)}<strong>${escapeHtml(stat.value)}</strong></div>`).join("")}</div>${report.sections.map((section) => `<h2>${escapeHtml(section.title)}</h2><table><thead><tr>${section.headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr></thead><tbody>${section.rows.length ? section.rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("") : `<tr><td colspan="${section.headers.length}">No data for this period</td></tr>`}</tbody></table>`).join("")}<footer>Revenue includes completed appointments only. Returning clients first booked before the selected period.</footer></body></html>`,
  );
  doc.close();
  try {
    await doc.fonts.ready;
    await new Promise((resolve) => setTimeout(resolve, 150));
    frame.contentWindow.addEventListener("afterprint", () => frame.remove(), {
      once: true,
    });
    frame.contentWindow.focus();
    frame.contentWindow.print();
  } catch (error) {
    frame.remove();
    throw error;
  }
  setTimeout(() => frame.remove(), 60000);
}
