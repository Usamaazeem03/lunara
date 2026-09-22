import ClientAppLayout from "./ClientAppLayout.jsx";
import AppLayout from "./AppLayout";
import ProfileModal from "../Shared/ProfileModal";
import Spinner from "../ui/Spinner";
import { useDashboardRouting } from "../features/Dashboard/hooks/useDashboardRoute";

function AppLayoutByRole() {
  const {
    role,
    loading,
    profile,
    isProfileRoute,
    ActivePage,
    avatarUrl,
    menuItemsWithActive,
    setActiveMenu,
    openProfile,
    closeProfile,
  } = useDashboardRouting();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f7f5f0]">
        <div className="text-center">
          <Spinner />
          <p className="text-ink/60 mt-4 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const salonUrl =
    role === "owner" && profile?.salon_slug
      ? `${window.location.origin}/salon/${profile.salon_slug}`
      : null;

  const Layout = role === "owner" ? AppLayout : ClientAppLayout;
  const clientFooter = role === "owner" ? null : (
    <div className="rounded-2xl border border-ink/10 bg-white/60 p-4">
      <p className="text-sm font-semibold">A little time for you</p>
      <p className="mt-2 text-xs leading-5 text-ink-muted">Your next visit and booking pass are always close by.</p>
      <button type="button" onClick={() => setActiveMenu("my-appointment")} className="mt-3 min-h-11 w-full rounded-xl border border-ink/15 text-xs font-semibold">Open my visits</button>
    </div>
  );

  return (
    <>
      {isProfileRoute && (
        <ProfileModal
          avatarUrl={avatarUrl}
          salonUrl={salonUrl}
          onClose={closeProfile}
          onLogout={() => (window.location.href = `/auth/${role}/signin`)}
        />
      )}
      <Layout
        menuItems={menuItemsWithActive}
        profileImg={avatarUrl}
        portalLabel={role === "owner" ? "Owner Portal" : "Client Portal"}
        brand="LUNARA"
        footer={clientFooter}
        onProfileClick={openProfile}
      >
        {isProfileRoute ? null : ActivePage ? (
          <ActivePage setActiveMenu={setActiveMenu} />
        ) : (
          <div className="flex h-full items-center justify-center">
            Page not found
          </div>
        )}
      </Layout>
    </>
  );
}

export default AppLayoutByRole;
