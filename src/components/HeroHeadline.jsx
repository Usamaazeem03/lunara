import Button from "../Shared/Button";
import CornerWord from "./CornerWord";
import HeroBadge from "./HeroBadge";
import HeroHighlightItem from "./HeroHighlightItem";
import HeroTrustBadges from "./HeroTrustBadges";

function HeroHeadline({ heroHighlights }) {
  const trustItems = [
    "No credit card",
    "Cancel anytime",
    "Setup in 15 minutes",
  ];
  return (
    <div>
      <HeroBadge text="Booking platform for salons" bgColor="bg-white/70" />

      <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-widest sm:text-5xl lg:text-6xl">
        Book more. Manage less.{" "}
        <CornerWord>Make every day feel effortless.</CornerWord>
      </h1>
      <p className="mt-6 max-w-xl text-lg text-black/70">
        The booking platform built for modern salons and service studios. Online
        scheduling, automated reminders, payments, and client profiles in one
        elegant flow.
      </p>

      <HeroHighlightItem heroHighlights={heroHighlights} />

      <div className="mt-8 flex flex-wrap gap-4">
        <Button
          to="/auth/owner/signup"
          variant="primary"
          className="px-6 py-3 text-xs tracking-[0.35em] text-ink"
        >
          Start free trial
        </Button>
        <Button
          href="#demo"
          variant="custom"
          className="border border-ink/30 px-6 py-3 text-xs uppercase tracking-[0.35em] text-ink "
        >
          Book a demo
        </Button>
      </div>

      <HeroTrustBadges items={trustItems} />
    </div>
  );
}

export default HeroHeadline;
