function StatCard({ value, label }) {
  return (
    <div className="border border-black/10 bg-white/70 p-6 text-center">
      <p className="text-3xl font-semibold tracking-widest">{value}</p>
      {label && (
        <p className="mt-3 text-sm uppercase tracking-[0.25em] text-black/60">
          {label}
        </p>
      )}
    </div>
  );
}

function StatsSection({ stats }) {
  const data = stats ?? [];

  return (
    <section className="bg-[#f3efe9] px-6 py-16 md:px-12 lg:px-20">
      <div className="grid gap-10 lg:grid-cols-[1fr,1.2fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-black/50">
            Trusted by busy teams
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-widest sm:text-4xl">
            Keep the front desk calm while bookings keep flowing.
          </h2>
          <p className="mt-6 text-lg text-black/70">
            Your team gets one source of truth for schedules, payments, and
            client notes. Clients get a clean, mobile-first booking experience.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {data.map((stat, index) => {
            const label = stat.label || stat.title || "";
            const value = stat.value || "";
            const key = stat.id || label || value || index;

            return <StatCard key={key} value={value} label={label} />;
          })}
        </div>
      </div>
    </section>
  );
}

export default StatsSection;
