import UserAvatar from "../../Shared/ui/UserAvatar";
import { formatCurrency } from "../../utils/currency";
import calendarIcon from "../../Shared/assets/icons/calendar.svg";
const ClientRow = ({ client, onViewProfile, currencyCode }) => {
  return (
    <div className="border-ink/10 hover:bg-cream/50 grid gap-3 border-b px-4 py-3 text-sm transition sm:grid-cols-[1.4fr_1.6fr_1fr_0.9fr_0.8fr] sm:items-center">
      <p className="text-ink-muted text-xs tracking-widest uppercase sm:hidden">
        Name
      </p>
      <div className="flex items-center gap-3">
        <span className="border-ink/20 bg-cream text-ink-muted flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border text-xs font-semibold uppercase">
          <UserAvatar
            src={client.avatar_img}
            alt={`${client.full_name || "Client"} profile`}
          />
        </span>
        <span className="font-semibold">
          {client.full_name || client.name || "Unknown Client"}
        </span>
      </div>

      <p className="text-ink-muted text-xs tracking-widest uppercase sm:hidden">
        Contact
      </p>
      <div className="text-ink-muted text-xs">
        <p>{client.phone}</p>
        <p>{client.email}</p>
      </div>

      <p className="text-ink-muted text-xs tracking-widest uppercase sm:hidden">
        Last Visit
      </p>
      <div className="flex items-center gap-2">
        <img src={calendarIcon} alt="" className="h-4 w-4 opacity-60" />
        <span>{client.lastVisit}</span>
      </div>

      <p className="text-ink-muted text-xs tracking-widest uppercase sm:hidden">
        Total Spent
      </p>
      <span className="font-semibold">
        {currencyCode
          ? formatCurrency(client.totalSpent, currencyCode)
          : "Unavailable"}
      </span>

      <p className="text-ink-muted text-xs tracking-widest uppercase sm:hidden">
        Actions
      </p>
      <button
        type="button"
        onClick={() => onViewProfile?.(client)}
        className="border-ink hover:bg-ink hover:text-cream w-fit border-2 px-3 py-1 text-xs tracking-widest uppercase transition"
      >
        View Profile
      </button>
    </div>
  );
};

export default ClientRow;
