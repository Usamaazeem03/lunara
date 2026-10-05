function AuthHeader({ eyebrow, headline, subhead }) {
  return (
    <>
      <p className="text-ink/50 text-xs tracking-[0.3em] uppercase md:tracking-[0.4em] md:text-black/50">
        {eyebrow}
      </p>
      <h2 className="text-ink mt-1 text-lg font-semibold tracking-[0.1em] sm:text-xl md:text-4xl md:font-bold md:tracking-[0.2em] md:text-black">
        {headline}
      </h2>
      <p className="text-ink/60 mt-1.5 text-xs sm:text-sm md:text-black/60">
        {subhead}
      </p>
    </>
  );
}

export default AuthHeader;
