import StaffAvatar from "../../../Shared/ui/StaffAvatar";
import { useBookingStaff } from "./useBookingStaff.js";

function StepStaff({ selectedStaff, setSelectedStaff, ownerId }) {
  const { staffMembers, loading, error } = useBookingStaff(ownerId);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex h-full animate-pulse items-center gap-3 border-2 border-[#2d2620]/10 bg-white/50 p-4 sm:gap-4"
          >
            <div className="h-12 w-12 rounded-full bg-[#2d2620]/10"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded bg-[#2d2620]/10"></div>
              <div className="h-3 w-1/2 rounded bg-[#2d2620]/10"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error && staffMembers.length === 0) {
    return (
      <div className="border-2 border-[#b0412e]/30 bg-[#b0412e]/10 p-4 text-center text-sm text-[#b0412e]">
        Unable to load staff members. Please try again.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
      {staffMembers.map((member) => {
        const isSelected = (selectedStaff?.id ?? "no-preference") === member.id;
        return (
          <button
            key={member.id}
            type="button"
            onClick={() => setSelectedStaff(member)}
            aria-pressed={isSelected}
            className={`focus-visible:outline-ink flex min-h-24 w-full items-center gap-3 rounded-2xl border p-4 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 ${
              isSelected
                ? "border-[#2d2620] bg-[#f3efe9]"
                : "border-[#2d2620]/15 bg-white hover:border-[#2d2620]/50"
            }`}
          >
            <StaffAvatar
              image={member.image}
              name={member.name}
              className="h-14 w-14"
            />
            <div className="flex min-w-0 flex-1 flex-col">
              <p className="truncate text-base font-semibold">{member.name}</p>
              <p className="truncate text-sm text-[#5f544b]">{member.role}</p>
              <p className="mt-1 text-xs text-[#5f544b]">
                ⭐ {member.rating} • {member.bookings}
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              {member.isOnShift && (
                <span className="rounded-full border border-green-200 bg-green-100 px-2 py-0.5 text-[0.6rem] font-medium text-green-700 uppercase">
                  On Shift
                </span>
              )}
              {isSelected && (
                <span className="text-[0.65rem] tracking-widest text-[#2d2620] uppercase">
                  Selected
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default StepStaff;
