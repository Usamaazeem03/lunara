import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../../hooks/useAuth";
import { getRewards, rewardStatus } from "../../../../services/apiRewards";
import ClientPageHeader from "../components/ClientPageHeader.jsx";
import ClientEmptyState from "../components/ClientEmptyState.jsx";

export default function OffersLoyaltyPage() {
  const { user, loading } = useAuth();
  const query = useQuery({
    queryKey: ["client-rewards", "mine", user?.id],
    queryFn: () => getRewards({ clientId: user.id }),
    enabled: Boolean(user?.id),
    refetchInterval: 15000,
    refetchOnWindowFocus: "always",
  });
  return <section className="mx-auto max-w-3xl">
    <ClientPageHeader eyebrow="Something to look forward to" title="Offers & rewards" description="Personal discounts from your salons. Each code is yours to use once." />
    {user && <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm text-ink-muted"><p>Rewards for {user.email}</p><button disabled={query.isFetching} onClick={() => query.refetch()} className="underline disabled:opacity-50">{query.isFetching ? "Refreshing…" : "Refresh rewards"}</button></div>}
    {loading ? <p role="status">Loading your account…</p> : !user ? <p>Please sign in to see your rewards.</p> : query.isPending ? <p role="status">Loading rewards…</p> : query.error ? <div role="alert">{query.error.message}<button className="ml-2 underline" onClick={() => query.refetch()}>Retry</button></div> : !query.data?.length ? <ClientEmptyState icon="gift-box-benefits" title="No rewards for this account yet" description="Already received a reward? Ask your salon to connect it to the login email shown above, then refresh this page." /> : <ul className="space-y-4">
      {query.data.map((reward) => <li key={reward.id} className="rounded-2xl border border-ink/10 bg-white/80 p-5">
        <div className="flex items-center justify-between gap-3"><h2 className="text-xl font-semibold">{reward.percent_off}% off your next visit</h2><span className="text-sm">{rewardStatus(reward)}</span></div>
        <p className="mt-2 text-sm text-ink-muted">Expires {new Date(reward.expires_at).toLocaleString()}. Valid only at the salon that issued it. Cancelled bookings do not restore the code.</p>
        <code className="mt-3 block break-all text-sm select-all">{reward.code}</code>
        {rewardStatus(reward) === "Available" && <Link className="mt-4 inline-flex rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-cream" to={`/dashboard/book-appointment?owner_id=${encodeURIComponent(reward.owner_id)}&reward=${encodeURIComponent(reward.code)}`}>Book with this reward</Link>}
      </li>)}
    </ul>}
    <Link to="/dashboard/book-appointment?choose_salon=1" className="mt-5 inline-flex text-sm underline">Explore salons</Link>
  </section>;
}
