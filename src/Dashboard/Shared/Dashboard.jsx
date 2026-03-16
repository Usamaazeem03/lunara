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

import DashboardLayout from "./DashboardLayout";
import ProfileModal from "./ProfileModal";

// Client Pages
import BookAppointmentPage from "../Client/ClientPages/BookAppointmentPage";
import MyAppointmentPage from "../Client/ClientPages/MyAppointmentPage";
import PaymentHistoryPage from "../Client/ClientPages/PaymentHistoryPage";
import OffersLoyaltyPage from "../Client/ClientPages/OffersLoyaltyPage";
import NotificationPage from "../Client/ClientPages/NotificationPage";
import HomePage from "../Client/ClientPages/HomePage";

// Admin Pages
import AdminDashboard from "../Admin/AdminDashboard";
import AppointmentPage from "../Admin/AppointmentPage";
import ClientPage from "../Admin/ClientPage";
import ServicesPage from "../Admin/ServicesPage";
import StaffPage from "../Admin/StaffPage";
import PaymentPage from "../Admin/PaymentPage";
import ReportsPage from "../Admin/ReportsPage";
import SettingsPage from "../Admin/SettingsPage";

// ==============================
// PAGE CONFIG
// ==============================

const clientPages = {
  Home: HomePage,
  "Book Appointment": BookAppointmentPage,
  "My Appointment": MyAppointmentPage,
  "Payment History": PaymentHistoryPage,
  "Offers & Loyalty": OffersLoyaltyPage,
  Notifications: NotificationPage,
};

const adminPages = {
  Dashboard: AdminDashboard,
  Appointments: AppointmentPage,
  Clients: ClientPage,
  Services: ServicesPage,
  Staff: StaffPage,
  Payment: PaymentPage,
  Reports: ReportsPage,
  Settings: SettingsPage,
};

const Dashboard = () => {
  const navigate = useNavigate();

  const role = "client"; // FIXED

  // ==============================
  // MENU CONFIG
  // ==============================

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

  const pages = role === "admin" ? adminPages : clientPages;
  const menuItems = role === "admin" ? adminMenuItems : clientMenuItems;

  // ==============================
  // STATE
  // ==============================

  const [activeMenu, setActiveMenu] = useState(menuItems[0].text);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const menuItemsWithActive = menuItems.map((item) => ({
    ...item,
    active: item.text === activeMenu,
    onClick: () => setActiveMenu(item.text),
  }));

  const ActivePage = pages[activeMenu];

  const authRole = role === "admin" ? "owner" : "client";

  // ==============================
  // PROFILE
  // ==============================

  const profileData = {
    name: "Alex",
    role: role === "admin" ? "Salon Owner" : "Client",
    email: "alex@gmail.com",
    phone: "+92 304 679 269",
  };

  const clientFooter =
    role === "admin" ? null : (
      <div className="border border-ink/20 bg-white/70 p-4">
        <p className="text-xs uppercase tracking-widest text-ink-muted">
          Membership
        </p>
        <p className="mt-2 text-base font-semibold">Glow Member</p>
        <p className="mt-2 text-xs text-ink-muted">
          Priority booking and 10% off services.
        </p>
        <button className="mt-4 w-full border border-ink px-4 py-2 text-xs uppercase tracking-widest transition hover:bg-ink hover:text-cream">
          Manage
        </button>
      </div>
    );

  return (
    <>
      {isProfileOpen && (
        <ProfileModal
          avatarImage={profileImg}
          profile={profileData}
          onClose={() => setIsProfileOpen(false)}
          onLogout={() => navigate(`/auth/${authRole}/signin`)}
        />
      )}

      <DashboardLayout
        menuItems={menuItemsWithActive}
        profileImg={profileImg}
        portalLabel={role === "admin" ? "Admin Portal" : "Client Portal"}
        brand="LUNARA"
        footer={clientFooter}
        onProfileClick={() => setIsProfileOpen(true)}
      >
        {ActivePage ? (
          <ActivePage setActiveMenu={setActiveMenu} />
        ) : (
          <div className="flex items-center justify-center h-full">
            Page not found
          </div>
        )}
      </DashboardLayout>
    </>
  );
};

export default Dashboard;
