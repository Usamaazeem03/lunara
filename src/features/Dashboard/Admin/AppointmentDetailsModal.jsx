import { fixedLabel } from "../../../i18n/fixedLabels.js";
import { useTranslation } from "react-i18next";
import { useUserAvatars } from "../../../globalHooks/useUserAvatars";
import UserAvatar from "../../../Shared/ui/UserAvatar";
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
  const { t } = useTranslation();
  const { avatars } = useUserAvatars(
    appointment?.avatarUrl === undefined ? [appointment?.client_id] : [],
  );
  if (!appointment) return null;
  const avatarUrl = appointment.avatarUrl ?? avatars[appointment.client_id];

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
            <span className="border-ink/20 bg-cream text-ink-muted flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden border text-sm font-semibold tracking-widest uppercase">
              <UserAvatar
                src={avatarUrl}
                alt={t("common.profile", { value1: appointment.client || t("common.client") })}
              />
            </span>
            <div>
              <p className="text-ink text-base leading-tight font-semibold">
                {appointment.client}
              </p>
              <p className="text-ink-muted mt-0.5 text-xs tracking-widest uppercase"> {t("appointments.appointmentDetails")} </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="border-ink/20 text-ink-muted hover:border-ink hover:text-ink flex h-8 w-8 shrink-0 items-center justify-center border-2 text-xs transition"
            aria-label={t("common.close")}
          >
            X
          </button>
        </div>

        <div className="bg-ink/10 border-ink/10 grid grid-cols-2 gap-px border-b-2">
          <div className="bg-white px-5 py-4">
            <p className="text-ink-muted mb-1 text-[0.6rem] tracking-widest uppercase"> {t("common.service")} </p>
            <p className="text-ink text-sm font-semibold">
              {appointment.service}
            </p>
          </div>

          <div className="bg-white px-5 py-4">
            <p className="text-ink-muted mb-1 text-[0.6rem] tracking-widest uppercase"> {t("common.status")} </p>
            <span
              className={`inline-block rounded-full border-2 px-3 py-0.5 text-[0.65rem] tracking-widest uppercase ${statusBadgeClass}`}
            >
              {fixedLabel(appointment.status, "status")}
            </span>
          </div>

          <div className="bg-cream/60 px-5 py-4">
            <p className="text-ink-muted mb-1 text-[0.6rem] tracking-widest uppercase"> {t("common.date")} </p>
            <p className="text-ink text-sm font-semibold">
              {appointment.dateLabel}
            </p>
          </div>

          <div className="bg-cream/60 px-5 py-4">
            <p className="text-ink-muted mb-1 text-[0.6rem] tracking-widest uppercase"> {t("common.time")} </p>
            <p className="text-ink text-sm font-semibold">
              {appointment.timeLabel}
            </p>
          </div>

          <div className="bg-white px-5 py-4">
            <p className="text-ink-muted mb-1 text-[0.6rem] tracking-widest uppercase"> {t("nav.staff")} </p>
            <p className="text-ink text-sm font-semibold">
              {appointment.staff}
            </p>
          </div>

          <div className="bg-white px-5 py-4">
            <p className="text-ink-muted mb-1 text-[0.6rem] tracking-widest uppercase"> {t("common.duration")} </p>
            <p className="text-ink text-sm font-semibold">
              {appointment.duration}
            </p>
          </div>

          <div className="bg-cream col-span-2 px-5 py-4">
            <p className="text-ink-muted mb-1 text-[0.6rem] tracking-widest uppercase"> {t("common.price")} </p>
            <p className="text-ink text-base font-semibold">
              {appointment.price}
            </p>
            {appointment.rewardDiscount && <p className="mt-1 text-sm text-ink-muted">{t("dashboard.includesARewardDiscountOf")} {appointment.rewardDiscount}.</p>}
          </div>

          {appointment.notes && (
            <div className="col-span-2 bg-white px-5 py-4">
              <p className="text-ink-muted mb-1 text-[0.6rem] tracking-widest uppercase"> {t("common.notes")} </p>
              <p className="text-ink text-sm leading-relaxed">
                {appointment.notes}
              </p>
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
              > {t("common.confirm")} </button>
            )}

            {appointment.status === "Confirmed" && onComplete && (
              <button
                type="button"
                onClick={() => onComplete(appointment.id)}
                className="border-ink/20 text-ink hover:bg-ink hover:text-cream flex-1 border-r-2 px-4 py-3 text-xs tracking-widest uppercase transition"
              > {t("appointments.markComplete")} </button>
            )}

            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(appointment.id)}
                className="flex-1 px-4 py-3 text-xs tracking-widest text-[#b0412e] uppercase transition hover:bg-[#b0412e] hover:text-white"
              > {t("common.delete")} </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AppointmentDetailsModal;
