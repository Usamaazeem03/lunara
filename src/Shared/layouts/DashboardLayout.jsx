import { useState } from "react";

import Sidebar from "../Sidebar";
import MobileNavbar from "../MobileNavbar";
import MobileDrawer from "../MobileDrawer";
import BackgroundText from "../BackgroundText";

/**
 * DashboardLayout Component
 *
 * A responsive layout component supporting both desktop and mobile layouts.
 *
 * Desktop:
 * - Fixed left sidebar (280px)
 * - Main content on the right
 *
 * Mobile:
 * - Top navbar with hamburger menu
 * - Sliding drawer from left (260px)
 * - Dark backdrop overlay
 *
 * @component
 * @example
 * const menuItems = [
 *   { iconName: "home", text: "Home", onClick: () => {} },
 *   { iconName: "settings", text: "Settings", onClick: () => {} }
 * ];
 *
 * return (
 *   <DashboardLayout
 *     menuItems={menuItems}
 *     profileImg={profileImg}
 *     brand="LUNARA"
 *     portalLabel="Client Portal"
 *     footer={<MembershipCard />}
 *     onProfileClick={handleProfileClick}
 *   >
 *     <HomePage />
 *   </DashboardLayout>
 * )
 */
function DashboardLayout({
  menuItems = [],
  profileImg = "",
  brand = "LUNARA",
  portalLabel = "Client Portal",
  footer = null,
  profileAlt = "User profile",
  onProfileClick = null,
  children = null,
}) {
  // Drawer state for mobile
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  /**
   * Close drawer when menu item is clicked
   */
  const handleMenuItemClick = (originalOnClick) => {
    setIsDrawerOpen(false);
    if (originalOnClick) {
      originalOnClick();
    }
  };

  /**
   * Enhance menu items with drawer close functionality
   */
  const enhancedMenuItems = menuItems.map((item) => ({
    ...item,
    onClick: () => handleMenuItemClick(item.onClick),
  }));

  return (
    <div className="bg-cream text-ink relative h-screen overflow-hidden">
      <BackgroundText />

      {/* Mobile Drawer Overlay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 transition-opacity lg:hidden"
          onClick={() => setIsDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="relative flex h-full">
        {/* Desktop Sidebar */}
        <div className="sticky top-0 hidden h-screen lg:block">
          <Sidebar
            menuItems={enhancedMenuItems}
            profileImg={profileImg}
            portalLabel={portalLabel}
            brand={brand}
            footer={footer}
            profileAlt={profileAlt}
            onProfileClick={onProfileClick}
          />
        </div>

        {/* Mobile Drawer */}
        <MobileDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          menuItems={enhancedMenuItems}
          profileImg={profileImg}
          portalLabel={portalLabel}
          brand={brand}
          footer={footer}
          profileAlt={profileAlt}
          onProfileClick={onProfileClick}
        />

        {/* Main Content Area */}
        <div className="flex w-full flex-col lg:w-auto lg:flex-1">
          {/* Mobile Navbar */}
          <MobileNavbar
            brand={brand}
            profileImg={profileImg}
            profileAlt={profileAlt}
            isDrawerOpen={isDrawerOpen}
            onHamburgerClick={() => setIsDrawerOpen(!isDrawerOpen)}
            onProfileClick={onProfileClick}
          />

          {/* Main Content */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto">
            <div className="min-h-full px-4 py-4 sm:px-6 sm:py-6 lg:px-10 lg:py-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
