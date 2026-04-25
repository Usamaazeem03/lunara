import HeroMetricItem from "../../components/HeroMetricItem";
import HeroVideoCard from "../../components/HeroVideoCard";
import FloatingInfoCard from "./FloatingInfoCard";
import HeroHeadline from "../../components/HeroHeadline";

const floatingCards = [
  {
    position: "-left-8 top-12",
    animation: "float-slow",
    infoCardProps: {
      label: "Next opening",
      title: "Today 3:30 PM",
      meta: "2 slots left",
      padding: "p-4",
      className: "w-48 text-xs uppercase tracking-[0.2em] text-black/70",
    },
  },
  {
    position: "-right-6 bottom-10",
    animation: "float-slow-delay",
    infoCardProps: {
      label: "Deposit captured",
      title: "$45.00",
      meta: "Auto-confirmed",
      padding: "p-4",
      className: "w-44 text-xs uppercase tracking-[0.2em] text-black/70",
    },
  },
  {
    position: "right-8 top-6",
    animation: "float-slow-delay-2",
    infoCardProps: {
      label: "Waitlist",
      title: "6",
      padding: "p-3",
      className: "w-32 text-xs uppercase tracking-[0.2em] text-black/70",
    },
  },
];
function HeroMainSection({ heroHighlights, heroMetrics, heroVideo }) {
  return (
    <div className="relative z-10 grid items-center gap-12 px-6 pt-6 pb-20 md:px-12 lg:grid-cols-[1.1fr,0.9fr] lg:px-20 lg:pb-28">
      <HeroHeadline heroHighlights={heroHighlights} />

      <div className="relative">
        {/* Floating Info Cards */}
        {floatingCards.map((card, idx) => (
          <FloatingInfoCard
            key={idx}
            position={card.position}
            animation={card.animation}
            infoCardProps={card.infoCardProps}
          />
        ))}
        <div className="relative z-10 rounded-[32px] border border-black/10 bg-white/60 p-4 shadow-[0_25px_70px_rgba(0,0,0,0.2)]">
          <HeroVideoCard heroVideo={heroVideo} />
          <HeroMetricItem heroMetrics={heroMetrics} />
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-6 hidden text-[12rem] font-extrabold tracking-widest text-white/40 lg:block">
        BOOKING
      </div>
    </div>
  );
}

export default HeroMainSection;
