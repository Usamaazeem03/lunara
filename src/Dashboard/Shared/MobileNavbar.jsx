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
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-ink/10 bg-white/30 backdrop-blur-md px-4 py-3 shadow-sm lg:hidden">
      {/* Profile Avatar Button */}
      <button
        type="button"
        onClick={onProfileClick}
        aria-label="Open profile"
        className="flex h-10 w-10 items-center justify-center rounded-full overflow-hidden shadow-sm transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-ink/50"
      >
        <img
          src={profileImg}
          alt={profileAlt}
          className="h-full w-full object-cover rounded-full"
        />
      </button>

      {/* Brand Name */}
      <h1 className="text-lg sm:text-xl font-bold tracking-widest text-ink">
        {brand}
      </h1>

      {/* Hamburger Menu Button */}
      <button
        type="button"
        onClick={onHamburgerClick}
        aria-label="Toggle menu"
        aria-expanded={isDrawerOpen}
        className="flex h-10 w-10 items-center justify-center rounded-lg shadow-sm transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-ink/50"
      >
        <svg
          className={`h-6 w-6 text-ink transition-transform duration-300 ${
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
