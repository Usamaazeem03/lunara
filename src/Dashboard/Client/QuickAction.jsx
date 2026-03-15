import bellIcon from "../../assets/icons/bell.svg";
import skinCareIcon from "../../assets/icons/skin-care.svg";
import bodyRelaxIcon from "../../assets/icons/body-relax.svg";

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
    <div className="flex items-start gap-4">
      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#2d2620]/20 bg-[#f3efe9]">
        <img src={icon} alt="" className="h-5 w-5 opacity-70" />
      </div>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-[#5f544b]">{description}</p>
      </div>
    </div>
  );
}
function QuickActionPanal() {
  return (
    <div className="border border-[#2d2620]/20 bg-white/70 p-5">
      <p className="text-xs uppercase tracking-widest text-[#5f544b]">
        Quick Actions
      </p>
      <div className="mt-4 space-y-3">
        {quickActions.map((action) => (
          <QuickAction key={action.title} {...action} />
        ))}
      </div>
    </div>
  );
}

export default QuickActionPanal;
