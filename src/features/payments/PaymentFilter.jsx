function openPicker(event) {
  const input = event.currentTarget;
  try {
    input.showPicker?.();
  } catch {
    // Keep native input editing available when the browser blocks the picker.
    input.focus();
  }
}

function handlePickerKeyDown(event) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openPicker(event);
  }
}

export default function PaymentFilter({
  search,
  onSearchChange,
  filters,
  onFilterChange,
  onClear,
}) {
  return (
    <div className="border-ink/20 mt-4 border-2 bg-white/90 p-3">
      <label className="block">
        <span className="text-ink-muted mb-2 block text-xs tracking-widest uppercase">
          Find a client invoice
        </span>
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by client name, phone, email or booking ID..."
          className="border-ink/20 focus:border-ink min-h-11 w-full border-2 bg-white px-3 text-sm outline-none"
        />
      </label>
      <div className="mt-3 grid items-end gap-3 sm:grid-cols-[1fr_1fr_auto]">
        <label className="min-w-0">
          <span className="text-ink-muted mb-2 block text-xs tracking-widest uppercase">
            Appointment day
          </span>
          <input
            type="date"
            value={filters.date}
            onClick={openPicker}
            onKeyDown={handlePickerKeyDown}
            onChange={(event) => onFilterChange("date", event.target.value)}
            className="border-ink/20 focus:border-ink min-h-11 w-full min-w-0 cursor-pointer border-2 bg-white px-3 text-sm outline-none"
          />
        </label>
        <label className="min-w-0">
          <span className="text-ink-muted mb-2 block text-xs tracking-widest uppercase">
            Appointment time
          </span>
          <input
            type="time"
            value={filters.time}
            onClick={openPicker}
            onKeyDown={handlePickerKeyDown}
            onChange={(event) => onFilterChange("time", event.target.value)}
            className="border-ink/20 focus:border-ink min-h-11 w-full min-w-0 cursor-pointer border-2 bg-white px-3 text-sm outline-none"
          />
        </label>
        <button
          type="button"
          onClick={onClear}
          disabled={!search && !filters.date && !filters.time}
          className="border-ink/20 hover:border-ink min-h-11 border-2 px-4 text-xs tracking-widest uppercase disabled:opacity-40"
        >
          Clear filters
        </button>
      </div>
    </div>
  );
}
