import checkIcon from "../../../Shared/assets/icons/checkmark-tick.svg";
import creditCardIcon from "../../../Shared/assets/icons/credit-card.svg";
import walletIcon from "../../../Shared/assets/icons/wallet-payment.svg";

const paymentMethodMeta = {
  Cash: {
    icon: walletIcon,
    description: "Cash at the salon",
  },
  Card: {
    icon: creditCardIcon,
    description: "Card at the salon, if accepted",
  },
  Wallet: {
    icon: walletIcon,
    description: "Wallet at the salon, if accepted",
  },
};

function StepPayment({
  paymentOptions,
  selectedPayment,
  paymentMethods,
  selectedMethod,
  setSelectedMethod,
  activePayment,
  activeMethod,
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-3 text-xs tracking-widest text-[#5f544b] uppercase">
          Payment Options
        </p>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {paymentOptions.map((option, index) => {
            const isSelected = index === selectedPayment;
            return (
              <button
                key={option.title}
                type="button"
                disabled={option.disabled}
                aria-pressed={isSelected}
                className={`relative flex min-h-32 flex-col justify-between rounded-2xl border p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  isSelected
                    ? "border-[#2d2620] bg-[#f3efe9]"
                    : "border-[#2d2620]/15 bg-white hover:border-[#2d2620]/50"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <p className="max-w-[12rem] text-base leading-snug font-semibold text-[#2d2620]">
                      {option.title}
                    </p>
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
                        isSelected
                          ? "border-[#2d2620] bg-[#2d2620]"
                          : "border-[#2d2620]/15 bg-white"
                      }`}
                    >
                      {isSelected && (
                        <img
                          src={checkIcon}
                          alt=""
                          className="h-3.5 w-3.5 brightness-0 invert"
                        />
                      )}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[#5f544b]">
                    {option.description}
                  </p>
                </div>
                <span className="mt-5 text-[0.65rem] tracking-widest text-[#5f544b] uppercase sm:text-xs">
                  {option.disabled ? "Coming soon" : isSelected ? "Selected option" : "Tap to select"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs tracking-widest text-[#5f544b] uppercase">
          Preferred method at the salon
        </p>
        <p className="mb-3 text-sm text-ink-muted">Choose a preference and confirm availability with your salon. You can change how you pay at your visit. No money is collected in this app.</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {paymentMethods.map((method, index) => {
            const isSelected = index === selectedMethod;
            const meta = paymentMethodMeta[method] ?? paymentMethodMeta.Card;
            return (
              <button
                key={method}
                type="button"
                onClick={() => setSelectedMethod(index)}
                aria-pressed={isSelected}
                className={`flex min-h-20 items-center gap-3 rounded-2xl border p-3 text-left transition sm:p-4 ${
                  isSelected
                    ? "border-[#2d2620] bg-[#f3efe9]"
                    : "border-[#2d2620]/15 bg-white hover:border-[#2d2620]/50"
                }`}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-2 border-[#2d2620]/15 bg-white">
                  <img src={meta.icon} alt="" className="h-5 w-5 opacity-70" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-[#2d2620]">
                    {method}
                  </span>
                  <span className="mt-1 block text-xs text-[#5f544b]">
                    {meta.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-[#2d2620] bg-[#2d2620] p-4 text-[#f3efe9]">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <p className="text-xs tracking-widest text-[#f3efe9]/70 uppercase">
              Pay at your visit
            </p>
            <p className="mt-2 text-base font-semibold">
              {activePayment.title}
            </p>
          </div>
          <div className="border-2 border-[#f3efe9]/30 px-4 py-2 text-sm font-semibold">
            {activeMethod}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StepPayment;
