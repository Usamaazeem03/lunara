import calendarIcon from "../../assets/icons/calendar.svg";
import clockIcon from "../../assets/icons/clock.svg";
import hairCareIcon from "../../assets/icons/hair-care.svg";
const qrData = "Lunara Check-in | Alex | March 2, 2026 10:00 AM";
const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
  qrData,
)}`;
function NextAppointmentPanel() {
  return (
    <article className="relative flex h-full flex-col overflow-hidden border border-[#2d2620]/20 bg-white/80 p-5 sm:p-6 ">
      <div className="absolute -left-16 -top-16 h-32 w-32 bg-[#2d2620]/5 rounded-full"></div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#5f544b]">
            Next Appointment
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-wide">
            Classic Haircut
          </h2>
          <p className="mt-1 text-xs text-[#5f544b]">
            Signature finish with a styling consult.
          </p>
        </div>
        <span className="inline-flex items-center justify-center border rounded-2xl border-[#2d2620] px-4 py-1 text-xs uppercase tracking-widest">
          Confirmed
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <InfoItem
          label="Date & Time"
          value="March 2, 2026 at 10:00 AM"
          icon={calendarIcon}
        />
        <InfoItem label="Stylist" value="Billy Brown" icon={hairCareIcon} />
        <InfoItem label="Duration" value="40 minutes" icon={clockIcon} />
      </div>

      <div className="mt-4 border border-dashed border-[#2d2620]/40 bg-[#f3efe9] p-3">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center border border-[#2d2620]/40 bg-white p-1">
            <img
              src={qrUrl}
              alt="Check-in QR code"
              className="h-full w-full object-contain"
            />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-[#5f544b]">
              Check-in
            </p>
            <p className="text-sm font-semibold">Show your QR at reception</p>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button className="border border-[#2d2620] px-4 py-2 text-[0.65rem] uppercase tracking-widest transition hover:bg-[#2d2620] hover:text-[#f3efe9] sm:text-xs">
          View Details
        </button>
        <button className="border border-[#2d2620] px-4 py-2 text-[0.65rem] uppercase tracking-widest transition hover:bg-[#2d2620] hover:text-[#f3efe9] sm:text-xs">
          Reschedule
        </button>
        <button className="border border-[#2d2620]/30 bg-white/70 px-4 py-2 text-[0.65rem] uppercase tracking-widest transition hover:border-[#2d2620] sm:text-xs">
          Add Services
        </button>
      </div>
    </article>
  );
}
const InfoItem = ({ label, value, icon }) => {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#2d2620]/20 bg-[#f3efe9]">
        <img src={icon} alt="" className="h-5 w-5 opacity-70" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-widest text-[#5f534b]">
          {label}
        </p>
        <p className="mt-1 font-semibold">{value}</p>
      </div>
    </div>
  );
};

export default NextAppointmentPanel;
