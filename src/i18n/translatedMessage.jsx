import { createElement } from "react";
import LocalizedMessageView from "./LocalizedMessageView.jsx";

// Keep application-owned toast keys until render, including already-open toasts.
export function translatedMessage(translationKey, options) {
  return createElement(LocalizedMessageView, { translationKey, options });
}
