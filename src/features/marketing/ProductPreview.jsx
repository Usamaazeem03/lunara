import { translateConfig } from "../../i18n/translateConfig.js";
import { useTranslation } from "react-i18next";
const appointments = [
  { time: "10:00", name: "Maya R.", serviceKey: "marketing.cutFinish", initials: "MR", stateKey: "common.confirmed" },
  { time: "11:30", name: "Noor A.", serviceKey: "marketing.skinTreatment", initials: "NA", stateKey: "common.pending" },
  { time: "14:00", name: "Alex T.", serviceKey: "marketing.colourRefresh", initials: "AT", stateKey: "common.confirmed" },
];

export default function ProductPreview({ role = "owner", compact = false }) {
  const { t } = useTranslation();
  const owner = role === "owner";
  return (
    <div className={`marketing-product ${compact ? "marketing-product-compact" : ""}`}>
      <div className="marketing-product-top"><span className="marketing-product-brand">LUNARA</span><span className="marketing-sample">{t("marketing.samplePreview")}</span></div>
      <div className="marketing-product-body">
        <div className="marketing-product-heading"><div><p>{owner ? t("marketing.yourSalonAtAGlance") : t("marketing.aLittleTimeForYou")}</p><h3>{owner ? t("marketing.helloBeautifulDay") : t("marketing.yourNextMoment")}</h3></div><span className="marketing-avatar">{owner ? "L" : "M"}</span></div>
        {owner ? <>
          <div className="marketing-preview-stats"><div><span>{t("nav.appointments")}</span><strong>08</strong></div><div><span>{t("common.confirmed")}</span><strong>06</strong></div><div><span>{t("common.pending")}</span><strong>02</strong></div></div>
          <div className="marketing-schedule-label"><strong>{t("marketing.onTheSchedule")}</strong><span>{t("marketing.exampleDay")}</span></div>
          <div className="marketing-appointments">{translateConfig(appointments).map(item => <div className="marketing-appointment" key={item.time}>
            <time>{item.time}</time><span className="marketing-avatar">{item.initials}</span>
            <div><strong>{item.name}</strong><span>{item.service}</span></div>
            <span className={`marketing-status ${item.state === "Pending" ? "marketing-status-pending" : ""}`}>{item.state}</span>
          </div>)}</div>
          <div className="marketing-preview-footer"><span className="marketing-dot" /> {t("marketing.aClearerViewOfWhatComesNext")}</div>
        </> : <>
          <div className="marketing-client-pass"><div className="marketing-pass-top"><span>{t("marketing.yourBookingPass")}</span><span className="marketing-status">{t("common.confirmed")}</span></div><h4>{t("marketing.cutFinish")}</h4><p>{t("marketing.lunaraStudioWithAlex")}</p><div className="marketing-pass-date"><div><span>{t("marketing.date")}</span><strong>{t("marketing.24September")}</strong></div><div><span>{t("marketing.time")}</span><strong>10:00 AM</strong></div></div><div className="marketing-pass-bottom">{t("marketing.appointmentDetailsAlwaysWithYou")}<span aria-hidden="true">✦</span></div></div>
          <div className="marketing-reward-preview"><span aria-hidden="true">✳</span><div><strong>{t("marketing.aLittleTreatForNextTime")}</strong><p>{t("marketing.yourSalonRewardsInOnePlace")}</p></div></div>
        </>}
      </div>
    </div>
  );
}
