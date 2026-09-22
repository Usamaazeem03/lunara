const EmptyState = ({ title, description, icon, actionLabel, onAction }) => {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#2d2620]/30 bg-[#f3efe9]">
        {icon ? (
          <img src={icon} alt="" className="h-6 w-6 opacity-70" />
        ) : (
          <span className="text-2xl font-semibold text-[#2d2620]/70">X</span>
        )}
      </div>
      <div>
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="text-sm text-[#5f544b]">{description}</p>
      </div>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="border-2 border-[#2d2620] px-4 py-1.5 text-xs tracking-widest uppercase transition hover:bg-[#2d2620] hover:text-[#f3efe9]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
