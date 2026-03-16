// function Sidebar({ menuItems, profileImg }) {
//   return (
//     <aside className="hidden w-72 flex-col border-r border-[#2d2620]/15 bg-[#f7f2ec] p-6 lg:flex">
//       {/* Brand */}
//       <div className="flex items-center gap-3">
//         <div className="flex h-10 w-10 items-center justify-center border rounded-full border-[#2d2620]/20 bg-white/80 overflow-hidden">
//           <img
//             src={profileImg}
//             alt="Alex profile"
//             className="h-full w-full object-cover"
//           />
//         </div>
//         <div>
//           <p className="text-xs uppercase tracking-widest text-[#5f544b]">
//             Client Portal
//           </p>
//           <h3 className="text-2xl font-semibold tracking-widest">LUNARA</h3>
//         </div>
//       </div>

//       {/* Menu */}
//       <div className="mt-8">
//         <p className="text-xs uppercase tracking-widest text-[#5f544b]">Menu</p>
//         <nav className="mt-3 space-y-1">
//           {menuItems.map((item) => (
//             <MenuItem key={item.text} {...item} />
//           ))}
//         </nav>
//       </div>

//       {/* Membership */}
//       <div className="mt-auto pt-6">
//         <div className="border border-[#2d2620]/20 bg-white/70 p-4">
//           <p className="text-xs uppercase tracking-widest text-[#5f544b]">
//             Membership
//           </p>
//           <p className="mt-2 text-base font-semibold">Glow Member</p>
//           <p className="mt-2 text-xs text-[#5f544b]">
//             Priority booking and 10% off services.
//           </p>
//           <button className="mt-4 w-full border border-[#2d2620] px-4 py-2 text-xs uppercase tracking-widest transition hover:bg-[#2d2620] hover:text-[#f3efe9]">
//             Manage
//           </button>
//         </div>
//       </div>
//     </aside>
//   );
// }
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
    <aside className="hidden w-72 flex-col border-r border-ink/15 bg-cream-soft p-6 lg:flex h-full">
      {/* Top: Profile + Branding */}
      <div className="flex items-center gap-3">
        {onProfileClick ? (
          <button
            type="button"
            onClick={onProfileClick}
            aria-label="Open profile"
            className={`${avatarClasses} transition hover:scale-[1.02] hover:border-ink/40 focus-visible:outline-2 focus-visible:outline-ink/40`}
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
          <p className="text-xs uppercase tracking-widest text-ink-muted">
            {portalLabel}
          </p>
          <h3 className="text-2xl font-semibold tracking-widest">{brand}</h3>
        </div>
      </div>

      {/* Middle: Menu */}
      <div className="mt-8 flex-1 flex flex-col">
        <p className="text-xs uppercase tracking-widest text-ink-muted">Menu</p>
        <nav className="mt-3 space-y-1 flex-1 overflow-y-auto">
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
const MenuItem = ({ icon, text, active, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`flex w-full items-center gap-4 rounded-full px-3 py-2 text-left text-sm uppercase tracking-widest transition ${
        active ? "bg-ink text-cream" : "text-ink hover:bg-ink/10"
      }`}
    >
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-full border border-ink/20 ${
          active ? "bg-ink" : "bg-white/70"
        }`}
      >
        <img
          src={icon}
          alt=""
          className={`h-4 w-4 ${active ? "invert" : "opacity-70"}`}
        />
      </span>
      {text}
    </button>
  );
};

export default Sidebar;

/*  */
