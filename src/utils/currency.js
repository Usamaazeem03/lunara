import countryToCurrency from "country-to-currency";

const DEFAULT_CURRENCY = "USD";

export function formattedCurrency(value, currencyCode = DEFAULT_CURRENCY) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return "N/A";

  try {
    const normalizedCurrency = String(
      currencyCode || DEFAULT_CURRENCY,
    ).toUpperCase();
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: normalizedCurrency,
      currencyDisplay: "narrowSymbol",
    }).format(numericValue);
  } catch {
    return new Intl.NumberFormat(undefined, {
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
