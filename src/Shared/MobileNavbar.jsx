import UserAvatar from "./ui/UserAvatar";
/**
 * MobileNavbar Component
 *
 * Top navigation bar for mobile screens.
 * Displays:
 * - Hamburger menu button (left)
 * - Brand name (center)
 * - Profile avatar button (right)
 *
 * @component
 * @param {string} brand - Brand name to display
 * @param {string} profileImg - Profile image URL
 * @param {string} profileAlt - Alt text for profile image
 * @param {boolean} isDrawerOpen - Whether drawer is currently open
 * @param {function} onHamburgerClick - Callback when hamburger is clicked
 * @param {function} onProfileClick - Callback when profile avatar is clicked
 */
function MobileNavbar({
  brand = "LUNARA",
  profileImg = "",
  profileAlt = "User profile",
  isDrawerOpen = false,
  onHamburgerClick = null,
  onProfileClick = null,
}) {
  return (
    <header className="border-ink/10 sticky top-0 z-30 flex items-center justify-between border-b bg-white/30 px-4 py-3 shadow-sm backdrop-blur-md lg:hidden">
      {/* Profile Avatar Button */}
      <button
        type="button"
        onClick={onProfileClick}
        aria-label="Open profile"
        className="focus:ring-ink/50 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full shadow-sm transition-transform duration-200 hover:scale-105 focus:ring-2 focus:outline-none"
      >
        <UserAvatar src={profileImg} alt={profileAlt} />
      </button>

      {/* Brand Name */}
      <h1 className="text-ink text-lg font-bold tracking-widest sm:text-xl">
        {brand}
      </h1>

      {/* Hamburger Menu Button */}
      <button
        type="button"
        onClick={onHamburgerClick}
        aria-label="Toggle menu"
        aria-expanded={isDrawerOpen}
        className="focus:ring-ink/50 flex h-10 w-10 items-center justify-center rounded-lg shadow-sm transition-transform duration-200 hover:scale-105 focus:ring-2 focus:outline-none"
      >
        <svg
          className={`text-ink h-6 w-6 transition-transform duration-300 ${
            isDrawerOpen ? "rotate-90 opacity-70" : "rotate-0 opacity-100"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </header>
  );
}

export default MobileNavbar;
