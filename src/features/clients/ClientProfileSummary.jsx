import UserAvatar from "../../Shared/ui/UserAvatar";
import Icon from "../../Shared/ui/Icon";
import { formatClientDate } from "./clientProfileUtils";

export default function ClientProfileSummary({
  client,
  avatarUrl,
  nextAppointment,
  upcomingCount,
  onSelectAppointment,
}) {
  const telephone = String(client.phone ?? "").replace(/[^+\d]/g, "");
  return (
    <aside className="flex min-w-0 flex-col gap-4">
      <section className="border-ink/20 border-2 bg-white/90">
        <div className="border-ink/10 bg-cream/60 border-b px-5 py-6">
          <div className="border-ink/20 mb-4 h-24 w-24 overflow-hidden rounded-full border-2 bg-white">
            <UserAvatar
              src={avatarUrl}
              alt={`${client.full_name} profile`}
              iconSize={40}
            />
          </div>
          <p className="text-ink-muted text-[0.65rem] tracking-widest uppercase">
            Client profile
          </p>
          <h2 className="mt-1 text-2xl font-semibold break-words">
            {client.full_name}
          </h2>
          <p className="text-ink-muted mt-2 text-xs">
            Last completed visit: {formatClientDate(client.lastVisit)}
          </p>
        </div>
        <div className="p-5">
          <h3 className="text-xs font-semibold tracking-widest uppercase">
            Contact details
          </h3>
          <dl className="mt-4 space-y-5 text-sm">
            <div>
              <dt className="text-ink-muted mb-1 text-xs">Phone number</dt>
              <dd>
                {telephone ? (
                  <a
                    href={`tel:${telephone}`}
                    className="hover:text-ink-muted decoration-ink/20 font-medium underline underline-offset-4"
                  >
                    {client.phone}
                  </a>
                ) : (
                  <span className="text-ink-muted">Not provided</span>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-ink-muted mb-1 text-xs">Email address</dt>
              <dd className="break-all">
                {client.email ? (
                  <a
                    href={`mailto:${client.email}`}
                    className="hover:text-ink-muted decoration-ink/20 font-medium underline underline-offset-4"
                  >
                    {client.email}
                  </a>
                ) : (
                  <span className="text-ink-muted">Not provided</span>
                )}
              </dd>
            </div>
          </dl>
        </div>
      </section>
      <section className="border-ink/20 border-2 bg-white/90 p-5">
        <div className="flex items-center gap-2">
          <Icon name="calendar-week" size={19} />
          <h3 className="text-sm font-semibold">Next appointment</h3>
        </div>
        {nextAppointment ? (
          <>
            <p className="mt-4 text-lg font-semibold">
              {nextAppointment.dateLabel}
            </p>
            <p className="text-ink-muted mt-1 text-sm">
              {nextAppointment.timeLabel} &middot; {nextAppointment.duration}
            </p>
            <p className="mt-3 text-sm break-words">
              {nextAppointment.service}
            </p>
            <p className="text-ink-muted mt-1 text-xs">
              {nextAppointment.staff} &middot; {nextAppointment.status}
            </p>
            <button
              type="button"
              onClick={() => onSelectAppointment(nextAppointment)}
              className="border-ink/30 hover:bg-ink hover:text-cream mt-4 w-full border px-3 py-2 text-xs tracking-widest uppercase transition"
            >
              View appointment
            </button>
            <p className="text-ink-muted mt-3 text-xs">
              {upcomingCount} upcoming booking{upcomingCount === 1 ? "" : "s"}
            </p>
          </>
        ) : (
          <p className="text-ink-muted mt-4 text-sm leading-6">
            No upcoming appointments booked at this salon.
          </p>
        )}
      </section>
    </aside>
  );
}
