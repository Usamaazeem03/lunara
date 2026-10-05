import { translatedMessage } from "../../../i18n/translatedMessage.jsx";
import { translateConfig } from "../../../i18n/translateConfig.js";
import { useTranslation } from "react-i18next";
import { useBookingServices } from "./useBookingServices.js";
import { useBookingSchedule } from "./useBookingSchedule.js";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../hooks/useAuth.js";
import { getRewards, rewardStatus } from "../../../services/apiRewards.js";
import {
  requestBookingVerification,
  verifyBookingCode,
} from "../../../services/apiBookingVerification.js";
import { formatNumber } from "../../../utils/appointmentUtils.js";
import { useBookingSubmit } from "../../../globalHooks/useBookingSubmit.js";
import { notify } from "../../../Shared/lib/toast.jsx";
import { formatCurrency } from "../../../utils/currency.js";
import { BOOKING_STEPS, PAYMENT_METHODS } from "./bookingConfig.js";

const clampIndex = (list, index) => list[index] ?? list[0];
const normalizeEmail = (email) => email.trim().toLowerCase();
const validEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
const emptyVerificationState = () => ({
  email: "",
  status: "idle",
  verificationId: null,
  expiresAt: null,
  proof: null,
  errorType: null,
});

export function useClientBooking({ onBack }) {
  const { t } = useTranslation();
  const [selectedStep, setStep] = useState(null);
  const [bookedAppointment, setBookedAppointment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submissionPending = useRef(false);
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState(0);
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const customerDetailsRef = useRef(customerDetails);
  customerDetailsRef.current = customerDetails;
  const [verificationState, setVerificationState] = useState(emptyVerificationState);
  const verificationStateRef = useRef(verificationState);
  verificationStateRef.current = verificationState;
  const verificationRequestPending = useRef(false);
  const verificationRequestVersion = useRef(0);
  const initializedCustomerUser = useRef(null);

  const [selectedStaff, setSelectedStaff] = useState(null);
  const selectedPayment = 0;
  const [selectedMethod, setSelectedMethod] = useState(0);

  const [searchParams] = useSearchParams();
  const { ownerId: routeOwnerId } = useParams();
  const [rewardCode, setRewardCode] = useState(searchParams.get("reward") || "");
  let storedOwnerId = null;
  try { storedOwnerId = localStorage.getItem("owner_id"); } catch { /* The URL is the primary salon selection. */ }
  const ownerId = routeOwnerId || searchParams.get("owner_id") || storedOwnerId;
  const { user, profile, loading: authLoading } = useAuth();
  useEffect(() => {
    if (!user?.id || authLoading || initializedCustomerUser.current === user.id) return;
    initializedCustomerUser.current = user.id;
    setCustomerDetails((current) => ({
      name: current.name || profile?.full_name || user.user_metadata?.full_name || "",
      email: current.email || profile?.email || user.email || "",
      phone: current.phone || profile?.phone || user.user_metadata?.phone || "",
    }));
  }, [authLoading, profile, user]);

  const updateVerificationState = useCallback((nextState) => {
    verificationStateRef.current = nextState;
    setVerificationState(nextState);
  }, []);

  const handleCustomerDetailsChange = useCallback((field, value) => {
    if (
      field === "email" &&
      normalizeEmail(customerDetailsRef.current.email) !== normalizeEmail(value)
    ) {
      verificationRequestVersion.current += 1;
      verificationRequestPending.current = false;
      updateVerificationState(emptyVerificationState());
    }
    setCustomerDetails((current) => ({ ...current, [field]: value }));
  }, [updateVerificationState]);
  const rewards = useQuery({
    queryKey: ["client-rewards", ownerId, user?.id],
    queryFn: () => getRewards({ ownerId, clientId: user.id }),
    enabled: Boolean(ownerId && user?.id && rewardCode.trim()),
  });
  const selectedReward = rewards.data?.find((reward) => reward.code === rewardCode.trim().toUpperCase() && rewardStatus(reward) === "Available");
  const rewardMessage = !rewardCode.trim() ? "" : rewards.isFetching ? t("booking.checkingYourReward") : selectedReward ? t("booking.rewardIncludedValidatedAgainWhenYouBook", { value1: selectedReward.percent_off }) : t("booking.thisCodeIsUnavailableForYourAccountAtThisSalon");
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
    hasPreselectedServices,
  } = useBookingServices(ownerId, searchParams.get("services"));
  // The URL chooses the initial step only; Back and subsequent navigation win.
  const step = selectedStep ?? (hasPreselectedServices ? 2 : 1);

  const { handleBooking } = useBookingSubmit("client");
  const {
    availableDates,
    timeSlots,
    loading: scheduleLoading,
    error: scheduleError,
  } = useBookingSchedule(ownerId, selectedDate);

  const stepCount = translateConfig(BOOKING_STEPS).length;
  const isLastStep = step === stepCount;
  const activeStep = translateConfig(BOOKING_STEPS)[step - 1] ?? translateConfig(BOOKING_STEPS)[0];
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
  const totalDurationLabel = t("common.min", { value1: formatNumber(totalDurationValue) });
  const paymentOptions = [
    {
      title: t("booking.payInFullAtTheSalon"),
      description: t("booking.payTheFullAmountAtYourVisitUsingAMethod"),
    },
    {
      title: t("booking.payOnlineFullAmount"),
      description: t("booking.comingSoonOnlinePaymentsAreNotAvailableYet"),
      disabled: true,
    },
    {
      title: t("booking.payAdvance50"),
      description: t("booking.comingSoonNoDepositOrAdvancePaymentIsRequired"),
      disabled: true,
    },
  ];
  const activePayment = clampIndex(paymentOptions, selectedPayment);

  const requestVerification = useCallback(async ({ force = false } = {}) => {
    const email = customerDetailsRef.current.email.trim();
    const normalizedEmail = normalizeEmail(email);
    const current = verificationStateRef.current;
    if (
      !force &&
      current.email === normalizedEmail &&
      ["requesting", "ready", "verifying", "booking", "booking_error"].includes(current.status)
    ) return;
    if (verificationRequestPending.current) return;

    const requestVersion = ++verificationRequestVersion.current;
    verificationRequestPending.current = true;
    updateVerificationState({
      ...emptyVerificationState(),
      email: normalizedEmail,
      status: "requesting",
      resendAvailableAt: Date.now() + 60_000,
    });
    try {
      const result = await requestBookingVerification({ ownerId, email });
      if (
        requestVersion !== verificationRequestVersion.current ||
        normalizeEmail(customerDetailsRef.current.email) !== normalizedEmail
      ) return;
      updateVerificationState({
        email: normalizedEmail,
        status: "ready",
        verificationId: result.verificationId,
        expiresAt: result.expiresAt,
        proof: null,
        errorType: null,
        resendAvailableAt: Date.now() + 60_000,
      });
    } catch (error) {
      if (
        requestVersion !== verificationRequestVersion.current ||
        normalizeEmail(customerDetailsRef.current.email) !== normalizedEmail
      ) return;
      updateVerificationState({
        ...emptyVerificationState(),
        email: normalizedEmail,
        status: "request_error",
        errorType: error?.code === "DELIVERY_FAILED"
          ? "delivery_failed"
          : ["FunctionsFetchError", "FunctionsRelayError"].includes(error?.name)
            ? "network_failed"
            : "request_failed",
        resendAvailableAt: Date.now() + 60_000,
      });
    } finally {
      if (requestVersion === verificationRequestVersion.current) {
        verificationRequestPending.current = false;
      }
    }
  }, [ownerId, updateVerificationState]);

  const submitBookingWithProof = useCallback(async (proof) => {
    if (submissionPending.current || bookedAppointment) return false;
    if (!ownerId || !activeDate || !activeTime) {
      notify.error(
        translatedMessage("booking.pleaseSelectASalonDateAndAvailableTimeBeforeBooking"),
      );
      return false;
    }
    if (rewardCode.trim() && (!selectedReward || rewards.isFetching)) {
      notify.error(translatedMessage("booking.pleaseEnterAnAvailableRewardCodeOrRemoveItBefore"));
      return false;
    }

    const normalizedServices = selectedServiceList.map((service) => ({
      id: service.id,
      title: service.title,
      priceValue: service.priceValue,
      durationValue: service.durationValue,
    }));

    submissionPending.current = true;
    setIsSubmitting(true);
    try {
      const result = await handleBooking({
        ownerId,
        services: normalizedServices,
        rewardCode,
        staff: activeStaff,
        appointmentDate: activeDate.fullDate,
        appointmentTime: activeTime,
        paymentMethod: activeMethod ?? null,
        clientName: customerDetailsRef.current.name.trim(),
        clientEmail: customerDetailsRef.current.email.trim(),
        clientPhone: customerDetailsRef.current.phone.trim() || null,
        verification: proof,
        onSuccess: (rows) => {
          const saved = Array.isArray(rows) ? rows[0] : rows;
          if (saved?.id) setBookedAppointment(saved);
        },
      });
      return Boolean(result);
    } catch (error) {
      notify.error(
        error?.message || translatedMessage("booking.unableToCompleteYourBookingPleaseTryAgain"),
      );
      return false;
    } finally {
      submissionPending.current = false;
      setIsSubmitting(false);
    }
  }, [
    activeDate,
    activeMethod,
    activeStaff,
    activeTime,
    bookedAppointment,
    handleBooking,
    ownerId,
    rewardCode,
    rewards.isFetching,
    selectedReward,
    selectedServiceList,
  ]);

  const handleVerifyCode = useCallback(async (code) => {
    const current = verificationStateRef.current;
    if (current.status !== "ready" || !current.verificationId) return;
    updateVerificationState({ ...current, status: "verifying", errorType: null });
    try {
      const proof = await verifyBookingCode({
        verificationId: current.verificationId,
        code,
      });
      if (normalizeEmail(customerDetailsRef.current.email) !== current.email) return;
      updateVerificationState({ ...current, status: "booking", proof, errorType: null });
      const booked = await submitBookingWithProof(proof);
      if (!booked) {
        updateVerificationState({
          ...verificationStateRef.current,
          status: "booking_error",
          proof,
          errorType: "booking_failed",
        });
      } else {
        updateVerificationState({
          ...verificationStateRef.current,
          status: "complete",
          proof,
          errorType: null,
        });
      }
    } catch (error) {
      const errorType = ["VERIFICATION_MISMATCH", "INVALID_CODE"].includes(error?.code)
        ? "wrong_code"
        : error?.code === "EXPIRED_CODE" || error?.code === "INVALID_VERIFICATION"
          ? "expired"
          : error?.code === "TOO_MANY_ATTEMPTS"
            ? "attempts_exhausted"
            : ["FunctionsFetchError", "FunctionsRelayError"].includes(error?.name)
              ? "network_failed"
              : "wrong_code";
      updateVerificationState({
        ...verificationStateRef.current,
        status: errorType === "expired"
          ? "expired"
          : errorType === "attempts_exhausted"
            ? "attempts_exhausted"
            : "ready",
        errorType,
      });
    }
  }, [submitBookingWithProof, updateVerificationState]);

  const retryBooking = useCallback(async () => {
    const proof = verificationStateRef.current.proof;
    if (!proof) return;
    updateVerificationState({ ...verificationStateRef.current, status: "booking" });
    const booked = await submitBookingWithProof(proof);
    updateVerificationState({
      ...verificationStateRef.current,
      status: booked ? "complete" : "booking_error",
      errorType: booked ? null : "booking_failed",
      proof,
    });
  }, [submitBookingWithProof, updateVerificationState]);

  const progress = Math.round((step / stepCount) * 100);

  const goToStep = (nextStep) => {
    if (nextStep > step + 1) return;
    if (nextStep > 1 && selectedServiceList.length === 0) {
      notify.error(translatedMessage("booking.pleaseSelectAtLeastOneServiceToContinue"));
      return;
    }

    if (
      nextStep > 2 &&
      (!activeDate || !activeTime || scheduleLoading || scheduleError)
    ) {
      notify.error(translatedMessage("booking.chooseAnAvailableDateAndTimeFirst"));
      return;
    }
    if (
      nextStep >= 5 &&
      (!customerDetails.name.trim() || !validEmail(customerDetails.email))
    ) {
      notify.error(
        translatedMessage(
          customerDetails.name.trim()
            ? "common.enterAValidEmailAddress"
            : "common.fullNameIsRequired",
        ),
      );
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
      notify.error(translatedMessage("booking.pleaseSelectAtLeastOneServiceToContinue"));
      return;
    }

    if (step === 4) {
      if (!customerDetails.name.trim()) {
        notify.error(translatedMessage("common.fullNameIsRequired"));
        return;
      }
      if (!validEmail(customerDetails.email)) {
        notify.error(translatedMessage("common.enterAValidEmailAddress"));
        return;
      }
      goToStep(5);
      return;
    }

    if (!isLastStep) {
      goToStep(step + 1);
      return;
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
    customerDetails,
    handleCustomerDetailsChange,
    verificationState,
    requestVerification,
    handleVerifyCode,
    retryBooking,
    activePayment,
    activeMethod,
    handleBack,
    handleNext,
    isLastStep,
  };
}
