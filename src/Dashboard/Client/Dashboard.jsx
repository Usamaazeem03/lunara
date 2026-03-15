import { useState } from "react";
import { useNavigate } from "react-router-dom";

import homeIcon from "../../assets/icons/home.svg";
import calendarIcon from "../../assets/icons/calendar.svg";
import clockIcon from "../../assets/icons/clock.svg";
import creditCardIcon from "../../assets/icons/credit-card.svg";
import giftIcon from "../../assets/icons/gift-box-benefits.svg";
import bellIcon from "../../assets/icons/bell.svg";
import hairCareIcon from "../../assets/icons/hair-care.svg";
import profileImg from "../../assets/images/Alex-dp.png";
import Sidebar from "./Sidebar";
import BookAppointmentPage from "./ClientPages/BookAppointmentPage";
import MyAppointmentPage from "./ClientPages/MyAppointmentPage";
import PaymentHistoryPage from "./ClientPages/PaymentHistoryPage";
import OffersLoyaltyPage from "./ClientPages/OffersLoyaltyPage";
import NotificationPage from "./ClientPages/NotificationPage";
import StatCards from "./StatCards";
import RedeemPointsPanal from "./RedeemPointsPanal";
import QuickActionPanal from "./QuickAction";
import NextAppointmentPanel from "./NextAppointmentPanel";
import DashboardHeader from "../Shared/DashboardHeader";
import BackgroundText from "../Shared/BackgroundText";
import Button from "../Shared/Button";
import HomePage from "./ClientPages/HomePage";
import AdminDashboard from "../Admin/AdminDashboard";
import AppointmentPage from "../Admin/AppointmentPage";
import ClientPage from "../Admin/ClientPage";
import ServicesPage from "../Admin/ServicesPage";
import StaffPage from "../Admin/StaffPage";
import PaymentPage from "../Admin/PaymentPage";
import ReportsPage from "../Admin/ReportsPage";
import SettingsPage from "../Admin/SettingsPage";
import ProfileModal from "../Shared/ProfileModal";

const Dashboard = () => {
  const navigate = useNavigate();
  const clientMenuItems = [
    { icon: homeIcon, text: "Home" },
    { icon: calendarIcon, text: "Book Appointment" },
    { icon: clockIcon, text: "My Appointment" },
    { icon: creditCardIcon, text: "Payment History" },
    { icon: giftIcon, text: "Offers & Loyalty" },
    { icon: bellIcon, text: "Notifications" },
  ];
  const adminMenuItems = [
    { icon: homeIcon, text: "Dashboard" },
    { icon: calendarIcon, text: "Appointments" },
    { icon: clockIcon, text: "Clients" },
    { icon: hairCareIcon, text: "Services" },
    { icon: clockIcon, text: "Staff" },
    { icon: creditCardIcon, text: "Payment" },
    { icon: giftIcon, text: "Reports" },
    { icon: bellIcon, text: "Settings" },
  ];
  const role = "clint";
  const menuItems = role === "admin" ? adminMenuItems : clientMenuItems;
  const [activeMenu, setActiveMenu] = useState(menuItems[0]?.text ?? "");
  const [isProfileOpen, setProfileOpen] = useState(false);
  const menuItemsWithActive = menuItems.map((item) => ({
    ...item,
    active: item.text === activeMenu,
    onClick: () => setActiveMenu(item.text),
  }));
  const isBookingPage = activeMenu === "Book Appointment";
  const isMyAppointmentPage = activeMenu === "My Appointment";
  const isPaymentHistoryPage = activeMenu === "Payment History";
  const isOffersPage = activeMenu === "Offers & Loyalty";
  const isNotificationPage = activeMenu === "Notifications";
  const isAdminDashboard = activeMenu === "Dashboard";
  const isAppointmentPage = activeMenu === "Appointments";
  const isServicesPage = activeMenu === "Services";
  const isClientPage = activeMenu === "Clients";
  const isStaffPage = activeMenu === "Staff";
  const isAdminPaymentPage = activeMenu === "Payment";
  const isReportsPage = activeMenu === "Reports";
  const isSettingsPage = activeMenu === "Settings";
  const authRole = role === "admin" ? "owner" : "client";
  const profileData = {
    name: "Alex",
    role: role === "admin" ? "Salon Owner" : "Client",
    email: "alex@gmail.com",
    phone: "+92 304 679 269",
    dob: "2002-03-23",
    address: "123 Main St, Apt 4B, New York, NY 10001",
  };
  const clientFooter = (
    <div className="border border-[#2d2620]/20 bg-white/70 p-4">
      <p className="text-xs uppercase tracking-widest text-[#5f544b]">
        Membership
      </p>
      <p className="mt-2 text-base font-semibold">Glow Member</p>
      <p className="mt-2 text-xs text-[#5f544b]">
        Priority booking and 10% off services.
      </p>
      <button className="mt-4 w-full border border-[#2d2620] px-4 py-2 text-xs uppercase tracking-widest transition hover:bg-[#2d2620] hover:text-[#f3efe9]">
        Manage
      </button>
    </div>
  );
  const profileModal = isProfileOpen ? (
    <ProfileModal
      avatarImage={profileImg}
      profile={profileData}
      onClose={() => setProfileOpen(false)}
      onLogout={() => {
        setProfileOpen(false);
        navigate(`/auth/${authRole}/signin`);
      }}
    />
  ) : null;

  if (role === "clint")
    return (
      <div className="relative h-screen overflow-hidden bg-[#f3efe9] text-[#2d2620]">
        <BackgroundText />
        {profileModal}

        <div className="relative flex h-full">
          {/* ================= Clent SIDEBAR ================= */}
          {/* <Sidebar menuItems={menuItemsWithActive} profileImg={profileImg} /> */}

          <Sidebar
            menuItems={menuItemsWithActive}
            profileImg={profileImg}
            portalLabel="Client Portal"
            brand="LUNARA"
            footer={clientFooter}
            onProfileClick={() => setProfileOpen(true)}
          />

          {/* ================= MAIN CONTENT ================= */}
          <main className="flex h-full flex-1 flex-col overflow-y-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-10 lg:py-8">
            {isBookingPage ? (
              <BookAppointmentPage onBack={() => setActiveMenu("Home")} />
            ) : isMyAppointmentPage ? (
              <MyAppointmentPage
                onBook={() => setActiveMenu("Book Appointment")}
              />
            ) : isPaymentHistoryPage ? (
              <PaymentHistoryPage />
            ) : isOffersPage ? (
              <OffersLoyaltyPage />
            ) : isNotificationPage ? (
              <NotificationPage />
            ) : (
              <HomePage setActiveMenu={setActiveMenu} />
            )}
          </main>
        </div>
      </div>
    );
  return (
    <div className="relative h-screen overflow-hidden bg-[#f3efe9] text-[#2d2620]">
      <BackgroundText />
      {profileModal}

      <div className="relative flex h-full">
        {/* ================= owner SIDEBAR ================= */}
        <Sidebar
          menuItems={menuItemsWithActive}
          profileImg={profileImg}
          portalLabel="Admin Portal"
          brand="LUNARA"
          footer={null}
          onProfileClick={() => setProfileOpen(true)}
        />

        {/* ================= MAIN CONTENT ================= */}
        <main className="flex h-full flex-1 flex-col overflow-y-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-10 lg:py-8">
          {isAdminDashboard ? (
            <AdminDashboard />
          ) : isAppointmentPage ? (
            <AppointmentPage />
          ) : isServicesPage ? (
            <ServicesPage />
          ) : isStaffPage ? (
            <StaffPage />
          ) : isAdminPaymentPage ? (
            <PaymentPage />
          ) : isReportsPage ? (
            <ReportsPage />
          ) : isSettingsPage ? (
            <SettingsPage />
          ) : isClientPage ? (
            <ClientPage />
          ) : isOffersPage ? (
            <OffersLoyaltyPage />
          ) : isNotificationPage ? (
            <NotificationPage />
          ) : (
            <HomePage setActiveMenu={setActiveMenu} />
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
