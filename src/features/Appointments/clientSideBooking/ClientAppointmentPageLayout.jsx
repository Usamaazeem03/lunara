import { useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ClientSalonPicker from "./ClientSalonPicker.jsx";
import BookingPass from "../bookingPass/BookingPass.jsx";

import calendarIcon from "../../../Shared/assets/icons/calendar.svg";
import clockIcon from "../../../Shared/assets/icons/clock.svg";
import BookingActionBar from "./BookingActionBar.jsx";

import BookingStepNavigation from "./BookingStepNavigation.jsx";
import BookingStepViews from "./BookingStepViews.jsx";
import BookingSummary from "./BookingSummary.jsx";

import { useClientBooking } from "./useClientBooking.js";
import { PAYMENT_METHODS } from "./bookingConfig.js";

function ClientAppointmentPageLayout({ onBack }) {
  const [searchParams] = useSearchParams();
  let storedOwnerId = null;
  try { storedOwnerId = localStorage.getItem("owner_id"); } catch { /* URL selection works without storage. */ }
  const ownerId = searchParams.get("owner_id") || storedOwnerId;
  if (searchParams.has("choose_salon") || !ownerId) return <ClientSalonPicker />;
  return <ClientBookingContent key={ownerId} onBack={onBack} />;
}

function ClientBookingContent({ onBack }) {
  const successHeadingRef = useRef(null);
  const {
    rewardCode,
    rewardMessage,
    setRewardCode,
    bookedAppointment,
    canContinue,
    isSubmitting,
    step,
    goToStep,
    categories,
    selectedCategory,
    handleCategoryChange,
    ownerId,
    availableDates,
    timeSlots,
    scheduleLoading,
    scheduleError,
    activeStep,
    serviceQuery,
    setServiceQuery,
    activeDate,
    activeTime,
    filteredServices,
    safeSelectedServices,
    toggleService,
    emptyServicesMessage,
    selectedDate,
    setSelectedDate,
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
    selectedMethod,
    setSelectedMethod,
    activePayment,
    activeMethod,
    handleBack,
    handleNext,
  } = useClientBooking({ onBack });

  useEffect(() => {
    if (!bookedAppointment) return;
    successHeadingRef.current?.focus({ preventScroll: true });
    successHeadingRef.current?.scrollIntoView({ block: "start" });
  }, [bookedAppointment]);

  if (bookedAppointment) {
    return (
      <section className="mx-auto max-w-lg pb-8">
        <header role="status" className="mb-6 text-center">
          <p className="text-ink-muted text-xs tracking-[0.2em] uppercase">
            Booking saved
          </p>
          <h1
            ref={successHeadingRef}
            tabIndex={-1}
            className="mt-2 scroll-mt-4 text-3xl font-semibold outline-none"
          >
            Your next visit starts here
          </h1>
          <p className="text-ink-muted mt-3 text-sm leading-6">
            Keep your pass handy. You can find it again in My Appointments.
          </p>
        </header>
        <BookingPass appointment={bookedAppointment} />
        <Link
          to="/dashboard/my-appointment"
          className="border-ink/20 mt-5 flex min-h-12 items-center justify-center rounded-xl border text-sm font-semibold"
        >
          View my appointments
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col pb-36 lg:pb-2">
      <header className="flex items-end justify-between gap-4">
        <div>
          <p className="text-ink-muted mb-2 text-[10px] font-semibold tracking-[0.22em] uppercase">
            A little time for you
          </p>
          <h1 className="text-ink text-3xl font-semibold tracking-tight sm:text-4xl">
            Book your next visit
          </h1>
          <p className="text-ink-muted mt-2 text-sm leading-6">
            Your services, your stylist, your perfect time.
          </p>
        </div>
      </header>

      <Link to="?choose_salon=1" className="mt-3 inline-flex min-h-11 w-fit items-center text-xs text-ink-muted underline underline-offset-4">Choose a different salon</Link>

      <BookingStepNavigation step={step} goToStep={goToStep} />
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_340px]">
        <BookingStepViews
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          ownerId={ownerId}
          availableDates={availableDates}
          scheduleLoading={scheduleLoading}
          scheduleError={scheduleError}
          activeMeta={activeStep}
          step={step}
          serviceQuery={serviceQuery}
          setServiceQuery={setServiceQuery}
          calendarIcon={calendarIcon}
          activeDate={activeDate}
          clockIcon={clockIcon}
          activeTime={activeTime}
          filteredServices={filteredServices}
          selectedServices={safeSelectedServices}
          toggleService={toggleService}
          servicesStatusMessage={emptyServicesMessage}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          timeSlots={timeSlots}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          selectedStaff={selectedStaff}
          setSelectedStaff={setSelectedStaff}
          totalDurationLabel={totalDurationLabel}
          activeStaff={activeStaff}
          selectedServiceList={selectedServiceList}
          totalPriceLabel={totalPriceLabel}
          paymentOptions={paymentOptions}
          selectedPayment={selectedPayment}
          paymentMethods={PAYMENT_METHODS}
          selectedMethod={selectedMethod}
          setSelectedMethod={setSelectedMethod}
          activePayment={activePayment}
          activeMethod={activeMethod}
          handleBack={handleBack}
        />

        <aside className="flex flex-col gap-3">
          <BookingSummary
            rewardCode={rewardCode}
            rewardMessage={rewardMessage}
            setRewardCode={setRewardCode}
            isSubmitting={isSubmitting}
            services={selectedServiceList}
            totalDurationLabel={totalDurationLabel}
            activeTime={activeTime}
            activeDate={activeDate}
            activeStaff={activeStaff}
            activePayment={activePayment}
            totalPriceLabel={totalPriceLabel}
          />
        </aside>
      </div>
      <BookingActionBar
        totalPriceLabel={totalPriceLabel}
        selectedCount={selectedServiceList.length}
        totalDurationLabel={totalDurationLabel}
        step={step}
        canContinue={canContinue}
        isSubmitting={isSubmitting}
        onContinue={handleNext}
      />
    </section>
  );
}

export default ClientAppointmentPageLayout;
