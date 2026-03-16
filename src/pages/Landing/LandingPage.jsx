import LandingHeader from "../../components/LandingHeader";
import HeroMainSection from "../../components/HeroMainSection";
import TrustBrandsSection from "../../components/TrustBrandsSection";
import StatsSection from "../../components/StatsSection";
import FeaturesGridSection from "../../components/FeaturesGridSection";
import WorkflowStepsSection from "../../components/WorkflowStepsSection";
import DashboardPreviewSection from "../../components/DashboardPreviewSection";
import ClientExperienceSection from "../../components/ClientExperienceSection";
import PricingSection from "../../components/PricingSection";
import CTASection from "../../components/CTASection";
import TestimonialsSection from "../../components/TestimonialsSection";
import LandingFooter from "../../components/LandingFooter";

import Icon from "../../components/Icon";
import heroVideo from "../../assets/images/hero-img-b.mp4";

function LandingPage() {
  const stats = [
    { value: "28%", label: "Fewer no-shows with smart reminders" },
    { value: "3x", label: "Faster checkouts with saved cards" },
    { value: "60%", label: "More rebookings from auto follow-ups" },
  ];

  const features = [
    {
      title: "Smart Scheduling",
      description:
        "Prevent double bookings, balance staff time, and keep calendars clean.",
      icon: <Icon name="calendar" />,
    },
    {
      title: "Automated Reminders",
      description:
        "Text and email nudges that reduce last-minute cancellations.",
      icon: <Icon name="bell" />,
    },
    {
      title: "Payments and Deposits",
      description: "Collect deposits or full payment before the visit.",
      icon: <Icon name="credit-card" />,
    },
    {
      title: "Team Availability",
      description: "Control shifts, breaks, and services per specialist.",
      icon: <Icon name="clock" />,
    },
    {
      title: "Client Profiles",
      description: "Track preferences, visit history, and notes in one view.",
      icon: <Icon name="home" />,
    },
    {
      title: "Packages and Gifts",
      description: "Offer bundles, memberships, and gift cards with ease.",
      icon: <Icon name="gift-box-benefits" />,
    },
  ];

  const steps = [
    {
      title: "Set up services",
      text: "Add your services, staff, prices, and availability in minutes.",
    },
    {
      title: "Share your booking link",
      text: "Clients book 24/7 from any device, no calls needed.",
    },
    {
      title: "Confirm and remind",
      text: "Instant confirmations and gentle reminders keep schedules solid.",
    },
    {
      title: "Get paid and grow",
      text: "Deposits, tips, and analytics help you scale with confidence.",
    },
  ];

  const testimonials = [
    {
      quote:
        "We reduced no-shows in the first month and the team finally stopped juggling DMs.",
      name: "Sana K.",
      role: "Studio Owner",
    },
    {
      quote:
        "The booking flow feels premium. Clients love the clean experience and I love the calendar.",
      name: "Mira L.",
      role: "Lead Stylist",
    },
    {
      quote: "Payments are simple now. Deposits saved our peak-season revenue.",
      name: "Adeel R.",
      role: "Operations Manager",
    },
  ];

  const heroHighlights = [
    "Online booking 24/7",
    "Automated reminders",
    "Deposits and tips",
    "Client profiles and notes",
  ];

  const heroMetrics = [
    { value: "42", label: "Bookings today" },
    { value: "93%", label: "Fill rate" },
    { value: "$1.8k", label: "Deposits" },
  ];

  const trustLogos = [
    "Aura Studio",
    "Velvet Room",
    "Muse Loft",
    "Glow Bar",
    "Studio 18",
    "Luxe Lane",
    "Bloom Atelier",
    "The Cut Collective",
  ];

  return (
    <div className="bg-[#f3efe9] text-[#2d2620]">
      <header className="relative overflow-hidden bg-[#c5ced6]">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at top, rgba(255,255,255,0.65), rgba(197,206,214,0.15) 55%, rgba(197,206,214,0) 75%)",
          }}
        />
        <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />

        <LandingHeader />
        <HeroMainSection
          heroHighlights={heroHighlights}
          heroMetrics={heroMetrics}
          heroVideo={heroVideo}
        />
      </header>

      <TrustBrandsSection trustLogos={trustLogos} />
      <StatsSection stats={stats} />
      <FeaturesGridSection features={features} />
      <WorkflowStepsSection steps={steps} />
      <DashboardPreviewSection />
      <ClientExperienceSection />
      <PricingSection />
      <CTASection />
      <TestimonialsSection testimonials={testimonials} />
      <LandingFooter />
    </div>
  );
}
export default LandingPage;
