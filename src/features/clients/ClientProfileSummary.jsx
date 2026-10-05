import { fixedLabel } from "../../i18n/fixedLabels.js";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const telephone = String(client.phone ?? "").replace(/[^+\d]/g, "");
  return (
    <aside className="flex min-w-0 flex-col gap-4">
      <section className="border-ink/20 border-2 bg-white/90">
        <div className="border-ink/10 bg-cream/60 border-b px-5 py-6">
          <div className="border-ink/20 mb-4 h-24 w-24 overflow-hidden rounded-full border-2 bg-white">
            <UserAvatar
              src={avatarUrl}
              alt={t("common.profile", { value1: client.full_name })}
              iconSize={40}
            />
          </div>
          <p className="text-ink-muted text-[0.65rem] tracking-widest uppercase"> {t("clients.clientProfile")} </p>
          <h2 className="mt-1 text-2xl font-semibold break-words">
            {client.nameFallbackKey ? t("common.unknownClient") : client.full_name}
          </h2>
          <p className="text-ink-muted mt-2 text-xs"> {t("clients.lastCompletedVisit")} {formatClientDate(client.lastVisit)}
          </p>
        </div>
        <div className="p-5">
          <h3 className="text-xs font-semibold tracking-widest uppercase"> {t("clients.contactDetails")} </h3>
          <dl className="mt-4 space-y-5 text-sm">
            <div>
              <dt className="text-ink-muted mb-1 text-xs">{t("common.phoneNumber")}</dt>
              <dd>
                {telephone ? (
                  <a
                    href={`tel:${telephone}`}
                    className="hover:text-ink-muted decoration-ink/20 font-medium underline underline-offset-4"
                  >
                    {client.phone}
                  </a>
                ) : (
                  <span className="text-ink-muted">{t("common.notProvided")}</span>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-ink-muted mb-1 text-xs">{t("clients.emailAddress")}</dt>
              <dd className="break-all">
                {client.email ? (
                  <a
                    href={`mailto:${client.email}`}
                    className="hover:text-ink-muted decoration-ink/20 font-medium underline underline-offset-4"
                  >
                    {client.email}
                  </a>
                ) : (
                  <span className="text-ink-muted">{t("common.notProvided")}</span>
                )}
              </dd>
            </div>
          </dl>
        </div>
      </section>
      <section className="border-ink/20 border-2 bg-white/90 p-5">
        <div className="flex items-center gap-2">
          <Icon name="calendar-week" size={19} />
          <h3 className="text-sm font-semibold">{t("clients.nextAppointment")}</h3>
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
              {nextAppointment.staff} &middot; {fixedLabel(nextAppointment.status, "status")}
            </p>
            <button
              type="button"
              onClick={() => onSelectAppointment(nextAppointment)}
              className="border-ink/30 hover:bg-ink hover:text-cream mt-4 w-full border px-3 py-2 text-xs tracking-widest uppercase transition"
            > {t("clients.viewAppointment")} </button>
            <p className="text-ink-muted mt-3 text-xs">
              {upcomingCount} {t("clients.upcomingBooking")}{upcomingCount === 1 ? "" : "s"}
            </p>
          </>
        ) : (
          <p className="text-ink-muted mt-4 text-sm leading-6"> {t("clients.noUpcomingAppointmentsBookedAtThisSalon")} </p>
        )}
      </section>
    </aside>
  );
}
