import i18n from "../../i18n/i18n.js";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Button from "../../Shared/Button";
import { getRewards, issueReward, revokeReward, rewardStatus, linkRewardAccount } from "../../services/apiRewards";

export default function ClientRewards({ client, ownerId }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [percent, setPercent] = useState(10);
  const [days, setDays] = useState(30);
  const [notice, setNotice] = useState("");
  const [linkId, setLinkId] = useState(null);
  const [loginEmail, setLoginEmail] = useState(client.email || "");
  const cache = useQueryClient();
  const accountId = client.auth_id || client.id;
  const query = useQuery({
    queryKey: ["client-rewards", ownerId, accountId, client.id],
    queryFn: () => getRewards({ ownerId, clientId: accountId, profileId: client.id }),
    enabled: Boolean(ownerId && accountId),
  });
  const issue = useMutation({
    mutationFn: () => issueReward({ clientId: client.id, percent, days }),
    onSuccess: (reward) => {
      setOpen(false);
      setNotice(reward.client_id ? t("clients.rewardCreatedYourClientCanUseItWhenBookingOnline") : t("clients.rewardCreatedForThisSalonClientCopyTheCodeAnd"));
      cache.invalidateQueries({ queryKey: ["client-rewards"] });
    },
  });
  const revoke = useMutation({
    mutationFn: revokeReward,
    onSuccess: () => cache.invalidateQueries({ queryKey: ["client-rewards"] }),
  });
  const linkAccount = useMutation({
    mutationFn: linkRewardAccount,
    onSuccess: () => {
      setLinkId(null);
      setNotice(t("clients.rewardConnectedItNowAppearsInThisClientSOffers"));
      cache.invalidateQueries({ queryKey: ["client-rewards"] });
    },
  });
  return <section className="mt-5 rounded-2xl border border-ink/15 bg-white/80 p-5">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><h2 className="text-xl font-semibold">{t("clients.clientRewards")}</h2><p className="mt-1 text-sm text-ink-muted">{t("clients.aPersonalDiscountForTheirNextBookingAtYourSalon")}</p></div>
      <Button onClick={() => { issue.reset(); setOpen(!open); }}>{open ? t("common.close") : t("clients.giveReward")}</Button>
    </div>
    {open && <form className="mt-4 space-y-4" onSubmit={(event) => { event.preventDefault(); if (!issue.isPending) issue.mutate(); }}>
      <div className="flex flex-wrap gap-4">
        <label className="text-sm">{t("clients.discount")}<input className="mt-1 block rounded-lg border border-ink/20 p-2" type="number" min="1" max="100" step="1" required value={percent} onChange={(event) => setPercent(event.target.value)} /></label>
        <label className="text-sm">{t("clients.expiresInDays")}<input className="mt-1 block rounded-lg border border-ink/20 p-2" type="number" min="1" max="365" step="1" required value={days} onChange={(event) => setDays(event.target.value)} /></label>
      </div>
      <p className="text-sm text-ink-muted">{t("clients.rewardCodeNotice")}</p>
      <Button type="submit" disabled={issue.isPending}>{issue.isPending ? t("clients.creating") : t("clients.createReward")}</Button>
    </form>}
    {(issue.error || revoke.error || linkAccount.error) && <p role="alert" className="mt-3 text-sm text-danger">{(issue.error || revoke.error || linkAccount.error).message}</p>}
    {notice && <p role="status" className="mt-3 text-sm">{notice}</p>}
    {query.isPending ? <p className="mt-4 text-sm" role="status">{t("clients.loadingRewards")}</p> : query.error ? <div role="alert" className="mt-4 text-sm">{query.error.message}<button className="ml-2 underline" onClick={() => query.refetch()}>{t("clients.retry")}</button></div> : !query.data?.length ? <p className="mt-4 text-sm text-ink-muted">{t("clients.noRewardsIssuedYet")}</p> : <ul className="mt-4 divide-y divide-ink/10">
      {query.data.map((reward) => <li key={reward.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
        <div><p className="font-semibold">{reward.percent_off}{t("clients.off")} {rewardStatus(reward)}</p><p className="text-xs text-ink-muted">{t("clients.expires")} {new Date(reward.expires_at).toLocaleString(i18n.resolvedLanguage)}</p><code className="mt-1 block break-all text-xs select-all">{reward.code}</code></div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-ink-muted">{reward.client_id ? t("clients.onlineOrSalonBooking") : t("clients.salonAssistedBooking")}</span>
          {rewardStatus(reward) === "Available" && <>
            {!reward.client_id && <Button variant="secondary" onClick={() => {
              linkAccount.reset(); setLinkId(reward.id); setLoginEmail(client.email || "");
            }}>{t("clients.makeAvailableOnline")}</Button>}
            <Button variant="secondary" onClick={async () => {
              try { await navigator.clipboard.writeText(reward.code); setNotice(t("clients.rewardCodeCopied")); }
              catch { setNotice(t("clients.selectTheCodeAboveToCopyItManually")); }
            }}>{t("clients.copyCode")}</Button>
            <Button variant="secondary" disabled={revoke.isPending} onClick={() => revoke.mutate(reward.id)}>{t("clients.revoke")}</Button>
          </>}
        </div>
        {linkId === reward.id && <form className="w-full rounded-xl border border-ink/15 p-3" onSubmit={(event) => {
          event.preventDefault();
          if (!linkAccount.isPending) linkAccount.mutate({ rewardId: reward.id, email: loginEmail });
        }}>
          <label className="block text-sm">{t("clients.clientSLoginEmail")} <input type="email" required value={loginEmail} onChange={(event) => setLoginEmail(event.target.value)} disabled={linkAccount.isPending} className="mt-2 block w-full rounded-lg border border-ink/20 p-2" />
          </label>
          <p className="my-3 text-xs text-ink-muted">{t("clients.confirmThisIsTheClientSOwnVerifiedLoginEmail")}</p>
          <div className="flex gap-2"><Button type="submit" disabled={linkAccount.isPending}>{linkAccount.isPending ? t("clients.connecting") : t("clients.connectReward")}</Button><Button disabled={linkAccount.isPending} variant="secondary" onClick={() => setLinkId(null)}>{t("common.cancel")}</Button></div>
        </form>}
      </li>)}
    </ul>}
    <p className="mt-3 text-xs text-ink-muted">{t("clients.onlineRewardsAppearInTheClientSOffersRewardsPage")}</p>
  </section>;
}
