import { useTranslation } from "react-i18next";

function AuthRoleToggle({ value, options, onChange }) {
  const { t } = useTranslation();
  return (
    <div className="auth-role-toggle border-ink/10 mt-4 flex rounded-full border bg-white/70 p-1 md:border-black/10 md:bg-black/5">
      {options.map((role) => {
        const isActive = value === role;
        return (
          <button
            key={role}
            type="button"
            onClick={() => onChange(role)}
            className={`flex-1 rounded-full py-2 text-xs transition-all duration-300 ${
              isActive
                ? "bg-ink text-white shadow-md md:bg-black md:text-white"
                : "text-ink/60 hover:text-ink md:text-black/60 md:hover:text-black"
            }`}
          >
            {role === "owner" ? t("auth.owner") : t("common.client")}
          </button>
        );
      })}
    </div>
  );
}

export default AuthRoleToggle;
