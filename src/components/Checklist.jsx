const defaultItems = [
  { label: "Arrival", detail: "10 min early" },
  { label: "Prep", detail: "Clean hair/skin" },
  { label: "Notes", detail: "Bring inspo" },
];

function Checklist({ title = "Visit Checklist", items = defaultItems }) {
  return (
    <div className="border-2 border-[#2d2620]/20 bg-white/80 p-4">
      <p className="text-xs uppercase tracking-widest text-[#5f544b]">
        {title}
      </p>
      <div className="mt-3 space-y-3 text-sm">
        {items.map((item) => (
          <div
            key={`${item.label}-${item.detail}`}
            className="flex items-start justify-between"
          >
            <span className="font-semibold">{item.label}</span>
            <span className="text-xs uppercase tracking-widest text-[#5f544b]">
              {item.detail}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Checklist;
