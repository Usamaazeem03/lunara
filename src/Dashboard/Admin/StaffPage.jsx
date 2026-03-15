import calendarIcon from "../../assets/icons/calendar.svg";
import clockIcon from "../../assets/icons/clock.svg";
import giftIcon from "../../assets/icons/gift-box-benefits.svg";
import hairCareIcon from "../../assets/icons/hair-care.svg";
import DashboardHeader from "../Shared/DashboardHeader";
import StatCards from "../Client/StatCards";
import Button from "../Shared/Button";

const StaffPage = () => {
  const stats = [
    {
      title: "Total Staff",
      value: "5",
      subtitle: "Team members",
      icon: giftIcon,
    },
    {
      title: "Active Today",
      value: "4",
      subtitle: "On shift",
      icon: calendarIcon,
    },
    {
      title: "Avg. Rating",
      value: "4.8",
      subtitle: "Client feedback",
      icon: clockIcon,
    },
    {
      title: "Total Appointments",
      value: "585",
      subtitle: "All time",
      icon: hairCareIcon,
    },
  ];

  const staffMembers = [
    {
      id: "ST-101",
      name: "Jessica Martinez",
      role: "Senior Stylist",
      initials: "JM",
      rating: "4.9",
      appointments: "142",
      phone: "(555) 111-2222",
      email: "jessica.m@salonpro.com",
      schedule: "Mon - Fri",
      specialties: ["Hair Coloring", "Hair Styling", "Hair Treatment"],
    },
    {
      id: "ST-102",
      name: "David Rodriguez",
      role: "Barber",
      initials: "DR",
      rating: "4.8",
      appointments: "158",
      phone: "(555) 222-3333",
      email: "david.r@salonpro.com",
      schedule: "Tue - Sat",
      specialties: ["Haircut", "Beard Trim", "Shaving"],
    },
    {
      id: "ST-103",
      name: "Maria Lopez",
      role: "Spa Specialist",
      initials: "ML",
      rating: "5.0",
      appointments: "95",
      phone: "(555) 333-4444",
      email: "maria.l@salonpro.com",
      schedule: "Mon - Fri",
      specialties: ["Facial Treatment", "Massage", "Spa Packages"],
    },
  ];

  return (
    <section className="flex h-full flex-col">
      <DashboardHeader
        eyebrow="Staff"
        title="Staff Management"
        description="Manage your team members and their schedules."
      >
        <Button variant="primary">Add Staff Member</Button>
      </DashboardHeader>

      <StatCards stats={stats} lgGridCols={4} />

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {staffMembers.map((member) => (
          <StaffCard key={member.id} member={member} />
        ))}
      </div>
    </section>
  );
};

const StaffCard = ({ member }) => {
  return (
    <article className="relative flex h-full flex-col border-2 border-ink/20 bg-white/90 p-4 sm:p-5">
      <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-ink/5"></div>
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-ink/20 bg-cream text-xs font-semibold uppercase text-ink-muted">
          {member.initials}
        </div>
        <div>
          <h3 className="text-lg font-semibold">{member.name}</h3>
          <p className="text-sm text-ink-muted">{member.role}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 border-2 border-ink/10 bg-cream/60 p-3 text-center">
        <div>
          <p className="text-base font-semibold">{member.rating}</p>
          <p className="text-xs uppercase tracking-widest text-ink-muted">
            Rating
          </p>
        </div>
        <div>
          <p className="text-base font-semibold">{member.appointments}</p>
          <p className="text-xs uppercase tracking-widest text-ink-muted">
            Appointments
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <InfoRow label="Phone" value={member.phone} symbol="P" />
        <InfoRow label="Email" value={member.email} symbol="E" />
        <InfoRow label="Schedule" value={member.schedule} symbol="S" />
      </div>

      <div className="mt-4">
        <p className="text-xs uppercase tracking-widest text-ink-muted">
          Specialties
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {member.specialties.map((specialty) => (
            <span
              key={specialty}
              className="rounded-full border-2 border-ink/20 bg-cream px-3 py-1 text-[0.65rem] uppercase tracking-widest text-ink-muted"
            >
              {specialty}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        <button className="flex-1 border-2 border-ink/20 bg-cream px-4 py-2 text-xs uppercase tracking-widest transition hover:border-ink">
          Edit
        </button>
        <button className="flex-1 border-2 border-[#b0412e]/40 bg-[#b0412e]/10 px-4 py-2 text-xs uppercase tracking-widest text-[#b0412e] transition hover:border-[#b0412e]">
          Remove
        </button>
      </div>
    </article>
  );
};

const InfoRow = ({ label, value, symbol }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/20 bg-cream text-xs font-semibold uppercase text-ink-muted">
        {symbol}
      </div>
      <div>
        <p className="text-xs uppercase tracking-widest text-ink-muted">
          {label}
        </p>
        <p className="text-sm font-semibold text-ink">{value}</p>
      </div>
    </div>
  );
};

export default StaffPage;
