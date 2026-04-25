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
    <div className="bg-[#2d2620] p-4 text-[#f3efe9] sm:p-5">
      <p className="text-xs tracking-widest text-[#f3efe9]/70 uppercase">
        Booking Summary
      </p>
      <p className="mt-2 text-xl font-semibold sm:text-2xl">
        {serviceSummaryTitle}
      </p>
      <p className="mt-1 text-xs text-[#f3efe9]/80 sm:text-sm">
        {serviceSummaryDescription}
      </p>
      <div className="mt-3 space-y-2 text-[0.65rem] tracking-widest text-[#f3efe9]/70 uppercase sm:text-xs">
        <div className="flex items-center justify-between">
          <span>Date</span>
          <span className="text-[#f3efe9]">
            {activeDate
              ? typeof activeDate === "string"
                ? activeDate
                : `${activeDate.day ?? ""} ${activeDate.date ?? ""}`
              : "Not selected"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Time</span>
          <span className="text-[#f3efe9]">{activeTime}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Staff</span>
          <span className="text-[#f3efe9]">
            {activeStaff?.name || "Not selected"}
          </span>
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
      <button className="mt-4 w-full border border-[#f3efe9] px-4 py-2 text-[0.65rem] tracking-widest uppercase transition hover:bg-[#f3efe9] hover:text-[#2d2620] sm:text-xs">
        Share Booking
      </button>
    </div>
  );
}

export default SummaryPanal;
