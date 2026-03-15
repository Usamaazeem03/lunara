function StepConfirm({
  activeDate,
  activeTime,
  totalDurationLabel,
  activeStaff,
  selectedServiceList,
  totalPriceLabel,
}) {
  return (
    <div className="grid gap-3 lg:grid-cols-3">
      <div className="border-2 border-[#2d2620]/30 bg-white p-4">
        <p className="text-xs uppercase tracking-widest text-[#5f544b]">
          Date & Time
        </p>
        <p className="mt-3 text-sm font-semibold">
          {activeDate.day}, {activeDate.date}
        </p>
        <p className="text-xs text-[#5f544b]">{activeTime}</p>
        <p className="mt-2 text-xs text-[#5f544b]">
          Total duration: {totalDurationLabel}
        </p>
      </div>
      <div className="border-2 border-[#2d2620]/30 bg-white p-4">
        <p className="text-xs uppercase tracking-widest text-[#5f544b]">
          Staff Member
        </p>
        <p className="mt-3 text-sm font-semibold">{activeStaff.name}</p>
        <p className="text-xs text-[#5f544b]">{activeStaff.role}</p>
        <p className="mt-2 text-xs text-[#5f544b]">
          {activeStaff.rating} rating
        </p>
      </div>
      <div className="border-2 border-[#2d2620]/30 bg-white p-4">
        <p className="text-xs uppercase tracking-widest text-[#5f544b]">
          Services
        </p>
        <p className="mt-3 text-sm font-semibold">
          {selectedServiceList.length} selected
        </p>
        <div className="mt-2 space-y-1 text-xs text-[#5f544b]">
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
        <div className="mt-3 flex items-center justify-between text-xs uppercase tracking-widest">
          <span>Total</span>
          <span>{totalPriceLabel}</span>
        </div>
      </div>
    </div>
  );
}

export default StepConfirm;
