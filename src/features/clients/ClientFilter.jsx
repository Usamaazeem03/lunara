import Icon from "../../Shared/ui/Icon";

export default function ClientFilter({ searchQuery, onSearchChange }) {
  return (
    <div className="border-ink/20 flex flex-wrap items-center justify-between gap-3 border-2 bg-white/90 p-3 sm:p-4">
      <div className="border-ink/20 flex w-full flex-1 items-center gap-2 border-2 bg-white px-3 py-2 sm:w-auto">
        {/* <img src={calendarIcon} alt="" className="h-4 w-4 opacity-60" /> */}
        <Icon name="search" size={16} className="text-ink-muted/70" />
        <input
          aria-label="Search clients"
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by name, email, or phone..."
          className="text-ink w-full bg-transparent text-xs tracking-widest uppercase focus:outline-none"
        />
      </div>
    </div>
  );
}
