function StepStaff({ staffMembers, selectedStaff, setSelectedStaff }) {
  return (
    <div className="grid gap-3 lg:grid-cols-3">
      {staffMembers.map((member, index) => {
        const isSelected = index === selectedStaff;
        return (
          <button
            key={member.name}
            type="button"
            onClick={() => setSelectedStaff(index)}
            className={`flex h-full items-center gap-4 border-2 p-4 text-left transition ${
              isSelected
                ? "border-[#2d2620] bg-[#f3efe9]"
                : "border-[#2d2620]/30 bg-white"
            }`}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#2d2620]/30 bg-white text-xs font-semibold uppercase text-[#2d2620]">
              {member.initials}
            </div>
            <div>
              <p className="text-sm font-semibold">{member.name}</p>
              <p className="text-xs text-[#5f544b]">{member.role}</p>
              <p className="mt-1 text-xs text-[#5f544b]">
                {member.rating} rating - {member.bookings}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default StepStaff;
