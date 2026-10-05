import { fixedLabel } from "../../i18n/fixedLabels.js";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import Icon from "../../Shared/ui/Icon";
import BottomActionBar from "../services/BottomActionBar";
import { filterClientAppointments } from "./clientProfileUtils";

const PAGE_SIZE = 8;
const statusStyles = {
  Confirmed: "border-ink bg-ink text-cream",
  Pending: "border-ink/25 bg-cream text-ink-muted",
  Completed: "border-ink/25 bg-white text-ink",
  Cancelled: "border-danger/30 bg-danger/5 text-danger",
};

export default function ClientAppointmentHistory({ rows, onSelect }) {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const filtered = filterClientAppointments(rows, search, status);
  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const currentPage = Math.min(page, Math.max(1, pageCount));
  const visible = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  const reset = () => {
    setSearch("");
    setStatus("All");
    setPage(1);
  };
  return (
    <section className="border-ink/20 min-w-0 self-start border-2 bg-white/90">
      <div className="border-ink/10 flex flex-wrap items-start justify-between gap-3 border-b-2 p-5">
        <div>
          <h2 className="text-lg font-semibold">{t("clients.appointmentHistory")}</h2>
          <p className="text-ink-muted mt-1 text-xs"> {t("clients.bookingsAtThisSalonNewestFirstSelectAVisitFor")} </p>
        </div>
        <span className="border-ink/15 bg-cream rounded-full border px-3 py-1 text-xs">
          {rows.length} {t("clients.total")} </span>
      </div>
      <div className="border-ink/10 grid gap-3 border-b p-4 sm:grid-cols-[1fr_auto]">
        <label className="border-ink/20 focus-within:border-ink flex min-w-0 items-center gap-2 border bg-white px-3">
          <Icon name="search" size={18} className="text-ink-muted shrink-0" />
          <input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            aria-label={t("clients.searchAppointmentHistory")}
            placeholder={t("clients.searchServiceStaffOrDate")}
            className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
          />
        </label>
        <select
          aria-label={t("appointments.filterAppointmentsByStatus")}
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setPage(1);
          }}
          className="border-ink/20 focus-visible:outline-ink bg-cream/50 border px-3 py-3 text-sm"
        >
          <option value="All">{t("clients.allStatuses")}</option>
          {[
            ...new Set([
              t("common.completed"),
              t("common.confirmed"),
              t("common.pending"),
              t("common.cancelled"),
              ...rows.map((row) => row.status),
            ]),
          ].map((label) => (
            <option key={label}>{label}</option>
          ))}
        </select>
      </div>
      <div className="text-ink-muted border-ink/10 bg-cream/60 hidden grid-cols-[1.1fr_1.4fr_0.9fr_0.9fr] gap-4 border-b px-5 py-3 text-[0.65rem] tracking-widest uppercase md:grid">
        <span>{t("booking.dateTime")}</span>
        <span>{t("clients.serviceStaff")}</span>
        <span>{t("common.amount")}</span>
        <span>{t("common.status")}</span>
      </div>
      {visible.length ? (
        <div>
          {visible.map((appointment) => (
            <button
              key={appointment.id}
              type="button"
              onClick={() => onSelect(appointment)}
              aria-label={t("clients.viewAppointmentOnAt", { value1: appointment.service, value2: appointment.dateLabel, value3: appointment.timeLabel })}
              className="border-ink/10 hover:bg-cream/50 focus-visible:outline-ink grid w-full grid-cols-2 items-center gap-4 border-b px-5 py-4 text-left text-sm transition focus-visible:outline-2 focus-visible:-outline-offset-2 md:grid-cols-[1.1fr_1.4fr_0.9fr_0.9fr]"
            >
              <span>
                <span className="block font-semibold">
                  {appointment.dateLabel}
                </span>
                <span className="text-ink-muted mt-1 block text-xs">
                  {appointment.timeLabel}
                </span>
              </span>
              <span className="min-w-0">
                <span
                  className="block font-medium break-words"
                  title={appointment.service}
                >
                  {appointment.serviceSummary}
                </span>
                <span className="text-ink-muted mt-1 block text-xs">
                  {appointment.staff} &middot; {appointment.duration}
                </span>
              </span>
              <span className="font-semibold">{appointment.price}</span>
              <span
                className={`w-fit rounded-full border px-2.5 py-1 text-[0.6rem] tracking-wide uppercase ${statusStyles[appointment.status] || "border-ink/20 text-ink-muted"}`}
              >
                {fixedLabel(appointment.status, "status")}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="border-ink/20 bg-cream/40 m-4 border border-dashed p-8 text-center">
          <Icon
            name="calendar-week"
            size={28}
            className="text-ink-muted mx-auto mb-3"
          />
          <p className="text-sm font-medium">
            {rows.length
              ? t("clients.noAppointmentsMatchYourFilters")
              : t("clients.noAppointmentsYet")}
          </p>
          <p className="text-ink-muted mt-2 text-xs">
            {rows.length
              ? t("clients.tryADifferentServiceDateOrStatus")
              : t("clients.thisClientSBookingsWillAppearHere")}
          </p>
          {rows.length > 0 && (
            <button
              type="button"
              onClick={reset}
              className="mt-4 text-xs underline underline-offset-4"
            > {t("clients.clearFilters")} </button>
          )}
        </div>
      )}
      <div className="text-ink-muted flex flex-wrap items-center justify-between gap-2 px-5 py-3 text-xs">
        <p role="status">
          {filtered.length
            ? t("clients.ofBookings", { value1: (currentPage - 1) * PAGE_SIZE + 1, value2: Math.min(currentPage * PAGE_SIZE, filtered.length), value3: filtered.length })
            : t("clients.0Bookings")}
        </p>
        <p>{t("clients.amountsUseYourSalonCurrency")}</p>
      </div>
      <BottomActionBar
        currentPage={currentPage}
        totalPages={pageCount}
        onPageChange={setPage}
      />
    </section>
  );
}
