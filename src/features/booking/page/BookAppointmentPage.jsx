import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import calendarIcon from "../../../Shared/assets/icons/calendar.svg";
import clockIcon from "../../../Shared/assets/icons/clock.svg";
import DashboardHeader from "../../../Shared/layouts/DashboardHeader";
import InfoCard from "../../../Shared/ui/InfoCard";
import Button from "../../../Shared/Button";
import BookingStepViews from "../BookingStepViews";
import SummaryPanal from "../../../Dashboard/Client/SummaryPanal";
import Checklist from "../../../components/Checklist";
import Note from "../../../components/Note";
import { supabase } from "../../../Shared/lib/supabaseClient";
import {
  getCategoryLabel,
  getServiceIcon,
} from "../../../Shared/lib/serviceCategories";
import { formatNumber } from "../../../Shared/utils/appointmentUtils";
import { useBookingSubmit } from "../../../Shared/hook/useBookingSubmit";
import { notify } from "../../../Shared/lib/toast.jsx";

const BOOKING_STEPS = [
  {
    label: "Select Service",
    title: "Select Services",
    subtitle: "Choose one or more services",
  },
  {
    label: "Date & Time",
    title: "Select Date & Time",
    subtitle: "Choose a date and a time slot",
  },
  {
    label: "Staff Member",
    title: "Select Staff Member",
    subtitle: "Pick a preferred stylist or choose no preference",
  },
  {
    label: "Confirmed",
    title: "Confirm Your Booking",
    subtitle: "Please review your appointment details",
  },
  {
    label: "Payment",
    title: "Payment Options",
    subtitle: "Select how you would like to pay",
  },
];

const CURRENCY_CODE = "GBP";

const DATE_OPTIONS = [
  { day: "Sunday", date: "Feb 08" },
  { day: "Monday", date: "Feb 09" },
  { day: "Tuesday", date: "Feb 10" },
  { day: "Wednesday", date: "Feb 11" },
  { day: "Thursday", date: "Feb 12" },
  { day: "Friday", date: "Feb 13" },
  { day: "Saturday", date: "Feb 14" },
];

const TIME_SLOTS = [
  "09:00 AM",
  "10:30 AM",
  "12:00 PM",
  "01:30 PM",
  "03:00 PM",
  "04:30 PM",
  "06:00 PM",
  "07:30 PM",
];

const PAYMENT_OPTIONS = [
  {
    title: "Pay at Salon",
    description: "Pay when you arrive for your appointment",
  },
  {
    title: "Pay Online - Full Amount",
    description: "Secure online payment for GBP 45",
  },
  {
    title: "Pay Advance - 50%",
    description: "Pay GBP 23 now, rest at salon",
  },
];

const PAYMENT_METHODS = ["Card", "UPI", "Wallet"];

const numberFromText = (value = "") => {
  const match = value.match(/[\d.]+/);
  return match ? Number(match[0]) : 0;
};

// const formatNumber = (value) =>
//   Number.isInteger(value) ? value.toString() : value.toFixed(2);

const clampIndex = (list, index) => list[index] ?? list[0];

// Helper to get initials from name
// const getInitials = (name) => {
//   if (!name) return "??";
//   return name
//     .split(" ")
//     .map((n) => n[0])
//     .join("")
//     .toUpperCase()
//     .slice(0, 2);
// };

function BookAppointmentPage({ onBack }) {
  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState([0]);
  const [serviceQuery, setServiceQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState(1);
  // const [selectedStaff, setSelectedStaff] = useState(0);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(1);
  const [selectedMethod, setSelectedMethod] = useState(0);
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState("");

  // ownerId
  // const [searchParams] = useSearchParams();
  // const ownerId = searchParams.get("owner_id");
  const [searchParams] = useSearchParams();
  const ownerId =
    searchParams.get("owner_id") || localStorage.getItem("owner_id");

  // //////
  const { handleBooking } = useBookingSubmit("client");
  const [selectedFullDate, setSelectedFullDate] = useState(null);
  const [selectedTimeString, setSelectedTimeString] = useState(null);

  useEffect(() => {
    if (servicesError) notify.error(servicesError);
  }, [servicesError]);

  const stepCount = BOOKING_STEPS.length;
  const isLastStep = step === stepCount;
  const activeStep = BOOKING_STEPS[step - 1] ?? BOOKING_STEPS[0];
  const activeDate = selectedFullDate ?? DATE_OPTIONS[0];
  const activeTime = selectedTimeString ?? TIME_SLOTS[1];
  // const activeDate = clampIndex(DATE_OPTIONS, selectedDate);
  // const activeTime = clampIndex(TIME_SLOTS, selectedTime);

  // const activeStaff = clampIndex(dynamicStaff, selectedStaff);
  const activeStaff = selectedStaff;
  const activePayment = clampIndex(PAYMENT_OPTIONS, selectedPayment);
  const activeMethod = clampIndex(PAYMENT_METHODS, selectedMethod);

  const selectedServiceList = selectedServices
    .map((index) => services[index])
    .filter(Boolean);
  const primaryService = selectedServiceList[0] ?? services[0];
  const extraServicesCount = Math.max(selectedServiceList.length - 1, 0);
  const serviceSummaryTitle = servicesLoading
    ? "Loading services..."
    : primaryService
      ? extraServicesCount
        ? `${primaryService.title} + ${extraServicesCount} more`
        : primaryService.title
      : "No services yet";
  const serviceSummaryDescription = servicesLoading
    ? "Fetching the latest catalog"
    : primaryService
      ? extraServicesCount
        ? `${selectedServiceList.length} services selected`
        : primaryService.description
      : "Add services in the owner dashboard.";

  const normalizedQuery = serviceQuery.trim().toLowerCase();
  const filteredServices = services
    .map((service, index) => ({
      service,
      index,
    }))
    .filter(({ service }) =>
      service.title.toLowerCase().includes(normalizedQuery),
    );

  const totalPriceValue = selectedServiceList.reduce(
    (sum, service) => sum + numberFromText(service.price),
    0,
  );
  const totalDurationValue = selectedServiceList.reduce(
    (sum, service) => sum + numberFromText(service.duration),
    0,
  );
  const currency = primaryService?.price?.split(" ")[0] ?? "";
  const totalPriceLabel = currency
    ? `${currency} ${formatNumber(totalPriceValue)}`
    : formatNumber(totalPriceValue);
  const totalDurationLabel = `${formatNumber(totalDurationValue)} min`;

  const progress = Math.round((step / stepCount) * 100);

  const toggleService = (index) => {
    setSelectedServices((prev) => {
      if (prev.includes(index)) {
        return prev.length === 1 ? prev : prev.filter((item) => item !== index);
      }
      return [...prev, index];
    });
  };

  const goToStep = (nextStep) => {
    setStep(Math.max(1, Math.min(stepCount, nextStep)));
  };
  // /////
  const handleDateSelect = (dateObj) => {
    if (dateObj?.selectedTime) {
      // Time update hua
      setSelectedTimeString(dateObj.selectedTime);
      setSelectedFullDate((prev) => ({ ...prev, ...dateObj }));
    } else {
      // Date update hui
      setSelectedFullDate(dateObj);
    }
  };

  const handleBack = () => {
    if (step === 1) {
      onBack?.();
      return;
    }
    goToStep(step - 1);
  };

  /////////////////////////////////////////////////////////////

  const handleNext = () => {
    if (!isLastStep) {
      goToStep(step + 1);
      return;
    }

    const normalizedServices = selectedServiceList.map((s) => ({
      id: s.id,
      title: s.title,
      priceValue: numberFromText(s.price),
      durationValue: numberFromText(s.duration),
    }));

    handleBooking({
      ownerId,
      services: normalizedServices,
      staff: activeStaff,
      appointmentDate: selectedFullDate?.fullDate ?? null,
      appointmentTime:
        selectedTimeString ?? selectedFullDate?.selectedTime ?? null,
      paymentOption: activePayment?.title ?? null,
      paymentMethod: activeMethod ?? null,
    });
  };

  // Fetch services from Supabase
  useEffect(() => {
    let isMounted = true;

    const loadServices = async () => {
      if (!ownerId) {
        notify.error(
          "Owner ID is missing. Please open this page from a salon booking link.",
        );
        return;
      }

      setServicesLoading(true);
      setServicesError("");

      const { data, error } = await supabase
        .from("services")
        .select(
          "id, name, description, category, price, duration_minutes, is_active, owner_id",
        )
        .eq("owner_id", ownerId) // ✅ FILTER
        .order("name", { ascending: true });

      if (!isMounted) return;

      if (error) {
        setServicesError(error.message || "Unable to load services.");
        setServices([]);
        setServicesLoading(false);
        return;
      }

      const activeServices = (data ?? []).filter(
        (service) => service.is_active !== false,
      );

      const mappedServices = activeServices.map((service) => {
        const priceValue = Number(service.price);
        const durationValue = Number(service.duration_minutes);
        const categoryLabel = getCategoryLabel(service.category);

        return {
          id: service.id,
          title: service.name ?? "Untitled Service",
          description: service.description ?? "",
          duration: Number.isFinite(durationValue)
            ? `${durationValue} min`
            : "",
          price: Number.isFinite(priceValue)
            ? `${CURRENCY_CODE} ${priceValue}`
            : "",
          iconName: getServiceIcon(categoryLabel),
          category: categoryLabel,
        };
      });

      setServices(mappedServices);
      setServicesLoading(false);
    };

    loadServices();

    return () => {
      isMounted = false;
    };
  }, [ownerId]);

  // Fetch staff from Supabase - mirrors services fetch pattern
  // useEffect(() => {
  //   let isMounted = true;

  //   const loadStaff = async () => {
  //     if (!ownerId) {
  //       console.error("Owner ID missing in URL");
  //       return;
  //     }

  //     setStaffLoading(true);
  //     setStaffError("");

  //     const { data, error } = await supabase
  //       .from("staff")
  //       .select(
  //         "id, name, role, rating, appointments_count, is_on_shift, owner_id, ",
  //       )
  //       .eq("owner_id", ownerId) // ✅ FILTER
  //       .order("name", { ascending: true });

  //     if (!isMounted) return;

  //     if (error) {
  //       setStaffError(error.message || "Unable to load staff.");
  //       setStaffMembers([]);
  //       setStaffLoading(false);
  //       return;
  //     }

  //     const mappedStaff = (data ?? []).map((staff) => ({
  //       id: staff.id,
  //       name: staff.name,
  //       role: staff.role,
  //       rating: staff.rating ? staff.rating.toFixed(1) : "N/A",
  //       bookings: `${staff.appointments_count || 0} bookings`,
  //       initials: getInitials(staff.name),
  //       isOnShift: staff.is_on_shift,
  //     }));

  //     const staffWithNoPreference = [
  //       ...mappedStaff,
  //       {
  //         id: "no-preference",
  //         name: "No Preference",
  //         role: "Any available stylist",
  //         rating: "Top rated",
  //         bookings: "Fastest booking",
  //         initials: "NP",
  //       },
  //     ];

  //     setStaffMembers(staffWithNoPreference);
  //     setStaffLoading(false);
  //   };

  //   loadStaff();

  //   return () => {
  //     isMounted = false;
  //   };
  // }, [ownerId]);

  useEffect(() => {
    setSelectedServices((prev) => {
      if (services.length === 0) {
        return [];
      }
      const safeSelection = prev.filter((index) => index < services.length);
      return safeSelection.length ? safeSelection : [0];
    });
  }, [services]);

  const emptyServicesMessage = servicesLoading
    ? "Loading services..."
    : servicesError
      ? "Unable to load services. Please try again."
      : services.length === 0
        ? "No services available yet. Add services in the owner dashboard."
        : "No services found. Try a different search.";

  return (
    <section className="flex flex-col lg:h-full">
      <DashboardHeader
        eyebrow="Book an Appointment"
        title="Book an Appointment"
        description="Schedule your next visit in a few simple steps"
      />

      <InfoCard
        label="Booking Progress"
        title={`Step ${step} of ${stepCount} - ${activeStep.title}`}
        rightContent={
          <div className="w-full sm:w-52">
            <div className="h-2 w-full overflow-hidden border-2 border-[#2d2620] bg-white/60">
              <div
                className="h-full bg-[#2d2620]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-[0.65rem] tracking-widest text-[#5f544b] uppercase">
              {progress}% complete
            </p>
          </div>
        }
      />

      <div className="border-ink/20 mt-4 hidden w-full gap-2 border-2 text-[0.65rem] tracking-widest uppercase sm:grid sm:grid-cols-2 sm:gap-0 sm:text-xs lg:grid-cols-5">
        {BOOKING_STEPS.map(({ label }, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === step;
          const isCompleted = stepNumber < step;
          const isLast = stepNumber === stepCount;
          return (
            <Button
              key={label}
              type="button"
              onClick={() => goToStep(stepNumber)}
              className={`border-ink/20 flex min-w-[9.5rem] shrink-0 items-center justify-center gap-2 border-2 px-3 py-2 text-center whitespace-nowrap transition-colors duration-150 sm:min-w-0 sm:shrink sm:border-transparent ${
                isActive
                  ? "border-ink sm:border-ink relative z-10 rounded bg-[#f3efe9]"
                  : "bg-white"
              } ${
                !isLast && !isActive
                  ? "border-b-ink/20 sm:border-r-ink/20 border-b-2 sm:border-r-2 sm:border-b-0"
                  : ""
              }`}
              variant="custom"
              unstyled
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full border-2 text-[0.65rem] ${
                  isActive || isCompleted
                    ? "border-[#2d2620] bg-[#2d2620] text-[#f3efe9]"
                    : "border-[#2d2620]/40 bg-white text-[#2d2620]/60"
                }`}
              >
                {stepNumber}
              </span>
              {label}
            </Button>
          );
        })}
      </div>

      <div className="mt-4 grid gap-3 lg:min-h-0 lg:flex-1 lg:grid-cols-[1.6fr_1fr]">
        <BookingStepViews
          // send ownerId
          ownerId={ownerId}
          //
          onDateSelect={handleDateSelect}
          activeMeta={activeStep}
          step={step}
          serviceQuery={serviceQuery}
          setServiceQuery={setServiceQuery}
          calendarIcon={calendarIcon}
          activeDate={activeDate}
          clockIcon={clockIcon}
          activeTime={activeTime}
          filteredServices={filteredServices}
          selectedServices={selectedServices}
          toggleService={toggleService}
          servicesStatusMessage={emptyServicesMessage}
          dateOptions={DATE_OPTIONS}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          timeSlots={TIME_SLOTS}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          // Pass dynamic staff instead of static STAFF_MEMBERS
          // staffMembers={dynamicStaff}
          selectedStaff={selectedStaff}
          setSelectedStaff={setSelectedStaff}
          // staffLoading={staffLoading}
          // staffError={staffError}
          totalDurationLabel={totalDurationLabel}
          activeStaff={activeStaff}
          selectedServiceList={selectedServiceList}
          totalPriceLabel={totalPriceLabel}
          paymentOptions={PAYMENT_OPTIONS}
          selectedPayment={selectedPayment}
          setSelectedPayment={setSelectedPayment}
          paymentMethods={PAYMENT_METHODS}
          selectedMethod={selectedMethod}
          setSelectedMethod={setSelectedMethod}
          activePayment={activePayment}
          activeMethod={activeMethod}
          handleBack={handleBack}
          handleNext={handleNext}
          isLastStep={isLastStep}
        />

        <aside className="flex flex-col gap-3">
          <SummaryPanal
            serviceSummaryTitle={serviceSummaryTitle}
            serviceSummaryDescription={serviceSummaryDescription}
            activeTime={activeTime}
            activeDate={activeDate}
            activeStaff={activeStaff}
            activePayment={activePayment}
            totalPriceLabel={totalPriceLabel}
          />
          <Checklist />
          <Note />
        </aside>
      </div>
    </section>
  );
}

export default BookAppointmentPage;
