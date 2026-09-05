import { useState } from "react";

import Sidebar from "./sidebar/Sidebar";
import MobileNavbar from "../Shared/MobileNavbar";
import MobileDrawer from "../Shared/MobileDrawer";
import BackgroundText from "../ui/BackgroundText";
import PageContent from "./PageContent";

function AppLayout({
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
          <PageContent>{children}</PageContent>
        </div>
      </div>
    </div>
  );
}

export default AppLayout;
