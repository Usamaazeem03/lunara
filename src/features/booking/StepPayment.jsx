function StepPayment({
  paymentOptions,
  selectedPayment,
  setSelectedPayment,
  paymentMethods,
  selectedMethod,
  setSelectedMethod,
  activePayment,
  activeMethod,
}) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-xs uppercase tracking-widest text-[#5f544b]">
          Payment Options
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {paymentOptions.map((option, index) => {
            const isSelected = index === selectedPayment;
            return (
              <button
                key={option.title}
                type="button"
                onClick={() => setSelectedPayment(index)}
                className={`border-2 p-3 text-left text-sm transition sm:p-4 ${
                  isSelected
                    ? "border-[#2d2620] bg-[#f3efe9]"
                    : "border-[#2d2620]/30 bg-white"
                }`}
              >
                <p className="text-sm font-semibold sm:text-base">
                  {option.title}
                </p>
                <p className="mt-2 text-xs text-[#5f544b] sm:text-sm">
                  {option.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest text-[#5f544b]">
          Payment Methods
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {paymentMethods.map((method, index) => {
            const isSelected = index === selectedMethod;
            return (
              <button
                key={method}
                type="button"
                onClick={() => setSelectedMethod(index)}
                className={`border-2 px-3 py-3 text-[0.65rem] uppercase tracking-widest transition sm:px-4 sm:text-xs ${
                  isSelected
                    ? "border-[#2d2620] bg-[#f3efe9]"
                    : "border-[#2d2620]/30 bg-white"
                }`}
              >
                {method}
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-2 border-dashed border-[#2d2620]/40 bg-[#f7f2ec] p-3 text-sm sm:p-4">
        <p className="text-xs uppercase tracking-widest text-[#5f544b]">
          Selected Payment
        </p>
        <p className="mt-2 text-sm font-semibold sm:text-base">
          {activePayment.title}
        </p>
        <p className="text-[0.65rem] text-[#5f544b] sm:text-xs">
          Method: {activeMethod}
        </p>
      </div>
    </div>
  );
}

export default StepPayment;
