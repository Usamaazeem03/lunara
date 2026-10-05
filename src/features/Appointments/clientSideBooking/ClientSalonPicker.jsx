import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { findClientSalons } from "../../../services/apiClientSalons.js";
import UserAvatar from "../../../Shared/ui/UserAvatar.jsx";
import ClientPageHeader from "../../Dashboard/Client/components/ClientPageHeader.jsx";
import ClientDataState from "../../Dashboard/Client/components/ClientDataState.jsx";
import ClientEmptyState from "../../Dashboard/Client/components/ClientEmptyState.jsx";

export default function ClientSalonPicker() {
  const { t } = useTranslation();
  const [, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const { data: salons = [], isLoading, error, refetch, isFetching } = useQuery({ queryKey: ["client-salons", submittedSearch], queryFn: () => findClientSalons(submittedSearch), staleTime: 60_000 });
  function selectSalon(id) {
    try { localStorage.setItem("owner_id", id); } catch { /* The URL still carries the salon when storage is unavailable. */ }
    setSearchParams({ owner_id: id });
  }
  return <section className="mx-auto max-w-3xl pb-6"><ClientPageHeader eyebrow={t("common.aLittleTimeForYou")} title={t("booking.findYourSalon")} description={t("booking.chooseWhereYouWouldLikeYourNextVisitToBe")}/><form onSubmit={(event) => { event.preventDefault(); setSubmittedSearch(search); }} className="mb-5 flex gap-2"><label className="min-w-0 flex-1"><span className="sr-only">{t("booking.searchSalonOrOwnerName")}</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t("booking.salonOrOwnerName")} className="min-h-12 w-full rounded-xl border border-ink/15 bg-white px-4 text-base"/></label><button type="submit" className="min-h-12 rounded-xl bg-ink px-5 text-sm font-semibold text-cream">{t("booking.search")}</button></form><ClientDataState isLoading={isLoading} error={error} onRetry={refetch} isFetching={isFetching}/>{!isLoading && !error && (salons.length ? <div className="grid gap-3 sm:grid-cols-2">{salons.map(salon => <article key={salon.id} className="rounded-2xl border border-ink/10 bg-white/70 p-5"><UserAvatar src={salon.avatar_img} alt={t("booking.profilePhoto", { value1: salon.full_name || t("common.salon") })} className="mb-4 h-12 w-12 rounded-2xl text-lg font-semibold" fallback={salon.full_name?.trim().charAt(0) || "L"} /><h2 className="text-lg font-semibold">{salon.full_name || t("common.salon")}</h2><Link to={`/salon/${salon.salon_slug}`} className="mt-1 inline-flex min-h-11 items-center text-xs text-ink-muted underline underline-offset-4">{t("booking.viewSalon")}</Link><button type="button" onClick={() => selectSalon(salon.id)} className="mt-2 min-h-12 w-full rounded-xl border border-ink/20 text-sm font-semibold">{t("booking.chooseThisSalon")}</button></article>)}</div> : <ClientEmptyState title={t("booking.noSalonsFound")} description={t("booking.tryAnotherNameOrAskYourSalonForTheirBooking")}/>)}<p className="mt-5 text-xs leading-5 text-ink-muted">{t("booking.alreadyHaveASalonQrOrLinkOpenItTo")}</p></section>;
}
