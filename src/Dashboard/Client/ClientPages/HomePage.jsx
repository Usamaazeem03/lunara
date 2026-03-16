import DashboardHeader from "../../Shared/DashboardHeader";
import Button from "../../Shared/Button";
import NextAppointmentPanel from "../NextAppointmentPanel";
import QuickActionPanal from "../QuickAction";
import RedeemPointsPanal from "../RedeemPointsPanal";
import StatCards from "../StatCards";

function HomePage({ setActiveMenu }) {
  return (
    <section className="flex h-full flex-1 flex-col overflow-y-auto  scrollbar-hidden">
      {/* Welcome Section */}
      <DashboardHeader
        eyebrow={"Welcome back"}
        title={"Alex"}
        description={`Manage your appointments, tailor your glow routine, and stay on top of
          your beauty journey.`}
      >
        <Button
          onClick={() => setActiveMenu("Book Appointment")}
          variant="primary"
        >
          Book Appointment
        </Button>
        <Button onClick={() => setActiveMenu("Contact")} variant="secondary">
          Contact Salon
        </Button>
      </DashboardHeader>
      {/* Stats Cards */}
      <StatCards />

      {/* Appointment + Side Panel */}
      <section className="mt-3 grid gap-3 sm:mt-5 md:gap-4 lg:mt-6 lg:grid-cols-[1.5fr_1fr] xl:gap-5">
        {/* Next Appointment */}
        <NextAppointmentPanel />

        {/* Side Panel */}
        {/* <div className="grid grid-cols-1 gap-3 md:gap-4 lg:gap-4"> */}
        <div className="grid h-full gap-4">
          <RedeemPointsPanal />
          <QuickActionPanal />
        </div>
      </section>
    </section>
  );
}

export default HomePage;
