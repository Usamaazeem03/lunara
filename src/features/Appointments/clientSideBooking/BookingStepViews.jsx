import { useEffect, useRef } from "react";
import StepConfirm from "./StepConfirm";
import Button from "../../../Shared/Button";
import StepDateTime from "./StepDateTime";
import StepPayment from "./StepPayment";
import StepServices from "./StepServices";
import StepStaff from "./StepStaff";

function BookingStepViews({
  categories,
  selectedCategory,
  onCategoryChange,
  ownerId,
  availableDates,
  scheduleLoading,
  scheduleError,
  activeMeta,
  step,
  serviceQuery,
  setServiceQuery,
  calendarIcon,
  activeDate,
  clockIcon,
  activeTime,
  filteredServices,
  selectedServices,
  toggleService,
  servicesStatusMessage,
  selectedDate,
  setSelectedDate,
  timeSlots,
  selectedTime,
  setSelectedTime,
  selectedStaff,
  setSelectedStaff,
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
  handleBack,
}) {
  const contentRef = useRef(null);
  const previousStep = useRef(step);
  useEffect(() => {
    if (previousStep.current === step) return;
    previousStep.current = step;
    const heading = contentRef.current?.querySelector("[data-booking-heading]");
    heading?.focus({ preventScroll: true });
    heading?.scrollIntoView({ block: "start", behavior: "instant" });
  }, [step]);
  return (
    <div
      ref={contentRef}
      className="border-ink/10 min-w-0 rounded-2xl border bg-white/60 p-4 sm:p-6"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="custom"
            unstyled
            onClick={handleBack}
            aria-label="Go back"
            className="border-ink/20 text-ink hover:bg-ink hover:text-cream flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition"
          >
            &larr;
          </Button>

          <div className="flex flex-col gap-0.5">
            <h2
              tabIndex={-1}
              data-booking-heading
              className="scroll-mt-4 text-xl font-semibold outline-none sm:text-2xl"
            >
              {activeMeta.title}
            </h2>

            <p className="text-xs text-[#5f544b] sm:text-sm">
              {activeMeta.subtitle}
            </p>
          </div>
        </div>
        {step >= 3 && activeDate && (
          <div className="flex flex-wrap items-center gap-2 text-[0.65rem] tracking-widest text-[#5f544b] uppercase sm:gap-3 sm:text-xs">
            <span className="border-ink/10 flex items-center gap-2 rounded-full border bg-[#f3efe9] px-2 py-2 sm:px-3">
              <img src={calendarIcon} alt="" className="h-4 w-4 opacity-70" />
              {activeDate?.day ?? ""} {activeDate?.date ?? ""}
            </span>
            <span className="border-ink/10 flex items-center gap-2 rounded-full border bg-[#f3efe9] px-2 py-2 sm:px-3">
              <img src={clockIcon} alt="" className="h-4 w-4 opacity-70" />
              {activeTime}
            </span>
          </div>
        )}
      </div>

      {step === 1 && (
        <div className="mt-5 space-y-3">
          <label className="block">
            <span className="sr-only">Search services</span>
            <input
              type="search"
              value={serviceQuery}
              onChange={(event) => setServiceQuery(event.target.value)}
              placeholder="Search haircuts, facials, and more..."
              className="border-ink/15 text-ink focus:border-ink focus:ring-ink/10 min-h-12 w-full rounded-xl border bg-white px-4 py-3 text-base transition outline-none focus:ring-2"
            />
          </label>
          <div
            className="flex gap-2 overflow-x-auto pb-2"
            aria-label="Service categories"
          >
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                aria-pressed={category === selectedCategory}
                onClick={() => onCategoryChange(category)}
                className={`focus-visible:outline-ink min-h-11 shrink-0 rounded-full border px-4 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 ${category === selectedCategory ? "border-ink bg-ink text-cream" : "border-ink/10 text-ink-muted hover:border-ink/40 bg-white"}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="mt-5 flex flex-col">
        {step === 1 && (
          <StepServices
            ownerId={ownerId}
            filteredServices={filteredServices}
            selectedServices={selectedServices}
            toggleService={toggleService}
            statusMessage={servicesStatusMessage}
          />
        )}

        {step === 2 && (
          <StepDateTime
            ownerId={ownerId}
            availableDates={availableDates}
            loading={scheduleLoading}
            error={scheduleError}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            timeSlots={timeSlots}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
          />
        )}

        {step === 3 && (
          <StepStaff
            ownerId={ownerId}
            selectedStaff={selectedStaff}
            setSelectedStaff={setSelectedStaff}
          />
        )}

        {step === 4 && (
          <StepConfirm
            activeDate={activeDate ?? ""}
            activeTime={activeTime ?? ""}
            totalDurationLabel={totalDurationLabel ?? ""}
            activeStaff={activeStaff ?? ""}
            selectedServiceList={selectedServiceList ?? []}
            totalPriceLabel={totalPriceLabel ?? ""}
          />
        )}

        {step === 5 && (
          <StepPayment
            paymentOptions={paymentOptions}
            selectedPayment={selectedPayment}
            paymentMethods={paymentMethods}
            selectedMethod={selectedMethod}
            setSelectedMethod={setSelectedMethod}
            activePayment={activePayment}
            activeMethod={activeMethod}
          />
        )}
      </div>
    </div>
  );
}

export default BookingStepViews;
