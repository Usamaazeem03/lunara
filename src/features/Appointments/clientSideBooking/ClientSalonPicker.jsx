import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { findClientSalons } from "../../../services/apiClientSalons.js";
import UserAvatar from "../../../Shared/ui/UserAvatar.jsx";
import ClientPageHeader from "../../Dashboard/Client/components/ClientPageHeader.jsx";
import ClientDataState from "../../Dashboard/Client/components/ClientDataState.jsx";
import ClientEmptyState from "../../Dashboard/Client/components/ClientEmptyState.jsx";

export default function ClientSalonPicker() {
  const [, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const { data: salons = [], isLoading, error, refetch, isFetching } = useQuery({ queryKey: ["client-salons", submittedSearch], queryFn: () => findClientSalons(submittedSearch), staleTime: 60_000 });
  function selectSalon(id) {
    try { localStorage.setItem("owner_id", id); } catch { /* The URL still carries the salon when storage is unavailable. */ }
    setSearchParams({ owner_id: id });
  }
  return <section className="mx-auto max-w-3xl pb-6"><ClientPageHeader eyebrow="A little time for you" title="Find your salon" description="Choose where you would like your next visit to be."/><form onSubmit={(event) => { event.preventDefault(); setSubmittedSearch(search); }} className="mb-5 flex gap-2"><label className="min-w-0 flex-1"><span className="sr-only">Search salon or owner name</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Salon or owner name" className="min-h-12 w-full rounded-xl border border-ink/15 bg-white px-4 text-base"/></label><button type="submit" className="min-h-12 rounded-xl bg-ink px-5 text-sm font-semibold text-cream">Search</button></form><ClientDataState isLoading={isLoading} error={error} onRetry={refetch} isFetching={isFetching}/>{!isLoading && !error && (salons.length ? <div className="grid gap-3 sm:grid-cols-2">{salons.map(salon => <article key={salon.id} className="rounded-2xl border border-ink/10 bg-white/70 p-5"><UserAvatar src={salon.avatar_img} alt={`${salon.full_name || "Salon"} profile photo`} className="mb-4 h-12 w-12 rounded-2xl text-lg font-semibold" fallback={salon.full_name?.trim().charAt(0) || "L"} /><h2 className="text-lg font-semibold">{salon.full_name || "Salon"}</h2><Link to={`/salon/${salon.salon_slug}`} className="mt-1 inline-flex min-h-11 items-center text-xs text-ink-muted underline underline-offset-4">View salon</Link><button type="button" onClick={() => selectSalon(salon.id)} className="mt-2 min-h-12 w-full rounded-xl border border-ink/20 text-sm font-semibold">Choose this salon</button></article>)}</div> : <ClientEmptyState title="No salons found" description="Try another name, or ask your salon for their booking link."/>)}<p className="mt-5 text-xs leading-5 text-ink-muted">Already have a salon QR or link? Open it to go straight to their services.</p></section>;
}
