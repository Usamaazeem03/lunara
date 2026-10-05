import { useTranslation } from "react-i18next";
import UserAvatar from "../../Shared/ui/UserAvatar";
import { formatCurrency } from "../../utils/currency";
import calendarIcon from "../../Shared/assets/icons/calendar.svg";
const ClientRow = ({ client, onViewProfile, currencyCode }) => {
  const { t } = useTranslation();
  return (
    <div className="border-ink/10 hover:bg-cream/50 grid gap-3 border-b px-4 py-3 text-sm transition sm:grid-cols-[1.4fr_1.6fr_1fr_0.9fr_0.8fr] sm:items-center">
      <p className="text-ink-muted text-xs tracking-widest uppercase sm:hidden"> {t("clients.name")} </p>
      <div className="flex items-center gap-3">
        <span className="border-ink/20 bg-cream text-ink-muted flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border text-xs font-semibold uppercase">
          <UserAvatar
            src={client.avatar_img}
            alt={t("common.profile", { value1: client.full_name || t("common.client") })}
          />
        </span>
        <span className="font-semibold">
          {client.nameFallbackKey ? t("common.unknownClient") : client.full_name || client.name || t("common.unknownClient")}
        </span>
      </div>

      <p className="text-ink-muted text-xs tracking-widest uppercase sm:hidden"> {t("clients.contact")} </p>
      <div className="text-ink-muted text-xs">
        <p>{client.phone}</p>
        <p>{client.email}</p>
      </div>

      <p className="text-ink-muted text-xs tracking-widest uppercase sm:hidden"> {t("clients.lastVisit")} </p>
      <div className="flex items-center gap-2">
        <img src={calendarIcon} alt="" className="h-4 w-4 opacity-60" />
        <span>{client.lastVisitFallbackKey ? t("clients.noVisits") : client.lastVisit}</span>
      </div>

      <p className="text-ink-muted text-xs tracking-widest uppercase sm:hidden"> {t("common.totalSpent")} </p>
      <span className="font-semibold">
        {currencyCode
          ? formatCurrency(client.totalSpent, currencyCode)
          : t("common.unavailable")}
      </span>

      <p className="text-ink-muted text-xs tracking-widest uppercase sm:hidden"> {t("common.actions")} </p>
      <button
        type="button"
        onClick={() => onViewProfile?.(client)}
        className="border-ink hover:bg-ink hover:text-cream w-fit border-2 px-3 py-1 text-xs tracking-widest uppercase transition"
      > {t("clients.viewProfile")} </button>
    </div>
  );
};

export default ClientRow;
