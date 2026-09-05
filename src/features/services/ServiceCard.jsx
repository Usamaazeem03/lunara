import { getServiceIcon } from "../../Shared/lib/serviceCategories";
import Icon from "../../Shared/ui/Icon";

export const ServiceCard = ({ service, onEdit, onDelete, isDeleting }) => {
  const iconName = service.iconName || getServiceIcon(service.category);
  return (
    <article className="border-ink/20 relative flex h-full flex-col border-2 bg-white/90 p-4 sm:p-5">
      {/* <div className="bg-ink/5 absolute -top-8 -right-8 h-20 w-20 rounded-full"></div> */}
      <div className="flex items-start justify-between gap-3">
        <div className="border-ink/20 bg-cream flex h-12 w-12 items-center justify-center rounded-2xl border-2">
          <Icon name={iconName} size={24} className="text-ink/70" />
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="border-ink/20 bg-cream text-ink-muted rounded-full border-2 px-3 py-1 text-[0.65rem] tracking-widest uppercase">
            {service.category}
          </span>
          {!service.isActive && (
            <span className="border-danger/40 bg-danger/10 text-danger rounded-full border-2 px-3 py-1 text-[0.6rem] tracking-widest uppercase">
              Inactive
            </span>
          )}
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">{service.title}</h3>
        <p className="text-ink-muted mt-1 text-sm">{service.description}</p>
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="border-ink/20 bg-cream flex h-8 w-8 items-center justify-center rounded-full border">
            <Icon name="credit-card" size={16} className="text-ink/70" />
          </span>
          <span className="font-semibold">{service.priceLabel}</span>
        </div>
        <div className="text-ink-muted flex items-center gap-2">
          <span className="border-ink/20 bg-cream flex h-8 w-8 items-center justify-center rounded-full border">
            <Icon name="clock" size={16} className="text-ink/70" />
          </span>
          <span>{service.durationLabel}</span>
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={() => onEdit?.(service)}
          disabled={isDeleting}
          className={`border-ink/20 bg-cream hover:border-ink flex-1 border-2 px-4 py-2 text-xs tracking-widest uppercase transition ${isDeleting ? "cursor-not-allowed opacity-60" : ""}`}
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete?.(service)}
          disabled={isDeleting}
          className={`border-danger/40 bg-danger/10 text-danger hover:border-danger flex-1 border-2 px-4 py-2 text-xs tracking-widest uppercase transition ${isDeleting ? "cursor-not-allowed opacity-60" : ""}`}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </article>
  );
};
