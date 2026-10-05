import { useState } from "react";
import { useTranslation } from "react-i18next";
import StaffAvatar from "../../Shared/ui/StaffAvatar.jsx";

function getSpecialties(value) {
  if (Array.isArray(value)) return value.flatMap(getSpecialties);
  if (typeof value !== "string" || !value.trim()) return [];

  const text = value.trim();
  if (text.startsWith("[") || text.startsWith('"')) {
    try {
      return getSpecialties(JSON.parse(text));
    } catch {
      // Older records may contain a plain comma-separated list.
    }
  }

  return text
    .split(",")
    .map((label) => label.trim())
    .filter(Boolean);
}

export default function PublicSalonStaff({ staffMembers }) {
  const { t } = useTranslation();
  const [showAll, setShowAll] = useState(false);
  return (
    <section id="salon-team">
      <div className="salon-section-heading">
        <div>
          <p className="salon-eyebrow">{t("salon.meetTheTeam")}</p>
          <h2>{t("salon.page.peopleBehindTheCare")}</h2>
        </div>
        <span className="salon-count">{staffMembers.length}</span>
      </div>
      <p className="salon-section-description">
        {t("salon.page.teamDescription")}
      </p>
      {staffMembers.length === 0 ? (
        <div className="salon-empty">{t("salon.noTeamMembersListedYet")}</div>
      ) : (
        <div className="salon-team-grid">
          {(showAll ? staffMembers : staffMembers.slice(0, 4)).map((staff) => {
            const specialties = [...new Set(getSpecialties(staff.specialties))];
            return (
              <article className="salon-team-card" key={staff.id}>
                <div className="salon-team-identity">
                  <StaffAvatar
                    image={staff.image || staff.image_url}
                    name={staff.name}
                    className="h-14 w-14"
                  />
                  <div>
                    <h3>{staff.name}</h3>
                    <p>{staff.role}</p>
                  </div>
                </div>
                <div className="salon-team-status">
                  <span
                    className={
                      staff.is_on_shift ? "salon-on-shift" : "salon-off-shift"
                    }
                  >
                    <i aria-hidden="true" />
                    {t(staff.is_on_shift ? "common.onShift" : "salon.offShift")}
                  </span>
                  {Number(staff.rating) > 0 && (
                    <span className="salon-rating">
                      <span aria-hidden="true">★</span> {staff.rating}
                    </span>
                  )}
                </div>
                {specialties.length > 0 && (
                  <div className="salon-specialties">
                    {specialties.slice(0, 3).map((value, index) => (
                      <span key={`${value}-${index}`}>{value}</span>
                    ))}
                    {specialties.length > 3 && (
                      <span>+{specialties.length - 3}</span>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
      {staffMembers.length > 4 && (
        <button
          className="salon-text-button salon-team-more"
          onClick={() => setShowAll(!showAll)}
          aria-expanded={showAll}
        >
          {showAll
            ? t("salon.showLess")
            : t("salon.moreStaff", { value1: staffMembers.length - 4 })}
        </button>
      )}
    </section>
  );
}
