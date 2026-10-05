import i18n from "../../../../i18n/i18n.js";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../../hooks/useAuth";
import { getRewards, rewardStatus } from "../../../../services/apiRewards";
import ClientPageHeader from "../components/ClientPageHeader.jsx";
import ClientEmptyState from "../components/ClientEmptyState.jsx";

export default function OffersLoyaltyPage() {
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  const query = useQuery({
    queryKey: ["client-rewards", "mine", user?.id],
    queryFn: () => getRewards({ clientId: user.id }),
    enabled: Boolean(user?.id),
    refetchInterval: 15000,
    refetchOnWindowFocus: "always",
  });
  return <section className="mx-auto max-w-3xl">
    <ClientPageHeader eyebrow={t("dashboard.somethingToLookForwardTo")} title={t("dashboard.offersRewards")} description={t("dashboard.personalDiscountsFromYourSalonsEachCodeIsYoursTo")} />
    {user && <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm text-ink-muted"><p>{t("dashboard.rewardsFor")} {user.email}</p><button disabled={query.isFetching} onClick={() => query.refetch()} className="underline disabled:opacity-50">{query.isFetching ? t("dashboard.refreshing2") : t("dashboard.refreshRewards")}</button></div>}
    {loading ? <p role="status">{t("dashboard.loadingYourAccount")}</p> : !user ? <p>{t("dashboard.pleaseSignInToSeeYourRewards")}</p> : query.isPending ? <p role="status">{t("clients.loadingRewards")}</p> : query.error ? <div role="alert">{query.error.message}<button className="ml-2 underline" onClick={() => query.refetch()}>{t("clients.retry")}</button></div> : !query.data?.length ? <ClientEmptyState icon="gift-box-benefits" title={t("dashboard.noRewardsForThisAccountYet")} description={t("dashboard.alreadyReceivedARewardAskYourSalonToConnectIt")} /> : <ul className="space-y-4">
      {query.data.map((reward) => <li key={reward.id} className="rounded-2xl border border-ink/10 bg-white/80 p-5">
        <div className="flex items-center justify-between gap-3"><h2 className="text-xl font-semibold">{reward.percent_off}{t("dashboard.offYourNextVisit")}</h2><span className="text-sm">{rewardStatus(reward)}</span></div>
        <p className="mt-2 text-sm text-ink-muted">{t("clients.expires")} {new Date(reward.expires_at).toLocaleString(i18n.resolvedLanguage)}{t("dashboard.validOnlyAtTheSalonThatIssuedItCancelledBookings")}</p>
        <code className="mt-3 block break-all text-sm select-all">{reward.code}</code>
        {rewardStatus(reward) === "Available" && <Link className="mt-4 inline-flex rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-cream" to={`/dashboard/book-appointment?owner_id=${encodeURIComponent(reward.owner_id)}&reward=${encodeURIComponent(reward.code)}`}>{t("dashboard.bookWithThisReward")}</Link>}
      </li>)}
    </ul>}
    <Link to="/dashboard/book-appointment?choose_salon=1" className="mt-5 inline-flex text-sm underline">{t("dashboard.exploreSalons")}</Link>
  </section>;
}
