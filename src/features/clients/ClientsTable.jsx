import { useTranslation } from "react-i18next";
import { useUserAvatars } from "../../globalHooks/useUserAvatars";
import ClientRow from "./ClientRow";

export default function ClientsTable({
  clients,
  currencyCode,
  isLoading,
  loadError,
  searchQuery,
  onViewProfile,
}) {
  const { t } = useTranslation();
  const { avatars } = useUserAvatars(
    clients.map(
      (client) => client.avatarProfileId || client.auth_id || client.id,
    ),
  );
  return (
    <div className="border-ink/20 relative flex min-h-0 flex-1 flex-col border-2 bg-white/90">
      <div className="bg-ink/5 absolute -top-10 -right-10 h-24 w-24 rounded-full"></div>
      <div className="border-ink/10 bg-cream text-ink-muted hidden border-b-2 px-4 py-3 text-xs tracking-widest uppercase sm:grid sm:grid-cols-[1.4fr_1.6fr_1fr_0.9fr_0.8fr]">
        <span>{t("clients.name")}</span>
        <span>{t("clients.contact")}</span>
        <span>{t("clients.lastVisit")}</span>
        <span>{t("common.totalSpent")}</span>
        <span>{t("common.actions")}</span>
      </div>

      <div className="scrollbar-hidden flex-1 overflow-y-auto">
        {loadError ? (
          <div role="alert" className="text-danger p-4">
            {loadError}
          </div>
        ) : isLoading ? (
          <div className="p-4 text-center text-sm text-gray-500"> {t("clients.loadingClients")} </div>
        ) : clients.length > 0 ? (
          clients.map((client) => (
            <ClientRow
              key={client.id}
              client={{
                ...client,
                avatar_img:
                  avatars[
                    client.avatarProfileId || client.auth_id || client.id
                  ] || client.avatar_img,
              }}
              currencyCode={currencyCode}
              onViewProfile={onViewProfile}
            />
          ))
        ) : (
          <div className="border-ink/30 bg-cream text-ink-muted m-4 border-2 border-dashed p-4 text-center text-sm">
            {searchQuery ? (
              <>
                <span className="font-semibold">"{searchQuery}"</span> {t("clients.isNotFound")} </>
            ) : (
              t("clients.noClientsAvailable")
            )}
          </div>
        )}
      </div>
    </div>
  );
}
