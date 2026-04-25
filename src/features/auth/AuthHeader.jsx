function AuthHeader({ eyebrow, headline, subhead }) {
  return (
    <>
      <p className="text-xs uppercase tracking-[0.3em] md:tracking-[0.4em] text-ink/50 md:text-black/50">
        {eyebrow}
      </p>
      <h2 className="mt-1 text-lg sm:text-xl md:text-4xl font-semibold md:font-bold text-ink md:text-black tracking-[0.1em] md:tracking-[0.2em]">
        {headline}
      </h2>
      <p className="mt-1.5 text-xs sm:text-sm text-ink/60 md:text-black/60">
        {subhead}
      </p>
    </>
  );
}

export default AuthHeader;
