export const SERVICE_CATEGORIES = [
  { key: "Hair", iconName: "hair-care" },
  { key: "Grooming", iconName: "beard" },
  { key: "Skin", iconName: "skin-care" },
  { key: "Spa", iconName: "body-relax" },
  { key: "Nails", iconName: "finger-nail" },
  { key: "Kid's", iconName: "kid" },
];

export const normalizeCategory = (value = "") =>
  value.toString().trim().toLowerCase();

export const getCategoryLabel = (value = "") => {
  const normalized = normalizeCategory(value);
  if (!normalized) return "General";
  if (normalized.includes("groom") || normalized.includes("beard")) {
    return "Grooming";
  }
  if (
    normalized.includes("hair") ||
    normalized.includes("cut") ||
    normalized.includes("color") ||
    normalized.includes("style")
  ) {
    return "Hair";
  }
  if (normalized.includes("skin") || normalized.includes("facial")) {
    return "Skin";
  }
  if (normalized.includes("spa")) {
    return "Spa";
  }
  if (normalized.includes("nail")) {
    return "Nails";
  }
  if (normalized.includes("body") || normalized.includes("massage")) {
    return "Spa";
  }
  return value.toString().trim();
};

export const getServiceIcon = (category = "") => {
  const label = getCategoryLabel(category);
  const normalized = normalizeCategory(label);
  if (normalized === "hair") {
    return "hair-care";
  }
  if (normalized === "grooming") {
    return "beard";
  }
  if (normalized === "skin") {
    return "skin-care";
  }
  if (normalized === "spa") {
    return "body-relax";
  }
  if (normalized === "nails") {
    return "finger-nail";
  }
  if (normalized === "kid's") {
    return "kid";
  }

  return "hair-care";
};
