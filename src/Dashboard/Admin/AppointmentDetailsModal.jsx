const statusStyles = {
  Confirmed: "border-ink bg-ink text-cream",
  Pending: "border-ink/30 bg-cream text-ink",
  Completed: "border-ink text-ink",
  Cancelled: "border-[#b0412e]/40 bg-[#b0412e]/10 text-[#b0412e]",
};

function AppointmentDetailsModal({
  appointment,
  onClose,
  onConfirm = null,
  onComplete = null,
  onDelete = null,
  showActions = true,
}) {
  if (!appointment) return null;

  const statusBadgeClass =
    statusStyles[appointment.status] ?? "border-ink/30 text-ink-muted";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="border-ink/20 relative z-10 w-full max-w-lg border-2 bg-white sm:mx-4">
        <div className="bg-ink h-1 w-full" />

        <div className="border-ink/10 flex items-start justify-between border-b-2 px-5 py-4">
          <div className="flex items-center gap-4">
            <span className="border-ink/20 bg-cream text-ink-muted flex h-11 w-11 shrink-0 items-center justify-center border text-sm font-semibold tracking-widest uppercase">
              {appointment.initials}
            </span>
            <div>
              <p className="text-ink text-base leading-tight font-semibold">
                {appointment.client}
              </p>
              <p className="text-ink-muted mt-0.5 text-xs tracking-widest uppercase">
                Appointment Details
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="border-ink/20 text-ink-muted hover:border-ink hover:text-ink flex h-8 w-8 shrink-0 items-center justify-center border-2 text-xs transition"
            aria-label="Close"
          >
            X
          </button>
        </div>

        <div className="bg-ink/10 border-ink/10 grid grid-cols-2 gap-px border-b-2">
          <div className="bg-white px-5 py-4">
            <p className="text-ink-muted mb-1 text-[0.6rem] tracking-widest uppercase">
              Service
            </p>
            <p className="text-ink text-sm font-semibold">{appointment.service}</p>
          </div>

          <div className="bg-white px-5 py-4">
            <p className="text-ink-muted mb-1 text-[0.6rem] tracking-widest uppercase">
              Status
            </p>
            <span
              className={`inline-block rounded-full border-2 px-3 py-0.5 text-[0.65rem] tracking-widest uppercase ${statusBadgeClass}`}
            >
              {appointment.status}
            </span>
          </div>

          <div className="bg-cream/60 px-5 py-4">
            <p className="text-ink-muted mb-1 text-[0.6rem] tracking-widest uppercase">
              Date
            </p>
            <p className="text-ink text-sm font-semibold">{appointment.dateLabel}</p>
          </div>

          <div className="bg-cream/60 px-5 py-4">
            <p className="text-ink-muted mb-1 text-[0.6rem] tracking-widest uppercase">
              Time
            </p>
            <p className="text-ink text-sm font-semibold">{appointment.timeLabel}</p>
          </div>

          <div className="bg-white px-5 py-4">
            <p className="text-ink-muted mb-1 text-[0.6rem] tracking-widest uppercase">
              Staff
            </p>
            <p className="text-ink text-sm font-semibold">{appointment.staff}</p>
          </div>

          <div className="bg-white px-5 py-4">
            <p className="text-ink-muted mb-1 text-[0.6rem] tracking-widest uppercase">
              Duration
            </p>
            <p className="text-ink text-sm font-semibold">{appointment.duration}</p>
          </div>

          <div className="bg-cream col-span-2 px-5 py-4">
            <p className="text-ink-muted mb-1 text-[0.6rem] tracking-widest uppercase">
              Price
            </p>
            <p className="text-ink text-base font-semibold">{appointment.price}</p>
          </div>

          {appointment.notes && (
            <div className="col-span-2 bg-white px-5 py-4">
              <p className="text-ink-muted mb-1 text-[0.6rem] tracking-widest uppercase">
                Notes
              </p>
              <p className="text-ink text-sm leading-relaxed">{appointment.notes}</p>
            </div>
          )}
        </div>

        {showActions && (
          <div className="flex gap-0">
            {appointment.status === "Pending" && onConfirm && (
              <button
                type="button"
                onClick={() => onConfirm(appointment.id)}
                className="border-ink/20 text-ink hover:bg-ink hover:text-cream flex-1 border-r-2 px-4 py-3 text-xs tracking-widest uppercase transition"
              >
                Confirm
              </button>
            )}

            {appointment.status === "Confirmed" && onComplete && (
              <button
                type="button"
                onClick={() => onComplete(appointment.id)}
                className="border-ink/20 text-ink hover:bg-ink hover:text-cream flex-1 border-r-2 px-4 py-3 text-xs tracking-widest uppercase transition"
              >
                Mark Complete
              </button>
            )}

            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(appointment.id)}
                className="flex-1 px-4 py-3 text-xs tracking-widest text-[#b0412e] uppercase transition hover:bg-[#b0412e] hover:text-white"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AppointmentDetailsModal;
