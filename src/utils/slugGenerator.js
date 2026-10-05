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
