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
  return (
    <div className="marketing-page">
      <a className="marketing-skip" href="#main-content">Skip to content</a>
      <LandingHeader />
      <main id="main-content">
        <HeroMainSection />
        <div className="marketing-ribbon" aria-label="Made for your everyday">
          <span>YOUR SALON. YOUR RHYTHM.</span>
          <span>Bookings</span><i aria-hidden="true">✦</i>
          <span>People</span><i aria-hidden="true">✦</i>
          <span>A little more breathing room</span>
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
