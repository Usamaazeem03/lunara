import { translateConfig } from "../../i18n/translateConfig.js";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Link } from "react-router-dom";

const links = [
  [{ translationKey: "marketing.features" }, "#features"], [{ translationKey: "marketing.insideLunara" }, "#preview"],
  [{ translationKey: "marketing.howItWorks" }, "#workflow"], [{ translationKey: "marketing.payments" }, "#pricing"],
];

export default function LandingHeader() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  return (
    <header className="marketing-header">
      <nav className="marketing-nav marketing-container" aria-label={t("clients.mainNavigation")}>
        <Link to="/" className="marketing-logo" aria-label={t("clients.lunaraHome")}>LUNARA<span aria-hidden="true">✦</span></Link>
        <div className="marketing-desktop-nav">
          {translateConfig(links).map(([label, href]) => <a key={href} href={href}>{label}</a>)}
        </div>
        <div className="marketing-nav-actions">
          <Link to="/auth/client/signin" className="marketing-login">{t("common.logIn")} <span aria-hidden="true">↗</span></Link>
          <button className="marketing-menu-toggle" type="button" aria-expanded={open} aria-controls="marketing-mobile-menu" onClick={() => setOpen(!open)}>
            {open ? t("common.close") : t("common.menu")} <span aria-hidden="true">{open ? "−" : "+"}</span>
          </button>
        </div>
      </nav>
      {open && <nav id="marketing-mobile-menu" className="marketing-mobile-menu" aria-label={t("marketing.mobileNavigation")}>
        {translateConfig(links).map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}<span aria-hidden="true">↗</span></a>)}
        <Link to="/auth/owner/signup">{t("marketing.createASalonAccount")} <span aria-hidden="true">↗</span></Link>
        <Link to="/auth/owner/signin">{t("common.ownerLogin")} <span aria-hidden="true">↗</span></Link>
      </nav>}
    </header>
  );
}
