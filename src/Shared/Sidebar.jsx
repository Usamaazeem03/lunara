import Icon from "./ui/Icon";

function Sidebar({
  menuItems,
  profileImg,
  portalLabel = "Client Portal",
  brand = "LUNARA",
  footer = null,
  profileAlt = "User profile",
  onProfileClick = null,
}) {
  const avatarClasses =
    "flex h-10 w-10 items-center justify-center rounded-full border border-[#2d2620]/20 bg-white/80 overflow-hidden";

  return (
    <aside className="border-ink/15 bg-cream-soft hidden h-full w-72 flex-col border-r p-6 lg:flex">
      {/* Top: Profile + Branding */}
      <div className="flex items-center gap-3">
        {onProfileClick ? (
          <button
            type="button"
            onClick={onProfileClick}
            aria-label="Open profile"
            className={`${avatarClasses} hover:border-ink/40 focus-visible:outline-ink/40 transition hover:scale-[1.02] focus-visible:outline-2`}
          >
            <img
              src={profileImg}
              alt={profileAlt}
              className="h-full w-full object-cover"
            />
          </button>
        ) : (
          <div className={avatarClasses}>
            <img
              src={profileImg}
              alt={profileAlt}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div>
          <p className="text-ink-muted text-xs tracking-widest uppercase">
            {portalLabel}
          </p>
          <h3 className="text-2xl font-semibold tracking-widest">{brand}</h3>
        </div>
      </div>

      {/* Middle: Menu */}
      <div className="mt-8 flex flex-1 flex-col">
        <p className="text-ink-muted text-xs tracking-widest uppercase">Menu</p>
        <nav className="mt-3 flex-1 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <MenuItem key={item.text} {...item} />
          ))}
        </nav>

        {/* Footer: Membership / Profile */}
        {footer ? <div className="mt-auto pt-6">{footer}</div> : null}
      </div>
    </aside>
  );
}
const MenuItem = ({ iconName, text, active, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`flex w-full items-center gap-4 rounded-full px-3 py-2 text-left text-sm tracking-widest uppercase transition ${
        active ? "bg-ink text-cream" : "text-ink hover:bg-ink/10"
      }`}
    >
      <span
        className={`border-ink/20 flex h-9 w-9 items-center justify-center rounded-full border ${
          active ? "bg-ink" : "bg-white/70"
        }`}
      >
        {iconName && (
          <Icon
            name={iconName}
            size={16}
            className={active ? "text-cream" : "text-ink/70"}
            aria-hidden="true"
          />
        )}
      </span>
      {text}
    </button>
  );
};

export default Sidebar;
