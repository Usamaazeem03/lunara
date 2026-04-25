function HeroMetricItem({ heroMetrics }) {
  return (
    <div className="mt-4 grid grid-cols-3 gap-3 text-[11px] uppercase tracking-[0.25em] text-black/60">
      {heroMetrics.map((metric) => (
        <div key={metric.label}>
          <p className="text-lg font-semibold text-black">{metric.value}</p>
          <p className="text-[10px] text-black/50">{metric.label}</p>
        </div>
      ))}
    </div>
  );
}

export default HeroMetricItem;
