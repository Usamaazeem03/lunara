import bellIcon from "../../Shared/assets/icons/bell.svg";
import skinCareIcon from "../../Shared/assets/icons/skin-care.svg";
import bodyRelaxIcon from "../../Shared/assets/icons/body-relax.svg";

export const quickActions = [
  {
    title: "Set arrival reminder",
    description: "30 minutes before visit",
    icon: bellIcon,
  },
  {
    title: "Update preferences",
    description: "Heat, oils, music, fragrance",
    icon: bodyRelaxIcon,
  },
  {
    title: "Add treatments",
    description: "Hair mask, gloss, scalp care",
    icon: skinCareIcon,
  },
];

function QuickAction({ icon, title, description }) {
  return (
    <div className="flex items-start gap-3 sm:gap-4 py-2 px-0.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/20 bg-cream sm:h-10 sm:w-10">
        <img src={icon} alt="" className="h-4 w-4 opacity-70 sm:h-5 sm:w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-ink">{title}</p>
        <p className="text-xs text-ink-muted">{description}</p>
      </div>
    </div>
  );
}
function QuickActionPanal() {
  return (
    <div className="border border-ink/20 bg-white/70 p-4 sm:p-5 transition-all duration-300 hover:bg-white/80">
      <p className="text-[0.65rem] uppercase tracking-widest text-ink-muted/80 sm:text-xs">
        Quick Actions
      </p>
      <div className="mt-3 space-y-2 sm:mt-4 sm:space-y-3">
        {quickActions.map((action) => (
          <QuickAction key={action.title} {...action} />
        ))}
      </div>
    </div>
  );
}

export default QuickActionPanal;
