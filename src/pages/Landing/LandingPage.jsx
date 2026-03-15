import { NavLink } from "react-router-dom";
import Button from "../../Dashboard/Shared/Button";
import CornerWord from "../../components/CornerWord";

import calendarIcon from "../../assets/icons/calendar.svg";
import clockIcon from "../../assets/icons/clock.svg";
import creditCardIcon from "../../assets/icons/credit-card.svg";
import bellIcon from "../../assets/icons/bell.svg";
import homeIcon from "../../assets/icons/home.svg";
import giftIcon from "../../assets/icons/gift-box-benefits.svg";

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
      icon: calendarIcon,
    },
    {
      title: "Automated Reminders",
      description:
        "Text and email nudges that reduce last-minute cancellations.",
      icon: bellIcon,
    },
    {
      title: "Payments and Deposits",
      description: "Collect deposits or full payment before the visit.",
      icon: creditCardIcon,
    },
    {
      title: "Team Availability",
      description: "Control shifts, breaks, and services per specialist.",
      icon: clockIcon,
    },
    {
      title: "Client Profiles",
      description: "Track preferences, visit history, and notes in one view.",
      icon: homeIcon,
    },
    {
      title: "Packages and Gifts",
      description: "Offer bundles, memberships, and gift cards with ease.",
      icon: giftIcon,
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

        <nav className="relative z-20 flex items-center justify-between px-6 py-6 md:px-12 lg:px-20">
          <div className="text-2xl font-bold tracking-widest">LUNARA</div>
          <div className="hidden items-center gap-8 text-xs uppercase tracking-[0.3em] md:flex">
            <a href="#features" className="text-black/70 hover:text-black">
              Features
            </a>
            <a href="#workflow" className="text-black/70 hover:text-black">
              Workflow
            </a>
            <a href="#preview" className="text-black/70 hover:text-black">
              Preview
            </a>
            <a href="#pricing" className="text-black/70 hover:text-black">
              Pricing
            </a>
          </div>
          <div className="flex items-center gap-3">
            <NavLink
              to="/auth/owner/signin"
              className="text-xs uppercase tracking-[0.3em] text-black/70 hover:text-black"
            >
              Login
            </NavLink>
            <NavLink
              to="/auth/owner/signup"
              className="border border-ink px-4 py-2 text-xs uppercase tracking-[0.3em] text-ink transition hover:bg-ink hover:text-cream"
            >
              Start Free
            </NavLink>
          </div>
        </nav>

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
              Online scheduling, automated reminders, payments, and client
              profiles in one elegant flow.
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
              <p className="mt-2 text-lg font-semibold text-black">
                Today 3:30 PM
              </p>
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
          {/* <div className="pointer-events-none absolute top-10 right-6 hidden text-[6rem] font-extrabold tracking-widest text-white/30 lg:block">
            LUNARA
          </div> */}
        </div>
      </header>

      <section className="border-y border-black/10 bg-[#f3efe9] py-6">
        <div className="flex flex-col gap-4 px-6 md:flex-row md:items-center md:justify-between md:px-12 lg:px-20">
          <p className="text-xs uppercase tracking-[0.35em] text-black/50">
            Trusted by growing studios
          </p>
          <div className="marquee">
            <div className="marquee-track">
              {trustLogos.concat(trustLogos).map((brand, index) => (
                <span
                  key={`${brand}-${index}`}
                  className="text-xs uppercase tracking-[0.35em] text-black/50"
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

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
              client notes. Clients get a clean, mobile-first booking
              experience.
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

      <section
        id="features"
        className="bg-[#f3efe9] px-6 py-16 md:px-12 lg:px-20"
      >
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-widest sm:text-4xl">
            FEATURES BUILT FOR BOOKING
          </h2>
          <p className="mt-4 text-lg text-black/70">
            Everything you need to run schedules, protect revenue, and grow your
            client base.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group border border-black/10 bg-white/70 p-6 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white">
                  <img
                    src={feature.icon}
                    alt=""
                    className="h-6 w-6"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="text-xl font-semibold tracking-wide">
                  {feature.title}
                </h3>
              </div>
              <p className="mt-4 text-sm text-black/70">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="workflow"
        className="relative overflow-hidden bg-[#ede2d3] px-6 py-16 md:px-12 lg:px-20"
      >
        <div className="absolute -right-10 top-10 h-40 w-40 rounded-full bg-black/10 blur-3xl" />
        <div className="relative z-10">
          <p className="text-xs uppercase tracking-[0.4em] text-black/50">
            How it works
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-widest sm:text-4xl">
            A smooth flow for teams and clients.
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="border border-black/20 bg-white/70 p-6"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-black/20 bg-black text-sm font-semibold text-white">
                    0{index + 1}
                  </span>
                  <h3 className="text-xl font-semibold tracking-wide">
                    {step.title}
                  </h3>
                </div>
                <p className="mt-4 text-sm text-black/70">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="preview"
        className="bg-[#f3efe9] px-6 py-16 md:px-12 lg:px-20"
      >
        <div className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-black/50">
              Owner dashboard
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-widest sm:text-4xl">
              See your entire day at a glance.
            </h2>
            <p className="mt-6 text-lg text-black/70">
              Manage staff shifts, reschedule in seconds, and view client
              history without leaving the calendar.
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
                  <p className="mt-1 text-[11px] text-black/50">
                    Captured today
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f3efe9] px-6 pb-4 pt-10 md:px-12 lg:px-20">
        <div className="grid gap-10 lg:grid-cols-[0.9fr,1.1fr] lg:items-center">
          {/* <div className="rounded-[28px] border border-black/10 bg-white/70 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
            <img
              src={clientLoginImg}
              alt="Client booking preview"
              className="h-[360px] w-full rounded-[20px] object-cover"
              loading="lazy"
              decoding="async"
            />
          </div> */}
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-black/50">
              Client experience
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-widest sm:text-4xl">
              A booking flow that feels premium.
            </h2>
            <p className="mt-6 text-lg text-black/70">
              Mobile-first screens, clear pricing, and auto confirmations give
              clients confidence to return again.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <NavLink
                to="/auth/owner/signup"
                className="border border-ink px-6 py-3 text-xs uppercase tracking-[0.35em] text-ink transition hover:bg-ink hover:text-cream"
              >
                Client signup
              </NavLink>
              <NavLink
                to="/auth/client/signin"
                className="border border-ink/30 px-6 py-3 text-xs uppercase tracking-[0.35em] text-ink "
              >
                Client login
              </NavLink>
            </div>

            {/* <div className="mt-8 flex flex-wrap gap-4">
              <NavLink
                to="/auth/client/signup"
                className="border border-black/60 px-6 py-3 text-xs uppercase tracking-[0.35em] text-black transition hover:bg-black hover:text-[#f3efe9]"
              >
                Client signup
              </NavLink>
              <NavLink
                to="/auth/client/signin"
                className="text-xs uppercase tracking-[0.35em] text-black/70 hover:text-black"
              >
                Client login
              </NavLink>
            </div> */}
          </div>
        </div>
      </section>

      <section
        id="pricing"
        className="bg-[#f3efe9] px-6 py-16 md:px-12 lg:px-20"
      >
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-black/50">
            Simple pricing
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-widest sm:text-4xl">
            Plans that scale with your studio.
          </h2>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Starter",
              price: "$29",
              note: "Per location / month",
              features: [
                "Single calendar",
                "Client reminders",
                "Basic reports",
              ],
            },
            {
              title: "Growth",
              price: "$59",
              note: "Most popular",
              features: ["Multiple staff", "Payments", "Marketing tools"],
            },
            {
              title: "Studio",
              price: "$99",
              note: "Multi-location",
              features: ["Advanced analytics", "Custom branding", "Priority"],
            },
          ].map((plan) => (
            <div
              key={plan.title}
              className="flex h-full flex-col border border-black/10 bg-white/80 p-6"
            >
              <h3 className="text-xl font-semibold tracking-widest">
                {plan.title}
              </h3>
              <p className="mt-3 text-4xl font-semibold">{plan.price}</p>
              <p className="text-xs uppercase tracking-[0.25em] text-black/50">
                {plan.note}
              </p>
              <div className="mt-6 space-y-2 text-sm text-black/70">
                {plan.features.map((item) => (
                  <div key={item}>{item}</div>
                ))}
              </div>
              <Button
                type="button"
                variant="custom"
                unstyled
                className="mt-6 border border-black/60 px-6 py-3 text-xs uppercase tracking-[0.35em] text-black transition hover:bg-black hover:text-[#f3efe9]"
              >
                Choose plan
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section
        id="demo"
        className="bg-[#2d2620] px-6 py-16 text-[#f3efe9] md:px-12 lg:px-20"
      >
        <div className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
          <div>
            <h2 className="text-3xl font-semibold tracking-widest sm:text-4xl">
              Ready to book smarter?
            </h2>
            <p className="mt-4 text-lg text-[#f3efe9]/80">
              Set up your studio in minutes. Import clients, open your calendar,
              and start collecting deposits today.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <NavLink
              to="/auth/owner/signup"
              className="bg-[#f3efe9] px-6 py-3 text-xs uppercase tracking-[0.35em] text-[#2d2620] transition hover:bg-white"
            >
              Start free trial
            </NavLink>
            <NavLink
              to="/auth/owner/signin"
              className="border border-[#f3efe9]/60 px-6 py-3 text-xs uppercase tracking-[0.35em] text-[#f3efe9] transition hover:bg-[#f3efe9] hover:text-[#2d2620]"
            >
              Owner login
            </NavLink>
          </div>
        </div>
      </section>

      <section className="bg-[#f3efe9] px-6 py-16 md:px-12 lg:px-20">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-black/50">
            Loved by studios
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-widest sm:text-4xl">
            Teams that feel in control again.
          </h2>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="border border-black/10 bg-white/70 p-6"
            >
              <p className="text-sm text-black/70">"{testimonial.quote}"</p>
              <p className="mt-4 text-sm font-semibold tracking-wide">
                {testimonial.name}
              </p>
              <p className="text-xs uppercase tracking-[0.25em] text-black/50">
                {testimonial.role}
              </p>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-[#f3efe9] px-6 pb-12 pt-6 md:px-12 lg:px-20">
        <div className="grid gap-8 border-t border-black/10 pt-8 md:grid-cols-3">
          <div>
            <p className="text-lg font-semibold tracking-widest">LUNARA</p>
            <p className="mt-3 text-sm text-black/60">
              Booking and growth platform for modern beauty studios.
            </p>
          </div>
          <div className="text-sm uppercase tracking-[0.25em] text-black/60">
            <div>Features</div>
            <div className="mt-2">Pricing</div>
            <div className="mt-2">Support</div>
          </div>
          <div className="text-sm uppercase tracking-[0.25em] text-black/60">
            <div>Instagram</div>
            <div className="mt-2">LinkedIn</div>
            <div className="mt-2">Contact</div>
          </div>
        </div>
        <div className="mt-8 text-xs uppercase tracking-[0.25em] text-black/40">
          (c) 2026 Lunara Booking
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
