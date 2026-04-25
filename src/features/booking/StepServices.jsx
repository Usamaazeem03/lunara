import Icon from "../../Shared/ui/Icon";
import { getServiceIcon } from "../../Shared/lib/serviceCategories";

function StepServices({
  filteredServices,
  selectedServices,
  toggleService,
  statusMessage,
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {filteredServices.map(({ service, index }) => {
        const isSelected = selectedServices.includes(index);
        const iconName = service.iconName || getServiceIcon(service.category);
        return (
          <button
            key={`${service.title}-${index}`}
            type="button"
            onClick={() => toggleService(index)}
            className={`flex h-full flex-col gap-3 border-2 p-3 text-left transition sm:gap-4 sm:p-4 ${
              isSelected
                ? "border-[#2d2620] bg-[#f3efe9]"
                : "border-[#2d2620]/30 bg-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#2d2620]/30 bg-white sm:h-11 sm:w-11">
                <Icon name={iconName} size={20} className="text-[#2d2620]/70" />
              </span>
              {isSelected && (
                <span className="text-[0.65rem] tracking-widest text-[#2d2620] uppercase sm:text-xs">
                  Selected
                </span>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold sm:text-base">
                {service.title}
              </p>
              <p className="mt-1 text-xs text-[#5f544b] sm:text-sm">
                {service.description}
              </p>
            </div>
            <div className="flex items-center justify-between text-[0.65rem] tracking-widest uppercase sm:text-xs">
              <span>{service.price}</span>
              <span>{service.duration}</span>
            </div>
          </button>
        );
      })}
      {filteredServices.length === 0 && (
        <div className="col-span-full border-2 border-dashed border-[#2d2620]/30 bg-[#f7f2ec] p-4 text-center text-sm text-[#5f544b] sm:p-6">
          {statusMessage ?? "No services found. Try a different search."}
        </div>
      )}
    </div>
  );
}

export default StepServices;
