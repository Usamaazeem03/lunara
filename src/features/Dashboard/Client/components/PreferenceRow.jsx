const PreferenceRow = ({ item, onToggle }) => {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-sm font-semibold">{item.title}</p>
        <p className="text-xs text-[#5f544b]">{item.description}</p>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={`flex h-6 w-11 items-center rounded-full border-2 px-1 transition ${
          item.enabled
            ? "border-[#2d2620] bg-[#2d2620]"
            : "border-[#2d2620]/40 bg-white"
        }`}
        aria-pressed={item.enabled}
      >
        <span
          className={`h-4 w-4 rounded-full bg-white transition ${
            item.enabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
};

export default PreferenceRow;
