function AuthHeroPanel({ role, imageSrc, content }) {
  return (
    <div className="hidden md:block relative min-h-[240px] md:min-h-full">
      <img
        src={imageSrc}
        alt={role === "owner" ? "Owner login" : "Client login"}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/50 to-black/10" />

      <div className="absolute -left-16 -top-16 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-20 right-0 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

      <div className="relative z-10 flex h-full flex-col p-10 text-white">
        <h1 className="mb-4 text-4xl uppercase tracking-[0.4em] text-white/70">
          LUNARA
        </h1>

        <div className="mt-auto">
          <p className="text-4xl font-bold">{content.heroTitle}</p>
          <p className="mt-4 max-w-md text-lg text-white/85">
            {content.heroBody}
          </p>

          <div className="mt-6 grid gap-4 text-xs uppercase tracking-[0.2em] text-white/80 sm:grid-cols-3">
            {content.steps.map((step, index) => (
              <div
                key={`${step}-${index}`}
                className="rounded-xl bg-white/30 px-4 py-3"
              >
                <p className="text-[10px] text-white/60">Step {index + 1}</p>
                <p className="mt-2 text-sm font-semibold normal-case">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthHeroPanel;
