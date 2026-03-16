function DashboardPreviewSection() {
  return (
    <section id="preview" className="bg-[#f3efe9] px-6 py-16 md:px-12 lg:px-20">
      <div className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-black/50">
            Owner dashboard
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-widest sm:text-4xl">
            See your entire day at a glance.
          </h2>
          <p className="mt-6 text-lg text-black/70">
            Manage staff shifts, reschedule in seconds, and view client history
            without leaving the calendar.
          </p>
          <ul className="mt-6 space-y-3 text-sm uppercase tracking-[0.25em] text-black/60">
            <li>Live queue and waitlist</li>
            <li>Quick add-ons and retail</li>
            <li>Daily performance snapshot</li>
          </ul>
        </div>
        <div className="rounded-[28px] border border-black/10 bg-white/70 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
          <div className="rounded-[22px] border border-black/10 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-black/40">
                  Owner dashboard
                </p>
                <p className="mt-2 text-lg font-semibold text-black">
                  Today overview
                </p>
              </div>
              <span className="rounded-full border border-black/10 bg-[#f3efe9] px-3 py-1 text-[10px] uppercase tracking-[0.35em] text-black/60">
                Live
              </span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { label: "Bookings", value: "24" },
                { label: "Check-ins", value: "18" },
                { label: "Revenue", value: "$1.2k" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-black/10 bg-[#f7f2ec] p-3 text-center"
                >
                  <p className="text-lg font-semibold text-black">
                    {item.value}
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-black/50">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-black/10 bg-white p-4">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.35em] text-black/50">
                <span>Schedule</span>
                <span>Next 3 hours</span>
              </div>
              <div className="mt-4 space-y-3">
                {[
                  {
                    time: "2:00 PM",
                    name: "Zara A.",
                    service: "Color + Cut",
                  },
                  { time: "2:45 PM", name: "Maya R.", service: "Skin glow" },
                  { time: "3:30 PM", name: "Noor H.", service: "Blowout" },
                ].map((slot) => (
                  <div
                    key={slot.time}
                    className="flex items-center justify-between rounded-xl border border-black/10 bg-[#f3efe9] px-3 py-2 text-sm"
                  >
                    <div>
                      <p className="font-semibold text-black">{slot.name}</p>
                      <p className="text-[11px] uppercase tracking-[0.3em] text-black/50">
                        {slot.service}
                      </p>
                    </div>
                    <span className="text-xs uppercase tracking-[0.3em] text-black/50">
                      {slot.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-black/10 bg-[#f7f2ec] p-4">
                <p className="text-[10px] uppercase tracking-[0.35em] text-black/50">
                  Waitlist
                </p>
                <p className="mt-2 text-2xl font-semibold text-black">6</p>
                <p className="mt-1 text-[11px] text-black/50">
                  Auto-fill openings
                </p>
              </div>
              <div className="rounded-2xl border border-black/10 bg-[#f7f2ec] p-4">
                <p className="text-[10px] uppercase tracking-[0.35em] text-black/50">
                  Deposits
                </p>
                <p className="mt-2 text-2xl font-semibold text-black">$420</p>
                <p className="mt-1 text-[11px] text-black/50">Captured today</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DashboardPreviewSection;
