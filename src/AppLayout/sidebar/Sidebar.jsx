import { useTranslation } from "react-i18next";
import i18n from "../../i18n/i18n.js";
import Branding from "../../ui/Branding";
import { MenuItem } from "./MenuItem";

function Sidebar({
  menuItems,
  profileImg,
  portalLabel = i18n.t("common.clientPortal"),
  brand = "LUNARA",
  footer = null,
  profileAlt = i18n.t("common.userProfile"),
  onProfileClick = null,
}) {
  const { t } = useTranslation();
  const mainMenuItems = menuItems.filter((item) => item.placement !== "bottom");
  const bottomMenuItems = menuItems.filter((item) => item.placement === "bottom");
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
      <div className="mt-8 flex min-h-0 flex-1 flex-col">
        <p className="text-ink-muted text-xs tracking-widest uppercase">{t("common.menu")}</p>
        <nav className="mt-3 min-h-0 flex-1 space-y-1 overflow-y-auto">
          {mainMenuItems.map((item) => (
            <MenuItem key={item.segment} {...item} />
          ))}
        </nav>

        {/* Footer: Membership / Profile */}
        {footer ? <div className="mt-auto pt-6">{footer}</div> : null}
        {bottomMenuItems.length > 0 && (
          <nav className="shrink-0 space-y-1 pt-4">
            {bottomMenuItems.map((item) => (
              <MenuItem key={item.segment} {...item} />
            ))}
          </nav>
        )}
      </div>
    </aside>
  );
}
export default Sidebar;
