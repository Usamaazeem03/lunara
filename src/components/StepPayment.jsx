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
        <div className="mt-3 grid gap-3 lg:grid-cols-3">
          {paymentOptions.map((option, index) => {
            const isSelected = index === selectedPayment;
            return (
              <button
                key={option.title}
                type="button"
                onClick={() => setSelectedPayment(index)}
                className={`border-2 p-4 text-left text-sm transition ${
                  isSelected
                    ? "border-[#2d2620] bg-[#f3efe9]"
                    : "border-[#2d2620]/30 bg-white"
                }`}
              >
                <p className="text-sm font-semibold">{option.title}</p>
                <p className="mt-2 text-xs text-[#5f544b]">
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
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {paymentMethods.map((method, index) => {
            const isSelected = index === selectedMethod;
            return (
              <button
                key={method}
                type="button"
                onClick={() => setSelectedMethod(index)}
                className={`border-2 px-4 py-3 text-xs uppercase tracking-widest transition ${
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

      <div className="border-2 border-dashed border-[#2d2620]/40 bg-[#f7f2ec] p-4 text-sm">
        <p className="text-xs uppercase tracking-widest text-[#5f544b]">
          Selected Payment
        </p>
        <p className="mt-2 font-semibold">{activePayment.title}</p>
        <p className="text-xs text-[#5f544b]">Method: {activeMethod}</p>
      </div>
    </div>
  );
}

export default StepPayment;
