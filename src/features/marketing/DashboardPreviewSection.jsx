import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Link } from "react-router-dom";
import ProductPreview from "./ProductPreview";

export default function DashboardPreviewSection() {
  const { t } = useTranslation();
  const [role, setRole] = useState("owner");
  const owner = role === "owner";
  return (
    <section id="preview" className="marketing-preview-section">
      <div className="marketing-container marketing-preview-grid">
        <div>
          <p className="marketing-eyebrow">{t("dashboard.takeALookInside")}</p>
          <h2>{t("dashboard.twoPerspectives")}<br />{t("dashboard.one")} <em>{t("dashboard.connected")}</em> {t("dashboard.space")}</h2>
          <div className="marketing-preview-switch" role="group" aria-label={t("dashboard.chooseProductPreview")}>
            <button type="button" aria-pressed={owner} onClick={() => setRole("owner")}>{t("dashboard.forSalonOwners")}</button>
            <button type="button" aria-pressed={!owner} onClick={() => setRole("client")}>{t("dashboard.forClients")}</button>
          </div>
          <div className="marketing-preview-description" aria-live="polite">
            <h3>{owner ? t("dashboard.yourDayWithRoomToBreathe") : t("dashboard.yourSalonVisitWithoutTheBackAndForth")}</h3>
            <p>{owner ? t("dashboard.seeYourAppointmentsManageYourTeamAndGetToKnow") : t("dashboard.chooseYourServiceAndTimeFollowYourAppointmentStatusAnd")}</p>
          </div>
          <Link className="marketing-text-link" to={`/auth/${role}/signup`}>{owner ? t("dashboard.createYourSalonAccount") : t("dashboard.createYourClientAccount")} <span aria-hidden="true">↗</span></Link>
        </div>
        <ProductPreview role={role} />
      </div>
    </section>
  );
}
