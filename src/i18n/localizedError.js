import i18n from "./i18n.js";

// Keep error identity and metadata while resolving its fixed message at display time.
export function localizedError(translationKey, options) {
  const error = new Error(i18n.t(translationKey, options));
  Object.defineProperty(error, "message", {
    configurable: true,
    get: () => i18n.t(translationKey, options),
  });
  return error;
}
