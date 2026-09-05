function RedeemPointsPanal() {
  return (
    <div className="bg-ink p-4 text-cream sm:p-5 transition-all duration-300 hover:bg-ink/90">
      <p className="text-[0.65rem] uppercase tracking-widest text-cream/70 sm:text-xs">
        Loyalty Status
      </p>
      <p className="mt-2 text-2xl font-semibold sm:mt-3 sm:text-3xl">120 pts</p>
      <p className="mt-1.5 text-xs text-cream/80 sm:mt-2">
        Redeem a glow boost on your next visit.
      </p>
      <button className="mt-4 w-full border border-cream px-3 py-2 text-[0.6rem] uppercase tracking-widest transition duration-300 hover:bg-cream hover:text-ink active:scale-95 sm:mt-5 sm:px-4 sm:py-2.5 sm:text-xs">
        Redeem Points
      </button>
    </div>
  );
}

export default RedeemPointsPanal;
