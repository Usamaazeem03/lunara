import { useTranslation } from "react-i18next";
import Icon from "../../Shared/ui/Icon";

export default function ClientFilter({ searchQuery, onSearchChange }) {
  const { t } = useTranslation();
  return (
    <div className="border-ink/20 flex flex-wrap items-center justify-between gap-3 border-2 bg-white/90 p-3 sm:p-4">
      <div className="border-ink/20 flex w-full flex-1 items-center gap-2 border-2 bg-white px-3 py-2 sm:w-auto">
        <Icon name="search" size={16} className="text-ink-muted/70" />
        <input
          aria-label={t("clients.searchClients")}
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={t("clients.searchByNameEmailOrPhone")}
          className="text-ink w-full bg-transparent text-xs tracking-widest uppercase focus:outline-none"
        />
      </div>
    </div>
  );
}
