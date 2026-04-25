function DashboardHeader({ children, eyebrow, title, description }) {
  return (
    <header className="mb-2 flex flex-col gap-3 sm:gap-4 md:mb-3 lg:flex-row lg:items-end lg:justify-between">
      <div className="flex-1">
        <p className="text-[0.65rem] uppercase tracking-widest text-ink-muted sm:text-xs">
          {/* Welcome back */}
          {eyebrow}
        </p>
        <h1 className="text-2xl font-semibold tracking-wide sm:text-3xl md:text-4xl">
          {/* Alex */}
          {title}
        </h1>
        <p className="mt-1.5 max-w-lg text-sm text-ink-muted sm:mt-2 sm:text-base md:text-base">
          {/* Manage your appointments, tailor your glow routine, and stay on top of
          your beauty journey. */}
          {description}
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:gap-3 sm:flex-wrap w-full sm:w-auto">
        {children}
      </div>
    </header>
  );
}

export default DashboardHeader;
