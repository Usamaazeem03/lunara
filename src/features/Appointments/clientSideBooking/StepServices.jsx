import checkIcon from "../../../Shared/assets/icons/checkmark-tick.svg";
import Icon from "../../../Shared/ui/Icon";
import { getServiceIcon } from "../../../Shared/lib/serviceCategories";

function StepServices({
  filteredServices = [],
  selectedServices = [],
  toggleService,
  statusMessage = "No services found.",
}) {
  const selectedCount = selectedServices.length;
  const shownCount = filteredServices.length;

  return (
    <div className="flex flex-col gap-3">
      {(shownCount > 0 || selectedCount > 0) && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs tracking-widest text-[#5f544b] uppercase">
            {selectedCount
              ? `${selectedCount} selected`
              : "No service selected"}
          </p>

          <p className="text-[0.65rem] tracking-widest text-[#5f544b] uppercase sm:text-xs">
            {shownCount} shown
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {filteredServices.length > 0 ? (
          <>
            {filteredServices.map(({ service }) => {
              const isSelected = selectedServices.includes(service.id);

              const iconName =
                service.iconName || getServiceIcon(service.category);

              return (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => toggleService(service.id)}
                  aria-pressed={isSelected}
                  className={`relative flex flex-col justify-between rounded-2xl border p-4 text-left transition focus-visible:ring-2 focus-visible:ring-[#2d2620] focus-visible:ring-offset-2 focus-visible:outline-none sm:min-h-52 ${
                    isSelected
                      ? "border-[#2d2620] bg-[#f3efe9] ring-1 ring-[#2d2620]"
                      : "border-[#2d2620]/15 bg-white hover:border-[#2d2620]/60 hover:bg-[#fbfaf7]"
                  }`}
                >
                  {/* Top section */}
                  <div className="flex items-start justify-between gap-3">
                    {/* Service image / icon */}
                    <span
                      className={`flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 ${
                        isSelected
                          ? "border-[#2d2620] bg-white"
                          : "border-[#2d2620]/25 bg-[#f7f2ec]"
                      }`}
                    >
                      {service.image ? (
                        <img
                          src={service.image}
                          alt={service.name || service.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Icon
                          name={iconName}
                          size={24}
                          className="text-ink/70"
                        />
                      )}
                    </span>

                    {/* Selected check */}
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 ${
                        isSelected
                          ? "border-[#2d2620] bg-[#2d2620]"
                          : "border-[#2d2620]/25 bg-white"
                      }`}
                    >
                      {isSelected && (
                        <img
                          src={checkIcon}
                          alt=""
                          className="h-3.5 w-3.5 brightness-0 invert"
                        />
                      )}
                    </span>
                  </div>

                  {/* Service information */}
                  <div className="mt-4 flex flex-1 flex-col">
                    <div>
                      {service.category && (
                        <p className="text-[0.65rem] tracking-widest text-[#5f544b] uppercase sm:text-xs">
                          {service.category}
                        </p>
                      )}

                      <p className="mt-2 text-base leading-snug font-semibold break-words text-[#2d2620]">
                        {service.title}
                      </p>

                      {service.description && (
                        <p className="mt-2 text-sm leading-6 text-[#5f544b]">
                          {service.description}
                        </p>
                      )}
                    </div>

                    {/* Price / duration */}
                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#2d2620]/10 pt-4 text-sm">
                      <span className="font-semibold text-[#2d2620]">
                        {service.price}
                      </span>

                      <span className="text-[#5f544b]">{service.duration}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </>
        ) : (
          <div className="col-span-full border-2 border-dashed border-[#2d2620]/30 bg-[#f7f2ec] p-4 text-center text-sm text-[#5f544b] sm:p-6">
            {statusMessage}
          </div>
        )}
      </div>
    </div>
  );
}

export default StepServices;
