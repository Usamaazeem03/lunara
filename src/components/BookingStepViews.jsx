import StepConfirm from "../Dashboard/Client/ClientPages/StepConfirm";
import Button from "../Dashboard/Shared/Button";
import StepDateTime from "./StepDateTime";
import StepPayment from "./StepPayment";
import StepServices from "./StepServices";
import StepStaff from "./StepStaff";

function BookingStepViews({
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
  dateOptions,
  selectedDate,
  setSelectedDate,
  timeSlots,
  selectedTime,
  setSelectedTime,
  staffMembers,
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
      <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-[#2d2620]/5"></div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">{activeMeta.title}</h2>
          <p className="text-sm text-[#5f544b]">{activeMeta.subtitle}</p>
        </div>
        {step === 1 && (
          <div className="w-full max-w-sm">
            <input
              type="text"
              value={serviceQuery}
              onChange={(event) => setServiceQuery(event.target.value)}
              placeholder="Search by name (e.g. facial, haircut)"
              className="mt-2 w-full border-2 border-[#2d2620]/30 bg-white px-4 py-2 text-xs uppercase tracking-widest text-[#2d2620] placeholder:normal-case placeholder:text-[#5f544b]/70 focus:border-[#2d2620] focus:outline-none"
            />
          </div>
        )}
        {step >= 2 && (
          <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-[#5f544b]">
            <span className="flex items-center gap-2 border-2 border-[#2d2620] bg-[#f3efe9] px-3 py-2">
              <img src={calendarIcon} alt="" className="h-4 w-4 opacity-70" />
              {activeDate.day} {activeDate.date}
            </span>
            <span className="flex items-center gap-2 border-2 border-[#2d2620] bg-[#f3efe9] px-3 py-2">
              <img src={clockIcon} alt="" className="h-4 w-4 opacity-70" />
              {activeTime}
            </span>
          </div>
        )}
      </div>

      <div className="scrollbar-hidden  mt-5 flex min-h-0 flex-1 flex-col max-h-[50vh] min-h-[50vh] overflow-y-auto pr-3 md:min-h-0">
        {step === 1 && (
          <StepServices
            filteredServices={filteredServices}
            selectedServices={selectedServices}
            toggleService={toggleService}
          />
        )}

        {step === 2 && (
          <StepDateTime
            dateOptions={dateOptions}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            timeSlots={timeSlots}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
          />
        )}

        {step === 3 && (
          <StepStaff
            staffMembers={staffMembers}
            selectedStaff={selectedStaff}
            setSelectedStaff={setSelectedStaff}
          />
        )}

        {step === 4 && (
          <StepConfirm
            activeDate={activeDate}
            activeTime={activeTime}
            totalDurationLabel={totalDurationLabel}
            activeStaff={activeStaff}
            selectedServiceList={selectedServiceList}
            totalPriceLabel={totalPriceLabel}
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

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 ">
        <Button onClick={handleBack} variant="primary">
          {step === 1 ? "Back to Dashboard" : "Back"}
        </Button>
        <Button onClick={handleNext} variant="primary">
          {isLastStep ? "Complete Booking" : "Continue"}
        </Button>
        {/* <button
          type="button"
          onClick={handleBack}
          className="border-2 border-[#2d2620] px-4 py-2 text-xs uppercase tracking-widest transition hover:bg-[#2d2620] hover:text-[#f3efe9]"
        >
          {step === 1 ? "Back to Dashboard" : "Back"}
        </button> */}
        {/* <button
          type="button"
          onClick={handleNext}
          disabled={isLastStep}
          className={`border-2 px-4 py-2 text-xs uppercase tracking-widest transition ${
            isLastStep
              ? "border-[#2d2620]/30 bg-white/70 text-[#2d2620]/40"
              : "border-[#2d2620] hover:bg-[#2d2620] hover:text-[#f3efe9]"
          }`}
        >
          {isLastStep ? "Complete Booking" : "Continue"}
        </button> */}
      </div>
    </div>
  );
}

export default BookingStepViews;
