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
          onLogout={() => (window.location.href = `/auth/${role}/signin`)}
        />
      )}
      <AppLayout
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
          <div className="flex h-full items-center justify-center">
            Page not found
          </div>
        )}
      </AppLayout>
    </>
  );
}

export default AppLayoutByRole;
