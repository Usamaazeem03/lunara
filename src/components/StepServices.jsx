function StepServices({ filteredServices, selectedServices, toggleService }) {
  return (
    <div className="grid gap-3 lg:grid-cols-3">
      {filteredServices.map(({ service, index }) => {
        const isSelected = selectedServices.includes(index);
        return (
          <button
            key={`${service.title}-${index}`}
            type="button"
            onClick={() => toggleService(index)}
            className={`flex h-full flex-col gap-4 border-2 p-4 text-left transition ${
              isSelected
                ? "border-[#2d2620] bg-[#f3efe9]"
                : "border-[#2d2620]/30 bg-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#2d2620]/30 bg-white">
                <img src={service.icon} alt="" className="h-5 w-5 opacity-70" />
              </span>
              {isSelected && (
                <span className="text-xs uppercase tracking-widest text-[#2d2620]">
                  Selected
                </span>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold">{service.title}</p>
              <p className="mt-1 text-xs text-[#5f544b]">
                {service.description}
              </p>
            </div>
            <div className="flex items-center justify-between text-xs uppercase tracking-widest">
              <span>{service.price}</span>
              <span>{service.duration}</span>
            </div>
          </button>
        );
      })}
      {filteredServices.length === 0 && (
        <div className="col-span-full border-2 border-dashed border-[#2d2620]/30 bg-[#f7f2ec] p-6 text-center text-sm text-[#5f544b]">
          No services found. Try a different search.
        </div>
      )}
    </div>
  );
}

export default StepServices;
