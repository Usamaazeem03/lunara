// Dashboard shell that maps sidebar menu selections to URL-driven pages for owner and client portals.
import { useCallback, useEffect, useMemo } from "react";
import { useLocation, useMatch, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

import DashboardLayout from "./DashboardLayout";
import ProfileModal from "../ProfileModal";

// Client Pages
import BookAppointmentPage from "../../features/booking/page/BookAppointmentPage";
import MyAppointmentPage from "../../Dashboard/Client/ClientPages/MyAppointmentPage";
import PaymentHistoryPage from "../../Dashboard/Client/ClientPages/PaymentHistoryPage";
import OffersLoyaltyPage from "../../Dashboard/Client/ClientPages/OffersLoyaltyPage";
import NotificationPage from "../../Dashboard/Client/ClientPages/NotificationPage";
import HomePage from "../../Dashboard/Client/ClientPages/HomePage";

// Owner Pages
import AdminDashboard from "../../Dashboard/Admin/AdminDashboard";
import AppointmentPage from "../../Dashboard/Admin/AppointmentPage";
import ClientPage from "../../Dashboard/Admin/ClientPage";
import ServicesPage from "../../Dashboard/Admin/ServicesPage";
import StaffPage from "../../Dashboard/Admin/StaffPage";
import PaymentPage from "../../Dashboard/Admin/PaymentPage";
import ReportsPage from "../../Dashboard/Admin/ReportsPage";
import SettingsPage from "../../Dashboard/Admin/SettingsPage";
import WorkingSchedule from "../../Dashboard/Admin/WorkingSchedulePage";

const CLIENT_PAGES = {
  home: HomePage,
  "book-appointment": BookAppointmentPage,
  "my-appointment": MyAppointmentPage,
  "payment-history": PaymentHistoryPage,
  "offers-loyalty": OffersLoyaltyPage,
  notifications: NotificationPage,
};

const OWNER_PAGES = {
  dashboard: AdminDashboard,
  appointments: AppointmentPage,
  clients: ClientPage,
  services: ServicesPage,
  staff: StaffPage,
  payment: PaymentPage,
  reports: ReportsPage,
  schedule: WorkingSchedule,
  settings: SettingsPage,
};

const CLIENT_MENU_ITEMS = [
  { iconName: "home", text: "Home", segment: "home" },
  {
    iconName: "calendar",
    text: "Book Appointment",
    segment: "book-appointment",
  },
  { iconName: "clock", text: "My Appointment", segment: "my-appointment" },
  {
    iconName: "credit-card",
    text: "Payment History",
    segment: "payment-history",
  },
  {
    iconName: "gift-box-benefits",
    text: "Offers & Loyalty",
    segment: "offers-loyalty",
  },
  { iconName: "bell", text: "Notifications", segment: "notifications" },
];

const OWNER_MENU_ITEMS = [
  { iconName: "home", text: "Dashboard", segment: "dashboard" },
  { iconName: "calendar", text: "Appointments", segment: "appointments" },
  { iconName: "clients", text: "Clients", segment: "clients" },
  { iconName: "mascara", text: "Services", segment: "services" },
  { iconName: "staff", text: "Staff", segment: "staff" },
  { iconName: "credit-card", text: "Payment", segment: "payment" },
  { iconName: "report", text: "Reports", segment: "reports" },
  { iconName: "date-time", text: "Schedule", segment: "schedule" },
  { iconName: "bell", text: "Settings", segment: "settings" },
];

const DEFAULT_SEGMENT_BY_ROLE = {
  owner: "dashboard",
  client: "home",
};

const VALID_ROUTE_ROLES = ["owner", "client"];

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const profileRouteMatch = useMatch("/profile");
  const isProfileRoute = Boolean(profileRouteMatch);
  const { role: routeRole, slug: routeSlug, page: routePage } = useParams();
  const { user, profile, loading } = useAuth();

  const userRole = user?.user_metadata?.role;
  const role =
    userRole || (VALID_ROUTE_ROLES.includes(routeRole) ? routeRole : "client");

  const baseMenuItems = role === "owner" ? OWNER_MENU_ITEMS : CLIENT_MENU_ITEMS;
  const pages = role === "owner" ? OWNER_PAGES : CLIENT_PAGES;
  const defaultSegment = DEFAULT_SEGMENT_BY_ROLE[role] || baseMenuItems[0].segment;

  const normalizedRoutePage = routePage?.toLowerCase();
  const hasValidRoutePage = normalizedRoutePage
    ? Boolean(pages[normalizedRoutePage])
    : false;
  const activeSegment = hasValidRoutePage ? normalizedRoutePage : defaultSegment;
  const ActivePage = pages[activeSegment];

  const buildDashboardPath = useCallback(
    (segment = defaultSegment) => {
      if (role === "owner") {
        const ownerSlug = profile?.salon_slug || routeSlug;
        if (!ownerSlug) return "/dashboard";
        if (segment === defaultSegment) {
          return `/owner/salon/${ownerSlug}`;
        }
        return `/owner/salon/${ownerSlug}/${segment}`;
      }

      return segment === defaultSegment ? "/dashboard" : `/dashboard/${segment}`;
    },
    [defaultSegment, profile?.salon_slug, role, routeSlug],
  );

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate(`/auth/${role}/signin`, { replace: true });
      return;
    }

    if (isProfileRoute) return;

    if (role === "owner") {
      const ownerSlug = profile?.salon_slug || routeSlug;
      if (!ownerSlug) return;

      const hasOwnerRoute = Boolean(routeSlug);
      const isLegacyOwnerRoute = routeRole === "owner";
      const hasSlugMismatch = routeSlug && routeSlug !== ownerSlug;
      const shouldNormalizeInvalidPage = Boolean(routePage) && !hasValidRoutePage;
      const shouldNormalizeDefaultPage =
        Boolean(routePage) && activeSegment === defaultSegment;

      if (!hasOwnerRoute) {
        navigate(buildDashboardPath(defaultSegment), { replace: true });
        return;
      }

      if (
        isLegacyOwnerRoute ||
        hasSlugMismatch ||
        shouldNormalizeInvalidPage ||
        shouldNormalizeDefaultPage
      ) {
        const nextSegment = shouldNormalizeInvalidPage
          ? defaultSegment
          : activeSegment;
        navigate(buildDashboardPath(nextSegment), { replace: true });
      }
      return;
    }

    if (!routePage) return;

    if (!hasValidRoutePage || activeSegment === defaultSegment) {
      navigate(buildDashboardPath(defaultSegment), { replace: true });
    }
  }, [
    activeSegment,
    buildDashboardPath,
    defaultSegment,
    hasValidRoutePage,
    loading,
    navigate,
    profile?.salon_slug,
    role,
    routePage,
    routeRole,
    routeSlug,
    user,
    isProfileRoute,
  ]);

  const avatarUrl = useMemo(
    () => profile?.avatar_img || user?.user_metadata?.picture || null,
    [profile?.avatar_img, user?.user_metadata?.picture],
  );

  const openProfile = useCallback(() => {
    if (isProfileRoute) return;

    navigate("/profile", {
      state: { from: `${location.pathname}${location.search}` },
    });
  }, [isProfileRoute, location.pathname, location.search, navigate]);

  const closeProfile = useCallback(() => {
    const fromPath =
      typeof location.state?.from === "string" ? location.state.from : null;
    if (fromPath && fromPath !== "/profile") {
      navigate(fromPath, { replace: true });
      return;
    }

    navigate(buildDashboardPath(activeSegment), { replace: true });
  }, [activeSegment, buildDashboardPath, location.state, navigate]);

  const setActiveMenu = useCallback(
    (identifier) => {
      const matchedItem = baseMenuItems.find(
        (item) => item.segment === identifier || item.text === identifier,
      );
      if (!matchedItem) return;
      navigate(buildDashboardPath(matchedItem.segment));
    },
    [baseMenuItems, buildDashboardPath, navigate],
  );

  const menuItemsWithActive = useMemo(
    () =>
      baseMenuItems.map((item) => ({
        ...item,
        active: item.segment === activeSegment,
        onClick: () => setActiveMenu(item.segment),
      })),
    [activeSegment, baseMenuItems, setActiveMenu],
  );

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f7f5f0]">
        <div className="text-center">
          <div className="border-ink mx-auto h-12 w-12 animate-spin rounded-full border-b-2" />
          <p className="text-ink/60 mt-4 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const salonUrl =
    role === "owner" && profile?.salon_slug
      ? `${window.location.origin}/salon/${profile.salon_slug}`
      : null;

  const clientFooter =
    role === "owner" ? null : (
      <div className="border-ink/20 border bg-white/70 p-4">
        <p className="text-ink-muted text-xs tracking-widest uppercase">
          Membership
        </p>
        <p className="mt-2 text-base font-semibold">Glow Member</p>
        <p className="text-ink-muted mt-2 text-xs">
          Priority booking and 10% off services.
        </p>
        <button className="border-ink hover:bg-ink hover:text-cream mt-4 w-full border px-4 py-2 text-xs tracking-widest uppercase transition">
          Manage
        </button>
      </div>
    );

  return (
    <>
      {isProfileRoute && (
        <ProfileModal
          avatarUrl={avatarUrl}
          salonUrl={salonUrl}
          onClose={closeProfile}
          onLogout={() => navigate(`/auth/${role}/signin`)}
        />
      )}

      <DashboardLayout
        menuItems={menuItemsWithActive}
        profileImg={avatarUrl}
        portalLabel={role === "owner" ? "Owner Portal" : "Client Portal"}
        brand="LUNARA"
        footer={clientFooter}
        onProfileClick={openProfile}
      >
        {ActivePage ? (
          <ActivePage setActiveMenu={setActiveMenu} />
        ) : (
          <div className="flex h-full items-center justify-center">Page not found</div>
        )}
      </DashboardLayout>
    </>
  );
}

export default Dashboard;
