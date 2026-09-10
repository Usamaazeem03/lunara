import clockIcon from "../../Shared/assets/icons/clock.svg";
import { getServiceSummary } from "./appointmentFormatters.js";

export const AppointmentRow = ({ appointment, onSelect }) => {
  const statusStyles = {
    Confirmed: "border-ink bg-ink text-cream",
    Pending: "border-ink/30 bg-cream text-ink",
    Completed: "border-ink text-ink",
    Cancelled: "border-[#b0412e]/40 bg-[#b0412e]/10 text-[#b0412e]",
  };

  return (
    <div
      onClick={() => onSelect(appointment)}
      className="border-ink/10 hover:bg-cream/50 grid cursor-pointer gap-3 border-b px-4 py-3 text-sm transition sm:grid-cols-[1.2fr_1.2fr_1.4fr_1fr_0.8fr_0.7fr_0.8fr] sm:items-center"
    >
      <p className="text-ink-muted text-xs tracking-widest uppercase sm:hidden">
        Date & Time
      </p>
      <div className="flex items-center gap-2">
        <span className="border-ink/20 bg-cream flex h-8 w-8 items-center justify-center rounded-full border">
          <img src={clockIcon} alt="" className="h-4 w-4 opacity-70" />
        </span>
        <div>
          <p className="font-semibold">{appointment.timeLabel}</p>
          <p className="text-ink-muted text-xs">{appointment.dateLabel}</p>
        </div>
      </div>

      <p className="text-ink-muted text-xs tracking-widest uppercase sm:hidden">
        Client
      </p>
      <div className="flex items-center gap-3">
        <span className="border-ink/20 bg-cream text-ink-muted flex h-9 w-9 items-center justify-center rounded-full border text-xs font-semibold uppercase">
          {appointment.initials}
        </span>
        <span className="font-semibold">{appointment.client}</span>
      </div>

      <p className="text-ink-muted text-xs tracking-widest uppercase sm:hidden">
        Service
      </p>
      <span>{getServiceSummary(appointment.service)}</span>

      <p className="text-ink-muted text-xs tracking-widest uppercase sm:hidden">
        Staff
      </p>
      <span>{appointment.staff}</span>

      <p className="text-ink-muted text-xs tracking-widest uppercase sm:hidden">
        Duration
      </p>
      <span>{appointment.duration}</span>

      <p className="text-ink-muted text-xs tracking-widest uppercase sm:hidden">
        Price
      </p>
      <span className="font-semibold">{appointment.price}</span>

      <p className="text-ink-muted text-xs tracking-widest uppercase sm:hidden">
        Status
      </p>
      <div className="flex items-center gap-2">
        <span
          className={`w-fit rounded-full border-2 px-3 py-1 text-[0.65rem] tracking-widest uppercase ${statusStyles[appointment.status] ?? "border-ink/30 text-ink-muted"}`}
        >
          {appointment.status}
        </span>
        {appointment.isLocalDraft && (
          <span className="rounded-full border border-amber-300 bg-amber-50 px-2 py-1 text-[0.55rem] tracking-widest text-amber-700 uppercase">
            Local
          </span>
        )}
      </div>
    </div>
  );
};
