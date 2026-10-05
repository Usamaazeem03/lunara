import { useTranslation } from "react-i18next";
import i18n from "../i18n/i18n.js";
import Icon from "./ui/Icon";

function MobileDrawer({
  isOpen = false,
  onClose = null,
  menuItems = [],
  profileImg = "",
  profileAlt = i18n.t("common.userProfile"),
  onProfileClick = null,
}) {
  const { t } = useTranslation();
  const handleDrawerToggle = () => {
    if (isOpen) {
      onClose?.();
    } else {
      onClose?.();
    }
  };

  return (
    <aside
      className={`border-ink/15 bg-cream-soft/90 fixed top-10 ${isOpen ? "right-5" : "right-0"} z-40 h-auto rounded-4xl border shadow-sm transition-all duration-300 ease-in-out lg:hidden ${
        isOpen ? "translate-x-0.1 w-auto" : "translate-x-0.1 w-0"
      }`}
      aria-hidden={!isOpen}
    >
      <div className="flex flex-col items-center overflow-y-auto p-3">
        {/* Profile */}
        <div className="flex flex-col items-center">
          {onProfileClick ? (
            <button
              type="button"
              onClick={() => {
                onProfileClick?.();
                onClose?.();
              }}
              aria-label={t("common.openProfile")}
              className="border-ink/20 hover:border-ink/40 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border bg-white/80 transition hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <img
                src={profileImg}
                alt={profileAlt}
                className="h-full w-full object-cover"
              />
            </button>
          ) : (
            <div className="border-ink/20 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border bg-white/80">
              <img
                src={profileImg}
                alt={profileAlt}
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Menu */}
        <div
          className={`flex flex-col items-center ${isOpen ? "mt-8" : "mt-6"}`}
        >
          {isOpen && (
            <p className="text-ink-muted text-xs tracking-widest uppercase"> {t("common.menu")} </p>
          )}

          <nav
            className={`flex flex-col items-center ${
              isOpen ? "mt-3 space-y-2" : "mt-4 space-y-2"
            }`}
          >
            {menuItems.map((item) => (
              <DrawerMenuItem
                key={item.segment}
                {...item}
                isOpen={isOpen}
                onClick={() => {
                  item.onClick?.();
                  onClose?.();
                }}
              />
            ))}
          </nav>
        </div>
      </div>

      {/* Open / Close button */}
      <button
        type="button"
        onClick={handleDrawerToggle}
        aria-label={isOpen ? t("dashboard.closeMenu") : t("common.openMenu")}
        className={`border-ink/15 bg-cream-soft/90 absolute top-1/2 ${isOpen ? "opacity-0" : "-left-5 opacity-100"} flex h-40 w-5 -translate-y-1/2 items-center justify-center rounded-l-2xl border border-r-0`}
      >
        <span
          className={`text-ink text-xl transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ‹
        </span>
      </button>
    </aside>
  );
}

const DrawerMenuItem = ({
  iconName = "",
  textKey,
  active = false,
  onClick = null,
  isOpen = false,
}) => {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      aria-label={t(textKey)}
      title={!isOpen ? t(textKey) : undefined}
      className={`flex items-center gap-3 rounded-xl px-2 py-2 text-left text-sm tracking-widest uppercase transition ${
        active ? "bg-ink text-cream" : "text-ink hover:bg-ink/10"
      } ${isOpen ? "w-full" : "w-12 justify-center"}`}
    >
      {iconName && (
        <span
          className={`border-ink/20 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
            active ? "bg-ink" : "bg-white/70"
          }`}
        >
          <Icon
            name={iconName}
            size={20}
            className={active ? "text-cream" : "text-ink/70"}
            aria-hidden="true"
          />
        </span>
      )}

      {/* {isOpen && <span className="flex-1">{text}</span>} */}
    </button>
  );
};

export default MobileDrawer;
