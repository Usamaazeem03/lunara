import i18n from "../i18n/i18n.js";
import countryToCurrency from "country-to-currency";

const DEFAULT_CURRENCY = "USD";

export function formattedCurrency(value, currencyCode = DEFAULT_CURRENCY) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return i18n.t("common.nA");

  try {
    const normalizedCurrency = String(
      currencyCode || DEFAULT_CURRENCY,
    ).toUpperCase();
    return new Intl.NumberFormat(i18n.resolvedLanguage, {
      style: "currency",
      currency: normalizedCurrency,
      currencyDisplay: "narrowSymbol",
    }).format(numericValue);
  } catch {
    return new Intl.NumberFormat(i18n.resolvedLanguage, {
      style: "currency",
      currency: DEFAULT_CURRENCY,
    }).format(numericValue);
  }
}

export const formatCurrency = formattedCurrency;

export function getCurrencyFromCountry(countryCode) {
  if (!countryCode) {
    return DEFAULT_CURRENCY;
  }

  const currency = countryToCurrency[countryCode.toUpperCase()];

  return currency || DEFAULT_CURRENCY;
}
