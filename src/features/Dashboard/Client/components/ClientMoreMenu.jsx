import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";
import Icon from "../../../../Shared/ui/Icon.jsx";

export default function ClientMoreMenu({ menuItems, onClose, onProfileClick }) {
  const { t } = useTranslation();
  const dialogRef = useRef(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    dialog.showModal();
    return () => dialog.close();
  }, []);
  return <dialog ref={dialogRef} onCancel={(event) => { event.preventDefault(); onClose(); }} aria-labelledby="client-menu-title" className="m-auto w-[calc(100%_-_2rem)] max-w-sm rounded-3xl bg-[#fffdf9] p-5 text-ink backdrop:bg-black/40"><div className="mb-4 flex items-center justify-between"><h2 id="client-menu-title" className="text-xl font-semibold">{t("dashboard.yourSpace")}</h2><button type="button" onClick={onClose} aria-label={t("dashboard.closeMenu")} className="h-11 w-11 rounded-full border border-ink/15 text-xl">&times;</button></div><nav aria-label={t("dashboard.morePages")} className="space-y-2">{menuItems.filter(item => !["home", "book-appointment", "my-appointment"].includes(item.segment)).map(item => <button key={item.segment} type="button" onClick={() => { item.onClick(); onClose(); }} aria-current={item.active ? "page" : undefined} className={`flex min-h-14 w-full items-center gap-3 rounded-xl px-4 text-left text-sm font-medium ${item.active ? "bg-ink text-cream" : "bg-cream/70 hover:bg-cream"}`}><Icon name={item.iconName} size={20}/>{t(item.textKey)}<span className="ml-auto" aria-hidden="true">&rarr;</span></button>)}<button type="button" onClick={() => { onClose(); onProfileClick?.(); }} className="flex min-h-14 w-full items-center gap-3 rounded-xl bg-cream/70 px-4 text-sm font-medium"><Icon name="user-profile" size={20}/>{t("dashboard.myProfile")}</button></nav></dialog>;
}
