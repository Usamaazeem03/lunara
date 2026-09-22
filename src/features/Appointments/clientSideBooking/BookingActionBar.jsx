export default function BookingActionBar({
  totalPriceLabel,
  selectedCount,
  totalDurationLabel,
  step,
  canContinue,
  isSubmitting,
  onContinue,
}) {
  const labels = [
    "Choose a time",
    "Choose a stylist",
    "Review booking",
    "Choose payment",
    "Confirm booking",
  ];
  return (
    <div className="border-ink/10 fixed inset-x-0 bottom-0 z-20 border-t bg-[#fffdf9]/95 px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(45,38,32,0.06)] backdrop-blur-xl lg:sticky lg:mt-6 lg:rounded-2xl lg:border lg:px-5 lg:pb-4">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
        <div className="min-w-0" aria-live="polite" aria-atomic="true">
          <p className="text-ink-muted text-[11px]">
            {selectedCount
              ? `${selectedCount} service${selectedCount === 1 ? "" : "s"} · ${totalDurationLabel}`
              : "Your appointment"}
          </p>
          <p className="text-ink mt-0.5 text-lg font-semibold break-words sm:text-xl">
            {totalPriceLabel}
          </p>
        </div>
        <button
          type="button"
          disabled={!canContinue || isSubmitting}
          onClick={onContinue}
          aria-busy={isSubmitting}
          className="bg-ink text-cream hover:bg-ink/85 focus-visible:outline-ink flex min-h-12 max-w-[60%] items-center justify-center gap-3 rounded-xl px-5 py-3 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40 sm:px-8"
        >
          {isSubmitting ? "Booking..." : labels[step - 1]}
          <span aria-hidden="true">&rarr;</span>
        </button>
      </div>
      {!canContinue && (
        <p className="text-ink-muted mx-auto mt-2 max-w-5xl text-xs">
          {step === 1
            ? "Select a service to get started."
            : "Choose an available date and time to continue."}
        </p>
      )}
    </div>
  );
}
