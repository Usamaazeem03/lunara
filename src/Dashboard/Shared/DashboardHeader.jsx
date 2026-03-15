function DashboardHeader({ children, eyebrow, title, description }) {
  return (
    <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
      <div>
        <p className="text-xs uppercase tracking-widest text-ink-muted">
          {/* Welcome back */}
          {eyebrow}
        </p>
        <h1 className="text-3xl font-semibold tracking-wide sm:text-4xl">
          {/* Alex */}
          {title}
        </h1>
        <p className="mt-2 max-w-lg text-sm text-ink-muted sm:text-base">
          {/* Manage your appointments, tailor your glow routine, and stay on top of
          your beauty journey. */}
          {description}
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        {/* <button
          type="button"
          onClick={() => setActiveMenu("Book Appointment")}
          className="border border-[#2d2620] px-4 py-2 text-[0.65rem] uppercase tracking-widest transition hover:bg-[#2d2620] hover:text-[#f3efe9] sm:text-xs"
        >
          Book Appointment
        </button>
        <button className="border border-[#2d2620]/30 bg-white/70 px-4 py-2 text-[0.65rem] uppercase tracking-widest transition hover:border-[#2d2620] sm:text-xs">
          Contact Salon
        </button> */}
        {children}
      </div>
    </header>
  );
}

export default DashboardHeader;
