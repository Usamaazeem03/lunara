import { useTranslation } from "react-i18next";
import { fixedLabel } from "../../i18n/fixedLabels.js";
export default function StaffFilter({ roles, selectedRole, onRoleChange }) {
  const { t } = useTranslation();
  return (
    <div className="border-ink/20 border-2 bg-white/90 p-3 sm:p-4">
      <div className="flex flex-wrap gap-2">
        {roles.map((role) => {
          const isActive = role === selectedRole;
          return (
            <button
              key={role}
              type="button"
              onClick={() => onRoleChange(role)}
              className={`rounded-full border-2 px-4 py-2 text-xs tracking-widest uppercase transition ${
                isActive
                  ? "border-ink bg-cream text-ink"
                  : "border-ink/20 text-ink-muted hover:border-ink bg-white"
              }`}
            >
              {role === "All" ? t("common.all") : fixedLabel(role, "role")}
            </button>
          );
        })}
      </div>
    </div>
  );
}
