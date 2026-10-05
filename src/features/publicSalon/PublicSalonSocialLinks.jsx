import { useTranslation } from "react-i18next";
import { getSafeSocialLinks } from "../../Shared/lib/socialLinks.js";

export default function PublicSalonSocialLinks({ links }) {
  const { t } = useTranslation();
  const visible = getSafeSocialLinks(links);
  if (!visible.length) return null;
  return (
    <div className="salon-follow">
      <h2>{t("settings.socialLinks.publicTitle")}</h2>
      <p className="salon-muted">
        {t("settings.socialLinks.publicDescription")}
      </p>
      <div className="salon-follow-links">
        {visible.map(({ title, url }, index) => (
          <a
            key={`${index}-${title}`}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>{title}</span>
            <span aria-hidden="true">↗</span>
          </a>
        ))}
      </div>
    </div>
  );
}
