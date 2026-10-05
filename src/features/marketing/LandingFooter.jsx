import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function LandingFooter() {
  const { t } = useTranslation();
  return <footer className="marketing-footer marketing-container"><div><Link to="/" className="marketing-logo">LUNARA<span aria-hidden="true">✦</span></Link><p>{t("marketing.aLittleMoreFlowALittleMoreYou")}</p></div><nav aria-label={t("marketing.footerNavigation")}><a href="#features">{t("marketing.features")}</a><a href="#workflow">{t("marketing.howItWorks")}</a><a href="#pricing">{t("marketing.paymentsComingSoon")}</a><Link to="/auth/client/signin">{t("auth.clientLogin")}</Link><Link to="/auth/owner/signin">{t("common.ownerLogin")}</Link></nav><div className="marketing-footer-bottom"><span>© {new Date().getFullYear()} Lunara</span><span>{t("marketing.thoughtfullyMadeForSalonDays")}</span></div></footer>;
}
