import i18n from "../../i18n/i18n.js";
export const emailRules = {
  requiredKey: "auth.emailIsRequired",
  validate: (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ||
    i18n.t("common.enterAValidEmailAddress"),
};
export const newPasswordRules = {
  requiredKey: "auth.passwordIsRequired",
  minLength: { value: 8, messageKey: "auth.useAtLeast8Characters" },
};
export function getAuthDestination(role, ownerId) {
  return role === "client" && ownerId
    ? `/dashboard?owner_id=${encodeURIComponent(ownerId)}`
    : "/dashboard";
}
