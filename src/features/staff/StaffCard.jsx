import Icon from "../../Shared/ui/Icon.jsx";
import StaffAvatar from "../../Shared/ui/StaffAvatar";
const StaffCard = ({ member, onEdit, onDelete, isDeleting }) => {
  return (
    <article className="border-ink/20 relative flex h-full flex-col border-2 bg-white/90 p-4 sm:p-5">
      <div className="bg-ink/5 absolute -top-8 -right-8 h-20 w-20 rounded-full"></div>
      <div className="flex items-start justify-between gap-3">
        <StaffAvatar image={member.image} name={member.name} />
        <div className="flex flex-col items-end gap-2">
          <span className="border-ink/20 bg-cream text-ink-muted rounded-full border-2 px-3 py-1 text-[0.65rem] tracking-widest uppercase">
            {member.role}
          </span>
          {member.isOnShift && (
            <span className="rounded-full border-2 border-green-600/40 bg-green-600/10 px-3 py-1 text-[0.6rem] tracking-widest text-green-700 uppercase">
              On Shift
            </span>
          )}
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">{member.name}</h3>
      </div>

      <div className="border-ink/10 bg-cream/60 mt-4 grid grid-cols-2 gap-3 border-2 p-3 text-center">
        <div>
          <p className="text-base font-semibold">
            {member.ratingCount > 0
              ? `${member.rating.toFixed(1)} / 5`
              : "No ratings yet"}
          </p>
          <p className="text-ink-muted text-xs tracking-widest uppercase">
            Rating
          </p>
          {member.ratingCount > 0 && (
            <p className="text-ink-muted mt-1 text-xs">
              {member.ratingCount}{" "}
              {member.ratingCount === 1 ? "review" : "reviews"}
            </p>
          )}
        </div>
        <div>
          <p className="text-base font-semibold">{member.appointments}</p>
          <p className="text-ink-muted text-xs tracking-widest uppercase">
            Appointments
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <InfoRow label="Phone" value={member.phone} iconName="phone" />
        <InfoRow
          label="Email"
          value={member.email || "N/A"}
          iconName="email-envelope"
        />
        <InfoRow label="Schedule" value={member.schedule} iconName="clock" />
      </div>

      {member.specialties?.length > 0 && (
        <div className="mt-4">
          <p className="text-ink-muted text-xs tracking-widest uppercase">
            Specialties
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {member.specialties.map((specialty) => (
              <span
                key={specialty}
                className="border-ink/20 bg-cream text-ink-muted rounded-full border-2 px-3 py-1 text-[0.65rem] tracking-widest uppercase"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={() => onEdit?.(member)}
          disabled={isDeleting}
          className={`border-ink/20 bg-cream hover:border-ink flex-1 border-2 px-4 py-2 text-xs tracking-widest uppercase transition ${
            isDeleting ? "cursor-not-allowed opacity-60" : ""
          }`}
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete?.(member)}
          disabled={isDeleting}
          className={`flex-1 border-2 border-[#b0412e]/40 bg-[#b0412e]/10 px-4 py-2 text-xs tracking-widest text-[#b0412e] uppercase transition hover:border-[#b0412e] ${
            isDeleting ? "cursor-not-allowed opacity-60" : ""
          }`}
        >
          {isDeleting ? "Deleting..." : "Remove"}
        </button>
      </div>
    </article>
  );
};

const InfoRow = ({ label, value, iconName }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="border-ink/20 bg-cream flex h-8 w-8 items-center justify-center rounded-full border">
        <Icon name={iconName} size={16} className="text-ink/70" />
      </div>
      <div>
        <p className="text-ink-muted text-xs tracking-widest uppercase">
          {label}
        </p>
        <p className="text-ink text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
};

export default StaffCard;
