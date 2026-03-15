function QuickActions({ quickActions }) {
  return (
    <div className="border-2 border-[#2d2620]/20 bg-white/80 p-3">
      <p className="text-xs uppercase tracking-widest text-[#5f544b]">
        Quick Actions
      </p>
      <div className="mt-2 space-y-3">
        {quickActions.map((action) => (
          <QuickAction key={action.title} {...action} />
        ))}
      </div>
    </div>
  );
}
const QuickAction = ({ icon, title, description }) => {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#2d2620]/20 bg-[#f3efe9]">
        <img src={icon} alt="" className="h-4 w-4 opacity-70" />
      </div>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-[#5f544b]">{description}</p>
      </div>
    </div>
  );
};

export default QuickActions;
