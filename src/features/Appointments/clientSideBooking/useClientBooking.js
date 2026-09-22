import { useBookingServices } from "./useBookingServices.js";
import { useBookingSchedule } from "./useBookingSchedule.js";
import { useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../hooks/useAuth.js";
import { getRewards, rewardStatus } from "../../../services/apiRewards.js";
import { formatNumber } from "../../../utils/appointmentUtils.js";
import { useBookingSubmit } from "../../../globalHooks/useBookingSubmit.js";
import { notify } from "../../../Shared/lib/toast.jsx";
import { formatCurrency } from "../../../utils/currency.js";
import { BOOKING_STEPS, PAYMENT_METHODS } from "./bookingConfig.js";

const clampIndex = (list, index) => list[index] ?? list[0];

export function useClientBooking({ onBack }) {
  const [step, setStep] = useState(1);
  const [bookedAppointment, setBookedAppointment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submissionPending = useRef(false);
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState(0);

  const [selectedStaff, setSelectedStaff] = useState(null);
  const selectedPayment = 0;
  const [selectedMethod, setSelectedMethod] = useState(0);

  const [searchParams] = useSearchParams();
  const [rewardCode, setRewardCode] = useState(searchParams.get("reward") || "");
  let storedOwnerId = null;
  try { storedOwnerId = localStorage.getItem("owner_id"); } catch { /* The URL is the primary salon selection. */ }
  const ownerId = searchParams.get("owner_id") || storedOwnerId;
  const { user } = useAuth();
  const rewards = useQuery({
    queryKey: ["client-rewards", ownerId, user?.id],
    queryFn: () => getRewards({ ownerId, clientId: user.id }),
    enabled: Boolean(ownerId && user?.id && rewardCode.trim()),
  });
  const selectedReward = rewards.data?.find((reward) => reward.code === rewardCode.trim().toUpperCase() && rewardStatus(reward) === "Available");
  const rewardMessage = !rewardCode.trim() ? "" : rewards.isFetching ? "Checking your reward…" : selectedReward ? `${selectedReward.percent_off}% reward included. Validated again when you book.` : "This code is unavailable for your account at this salon. Check the code or remove it to continue.";
  const {
    currencyCode,
    categories,
    selectedCategory,
    handleCategoryChange,
    serviceQuery,
    setServiceQuery,
    filteredServices,
    safeSelectedServices,
    selectedServiceList,
    toggleService,
    emptyServicesMessage,
  } = useBookingServices(ownerId);

  const { handleBooking } = useBookingSubmit("client");
  const {
    availableDates,
    timeSlots,
    loading: scheduleLoading,
    error: scheduleError,
  } = useBookingSchedule(ownerId, selectedDate);

  const stepCount = BOOKING_STEPS.length;
  const isLastStep = step === stepCount;
  const activeStep = BOOKING_STEPS[step - 1] ?? BOOKING_STEPS[0];
  const activeDate = availableDates[selectedDate] ?? null;
  const activeTime = timeSlots[selectedTime] ?? null;

  const activeStaff = selectedStaff;
  const activeMethod = clampIndex(PAYMENT_METHODS, selectedMethod);

  const subtotal = selectedServiceList.reduce(
    (sum, service) => sum + service.priceValue,
    0,
  );
  const totalPriceValue = selectedReward ? subtotal - Math.round(subtotal * selectedReward.percent_off) / 100 : subtotal;
  const totalDurationValue = selectedServiceList.reduce(
    (sum, service) => sum + service.durationValue,
    0,
  );
  const totalPriceLabel = formatCurrency(totalPriceValue, currencyCode);
  const totalDurationLabel = `${formatNumber(totalDurationValue)} min`;
  const paymentOptions = [
    {
      title: "Pay in full at the salon",
      description: "Pay the full amount at your visit using a method accepted by the salon.",
    },
    {
      title: "Pay Online - Full Amount",
      description: "Coming soon. Online payments are not available yet.",
      disabled: true,
    },
    {
      title: "Pay Advance - 50%",
      description: "Coming soon. No deposit or advance payment is required.",
      disabled: true,
    },
  ];
  const activePayment = clampIndex(paymentOptions, selectedPayment);

  const progress = Math.round((step / stepCount) * 100);

  const goToStep = (nextStep) => {
    if (nextStep > 1 && selectedServiceList.length === 0) {
      notify.error("Please select at least one service to continue.");
      return;
    }

    if (
      nextStep > 2 &&
      (!activeDate || !activeTime || scheduleLoading || scheduleError)
    ) {
      notify.error("Choose an available date and time first.");
      return;
    }
    setStep(Math.max(1, Math.min(stepCount, nextStep)));
  };

  const handleBack = () => {
    if (step === 1) {
      onBack?.();
      return;
    }
    goToStep(step - 1);
  };

  const handleNext = async () => {
    if (submissionPending.current || bookedAppointment) return;
    if (selectedServiceList.length === 0) {
      notify.error("Please select at least one service to continue.");
      return;
    }

    if (!isLastStep) {
      goToStep(step + 1);
      return;
    }

    if (!ownerId || !activeDate || !activeTime) {
      notify.error(
        "Please select a salon, date, and available time before booking.",
      );
      return;
    }
    if (rewardCode.trim() && (!selectedReward || rewards.isFetching)) {
      notify.error("Please enter an available reward code or remove it before booking.");
      return;
    }

    const normalizedServices = selectedServiceList.map((s) => ({
      id: s.id,
      title: s.title,
      priceValue: s.priceValue,
      durationValue: s.durationValue,
    }));

    submissionPending.current = true;
    setIsSubmitting(true);
    try {
      await handleBooking({
        ownerId,
        services: normalizedServices,
        rewardCode,
        staff: activeStaff,
        appointmentDate: activeDate?.fullDate ?? null,
        appointmentTime: activeTime,
        paymentMethod: activeMethod ?? null,
        onSuccess: (rows) => {
          const saved = Array.isArray(rows) ? rows[0] : rows;
          if (saved?.id) setBookedAppointment(saved);
        },
      });
    } catch (error) {
      notify.error(
        error?.message || "Unable to complete your booking. Please try again.",
      );
    } finally {
      submissionPending.current = false;
      setIsSubmitting(false);
    }
  };

  const canContinue =
    selectedServiceList.length > 0 &&
    (step === 1 ||
      Boolean(activeDate && activeTime && !scheduleLoading && !scheduleError));

  return {
    rewardMessage,
    rewardCode,
    setRewardCode,
    bookedAppointment,
    canContinue,
    isSubmitting,
    progress,
    step,
    stepCount,
    goToStep,
    categories,
    selectedCategory,
    handleCategoryChange,
    currencyCode,
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
    isLastStep,
  };
}
