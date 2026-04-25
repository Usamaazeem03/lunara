import calendarIcon from "../../Shared/assets/icons/calendar.svg";
import clockIcon from "../../Shared/assets/icons/clock.svg";
import creditCardIcon from "../../Shared/assets/icons/credit-card.svg";
import hairCareIcon from "../../Shared/assets/icons/hair-care.svg";

function AppointmentCard({ appointment }) {
  const statusStyles = {
    Confirmed: "border-ink text-ink",
    Completed: "border-ink bg-ink text-cream",
    Cancelled: "border-danger text-danger",
  };
  const actionStyles = {
    primary: "border-ink hover:bg-ink hover:text-cream",
    ghost: "border-ink/30 bg-white/70 hover:border-ink hover:text-ink",
    danger: "border-danger text-danger hover:bg-danger hover:text-white",
  };
  return (
    <article className="relative overflow-hidden border-2 border-ink/20 bg-white p-3 sm:p-4">
      <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-ink/5"></div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-ink-muted">
            Appointment {appointment.id}
          </p>
          <h3 className="mt-1 text-base font-semibold">
            {appointment.service}
          </h3>
          <p className="text-xs text-ink-muted">{appointment.description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full border-2 px-3 py-1 text-[0.65rem] uppercase tracking-widest ${
              statusStyles[appointment.status] ?? "border-ink/40 text-ink-muted"
            }`}
          >
            {appointment.status}
          </span>
          {appointment.payment && (
            <span className="rounded-full border-2 border-ink/30 bg-cream px-3 py-1 text-[0.65rem] uppercase tracking-widest text-ink">
              {appointment.payment}
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <InfoTile label="Date" value={appointment.date} icon={calendarIcon} />
        <InfoTile label="Time" value={appointment.time} icon={clockIcon} />
        <InfoTile label="Staff" value={appointment.staff} icon={hairCareIcon} />
        <InfoTile
          label="Amount"
          value={appointment.amount}
          icon={creditCardIcon}
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t-2 border-ink/10 pt-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-ink-muted">
            Location & Notes
          </p>
          <p className="text-sm font-semibold">{appointment.location}</p>
          <p className="text-xs text-ink-muted">{appointment.notes}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {appointment.actions?.map((action) => (
            <button
              key={action.label}
              type="button"
              className={`border-2 px-3 py-1.5 text-xs uppercase tracking-widest transition ${
                actionStyles[action.variant] ?? actionStyles.ghost
              }`}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </article>
  );
}

const InfoTile = ({ label, value, icon }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink/20 bg-cream">
        <img src={icon} alt="" className="h-4 w-4 opacity-70" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-widest text-ink-muted">
          {label}
        </p>
        <p className="text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
};

export default AppointmentCard;
