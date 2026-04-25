/**
 * Generate URL-safe slug from owner name
 * Example: "John Martinez" -> "john-martinez"
 */
export function generateSlugFromName(fullName) {
  if (!fullName) return "";

  return fullName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, "") // Remove special characters
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Validate if slug format is valid
 */
export function isValidSlug(slug) {
  return /^[a-z0-9-]+$/.test(slug) && slug.length > 0 && slug.length <= 100;
}

/**
 * Get display name from slug
 * Example: "john-martinez" -> "John Martinez"
 */
export function formatSlugToName(slug) {
  if (!slug) return "";

  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
