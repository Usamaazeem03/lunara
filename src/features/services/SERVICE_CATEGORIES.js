export const SERVICE_CATEGORIES = [
  { key: "Hair", iconName: "hair-care" },
  { key: "Grooming", iconName: "beard" },
  { key: "Skin", iconName: "skin-care" },
  { key: "Spa", iconName: "body-relax" },
  { key: "Nails", iconName: "finger-nail" },
  { key: "Kid's", iconName: "kid" },
];

export const normalizeCategory = (value = "") =>
  value
    .toString()
    .trim()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase();

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
    normalized.includes("style") ||
    normalized.includes("stylist")
  ) {
    return "Hair";
  }
  if (normalized.includes("skin") || normalized.includes("facial")) {
    return "Skin";
  }
  if (normalized.includes("spa") || normalized.includes("massage")) {
    return "Spa";
  }
  if (normalized.includes("nail") || normalized.includes("manicure")) {
    return "Nails";
  }
  if (normalized.includes("kid") || normalized.includes("kids")) {
    return "Kid's";
  }
  if (normalized.includes("body") || normalized.includes("therapy")) {
    return "Spa";
  }
  return value.toString().trim() || "General";
};

export const getServiceIcon = (category = "") => {
  const rawCategory = String(category ?? "").trim();
  const normalized = normalizeCategory(rawCategory);

  if (!normalized) {
    return "hair-care";
  }

  const directMatch = SERVICE_CATEGORIES.find((option) => {
    const optionKey = normalizeCategory(option.key);
    return (
      optionKey === normalized ||
      normalized.includes(optionKey) ||
      optionKey.includes(normalized)
    );
  });

  if (directMatch) {
    return directMatch.iconName;
  }

  const label = getCategoryLabel(rawCategory);
  const labelMatch = SERVICE_CATEGORIES.find(
    (option) => normalizeCategory(option.key) === normalizeCategory(label),
  );

  return labelMatch?.iconName ?? "hair-care";
};
