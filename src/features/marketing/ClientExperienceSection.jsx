import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function ClientExperienceSection() {
  const { t } = useTranslation();
  return <section className="marketing-container marketing-client-section">
    <div className="marketing-client-art" aria-hidden="true"><span className="marketing-art-star">✳</span><span className="marketing-art-word">{t("marketing.yourTime")}<br /><em>{t("marketing.yourGlow")}</em></span><span className="marketing-art-foot">{t("marketing.aMomentThatSJustForYou")}</span></div>
    <div className="marketing-client-copy"><p className="marketing-eyebrow">{t("marketing.forThePersonInTheChair")}</p><h2>{t("marketing.yourNextGood")}<br />{t("marketing.hairDay")} <em>{t("marketing.startsHere")}</em></h2><p>{t("marketing.findYourSalonChooseYourServiceAndMakeTimeFor")}</p><Link to="/auth/client/signup" className="marketing-button">{t("marketing.createAClientAccount")} <span aria-hidden="true">↗</span></Link><Link to="/auth/client/signin" className="marketing-text-link">{t("marketing.alreadyWithUsLogIn")} <span aria-hidden="true">→</span></Link></div>
  </section>;
}
