function SummaryPanal({
  serviceSummaryTitle,
  serviceSummaryDescription,
  activeDate,
  activeTime,
  activeStaff,
  activePayment,
  totalPriceLabel,
}) {
  return (
    <div className="bg-[#2d2620] p-4 text-[#f3efe9]">
      <p className="text-xs uppercase tracking-widest text-[#f3efe9]/70">
        Booking Summary
      </p>
      <p className="mt-2 text-2xl font-semibold">{serviceSummaryTitle}</p>
      <p className="mt-1 text-xs text-[#f3efe9]/80">
        {serviceSummaryDescription}
      </p>
      <div className="mt-3 space-y-2 text-xs uppercase tracking-widest text-[#f3efe9]/70">
        <div className="flex items-center justify-between">
          <span>Date</span>
          <span className="text-[#f3efe9]">
            {activeDate.day} {activeDate.date}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Time</span>
          <span className="text-[#f3efe9]">{activeTime}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Staff</span>
          <span className="text-[#f3efe9]">{activeStaff.name}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Payment</span>
          <span className="text-[#f3efe9]">{activePayment.title}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Total</span>
          <span className="text-[#f3efe9]">{totalPriceLabel}</span>
        </div>
      </div>
      <button className="mt-4 w-full border border-[#f3efe9] px-4 py-2 text-[0.65rem] uppercase tracking-widest transition hover:bg-[#f3efe9] hover:text-[#2d2620] sm:text-xs">
        Share Booking
      </button>
    </div>
  );
}

export default SummaryPanal;
