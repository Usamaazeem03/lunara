import { useTranslation } from "react-i18next";
import { useState } from "react";
import countryToCurrency from "country-to-currency";

import SearchableSelectBox from "../../Shared/ui/SearchableSelectBox";
import { SectionTitle } from "./SettingsPage";
import { useCurrencyCode } from "./useCurrencyCode.js";
import { useUpdateCurrency } from "./useUpdateCurrency.js";

function getCurrencyOptions(language) {
const countryNames = new Intl.DisplayNames([language], { type: "region" });
const currencyNames = new Intl.DisplayNames([language], { type: "currency" });

const currencyOptions = Object.entries(countryToCurrency).reduce(
  (options, [countryCode, currencyCode]) => {
    const existingOption = options.get(currencyCode);
    const countryName = countryNames.of(countryCode) || countryCode;

    if (existingOption) {
      existingOption.countries.push(countryName);
      return options;
    }

    let symbol = currencyCode;
    try {
      symbol = new Intl.NumberFormat("en", {
        style: "currency",
        currency: currencyCode,
        currencyDisplay: "narrowSymbol",
      })
        .formatToParts(0)
        .find((part) => part.type === "currency")?.value;
    } catch {
      // Keep the ISO code when a currency is not supported by the browser.
    }

    options.set(currencyCode, {
      value: currencyCode,
      currencyName: currencyNames.of(currencyCode) || currencyCode,
      countries: [countryName],
      symbol,
    });
    return options;
  },
  new Map(),
);

return [...currencyOptions.values()]
  .sort((first, second) =>
    first.currencyName.localeCompare(second.currencyName),
  )
  .map((option) => ({
    value: option.value,
    label: `${option.value} - ${option.currencyName} (${option.symbol})`,
    searchText: `${option.value} ${option.currencyName} ${option.countries.join(" ")}`,
  }));

}

function Currencies({ creditCardIcon, ownerId }) {
  const { t, i18n } = useTranslation();
  const formattedCurrencyOptions = getCurrencyOptions(i18n.resolvedLanguage);
  const { currencyCode } = useCurrencyCode(ownerId);

  // Currency & Payments State
  const [currency, setCurrency] = useState(currencyCode);
  const [currencySearch, setCurrencySearch] = useState(null);
  const [taxRate, setTaxRate] = useState("8.5");
  // update currency
  const { mutate } = useUpdateCurrency(ownerId);

  return (
    <div className="border-ink/20 relative flex flex-col gap-4 rounded-none border-2 bg-white/90 p-4 sm:p-5">
      <SectionTitle icon={creditCardIcon} title={t("settings.currencyPayments")} />

      <div className="grid gap-4">
        <div className="space-y-2">
          <label className="text-ink-muted text-xs tracking-widest uppercase"> {t("payments.currency")} </label>
          <SearchableSelectBox
            value={currencySearch ?? formattedCurrencyOptions.find((option) => option.value === (currency || currencyCode))?.label ?? ""}
            onValueChange={setCurrencySearch}
            options={formattedCurrencyOptions}
            selectedValue={currency}
            onOptionSelect={(option) => {
              setCurrency(option.value);
              setCurrencySearch(null);
              mutate(option.value);
            }}
            placeholder={t("settings.searchCountryOrCurrency")}
            noOptionsText={t("settings.noCountryOrCurrencyFound")}
          />
        </div>

        <div className="space-y-2">
          <label className="text-ink-muted text-xs tracking-widest uppercase"> {t("settings.taxRate")} </label>
          <input
            type="number"
            value={taxRate}
            onChange={(e) => setTaxRate(e.target.value)}
            className="border-ink/20 text-ink focus:border-ink w-full rounded-none border-2 bg-white px-3 py-2 text-sm tracking-normal normal-case focus:outline-none"
          />
        </div>

        <div className="border-ink/20 rounded-none border-2 p-4">
          <p className="font-semibold">{t("settings.onlinePaymentsComingSoon")}</p>
          <p className="mt-2 text-sm text-ink-muted">{t("settings.clientsPayInFullAtTheSalonUsingAMethod")}</p>
        </div>
      </div>
    </div>
  );
}

export default Currencies;
