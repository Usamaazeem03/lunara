import { useEffect, useState } from "react";
import { supabase } from "../../Shared/lib/supabaseClient";
import { notify } from "../../Shared/lib/toast.jsx";

// Helper to get initials from name
const getInitials = (name) => {
  if (!name) return "??";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

function StepStaff({ selectedStaff, setSelectedStaff, ownerId }) {
  const [staffMembers, setStaffMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (error) notify.error(error);
  }, [error]);

  // ✅ Fetch own data internally
  useEffect(() => {
    const fetchStaff = async () => {
      if (!ownerId) return;

      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("staff")
        .select(
          "id, name, role, rating, appointments_count, is_on_shift, owner_id",
        )
        .eq("owner_id", ownerId) // ✅ filter by salon
        .order("name", { ascending: true });

      if (error) {
        setError(error.message);
        setStaffMembers([]);
        setLoading(false);
        return;
      }

      const mapped = (data ?? []).map((staff) => ({
        id: staff.id,
        name: staff.name,
        role: staff.role,
        rating: staff.rating ? staff.rating.toFixed(1) : "N/A",
        bookings: `${staff.appointments_count || 0} bookings`,
        initials: getInitials(staff.name),
        isOnShift: staff.is_on_shift,
      }));

      // Always add "No Preference" at the end
      setStaffMembers([
        ...mapped,
        {
          id: "no-preference",
          name: "No Preference",
          role: "Any available stylist",
          rating: "Top rated",
          bookings: "Fastest booking",
          initials: "NP",
          isOnShift: false,
        },
      ]);

      setLoading(false);
    };

    fetchStaff();
  }, [ownerId]); // ✅ refetch if owner changes

  if (loading) {
    return (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3">
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
    <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3">
      {staffMembers.map((member) => {
        const isSelected = selectedStaff?.id === member.id; // ✅ id comparison
        return (
          <button
            key={member.id}
            type="button"
            onClick={() => setSelectedStaff(member)} // ✅ pass full object
            className={`flex w-full items-center gap-4 border-2 p-4 text-left transition ${
              isSelected
                ? "border-[#2d2620] bg-[#f3efe9]"
                : "border-[#2d2620]/30 bg-white hover:border-[#2d2620]/50"
            }`}
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-[#2d2620]/30 bg-white text-sm font-semibold text-[#2d2620] uppercase">
              {member.initials}
            </div>
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
