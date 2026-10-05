import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { notify } from "../Shared/lib/toast.jsx";
import Icon from "../Shared/ui/Icon";
import { PUBLIC_SITE_URL } from "../Shared/lib/publicUrl.js";
import { usePublicSalon } from "../features/publicSalon/usePublicSalon.js";
import PublicSalonHero from "../features/publicSalon/PublicSalonHero.jsx";
import PublicSalonServices from "../features/publicSalon/PublicSalonServices.jsx";
import PublicSalonStaff from "../features/publicSalon/PublicSalonStaff.jsx";
import ShareSalon from "../features/publicSalon/ShareSalon.jsx";
import "../features/publicSalon/publicSalon.css";

export default function PublicSalonPage() {
  const { t } = useTranslation();
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data, isLoading: loading, error: queryError } = usePublicSalon(slug);
  const ownerProfile = data?.salon;
  const services = data?.services ?? [];
  const staffMembers = data?.staff ?? [];
  const currencyCode = data?.settings?.currencyCode ?? "USD";
  const externalWebsiteUrl = data?.settings?.externalWebsiteUrl ?? null;
  const error = queryError?.message ?? "";
  const salonName =
    ownerProfile?.full_name?.trim() ||
    ownerProfile?.name?.trim() ||
    slug?.replace(/[-_]/g, " ") ||
    t("salon.page.yourSalon");
  useEffect(() => {
    if (error) notify.error(error);
  }, [error]);
  useEffect(() => {
    if (!loading && !error && ownerProfile && externalWebsiteUrl)
      window.location.replace(externalWebsiteUrl);
  }, [loading, error, ownerProfile, externalWebsiteUrl]);
  const salonUrl = `${PUBLIC_SITE_URL}/salon/${encodeURIComponent(slug)}`;
  const handleBooking = () => {
    localStorage.setItem("owner_id", ownerProfile.id);
    navigate(
      `/auth/client/signin?owner_id=${encodeURIComponent(ownerProfile.id)}`,
    );
  };
  if (loading || (externalWebsiteUrl && !error))
    return (
      <main className="salon-page salon-state" role="status">
        <div className="salon-brand-mark">L</div>
        <p>{t(loading ? "salon.loadingSalon" : "salon.page.openingWebsite")}</p>
      </main>
    );
  if (error || !ownerProfile)
    return (
      <main className="salon-page salon-state">
        <div className="salon-brand-mark">L</div>
        <h1>{t("salon.oops")}</h1>
        <p>{error || t("salon.salonNotFound2")}</p>
        <Link to="/" className="salon-button">
          {t("salon.goHome")}
        </Link>
      </main>
    );
  return (
    <div className="salon-page">
      <a className="salon-skip" href="#salon-services">
        {t("salon.page.browseServices")}
      </a>
      <header className="salon-header">
        <div className="salon-container salon-header-inner">
          <Link
            to="/"
            className="salon-brand"
            aria-label={t("clients.lunaraHome")}
          >
            <span className="salon-brand-mark">L</span>
            <span className="salon-wordmark">
              lunara<span>{t("salon.page.salonExperience")}</span>
            </span>
          </Link>
          <nav
            className="salon-header-links"
            aria-label={t("salon.page.pageNavigation")}
          >
            <a href="#salon-services">{t("nav.services")}</a>
            <a href="#salon-team">{t("salon.page.theTeam")}</a>
            <a href="#salon-contact">{t("salon.page.visitUs")}</a>
          </nav>
          <button
            onClick={handleBooking}
            className="salon-button salon-header-book"
          >
            {t("salon.bookNow")} <span aria-hidden="true">↗</span>
          </button>
        </div>
      </header>
      <main className="salon-container">
        <PublicSalonHero
          salonName={salonName}
          serviceCount={services.length}
          staffCount={staffMembers.length}
          onBooking={handleBooking}
        />
        <nav
          className="salon-section-nav"
          aria-label={t("salon.page.exploreSalon")}
        >
          <a href="#salon-services">
            {t("nav.services")} <span>{services.length}</span>
          </a>
          <a href="#salon-team">
            {t("salon.page.theTeam")} <span>{staffMembers.length}</span>
          </a>
          <a href="#salon-contact">{t("salon.page.visitUs")}</a>
        </nav>
        <div className="salon-main-grid">
          <div className="salon-main-content">
            <PublicSalonServices
              key={slug}
              services={services}
              currencyCode={currencyCode}
            />
            <PublicSalonStaff staffMembers={staffMembers} />
            <section id="salon-contact" className="salon-contact salon-panel">
              <p className="salon-eyebrow">{t("salon.page.letsConnect")}</p>
              <h2>{t("salon.page.visitUs")}</h2>
              <p className="salon-muted">
                {t("salon.page.contactDescription")}
              </p>
              <div className="salon-contact-links">
                {ownerProfile.phone && (
                  <a href={`tel:${ownerProfile.phone.replace(/[^+\d]/g, "")}`}>
                    <Icon name="phone" size={20} aria-hidden="true" />
                    <span>
                      <small>{t("common.phone")}</small>
                      {ownerProfile.phone}
                    </span>
                    <span aria-hidden="true">↗</span>
                  </a>
                )}
                {ownerProfile.email && (
                  <a href={`mailto:${ownerProfile.email}`}>
                    <Icon name="email-envelope" size={20} aria-hidden="true" />
                    <span>
                      <small>{t("common.email")}</small>
                      {ownerProfile.email}
                    </span>
                    <span aria-hidden="true">↗</span>
                  </a>
                )}
                {ownerProfile.address && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ownerProfile.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon name="home-house" size={20} aria-hidden="true" />
                    <span>
                      <small>{t("salon.page.address")}</small>
                      {ownerProfile.address}
                    </span>
                    <span aria-hidden="true">↗</span>
                  </a>
                )}
                {!ownerProfile.phone &&
                  !ownerProfile.email &&
                  !ownerProfile.address && (
                    <p className="salon-muted">{t("salon.page.noContact")}</p>
                  )}
              </div>
            </section>
          </div>
          <aside className="salon-sidebar">
            <section className="salon-booking-card">
              <span className="salon-icon-tile">
                <Icon name="calendar-week" size={23} aria-hidden="true" />
              </span>
              <p className="salon-eyebrow">{t("salon.page.aMomentForYou")}</p>
              <h2>{t("salon.page.yourNextVisit")}</h2>
              <p className="salon-muted">
                {t("salon.page.bookingDescription")}
              </p>
              <button className="salon-button" onClick={handleBooking}>
                {t("common.bookAppointment")} <span aria-hidden="true">↗</span>
              </button>
              <p className="salon-booking-note">
                <Icon name="user-profile" size={15} aria-hidden="true" />
                {t("salon.page.signInToBook")}
              </p>
            </section>
            <div className="salon-care-note">
              <Icon name="heart-love" size={22} aria-hidden="true" />
              <div>
                <strong>{t("salon.page.careStartsHere")}</strong>
                <p>{t("salon.page.careDescription")}</p>
              </div>
            </div>
            <ShareSalon
              salonUrl={salonUrl}
              ownerName={salonName}
              socialLinks={data?.settings?.socialLinks}
            />
          </aside>
        </div>
        <footer className="salon-footer">
          <Link to="/" className="salon-wordmark">
            lunara
          </Link>
          <p>{t("salon.page.footer")}</p>
          <a href="#salon-services">{t("salon.page.backToServices")} ↑</a>
        </footer>
      </main>
      <div className="salon-mobile-booking">
        <div>
          <strong>{salonName}</strong>
          <span>{t("salon.page.aMomentForYou")}</span>
        </div>
        <button className="salon-button" onClick={handleBooking}>
          {t("salon.bookNow")} <span aria-hidden="true">↗</span>
        </button>
      </div>
    </div>
  );
}
