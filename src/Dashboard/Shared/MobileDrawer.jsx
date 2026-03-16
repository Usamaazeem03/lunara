/**
 * MobileDrawer Component
 *
 * Sliding drawer navigation for mobile screens.
 * Features:
 * - Slides in from the left
 * - 260px width
 * - Full height
 * - Smooth animation
 * - Contains sidebar content (profile, menu, footer)
 *
 * @component
 * @param {boolean} isOpen - Whether drawer is open
 * @param {function} onClose - Callback to close drawer
 * @param {array} menuItems - Menu items to display
 * @param {string} profileImg - Profile image URL
 * @param {string} portalLabel - Portal label text
 * @param {string} brand - Brand name
 * @param {ReactNode} footer - Footer content
 * @param {string} profileAlt - Alt text for profile image
 * @param {function} onProfileClick - Callback when profile is clicked
 */
function MobileDrawer({
  isOpen = false,
  onClose = null,
  menuItems = [],
  profileImg = "",
  portalLabel = "Client Portal",
  brand = "LUNARA",
  footer = null,
  profileAlt = "User profile",
  onProfileClick = null,
}) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-60 transform border-r border-ink/15 bg-cream-soft transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:hidden`}
      aria-hidden={!isOpen}
    >
      <div className="flex h-full flex-col overflow-y-auto p-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3">
          {onProfileClick ? (
            <button
              type="button"
              onClick={() => {
                onProfileClick?.();
                onClose?.();
              }}
              aria-label="Open profile"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/20 bg-white/80 overflow-hidden transition hover:scale-[1.02] hover:border-ink/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink/40"
            >
              <img
                src={profileImg}
                alt={profileAlt}
                className="h-full w-full object-cover"
              />
            </button>
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/20 bg-white/80 overflow-hidden">
              <img
                src={profileImg}
                alt={profileAlt}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <div>
            <p className="text-xs uppercase tracking-widest text-ink-muted">
              {portalLabel}
            </p>
            <h3 className="text-2xl font-semibold tracking-widest">{brand}</h3>
          </div>
        </div>

        {/* Menu */}
        <div className="mt-8">
          <p className="text-xs uppercase tracking-widest text-ink-muted">
            Menu
          </p>
          <nav className="mt-3 space-y-1">
            {menuItems.map((item) => (
              <DrawerMenuItem key={item.text} {...item} />
            ))}
          </nav>
        </div>

        {/* Footer */}
        {footer && <div className="mt-auto pt-6">{footer}</div>}
      </div>
    </aside>
  );
}

/**
 * DrawerMenuItem Component
 *
 * Menu item for drawer navigation.
 * Can be either active or inactive.
 *
 * @component
 * @param {string} icon - Icon image URL
 * @param {string} text - Menu item text
 * @param {boolean} active - Whether item is active
 * @param {function} onClick - Callback when clicked
 */
const DrawerMenuItem = ({
  icon = "",
  text = "",
  active = false,
  onClick = null,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm uppercase tracking-widest transition ${
        active ? "bg-ink text-cream" : "text-ink hover:bg-ink/10"
      }`}
    >
      {icon && (
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-full border border-ink/20 ${
            active ? "bg-ink" : "bg-white/70"
          }`}
        >
          <img
            src={icon}
            alt=""
            className={`h-4 w-4 ${active ? "invert" : "opacity-70"}`}
          />
        </span>
      )}
      <span className="flex-1">{text}</span>
    </button>
  );
};

export default MobileDrawer;
