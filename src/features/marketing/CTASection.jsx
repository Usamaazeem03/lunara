import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function CTASection() {
  const { t } = useTranslation();
  return <section id="demo" className="marketing-cta"><div className="marketing-container"><span className="marketing-cta-star" aria-hidden="true">✳</span><p className="marketing-eyebrow">{t("marketing.makeSpaceForWhatYouLove")}</p><h2>{t("marketing.aBeautifulBusiness")}<br />{t("marketing.aLittleLess")} <em>{t("marketing.busywork")}</em></h2><p>{t("marketing.bringYourSalonDayTogetherWithLunara")}</p><div className="marketing-actions"><Link className="marketing-button marketing-button-light" to="/auth/owner/signup">{t("marketing.setUpYourSalon")} <span aria-hidden="true">↗</span></Link><Link className="marketing-text-link" to="/auth/owner/signin">{t("common.ownerLogin")} <span aria-hidden="true">→</span></Link></div></div></section>;
}
