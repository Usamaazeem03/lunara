const LEGACY_TITLES = {
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
  youtube: "YouTube",
  whatsapp: "WhatsApp",
  x: "X / Twitter",
};

export const SOCIAL_LINK_TITLE_MAX_LENGTH = 80;

export function normalizeSocialUrl(value) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 2048 || /\s/.test(trimmed)) return null;
  try {
    const url = new URL(trimmed);
    if (!["http:", "https:"].includes(url.protocol) || !url.hostname || url.username || url.password) return null;
    return url.href;
  } catch {
    return null;
  }
}

// Read custom entries and the original six-platform object without losing old links.
export function getSafeSocialLinks(value) {
  if (!value || typeof value !== "object") return [];
  const entries = Array.isArray(value)
    ? value
    : Array.isArray(value.links)
      ? value.links
      : Object.entries(LEGACY_TITLES).map(([key, title]) => ({ title, url: value[key] }));

  return entries.flatMap(entry => {
    const title = typeof entry?.title === "string" ? entry.title.trim() : "";
    const url = normalizeSocialUrl(entry?.url);
    return title && title.length <= SOCIAL_LINK_TITLE_MAX_LENGTH && url ? [{ title, url }] : [];
  });
}
