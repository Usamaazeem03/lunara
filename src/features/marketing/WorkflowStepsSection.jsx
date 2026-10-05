import { translateConfig } from "../../i18n/translateConfig.js";
import { useTranslation } from "react-i18next";
const steps = [
  [{ translationKey: "marketing.makeItYours" }, { translationKey: "marketing.createYourSalonAccountAddServicesPricesStaffAndOpening" }],
  [{ translationKey: "marketing.openTheDoor" }, { translationKey: "marketing.shareYourSalonPageSoClientsCanChooseAService" }],
  [{ translationKey: "marketing.findYourRhythm" }, { translationKey: "marketing.manageRequestsCompleteVisitsAndKeepClientHistoryReadyFor" }],
];
export default function WorkflowStepsSection() {
  const { t } = useTranslation();
  return <section id="workflow" className="marketing-section marketing-container">
    <div className="marketing-section-heading"><div><p className="marketing-eyebrow">{t("marketing.fromSetupToYourNextAppointment")}</p><h2>{t("marketing.aSimplerWay")}<br />{t("marketing.to")} <em>{t("marketing.getGoing")}</em></h2></div><p>{t("marketing.startWithYourSalonEssentialsBringTheRestOfYour")}</p></div>
    <ol className="marketing-workflow">{translateConfig(steps).map(([title, text], index) => <li key={title}><span className="marketing-step-number">0{index + 1}</span><h3>{title}</h3><p>{text}</p></li>)}</ol>
  </section>;
}
