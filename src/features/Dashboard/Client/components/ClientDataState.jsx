import { useTranslation } from "react-i18next";
export default function ClientDataState({ isLoading, error, onRetry, isFetching }) {
  const { t } = useTranslation();
  if (isLoading) return <div role="status" className="rounded-2xl border border-ink/10 bg-white/70 p-6"><p className="text-sm text-ink-muted">{t("dashboard.gettingYourVisitsReady")}</p><div aria-hidden="true" className="mt-4 space-y-3 motion-safe:animate-pulse"><div className="h-5 w-2/3 rounded-lg bg-ink/5"/><div className="h-20 rounded-xl bg-ink/5"/></div></div>;
  if (error) return <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-900"><p>{error.message || t("dashboard.yourVisitsCouldNotBeLoaded")}</p><button type="button" onClick={onRetry} disabled={isFetching} className="mt-3 min-h-11 rounded-xl border border-red-200 px-4 font-semibold disabled:opacity-50">{isFetching ? t("dashboard.tryingAgain") : t("common.tryAgain")}</button></div>;
  return null;
}
