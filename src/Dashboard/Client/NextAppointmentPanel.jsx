import calendarIcon from "../../assets/icons/calendar.svg";
import clockIcon from "../../assets/icons/clock.svg";
import hairCareIcon from "../../assets/icons/hair-care.svg";
const qrData = "Lunara Check-in | Alex | March 2, 2026 10:00 AM";
const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
  qrData,
)}`;
function NextAppointmentPanel() {
  return (
    <article className="relative flex h-full flex-col overflow-hidden border border-ink/20 bg-white/80 p-4 sm:p-5 md:p-6 transition-all duration-300 hover:bg-white/90 hover:shadow-sm">
      <div className="absolute -left-12 -top-12 h-24 w-24 bg-ink/5 rounded-full"></div>
      <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex-1">
          <p className="text-[0.65rem] uppercase tracking-widest text-ink-muted/80 sm:text-xs">
            Next Appointment
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-wide sm:text-2xl">
            Classic Haircut
          </h2>
          <p className="mt-1 text-xs text-ink-muted">
            Signature finish with a styling consult.
          </p>
        </div>
        <span className="inline-flex items-center justify-center border rounded-2xl border-ink px-3 py-1 text-[0.6rem] uppercase tracking-widest whitespace-nowrap sm:px-4 sm:text-xs">
          Confirmed
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 md:mt-4 md:gap-4">
        <InfoItem
          label="Date & Time"
          value="March 2, 2026 at 10:00 AM"
          icon={calendarIcon}
        />
        <InfoItem label="Stylist" value="Billy Brown" icon={hairCareIcon} />
        <InfoItem label="Duration" value="40 minutes" icon={clockIcon} />
      </div>

      <div className="mt-3 border border-dashed border-ink/40 bg-cream p-3 sm:mt-4 sm:p-4">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center border border-ink/40 bg-white p-1 sm:h-20 sm:w-20">
            <img
              src={qrUrl}
              alt="Check-in QR code"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="text-center sm:text-left">
            <p className="text-[0.65rem] uppercase tracking-widest text-ink-muted sm:text-xs">
              Check-in
            </p>
            <p className="text-sm font-semibold">Show your QR at reception</p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:mt-5 sm:flex-row sm:flex-wrap sm:gap-3">
        <button className="border border-ink px-3 py-2 text-[0.6rem] uppercase tracking-widest transition duration-300 hover:bg-ink hover:text-cream active:scale-95 sm:px-4 sm:py-2.5 sm:text-xs">
          View Details
        </button>
        <button className="border border-ink px-3 py-2 text-[0.6rem] uppercase tracking-widest transition duration-300 hover:bg-ink hover:text-cream active:scale-95 sm:px-4 sm:py-2.5 sm:text-xs">
          Reschedule
        </button>
        <button className="border border-ink/30 bg-white/70 px-3 py-2 text-[0.6rem] uppercase tracking-widest transition duration-300 hover:border-ink active:scale-95 sm:px-4 sm:py-2.5 sm:text-xs">
          Add Services
        </button>
      </div>
    </article>
  );
}
const InfoItem = ({ label, value, icon }) => {
  return (
    <div className="flex items-start gap-2 sm:gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/20 bg-cream sm:h-10 sm:w-10">
        <img src={icon} alt="" className="h-4 w-4 opacity-70 sm:h-5 sm:w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-[0.65rem] uppercase tracking-widest text-ink-muted/80 sm:text-xs">
          {label}
        </p>
        <p className="mt-0.5 text-xs font-semibold text-ink sm:mt-1 sm:text-sm">
          {value}
        </p>
      </div>
    </div>
  );
};

export default NextAppointmentPanel;
