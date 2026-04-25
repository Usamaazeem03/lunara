import StepConfirm from "./StepConfirm";
import Button from "../../Shared/Button";
import StepDateTime from "./StepDateTime";
import StepPayment from "./StepPayment";
import StepServices from "./StepServices";
import StepStaff from "./StepStaff";
import ServiceSearchInput from "../../Shared/ui/ServiceSearchInput";

function BookingStepViews({
  ownerId,
  onDateSelect,
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
  dateOptions,
  selectedDate,
  setSelectedDate,
  timeSlots,
  selectedTime,
  setSelectedTime,
  // staffMembers,
  selectedStaff,
  setSelectedStaff,
  totalDurationLabel,
  activeStaff,
  selectedServiceList,
  totalPriceLabel,
  paymentOptions,
  selectedPayment,
  setSelectedPayment,
  paymentMethods,
  selectedMethod,
  setSelectedMethod,
  activePayment,
  activeMethod,
  handleBack,
  handleNext,
  isLastStep,
}) {
  return (
    <div className="relative flex min-h-0 flex-1 flex-col border-2 border-[#2d2620] bg-white/90 p-4 sm:p-5">
      <div className="absolute -top-8 -right-8 h-20 w-20 rounded-full bg-[#2d2620]/5"></div>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold sm:text-xl">
            {activeMeta.title}
          </h2>
          <p className="text-xs text-[#5f544b] sm:text-sm">
            {activeMeta.subtitle}
          </p>
        </div>
        {step === 1 && (
          <div className="w-full max-w-sm">
            <ServiceSearchInput
              value={serviceQuery}
              onChange={(event) => setServiceQuery(event.target.value)}
            />
          </div>
        )}
        {step >= 2 && (
          <div className="flex flex-wrap items-center gap-2 text-[0.65rem] tracking-widest text-[#5f544b] uppercase sm:gap-3 sm:text-xs">
            <span className="flex items-center gap-2 border-2 border-[#2d2620] bg-[#f3efe9] px-2 py-2 sm:px-3">
              <img src={calendarIcon} alt="" className="h-4 w-4 opacity-70" />
              {activeDate?.day ?? ""} {activeDate?.date ?? ""}
            </span>
            <span className="flex items-center gap-2 border-2 border-[#2d2620] bg-[#f3efe9] px-2 py-2 sm:px-3">
              <img src={clockIcon} alt="" className="h-4 w-4 opacity-70" />
              {activeTime}
            </span>
          </div>
        )}
      </div>

      <div className="scrollbar-hidden mt-4 flex max-h-[50vh] min-h-0 min-h-[50vh] flex-1 flex-col overflow-y-auto pr-2 sm:mt-5 sm:pr-3 md:min-h-0">
        {step === 1 && (
          <StepServices
            filteredServices={filteredServices}
            selectedServices={selectedServices}
            toggleService={toggleService}
            statusMessage={servicesStatusMessage}
          />
        )}

        {step === 2 && (
          <StepDateTime
            ownerId={ownerId}
            dateOptions={dateOptions}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            timeSlots={timeSlots}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            onDateSelect={onDateSelect}
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
            setSelectedPayment={setSelectedPayment}
            paymentMethods={paymentMethods}
            selectedMethod={selectedMethod}
            setSelectedMethod={setSelectedMethod}
            activePayment={activePayment}
            activeMethod={activeMethod}
          />
        )}
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Button
          onClick={handleBack}
          variant="primary"
          fullWidth
          className="sm:w-auto"
        >
          {step === 1 ? "Back to Dashboard" : "Back"}
        </Button>
        <Button
          onClick={handleNext}
          variant="primary"
          fullWidth
          className="sm:w-auto"
        >
          {isLastStep ? "Complete Booking" : "Continue"}
        </Button>
      </div>
    </div>
  );
}

export default BookingStepViews;
