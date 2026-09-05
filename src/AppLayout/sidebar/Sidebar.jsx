import Branding from "../../ui/Branding";
import { MenuItem } from "./MenuItem";

function Sidebar({
  menuItems,
  profileImg,
  portalLabel = "Client Portal",
  brand = "LUNARA",
  footer = null,
  profileAlt = "User profile",
  onProfileClick = null,
}) {
  return (
    <aside className="border-ink/15 bg-cream-soft hidden h-full w-72 flex-col border-r p-6 lg:flex">
      {/* Top: Profile + Branding */}
      <Branding
        profileImg={profileImg}
        portalLabel={portalLabel}
        brand={brand}
        profileAlt={profileAlt}
        onProfileClick={onProfileClick}
      />

      {/* Menu item*/}
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
export default Sidebar;
