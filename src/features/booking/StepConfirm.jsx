function StepConfirm({
  activeDate,
  activeTime,
  totalDurationLabel,
  activeStaff,
  selectedServiceList,
  totalPriceLabel,
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <div className="border-2 border-[#2d2620]/30 bg-white p-3 sm:p-4">
        <p className="text-xs uppercase tracking-widest text-[#5f544b]">
          Date & Time
        </p>
        <p className="mt-3 text-sm font-semibold sm:text-base">
          {activeDate.day}, {activeDate.date}
        </p>
        <p className="text-xs text-[#5f544b] sm:text-sm">{activeTime}</p>
        <p className="mt-2 text-[0.65rem] text-[#5f544b] sm:text-xs">
          Total duration: {totalDurationLabel}
        </p>
      </div>
      <div className="border-2 border-[#2d2620]/30 bg-white p-3 sm:p-4">
        <p className="text-xs uppercase tracking-widest text-[#5f544b]">
          Staff Member
        </p>
        <p className="mt-3 text-sm font-semibold sm:text-base">
          {activeStaff.name}
        </p>
        <p className="text-xs text-[#5f544b] sm:text-sm">
          {activeStaff.role}
        </p>
        <p className="mt-2 text-[0.65rem] text-[#5f544b] sm:text-xs">
          {activeStaff.rating} rating
        </p>
      </div>
      <div className="border-2 border-[#2d2620]/30 bg-white p-3 sm:p-4">
        <p className="text-xs uppercase tracking-widest text-[#5f544b]">
          Services
        </p>
        <p className="mt-3 text-sm font-semibold sm:text-base">
          {selectedServiceList.length} selected
        </p>
        <div className="mt-2 space-y-1 text-[0.65rem] text-[#5f544b] sm:text-xs">
          {selectedServiceList.map((service, index) => (
            <div
              key={`${service.title}-${index}`}
              className="flex items-center justify-between"
            >
              <span>{service.title}</span>
              <span>{service.duration}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between text-[0.65rem] uppercase tracking-widest sm:text-xs">
          <span>Total</span>
          <span>{totalPriceLabel}</span>
        </div>
      </div>
    </div>
  );
}

export default StepConfirm;
