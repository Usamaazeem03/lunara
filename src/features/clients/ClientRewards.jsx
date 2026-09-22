import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Button from "../../Shared/Button";
import { getRewards, issueReward, revokeReward, rewardStatus, linkRewardAccount } from "../../services/apiRewards";

export default function ClientRewards({ client, ownerId }) {
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
      setNotice(reward.client_id ? "Reward created. Your client can use it when booking online." : "Reward created for this salon client. Copy the code and enter it in Add New Appointment after selecting this client.");
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
      setNotice("Reward connected. It now appears in this client's Offers & rewards when they sign in with that email.");
      cache.invalidateQueries({ queryKey: ["client-rewards"] });
    },
  });
  return <section className="mt-5 rounded-2xl border border-ink/15 bg-white/80 p-5">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><h2 className="text-xl font-semibold">Client rewards</h2><p className="mt-1 text-sm text-ink-muted">A personal discount for their next booking at your salon.</p></div>
      <Button onClick={() => { issue.reset(); setOpen(!open); }}>{open ? "Close" : "Give reward"}</Button>
    </div>
    {open && <form className="mt-4 space-y-4" onSubmit={(event) => { event.preventDefault(); if (!issue.isPending) issue.mutate(); }}>
      <div className="flex flex-wrap gap-4">
        <label className="text-sm">Discount (%)<input className="mt-1 block rounded-lg border border-ink/20 p-2" type="number" min="1" max="100" step="1" required value={percent} onChange={(event) => setPercent(event.target.value)} /></label>
        <label className="text-sm">Expires in (days)<input className="mt-1 block rounded-lg border border-ink/20 p-2" type="number" min="1" max="365" step="1" required value={days} onChange={(event) => setDays(event.target.value)} /></label>
      </div>
      <p className="text-sm text-ink-muted">One booking, one reward, for this client only. Clients with a linked account can redeem online; for other clients, apply the code when you create their appointment. Cancelled bookings do not restore used codes.</p>
      <Button type="submit" disabled={issue.isPending}>{issue.isPending ? "Creating…" : "Create reward"}</Button>
    </form>}
    {(issue.error || revoke.error || linkAccount.error) && <p role="alert" className="mt-3 text-sm text-danger">{(issue.error || revoke.error || linkAccount.error).message}</p>}
    {notice && <p role="status" className="mt-3 text-sm">{notice}</p>}
    {query.isPending ? <p className="mt-4 text-sm" role="status">Loading rewards…</p> : query.error ? <div role="alert" className="mt-4 text-sm">{query.error.message}<button className="ml-2 underline" onClick={() => query.refetch()}>Retry</button></div> : !query.data?.length ? <p className="mt-4 text-sm text-ink-muted">No rewards issued yet.</p> : <ul className="mt-4 divide-y divide-ink/10">
      {query.data.map((reward) => <li key={reward.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
        <div><p className="font-semibold">{reward.percent_off}% off · {rewardStatus(reward)}</p><p className="text-xs text-ink-muted">Expires {new Date(reward.expires_at).toLocaleString()}</p><code className="mt-1 block break-all text-xs select-all">{reward.code}</code></div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-ink-muted">{reward.client_id ? "Online or salon booking" : "Salon-assisted booking"}</span>
          {rewardStatus(reward) === "Available" && <>
            {!reward.client_id && <Button variant="secondary" onClick={() => {
              linkAccount.reset(); setLinkId(reward.id); setLoginEmail(client.email || "");
            }}>Make available online</Button>}
            <Button variant="secondary" onClick={async () => {
              try { await navigator.clipboard.writeText(reward.code); setNotice("Reward code copied."); }
              catch { setNotice("Select the code above to copy it manually."); }
            }}>Copy code</Button>
            <Button variant="secondary" disabled={revoke.isPending} onClick={() => revoke.mutate(reward.id)}>Revoke</Button>
          </>}
        </div>
        {linkId === reward.id && <form className="w-full rounded-xl border border-ink/15 p-3" onSubmit={(event) => {
          event.preventDefault();
          if (!linkAccount.isPending) linkAccount.mutate({ rewardId: reward.id, email: loginEmail });
        }}>
          <label className="block text-sm">Client's login email
            <input type="email" required value={loginEmail} onChange={(event) => setLoginEmail(event.target.value)} disabled={linkAccount.isPending} className="mt-2 block w-full rounded-lg border border-ink/20 p-2" />
          </label>
          <p className="my-3 text-xs text-ink-muted">Confirm this is the client's own verified login email. Connecting it makes this reward visible and usable from that account.</p>
          <div className="flex gap-2"><Button type="submit" disabled={linkAccount.isPending}>{linkAccount.isPending ? "Connecting…" : "Connect reward"}</Button><Button disabled={linkAccount.isPending} variant="secondary" onClick={() => setLinkId(null)}>Cancel</Button></div>
        </form>}
      </li>)}
    </ul>}
    <p className="mt-3 text-xs text-ink-muted">Online rewards appear in the client's Offers & rewards page. Salon-assisted rewards stay with this client record and can only be applied by your salon.</p>
  </section>;
}
