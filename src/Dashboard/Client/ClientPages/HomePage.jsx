import Button from "../../Shared/Button";
import DashboardHeader from "../../Shared/DashboardHeader";
import NextAppointmentPanel from "../NextAppointmentPanel";
import QuickActionPanal from "../QuickAction";
import RedeemPointsPanal from "../RedeemPointsPanal";
import StatCards from "../StatCards";

// <section className="flex h-full flex-col gap-6 p-4 sm:p-6 lg:p-8">
function HomePage({ setActiveMenu }) {
  return (
    <section className="flex h-full flex-1 flex-col overflow-y-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-10 lg:py-8">
      {/* Welcome Section */}
      <DashboardHeader
        eyebrow={"Welcome back"}
        title={"Alex"}
        description={`Manage your appointments, tailor your glow routine, and stay on top of
          your beauty journey.`}
      >
        {" "}
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
      <section className="mt-4 grid min-h-0 flex-1 gap-4 sm:mt-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Next Appointment */}
        <NextAppointmentPanel />

        {/* Side Panel */}
        <div className="grid h-full gap-4">
          <RedeemPointsPanal />
          <QuickActionPanal />
        </div>
      </section>
    </section>
  );
}

export default HomePage;
