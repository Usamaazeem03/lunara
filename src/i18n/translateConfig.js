import i18n from "./i18n.js";

// Only application-owned configuration contains these explicit key markers.
// User and database strings are returned unchanged and are never sent to t().
export function translateConfig(config, t = i18n.t.bind(i18n)) {
  if (Array.isArray(config)) return config.map((item) => translateConfig(item, t));
  if (!config || typeof config !== "object") return config;
  if (Object.keys(config).length === 1 && typeof config.translationKey === "string") {
    return t(config.translationKey);
  }
  return Object.fromEntries(Object.entries(config).map(([key, value]) =>
    key.endsWith("Key") && typeof value === "string"
      ? [key.slice(0, -3), t(value)]
      : [key, translateConfig(value, t)],
  ));
}
