import { translateConfig } from "../i18n/translateConfig.js";
import { useTranslation } from "react-i18next";
import UserAvatar from "../Shared/ui/UserAvatar";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Sidebar from "./sidebar/Sidebar.jsx";
import Icon from "../Shared/ui/Icon.jsx";
import ClientMoreMenu from "../features/Dashboard/Client/components/ClientMoreMenu.jsx";

const PRIMARY_PAGES = ["home", "book-appointment", "my-appointment"];
const LABELS = { home: { translationKey: "clients.home" }, "book-appointment": { translationKey: "clients.book" }, "my-appointment": { translationKey: "common.myVisits" } };

export default function ClientAppLayout({ menuItems, profileImg, brand, portalLabel, footer, onProfileClick, children }) {
  const { t } = useTranslation();
  const [moreOpen, setMoreOpen] = useState(false);
  const { pathname } = useLocation();
  const mainRef = useRef(null);
  const isBooking = pathname.endsWith("/book-appointment");
  const moreActive = menuItems.some(item => item.active && !PRIMARY_PAGES.includes(item.segment));
  useEffect(() => { mainRef.current?.scrollTo({ top: 0 }); }, [pathname]);
  return <div className="flex h-dvh overflow-hidden bg-cream text-ink"><div className="hidden h-full shrink-0 lg:block"><Sidebar menuItems={menuItems} profileImg={profileImg} brand={brand} portalLabel={portalLabel} footer={footer} onProfileClick={onProfileClick}/></div><div className="flex min-w-0 flex-1 flex-col"><header className="z-10 flex shrink-0 items-center justify-between border-b border-ink/5 bg-[#fffdf9]/90 px-4 py-2.5 lg:hidden"><Link to="/dashboard" aria-label={t("clients.lunaraHome")} className="flex min-h-11 items-center text-sm font-semibold tracking-[0.25em]">{brand}</Link><div className="flex items-center gap-3">{isBooking && <Link to="/dashboard/my-appointment" className="flex min-h-11 items-center text-xs text-ink-muted">{t("common.myVisits")}</Link>}<button type="button" onClick={onProfileClick} aria-label={t("clients.openMyProfile")} className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-ink/10 bg-cream"><UserAvatar src={profileImg} iconSize={21} /></button></div></header><main ref={mainRef} className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto"><div className={`mx-auto min-h-full max-w-7xl px-4 pt-5 sm:px-6 lg:px-10 lg:py-8 ${isBooking ? "pb-6" : "pb-[calc(6rem_+_env(safe-area-inset-bottom))] lg:pb-8"}`}>{children}</div></main>{!isBooking && <nav aria-label={t("clients.mainNavigation")} className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 border-t border-ink/10 bg-[#fffdf9]/95 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden">{PRIMARY_PAGES.map(segment => { const item = menuItems.find(menu => menu.segment === segment); return item && <button key={segment} type="button" onClick={item.onClick} aria-current={item.active ? "page" : undefined} className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-medium transition ${item.active ? "bg-ink text-cream" : "text-ink-muted hover:bg-cream"}`}><Icon name={item.iconName} size={20}/>{translateConfig(LABELS)[segment]}</button>; })}<button type="button" onClick={() => setMoreOpen(true)} aria-haspopup="dialog" aria-expanded={moreOpen} className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-medium ${moreActive ? "bg-ink text-cream" : "text-ink-muted"}`}><span aria-hidden="true" className="flex h-5 items-center text-xl leading-none tracking-[0.15em]">&#8943;</span>{t("clients.more")}</button></nav>}</div>{moreOpen && <ClientMoreMenu menuItems={menuItems} onClose={() => setMoreOpen(false)} onProfileClick={onProfileClick}/>}</div>;
}
