import { NavLink } from "react-router-dom";
import CornerWord from "./CornerWord";

function HeroMainSection({ heroHighlights, heroMetrics, heroVideo }) {
  return (
    <div className="relative z-10 grid items-center gap-12 px-6 pb-20 pt-6 md:px-12 lg:grid-cols-[1.1fr,0.9fr] lg:px-20 lg:pb-28">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-[11px] uppercase tracking-[0.35em] text-black/60">
          <span className="h-2 w-2 rounded-full bg-black/70" />
          Booking platform for salons
        </div>
        <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-widest sm:text-5xl lg:text-6xl">
          Book more. Manage less.{" "}
          <CornerWord>Make every day feel effortless.</CornerWord>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-black/70">
          The booking platform built for modern salons and service studios.
          Online scheduling, automated reminders, payments, and client profiles
          in one elegant flow.
        </p>

        <div className="mt-6 grid gap-3 text-sm text-black/70 sm:grid-cols-2">
          {heroHighlights.map((item) => (
            <div key={item} className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-black/70" />
              <span>{item}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <NavLink
            to="/auth/owner/signup"
            className="border border-ink px-6 py-3 text-xs uppercase tracking-[0.35em] text-ink transition hover:bg-ink hover:text-cream"
          >
            Start free trial
          </NavLink>
          <a
            href="#demo"
            className="border border-ink/30 px-6 py-3 text-xs uppercase tracking-[0.35em] text-ink "
          >
            Book a demo
          </a>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-6 text-[11px] uppercase tracking-[0.35em] text-black/60">
          <span>No credit card</span>
          <span>Cancel anytime</span>
          <span>Setup in 15 minutes</span>
        </div>
      </div>

      <div className="relative">
        <div className="absolute -left-8 top-12 z-20 hidden w-48 rounded-2xl border border-black/10 bg-white/80 p-4 text-xs uppercase tracking-[0.2em] text-black/70 shadow-lg backdrop-blur md:block float-slow">
          <p className="text-[10px] text-black/50">Next opening</p>
          <p className="mt-2 text-lg font-semibold text-black">Today 3:30 PM</p>
          <p className="mt-2 text-[10px] text-black/50">2 slots left</p>
        </div>

        <div className="absolute -right-6 bottom-10 z-20 hidden w-44 rounded-2xl border border-black/10 bg-white/80 p-4 text-xs uppercase tracking-[0.2em] text-black/70 shadow-lg backdrop-blur md:block float-slow-delay">
          <p className="text-[10px] text-black/50">Deposit captured</p>
          <p className="mt-2 text-lg font-semibold text-black">$45.00</p>
          <p className="mt-2 text-[10px] text-black/50">Auto-confirmed</p>
        </div>

        <div className="absolute right-8 top-6 z-20 hidden w-32 rounded-2xl border border-black/10 bg-white/80 p-3 text-[10px] uppercase tracking-[0.2em] text-black/70 shadow-lg backdrop-blur lg:block float-slow-delay-2">
          <p className="text-black/50">Waitlist</p>
          <p className="mt-2 text-lg font-semibold text-black">6</p>
        </div>

        <div className="relative z-10 rounded-[32px] border border-black/10 bg-white/60 p-4 shadow-[0_25px_70px_rgba(0,0,0,0.2)]">
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
            <div className="absolute bottom-6 left-6 rounded-full bg-white/80 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-black/70">
              Open slots today: 14
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 text-[11px] uppercase tracking-[0.25em] text-black/60">
            {heroMetrics.map((metric) => (
              <div key={metric.label}>
                <p className="text-lg font-semibold text-black">
                  {metric.value}
                </p>
                <p className="text-[10px] text-black/50">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-6 hidden text-[10rem] font-extrabold tracking-widest text-white/40 lg:block">
        BOOKING
      </div>
    </div>
  );
}

export default HeroMainSection;
