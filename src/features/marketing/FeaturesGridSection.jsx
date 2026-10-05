import { translateConfig } from "../../i18n/translateConfig.js";
import { useTranslation } from "react-i18next";
import Icon from "../../Shared/ui/Icon";

const features = [
  { number: "01", icon: "calendar-week", titleKey: "marketing.aScheduleThatMakesSense", descriptionKey: "marketing.reviewAppointmentRequestsConfirmVisitsAndKeepTrackOfCompleted", detailKey: "marketing.appointmentsAllTogether", tone: "sage" },
  { number: "02", icon: "razor-barber", titleKey: "marketing.yourTeamInSync", descriptionKey: "marketing.manageYourStaffAndServicesSetPricesAndDurationsAnd", detailKey: "marketing.staffServicesWorkingHours", tone: "cream" },
  { number: "03", icon: "users", titleKey: "marketing.rememberTheLittleThings", descriptionKey: "marketing.keepClientProfilesAndAppointmentHistoryTogetherSoTheNext", detailKey: "marketing.aHomeForEveryClient", tone: "peach" },
  { number: "04", icon: "sparkles", titleKey: "marketing.aReasonToComeBack", descriptionKey: "marketing.giveClientsRewardsTheyCanViewInTheirAccountAnd", detailKey: "clients.clientRewards", tone: "cream" },
  { number: "05", icon: "tachometer-average", titleKey: "marketing.seeTheBiggerPicture", descriptionKey: "marketing.reviewRevenueRecordsPopularServicesAndStaffPerformanceExportReports", detailKey: "marketing.reportsPaymentRecords", tone: "cream" },
  { number: "06", icon: "date-time", titleKey: "marketing.theirNextVisitSorted", descriptionKey: "marketing.clientsChooseASalonServiceSpecialistAndTimeAppointmentUpdates", detailKey: "marketing.aDedicatedClientSpace", tone: "sage" },
];

export default function FeaturesGridSection() {
  const { t } = useTranslation();
  return (
    <section id="features" className="marketing-section marketing-container">
      <div className="marketing-section-heading">
        <div><p className="marketing-eyebrow">{t("marketing.builtAroundYourEveryday")}</p><h2>{t("marketing.goodDaysStart")}<br />{t("marketing.withALittle")} <em>{t("marketing.order")}</em></h2></div>
        <p>{t("marketing.usefulToolsForTheWorkBehindTheBeautyAllConnected")}</p>
      </div>
      <div className="marketing-features">
        {translateConfig(features).map(feature => <article key={feature.number} className={`marketing-feature marketing-tone-${feature.tone}`}>
          <div className="marketing-feature-top"><Icon name={feature.icon} size={25} aria-hidden="true" /><span>{feature.number}</span></div>
          <h3>{feature.title}</h3><p>{feature.description}</p>
          <div className="marketing-feature-detail">{feature.detail}<span aria-hidden="true">↗</span></div>
        </article>)}
      </div>
    </section>
  );
}
