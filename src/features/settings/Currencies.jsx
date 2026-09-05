import { useState } from "react";
import countryToCurrency from "country-to-currency";

import SearchableSelectBox from "../../Shared/ui/SearchableSelectBox";
import { SectionTitle } from "./SettingsPage";
import { ToggleRow } from "./SettingsPage";
import { useCurrencyCode } from "./useCurrencyCode.js";
import { useUpdateCurrency } from "./useUpdateCurrency.js";

const countryNames = new Intl.DisplayNames(["en"], { type: "region" });
const currencyNames = new Intl.DisplayNames(["en"], { type: "currency" });

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

const formattedCurrencyOptions = [...currencyOptions.values()]
  .sort((first, second) =>
    first.currencyName.localeCompare(second.currencyName),
  )
  .map((option) => ({
    value: option.value,
    label: `${option.value} - ${option.currencyName} (${option.symbol})`,
    searchText: `${option.value} ${option.currencyName} ${option.countries.join(" ")}`,
  }));

function Currencies({ creditCardIcon, ownerId }) {
  const { currencyCode } = useCurrencyCode();

  // Currency & Payments State
  const [currency, setCurrency] = useState(currencyCode);
  const [currencySearch, setCurrencySearch] = useState(
    formattedCurrencyOptions.find((option) => option.value === currencyCode)
      ?.label || "",
  );
  const [taxRate, setTaxRate] = useState("8.5");
  const [enablePayments, setEnablePayments] = useState(true);
  // update currency
  const { mutate } = useUpdateCurrency(ownerId);

  return (
    <div className="border-ink/20 relative flex flex-col gap-4 border-2 bg-white/90 p-4 sm:p-5">
      <SectionTitle icon={creditCardIcon} title="Currency & Payments" />

      <div className="grid gap-4">
        <div className="space-y-2">
          <label className="text-ink-muted text-xs tracking-widest uppercase">
            Currency
          </label>
          <SearchableSelectBox
            value={currencySearch}
            onValueChange={setCurrencySearch}
            options={formattedCurrencyOptions}
            selectedValue={currency}
            onOptionSelect={(option) => {
              setCurrency(option.value);
              setCurrencySearch(option.label);
              mutate(option.value);
            }}
            placeholder="Search country or currency"
            noOptionsText="No country or currency found"
          />
        </div>

        <div className="space-y-2">
          <label className="text-ink-muted text-xs tracking-widest uppercase">
            Tax Rate (%)
          </label>
          <input
            type="number"
            value={taxRate}
            onChange={(e) => setTaxRate(e.target.value)}
            className="border-ink/20 text-ink focus:border-ink w-full rounded-none border-2 bg-white px-3 py-2 text-sm tracking-normal normal-case focus:outline-none"
          />
        </div>

        <ToggleRow
          label="Enable online payments"
          checked={enablePayments}
          onChange={() => setEnablePayments((prev) => !prev)}
        />
      </div>
    </div>
  );
}

export default Currencies;
