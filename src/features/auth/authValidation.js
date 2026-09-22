export const emailRules = {
  required: "Email is required.",
  validate: (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ||
    "Enter a valid email address.",
};
export const newPasswordRules = {
  required: "Password is required.",
  minLength: { value: 8, message: "Use at least 8 characters." },
};
export function getAuthDestination(role, ownerId) {
  return role === "client" && ownerId
    ? `/dashboard?owner_id=${encodeURIComponent(ownerId)}`
    : "/dashboard";
}
