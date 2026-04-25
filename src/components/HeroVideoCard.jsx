import HeroBadge from "./HeroBadge";

function HeroVideoCard({ heroVideo }) {
  return (
    <div className="relative overflow-hidden rounded-[24px]">
      <video
        src={heroVideo}
        className="h-[420px] w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-label="Lunara booking preview"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

      <HeroBadge
        text="Open slots today: 14"
        bgColor="bg-white/80"
        textColor="text-black/70"
        className="absolute bottom-6 left-6 text-[10px] uppercase tracking-[0.3em]"
        dotColor="bg-green-500/80"
      />
    </div>
  );
}

export default HeroVideoCard;
