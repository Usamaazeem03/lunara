import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import ProductPreview from "./ProductPreview";

export default function HeroMainSection() {
  const { t } = useTranslation();
  return (
    <section className="marketing-hero marketing-container" aria-labelledby="hero-title">
      <div className="marketing-hero-copy">
        <p className="marketing-eyebrow"><span className="marketing-dot" /> {t("marketing.aLittleCalmForYourSalon")}</p>
        <h1 id="hero-title">{t("marketing.lessAdmin")}<br />{t("marketing.more")} <em>{t("marketing.beautiful")}</em><br />{t("marketing.days")}</h1>
        <p className="marketing-lead">{t("marketing.yourBookingsYourTeamYourClientsOneThoughtfulSpaceTo")}</p>
        <div className="marketing-actions">
          <Link className="marketing-button" to="/auth/owner/signup">{t("marketing.setUpYourSalon")} <span aria-hidden="true">↗</span></Link>
          <Link className="marketing-text-link" to="/auth/client/signup">{t("marketing.hereToBook")} <span aria-hidden="true">→</span></Link>
        </div>
        <p className="marketing-hero-note">{t("marketing.madeForSalonOwnersLovedByYourDailyRoutine")}</p>
      </div>
      <div className="marketing-hero-stage">
        <div className="marketing-orbit" aria-hidden="true" />
        <div className="marketing-stage-caption"><span>{t("marketing.lessJugglingMoreFlow")}</span><span aria-hidden="true">✳</span></div>
        <ProductPreview role="owner" compact />
        <div className="marketing-stage-note"><span className="marketing-note-icon" aria-hidden="true">✓</span><div><strong>{t("marketing.everythingHasItsPlace")}</strong><span>{t("marketing.fromTheFirstBookingToTheNextVisit")}</span></div></div>
      </div>
    </section>
  );
}
