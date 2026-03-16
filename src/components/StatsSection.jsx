function StatsSection({ stats }) {
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
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="border border-black/10 bg-white/70 p-6 text-center"
            >
              <p className="text-3xl font-semibold tracking-widest">
                {stat.value}
              </p>
              <p className="mt-3 text-sm uppercase tracking-[0.25em] text-black/60">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default StatsSection;
