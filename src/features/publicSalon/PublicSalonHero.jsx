import { useTranslation } from "react-i18next";
import Icon from "../../Shared/ui/Icon";

export default function PublicSalonHero({
  salonName,
  serviceCount,
  staffCount,
  onBooking,
}) {
  const { t } = useTranslation();
  return (
    <section className="salon-hero" aria-labelledby="salon-title">
      <div className="salon-hero-copy">
        <span className="salon-verified">
          <Icon name="checkmark-tick" size={14} aria-hidden="true" />
          {t("salon.lunaraVerifiedSalon")}
        </span>
        <p className="salon-eyebrow">{t("salon.page.welcomeTo")}</p>
        <h1 id="salon-title">{salonName}</h1>
        <p className="salon-hero-description">
          {t("salon.page.heroDescription")}
        </p>
        <div className="salon-hero-actions">
          <button
            className="salon-button salon-button-light"
            onClick={onBooking}
          >
            {t("common.bookAppointment")} <span aria-hidden="true">↗</span>
          </button>
          <a href="#salon-services">
            {t("salon.page.exploreServices")} <span aria-hidden="true">↓</span>
          </a>
        </div>
        <div className="salon-hero-stats">
          <span>
            <strong>{serviceCount}</strong> {t("nav.services")}
          </span>
          <span>
            <strong>{staffCount}</strong> {t("salon.teamMembers")}
          </span>
        </div>
      </div>
      <div className="salon-hero-art" aria-hidden="true">
        <div className="salon-arch">
          <div className="salon-arch-inner">
            <Icon name="sparkles" size={32} />
            <span className="salon-monogram">
              {salonName.charAt(0).toLocaleUpperCase()}
            </span>
            <span className="salon-art-label">
              {t("salon.page.aLittleTimeForYou")}
            </span>
          </div>
        </div>
        <span className="salon-art-caption">
          LUNARA · {t("salon.page.madeForYou")}
        </span>
      </div>
    </section>
  );
}
