import { useState } from "react";

import calendarIcon from "../../../assets/icons/calendar.svg";
import clockIcon from "../../../assets/icons/clock.svg";
import hairCareIcon from "../../../assets/icons/hair-care.svg";
import skinCareIcon from "../../../assets/icons/skin-care.svg";
import bodyRelaxIcon from "../../../assets/icons/body-relax.svg";
import DashboardHeader from "../../Shared/DashboardHeader";
import InfoCard from "../InfoCard";
import Button from "../../Shared/Button";
import StepServices from "../../../components/StepServices";
import StepDateTime from "../../../components/StepDateTime";
import StepStaff from "../../../components/StepStaff";
import StepConfirm from "./StepConfirm";
import StepPayment from "../../../components/StepPayment";
import BookingStepViews from "../../../components/BookingStepViews";
import SummaryPanal from "../SummaryPanal";
import Checklist from "../../../components/Checklist";
import Note from "../../../components/Note";

const BookAppointmentPage = ({ onBack }) => {
  const steps = [
    "Select Service",
    "Date & Time",
    "Staff Member",
    "Confirmed",
    "Payment",
  ];
  const stepContent = [
    {
      title: "Select Services",
      subtitle: "Choose one or more services",
    },
    {
      title: "Select Date & Time",
      subtitle: "Choose a date and a time slot",
    },
    {
      title: "Select Staff Member",
      subtitle: "Pick a preferred stylist or choose no preference",
    },
    {
      title: "Confirm Your Booking",
      subtitle: "Please review your appointment details",
    },
    {
      title: "Payment Options",
      subtitle: "Select how you would like to pay",
    },
  ];

  const services = [
    {
      title: "Classic Haircut",
      description: "Signature finish with a styling consult.",
      duration: "40 min",
      price: "GBP 45",
      icon: hairCareIcon,
    },
    {
      title: "Glow Facial",
      description: "Deep cleansing glow treatment.",
      duration: "50 min",
      price: "GBP 75",
      icon: skinCareIcon,
    },
    {
      title: "Glow Facial",
      description: "Deep cleansing glow treatment.",
      duration: "50 min",
      price: "GBP 75",
      icon: skinCareIcon,
    },
    {
      title: "Glow Facial",
      description: "Deep cleansing glow treatment.",
      duration: "50 min",
      price: "GBP 75",
      icon: skinCareIcon,
    },
    {
      title: "Glow Facial",
      description: "Deep cleansing glow treatment.",
      duration: "50 min",
      price: "GBP 75",
      icon: skinCareIcon,
    },
    {
      title: "Glow Facial",
      description: "Deep cleansing glow treatment.",
      duration: "50 min",
      price: "GBP 75",
      icon: skinCareIcon,
    },
    {
      title: "Glow Facial",
      description: "Deep cleansing glow treatment.",
      duration: "50 min",
      price: "GBP 75",
      icon: skinCareIcon,
    },
    {
      title: "Glow Facial",
      description: "Deep cleansing glow treatment.",
      duration: "50 min",
      price: "GBP 75",
      icon: skinCareIcon,
    },
    {
      title: "Relax Massage",
      description: "Full body tension relief.",
      duration: "60 min",
      price: "GBP 85",
      icon: bodyRelaxIcon,
    },
  ];

  const dateOptions = [
    { day: "Sunday", date: "Feb 08" },
    { day: "Monday", date: "Feb 09" },
    { day: "Tuesday", date: "Feb 10" },
    { day: "Wednesday", date: "Feb 11" },
    { day: "Thursday", date: "Feb 12" },
    { day: "Friday", date: "Feb 13" },
    { day: "Saturday", date: "Feb 14" },
  ];

  const timeSlots = [
    "09:00 AM",
    "10:30 AM",
    "12:00 PM",
    "01:30 PM",
    "03:00 PM",
    "04:30 PM",
    "06:00 PM",
    "07:30 PM",
  ];

  const staffMembers = [
    {
      name: "Mark Martinez",
      role: "Master Barber",
      rating: "4.9",
      bookings: "289 bookings",
      initials: "MM",
    },
    {
      name: "Ava Lee",
      role: "Skin Specialist",
      rating: "4.8",
      bookings: "214 bookings",
      initials: "AL",
    },
    {
      name: "No Preference",
      role: "Any available stylist",
      rating: "Top rated",
      bookings: "Fastest booking",
      initials: "NP",
    },
  ];

  const paymentOptions = [
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

  const paymentMethods = ["Card", "UPI", "Wallet"];

  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState([0]);
  const [serviceQuery, setServiceQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState(1);
  const [selectedStaff, setSelectedStaff] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState(1);
  const [selectedMethod, setSelectedMethod] = useState(0);

  const isLastStep = step === steps.length;
  const activeMeta = stepContent[step - 1];
  const selectedServiceList = selectedServices
    .filter((index) => index >= 0 && index < services.length)
    .map((index) => services[index]);
  const primaryService = selectedServiceList[0] || services[0];
  const extraServicesCount = Math.max(selectedServiceList.length - 1, 0);
  const serviceSummaryTitle =
    extraServicesCount > 0
      ? `${primaryService.title} + ${extraServicesCount} more`
      : primaryService.title;
  const serviceSummaryDescription =
    extraServicesCount > 0
      ? `${selectedServiceList.length} services selected`
      : primaryService.description;
  const activeDate = dateOptions[selectedDate];
  const activeTime = timeSlots[selectedTime];
  const activeStaff = staffMembers[selectedStaff];
  const activePayment = paymentOptions[selectedPayment];
  const activeMethod = paymentMethods[selectedMethod];
  const progress = Math.round((step / steps.length) * 100);
  const filteredServices = services
    .map((service, index) => ({ service, index }))
    .filter(({ service }) =>
      service.title.toLowerCase().includes(serviceQuery.toLowerCase().trim()),
    );
  const parseNumber = (value) => {
    const match = value.match(/[\d.]+/);
    return match ? Number(match[0]) : 0;
  };
  const formatNumber = (value) =>
    Number.isInteger(value) ? value.toString() : value.toFixed(2);
  const totalPriceValue = selectedServiceList.reduce(
    (sum, service) => sum + parseNumber(service.price),
    0,
  );
  const totalDurationValue = selectedServiceList.reduce(
    (sum, service) => sum + parseNumber(service.duration),
    0,
  );
  const currency = primaryService?.price?.split(" ")[0] ?? "";
  const totalPriceLabel = currency
    ? `${currency} ${formatNumber(totalPriceValue)}`
    : formatNumber(totalPriceValue);
  const totalDurationLabel = `${formatNumber(totalDurationValue)} min`;

  const toggleService = (index) => {
    setSelectedServices((prev) => {
      if (prev.includes(index)) {
        if (prev.length === 1) {
          return prev;
        }
        return prev.filter((item) => item !== index);
      }
      return [...prev, index];
    });
  };

  const handleBack = () => {
    if (step === 1) {
      onBack();
      return;
    }
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    if (step >= steps.length) {
      return;
    }
    setStep((prev) => Math.min(steps.length, prev + 1));
  };

  return (
    <section className="flex h-full flex-col">
      <DashboardHeader
        eyebrow={"Book an Appointment"}
        title={"Book an Appointment"}
        description={`Schedule your next visit in a few simple steps`}
      />

      <InfoCard
        label="Booking Progress"
        title={`Step ${step} of ${steps.length} - ${activeMeta.title}`}
        rightContent={
          <div className="w-full sm:w-52">
            <div className="h-2 w-full overflow-hidden border-2 border-[#2d2620] bg-white/60">
              <div
                className="h-full bg-[#2d2620]"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="mt-2 text-[0.65rem] uppercase tracking-widest text-[#5f544b]">
              {progress}% complete
            </p>
          </div>
        }
      />
      {/* top buttona */}
      <div className="mt-4 grid w-full grid-cols-1 overflow-hidden border-2 border-ink/20 text-xs uppercase tracking-widest sm:grid-cols-2 lg:grid-cols-5">
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === step;
          const isCompleted = stepNumber < step;
          const isLast = index === steps.length - 1;
          return (
            <Button
              key={label}
              type="button"
              onClick={() => setStep(stepNumber)}
              className={`flex w-full items-center justify-center gap-2 border-2 border-transparent px-3 py-2 text-center transition-colors duration-150 ${
                isActive
                  ? "bg-[#f3efe9] border-ink rounded relative z-10"
                  : "bg-white"
              } ${
                !isLast && !isActive
                  ? "border-b-2 border-b-ink/20 sm:border-b-0 sm:border-r-2 sm:border-r-ink/20"
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

      <div className="mt-4 grid min-h-0 flex-1 gap-3 lg:grid-cols-[1.6fr_1fr]">
        {/* all service s */}
        <BookingStepViews
          activeMeta={activeMeta}
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
          dateOptions={dateOptions}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          timeSlots={timeSlots}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          staffMembers={staffMembers}
          selectedStaff={selectedStaff}
          setSelectedStaff={setSelectedStaff}
          totalDurationLabel={totalDurationLabel}
          activeStaff={activeStaff}
          selectedServiceList={selectedServiceList}
          totalPriceLabel={totalPriceLabel}
          paymentOptions={paymentOptions}
          selectedPayment={selectedPayment}
          setSelectedPayment={setSelectedPayment}
          paymentMethods={paymentMethods}
          selectedMethod={selectedMethod}
          setSelectedMethod={setSelectedMethod}
          activePayment={activePayment}
          activeMethod={activeMethod}
          handleBack={handleBack}
          handleNext={handleNext}
          isLastStep={isLastStep}
        />
        {/* <div className="relative flex min-h-0 flex-1 flex-col border-2 border-[#2d2620] bg-white/90 p-4 sm:p-5">
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
                  <img
                    src={calendarIcon}
                    alt=""
                    className="h-4 w-4 opacity-70"
                  />
                  {activeDate.day} {activeDate.date}
                </span>
                <span className="flex items-center gap-2 border-2 border-[#2d2620] bg-[#f3efe9] px-3 py-2">
                  <img src={clockIcon} alt="" className="h-4 w-4 opacity-70" />
                  {activeTime}
                </span>
              </div>
            )}
          </div>

          <div className="scrollbar-wow mt-5 flex min-h-0 flex-1 flex-col max-h-[50vh] min-h-[50vh] overflow-y-auto pr-3 md:min-h-0">
            {
              step === 1 && (
                <StepServices
                  filteredServices={filteredServices}
                  selectedServices={selectedServices}
                  toggleService={toggleService}
                />
              )
              // <div className="grid gap-3 lg:grid-cols-3">
              //   {filteredServices.map(({ service, index }) => {
              //     const isSelected = selectedServices.includes(index);
              //     return (
              //       <button
              //         key={`${service.title}-${index}`}
              //         type="button"
              //         onClick={() => toggleService(index)}
              //         className={`flex h-full flex-col gap-4 border-2 p-4 text-left transition ${
              //           isSelected
              //             ? "border-[#2d2620] bg-[#f3efe9]"
              //             : "border-[#2d2620]/30 bg-white"
              //         }`}
              //       >
              //         <div className="flex items-center justify-between">
              //           <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#2d2620]/30 bg-white">
              //             <img
              //               src={service.icon}
              //               alt=""
              //               className="h-5 w-5 opacity-70"
              //             />
              //           </span>
              //           {isSelected && (
              //             <span className="text-xs uppercase tracking-widest text-[#2d2620]">
              //               Selected
              //             </span>
              //           )}
              //         </div>
              //         <div>
              //           <p className="text-sm font-semibold">{service.title}</p>
              //           <p className="mt-1 text-xs text-[#5f544b]">
              //             {service.description}
              //           </p>
              //         </div>
              //         <div className="flex items-center justify-between text-xs uppercase tracking-widest">
              //           <span>{service.price}</span>
              //           <span>{service.duration}</span>
              //         </div>
              //       </button>
              //     );
              //   })}
              //   {filteredServices.length === 0 && (
              //     <div className="col-span-full border-2 border-dashed border-[#2d2620]/30 bg-[#f7f2ec] p-6 text-center text-sm text-[#5f544b]">
              //       No services found. Try a different search.
              //     </div>
              //   )}
              // </div>
            }

            {
              step === 2 && (
                <StepDateTime
                  dateOptions={dateOptions}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  timeSlots={timeSlots}
                  selectedTime={selectedTime}
                  setSelectedTime={setSelectedTime}
                />
              )
              // <div className="flex flex-col gap-5">
              //   <div>
              //     <p className="text-xs uppercase tracking-widest text-[#5f544b]">
              //       Choose Date
              //     </p>
              //     <div className="mt-3 grid gap-2 sm:grid-cols-3 lg:grid-cols-7">
              //       {dateOptions.map((option, index) => {
              //         const isSelected = index === selectedDate;
              //         return (
              //           <button
              //             key={`${option.day}-${option.date}`}
              //             type="button"
              //             onClick={() => setSelectedDate(index)}
              //             className={`border-2 px-3 py-3 text-center text-xs uppercase tracking-widest transition ${
              //               isSelected
              //                 ? "border-[#2d2620] bg-[#f3efe9]"
              //                 : "border-[#2d2620]/30 bg-white"
              //             }`}
              //           >
              //             <div className="text-sm font-semibold">
              //               {option.day}
              //             </div>
              //             <div className="text-[0.65rem] text-[#5f544b]">
              //               {option.date}
              //             </div>
              //           </button>
              //         );
              //       })}
              //     </div>
              //   </div>

              //   <div>
              //     <p className="text-xs uppercase tracking-widest text-[#5f544b]">
              //       Choose Time
              //     </p>
              //     <div className="mt-3 grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
              //       {timeSlots.map((slot, index) => {
              //         const isSelected = index === selectedTime;
              //         return (
              //           <button
              //             key={slot}
              //             type="button"
              //             onClick={() => setSelectedTime(index)}
              //             className={`border-2 px-3 py-2 text-xs uppercase tracking-widest transition ${
              //               isSelected
              //                 ? "border-[#2d2620] bg-[#f3efe9]"
              //                 : "border-[#2d2620]/30 bg-white"
              //             }`}
              //           >
              //             {slot}
              //           </button>
              //         );
              //       })}
              //     </div>
              //   </div>
              // </div>
            }

            {
              step === 3 && (
                <StepStaff
                  staffMembers={staffMembers}
                  selectedStaff={selectedStaff}
                  setSelectedStaff={setSelectedStaff}
                />
              )
              // <div className="grid gap-3 lg:grid-cols-3">
              //   {staffMembers.map((member, index) => {
              //     const isSelected = index === selectedStaff;
              //     return (
              //       <button
              //         key={member.name}
              //         type="button"
              //         onClick={() => setSelectedStaff(index)}
              //         className={`flex h-full items-center gap-4 border-2 p-4 text-left transition ${
              //           isSelected
              //             ? "border-[#2d2620] bg-[#f3efe9]"
              //             : "border-[#2d2620]/30 bg-white"
              //         }`}
              //       >
              //         <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#2d2620]/30 bg-white text-xs font-semibold uppercase text-[#2d2620]">
              //           {member.initials}
              //         </div>
              //         <div>
              //           <p className="text-sm font-semibold">{member.name}</p>
              //           <p className="text-xs text-[#5f544b]">{member.role}</p>
              //           <p className="mt-1 text-xs text-[#5f544b]">
              //             {member.rating} rating - {member.bookings}
              //           </p>
              //         </div>
              //       </button>
              //     );
              //   })}
              // </div>
            }

            {
              step === 4 && (
                <StepConfirm
                  activeDate={activeDate}
                  activeTime={activeTime}
                  totalDurationLabel={totalDurationLabel}
                  activeStaff={activeStaff}
                  selectedServiceList={selectedServiceList}
                  totalPriceLabel={totalPriceLabel}
                />
              )
              // <div className="grid gap-3 lg:grid-cols-3">
              //   <div className="border-2 border-[#2d2620]/30 bg-white p-4">
              //     <p className="text-xs uppercase tracking-widest text-[#5f544b]">
              //       Date & Time
              //     </p>
              //     <p className="mt-3 text-sm font-semibold">
              //       {activeDate.day}, {activeDate.date}
              //     </p>
              //     <p className="text-xs text-[#5f544b]">{activeTime}</p>
              //     <p className="mt-2 text-xs text-[#5f544b]">
              //       Total duration: {totalDurationLabel}
              //     </p>
              //   </div>
              //   <div className="border-2 border-[#2d2620]/30 bg-white p-4">
              //     <p className="text-xs uppercase tracking-widest text-[#5f544b]">
              //       Staff Member
              //     </p>
              //     <p className="mt-3 text-sm font-semibold">
              //       {activeStaff.name}
              //     </p>
              //     <p className="text-xs text-[#5f544b]">{activeStaff.role}</p>
              //     <p className="mt-2 text-xs text-[#5f544b]">
              //       {activeStaff.rating} rating
              //     </p>
              //   </div>
              //   <div className="border-2 border-[#2d2620]/30 bg-white p-4">
              //     <p className="text-xs uppercase tracking-widest text-[#5f544b]">
              //       Services
              //     </p>
              //     <p className="mt-3 text-sm font-semibold">
              //       {selectedServiceList.length} selected
              //     </p>
              //     <div className="mt-2 space-y-1 text-xs text-[#5f544b]">
              //       {selectedServiceList.map((service, index) => (
              //         <div
              //           key={`${service.title}-${index}`}
              //           className="flex items-center justify-between"
              //         >
              //           <span>{service.title}</span>
              //           <span>{service.duration}</span>
              //         </div>
              //       ))}
              //     </div>
              //     <div className="mt-3 flex items-center justify-between text-xs uppercase tracking-widest">
              //       <span>Total</span>
              //       <span>{totalPriceLabel}</span>
              //     </div>
              //   </div>
              // </div>
            }

            {
              step === 5 && (
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
              )
              // <div className="flex flex-col gap-5">
              //   <div>
              //     <p className="text-xs uppercase tracking-widest text-[#5f544b]">
              //       Payment Options
              //     </p>
              //     <div className="mt-3 grid gap-3 lg:grid-cols-3">
              //       {paymentOptions.map((option, index) => {
              //         const isSelected = index === selectedPayment;
              //         return (
              //           <button
              //             key={option.title}
              //             type="button"
              //             onClick={() => setSelectedPayment(index)}
              //             className={`border-2 p-4 text-left text-sm transition ${
              //               isSelected
              //                 ? "border-[#2d2620] bg-[#f3efe9]"
              //                 : "border-[#2d2620]/30 bg-white"
              //             }`}
              //           >
              //             <p className="text-sm font-semibold">
              //               {option.title}
              //             </p>
              //             <p className="mt-2 text-xs text-[#5f544b]">
              //               {option.description}
              //             </p>
              //           </button>
              //         );
              //       })}
              //     </div>
              //   </div>

              //   <div>
              //     <p className="text-xs uppercase tracking-widest text-[#5f544b]">
              //       Payment Methods
              //     </p>
              //     <div className="mt-3 grid gap-3 sm:grid-cols-3">
              //       {paymentMethods.map((method, index) => {
              //         const isSelected = index === selectedMethod;
              //         return (
              //           <button
              //             key={method}
              //             type="button"
              //             onClick={() => setSelectedMethod(index)}
              //             className={`border-2 px-4 py-3 text-xs uppercase tracking-widest transition ${
              //               isSelected
              //                 ? "border-[#2d2620] bg-[#f3efe9]"
              //                 : "border-[#2d2620]/30 bg-white"
              //             }`}
              //           >
              //             {method}
              //           </button>
              //         );
              //       })}
              //     </div>
              //   </div>

              //   <div className="border-2 border-dashed border-[#2d2620]/40 bg-[#f7f2ec] p-4 text-sm">
              //     <p className="text-xs uppercase tracking-widest text-[#5f544b]">
              //       Selected Payment
              //     </p>
              //     <p className="mt-2 font-semibold">{activePayment.title}</p>
              //     <p className="text-xs text-[#5f544b]">
              //       Method: {activeMethod}
              //     </p>
              //   </div>
              // </div>
            }
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 ">
            <button
              type="button"
              onClick={handleBack}
              className="border-2 border-[#2d2620] px-4 py-2 text-xs uppercase tracking-widest transition hover:bg-[#2d2620] hover:text-[#f3efe9]"
            >
              {step === 1 ? "Back to Dashboard" : "Back"}
            </button>
            <button
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
            </button>
          </div>
        </div> */}

        <aside className="flex flex-col gap-3">
          <SummaryPanal
            serviceSummaryTitle={serviceSummaryTitle}
            serviceSummaryDescription={serviceSummaryDescription}
            activeDate={activeDate}
            activeTime={activeTime}
            activeStaff={activeStaff}
            activePayment={activePayment}
            totalPriceLabel={totalPriceLabel}
          />
          {/* <div className="bg-[#2d2620] p-4 text-[#f3efe9]">
            <p className="text-xs uppercase tracking-widest text-[#f3efe9]/70">
              Booking Summary
            </p>
            <p className="mt-2 text-2xl font-semibold">{serviceSummaryTitle}</p>
            <p className="mt-1 text-xs text-[#f3efe9]/80">
              {serviceSummaryDescription}
            </p>
            <div className="mt-3 space-y-2 text-xs uppercase tracking-widest text-[#f3efe9]/70">
              <div className="flex items-center justify-between">
                <span>Date</span>
                <span className="text-[#f3efe9]">
                  {activeDate.day} {activeDate.date}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Time</span>
                <span className="text-[#f3efe9]">{activeTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Staff</span>
                <span className="text-[#f3efe9]">{activeStaff.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Payment</span>
                <span className="text-[#f3efe9]">{activePayment.title}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Total</span>
                <span className="text-[#f3efe9]">{totalPriceLabel}</span>
              </div>
            </div>
            <button className="mt-4 w-full border border-[#f3efe9] px-4 py-2 text-[0.65rem] uppercase tracking-widest transition hover:bg-[#f3efe9] hover:text-[#2d2620] sm:text-xs">
              Share Booking
            </button>
          </div> */}

          {/* <div className="border-2 border-[#2d2620]/20 bg-white/80 p-4">
            <p className="text-xs uppercase tracking-widest text-[#5f544b]">
              Visit Checklist
            </p>
            <div className="mt-3 space-y-3 text-sm">
              <div className="flex items-start justify-between">
                <span className="font-semibold">Arrival</span>
                <span className="text-xs uppercase tracking-widest text-[#5f544b]">
                  10 min early
                </span>
              </div>
              <div className="flex items-start justify-between">
                <span className="font-semibold">Prep</span>
                <span className="text-xs uppercase tracking-widest text-[#5f544b]">
                  Clean hair/skin
                </span>
              </div>
              <div className="flex items-start justify-between">
                <span className="font-semibold">Notes</span>
                <span className="text-xs uppercase tracking-widest text-[#5f544b]">
                  Bring inspo
                </span>
              </div>
            </div>
          </div> */}
          <Checklist />
          {/* <div className="border-2 border-dashed border-[#2d2620]/40 bg-[#f7f2ec] p-4 text-sm">
            <p className="text-xs uppercase tracking-widest text-[#5f544b]">
              Need to Adjust?
            </p>
            <p className="mt-2 font-semibold">
              Reschedule up to 24 hours before.
            </p>
            <p className="text-xs text-[#5f544b]">
              Contact the front desk for last-minute changes.
            </p>
          </div> */}
          <Note />
        </aside>
      </div>
    </section>
  );
};

export default BookAppointmentPage;
