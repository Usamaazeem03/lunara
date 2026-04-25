function LandingFooter() {
  return (
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
  );
}

export default LandingFooter;
