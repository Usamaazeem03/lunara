function AppHeader({ children, eyebrow, title, description }) {
  return (
    <header className="mb-2 flex flex-col gap-3 sm:gap-4 md:mb-3 lg:flex-row lg:items-end lg:justify-between">
      <div className="flex-1">
        <p className="text-ink-muted text-[0.65rem] tracking-widest uppercase sm:text-xs">
          {/* Welcome back */}
          {eyebrow}
        </p>
        <h1 className="text-2xl font-semibold tracking-wide sm:text-3xl md:text-4xl">
          {/* Alex */}
          {title}
        </h1>
        <p className="text-ink-muted mt-1.5 max-w-lg text-sm sm:mt-2 sm:text-base md:text-base">
          {/* Manage your appointments, tailor your glow routine, and stay on top of
          your beauty journey. */}
          {description}
        </p>
      </div>
      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-3">
        {children}
      </div>
    </header>
  );
}

export default AppHeader;
