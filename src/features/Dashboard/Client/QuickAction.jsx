import { quickActions } from "./data/quickActions.js";

function QuickAction({ icon, title, description }) {
  return (
    <div className="flex items-start gap-3 px-0.5 py-2 sm:gap-4">
      <div className="border-ink/20 bg-cream flex h-9 w-9 shrink-0 items-center justify-center rounded-full border sm:h-10 sm:w-10">
        <img src={icon} alt="" className="h-4 w-4 opacity-70 sm:h-5 sm:w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-ink text-sm font-semibold">{title}</p>
        <p className="text-ink-muted text-xs">{description}</p>
      </div>
    </div>
  );
}
function QuickActionPanal() {
  return (
    <div className="border-ink/20 border bg-white/70 p-4 transition-all duration-300 hover:bg-white/80 sm:p-5">
      <p className="text-ink-muted/80 text-[0.65rem] tracking-widest uppercase sm:text-xs">
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
