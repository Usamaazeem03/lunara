import { useTranslation } from "react-i18next";
import StepConfirm from "./StepConfirm.jsx";
import StepPayment from "./StepPayment.jsx";

export default function StepCustomerDetails({
  customerDetails,
  onCustomerDetailsChange,
  activeDate,
  activeTime,
  totalDurationLabel,
  activeStaff,
  selectedServiceList,
  totalPriceLabel,
  paymentOptions,
  selectedPayment,
  paymentMethods,
  selectedMethod,
  setSelectedMethod,
  activePayment,
  activeMethod,
}) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6">
      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="mb-3 text-sm font-semibold text-[#2d2620]">
          {t("booking.yourContactDetails")}
        </legend>
        <label className="block text-sm font-medium text-[#2d2620]">
          {t("common.fullName")}
          <input
            type="text"
            autoComplete="name"
            required
            maxLength={120}
            value={customerDetails.name}
            onChange={(event) => onCustomerDetailsChange("name", event.target.value)}
            className="mt-2 min-h-12 w-full rounded-xl border border-ink/20 bg-white px-4 text-base outline-none focus:border-ink focus:ring-2 focus:ring-ink/10"
          />
        </label>
        <label className="block text-sm font-medium text-[#2d2620]">
          {t("common.email")}
          <input
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            value={customerDetails.email}
            onChange={(event) => onCustomerDetailsChange("email", event.target.value)}
            className="mt-2 min-h-12 w-full rounded-xl border border-ink/20 bg-white px-4 text-base outline-none focus:border-ink focus:ring-2 focus:ring-ink/10"
          />
        </label>
        <label className="block text-sm font-medium text-[#2d2620] sm:col-span-2">
          {t("common.phoneNumber")}
          <input
            type="tel"
            autoComplete="tel"
            maxLength={40}
            value={customerDetails.phone}
            onChange={(event) => onCustomerDetailsChange("phone", event.target.value)}
            className="mt-2 min-h-12 w-full rounded-xl border border-ink/20 bg-white px-4 text-base outline-none focus:border-ink focus:ring-2 focus:ring-ink/10"
          />
        </label>
      </fieldset>

      <StepConfirm
        activeDate={activeDate}
        activeTime={activeTime}
        totalDurationLabel={totalDurationLabel}
        activeStaff={activeStaff}
        selectedServiceList={selectedServiceList}
        totalPriceLabel={totalPriceLabel}
      />

      <StepPayment
        paymentOptions={paymentOptions}
        selectedPayment={selectedPayment}
        paymentMethods={paymentMethods}
        selectedMethod={selectedMethod}
        setSelectedMethod={setSelectedMethod}
        activePayment={activePayment}
        activeMethod={activeMethod}
      />
    </div>
  );
}
