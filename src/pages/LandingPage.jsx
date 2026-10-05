import { useTranslation } from "react-i18next";
import LandingHeader from "../features/marketing/LandingHeader";
import HeroMainSection from "../features/marketing/HeroMainSection";
import FeaturesGridSection from "../features/marketing/FeaturesGridSection";
import WorkflowStepsSection from "../features/marketing/WorkflowStepsSection";
import DashboardPreviewSection from "../features/marketing/DashboardPreviewSection";
import ClientExperienceSection from "../features/marketing/ClientExperienceSection";
import PricingSection from "../features/marketing/PricingSection";
import CTASection from "../features/marketing/CTASection";
import LandingFooter from "../features/marketing/LandingFooter";
import "../features/marketing/marketing.css";

export default function LandingPage() {
  const { t } = useTranslation();
  return (
    <div className="marketing-page">
      <a className="marketing-skip" href="#main-content">{t("marketing.skipToContent")}</a>
      <LandingHeader />
      <main id="main-content">
        <HeroMainSection />
        <div className="marketing-ribbon" aria-label={t("marketing.madeForYourEveryday")}>
          <span>{t("marketing.yourSalonYourRhythm")}</span>
          <span>{t("marketing.bookings")}</span><i aria-hidden="true">✦</i>
          <span>{t("marketing.people")}</span><i aria-hidden="true">✦</i>
          <span>{t("marketing.aLittleMoreBreathingRoom")}</span>
        </div>
        <FeaturesGridSection />
        <DashboardPreviewSection />
        <WorkflowStepsSection />
        <ClientExperienceSection />
        <PricingSection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  );
}
