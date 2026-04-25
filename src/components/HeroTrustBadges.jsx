function HeroTrustBadges({ items }) {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-6 text-[11px] uppercase tracking-[0.35em] text-black/60">
      {items.map((item, idx) => (
        <span key={idx}>{item}</span>
      ))}
    </div>
  );
}

export default HeroTrustBadges;
