import { useTranslation } from "react-i18next";
export default function PricingSection() {
  const { t } = useTranslation();
  return <section id="pricing" className="marketing-section marketing-container">
    <div className="marketing-payments"><div className="marketing-payment-symbol" aria-hidden="true">↗</div><div><p className="marketing-eyebrow">{t("marketing.onTheHorizon")}</p><h2>{t("marketing.onlinePayments")}</h2><p>{t("marketing.bookYourAppointmentWithLunaraAndPayAtTheSalon")}</p></div><span className="marketing-coming-soon">{t("common.comingSoon")}</span></div>
    <div className="marketing-faq"><div><p className="marketing-eyebrow">{t("marketing.aFewHelpfulDetails")}</p><h2>{t("marketing.goodTo")} <em>{t("marketing.know")}</em></h2></div><div>
      <details><summary>{t("marketing.isLunaraForOwnersOrClients")}</summary><p>{t("marketing.bothOwnersManageSalonServicesStaffAppointmentsClientsAndReports")}</p></details>
      <details><summary>{t("marketing.canClientsPayOnline")}</summary><p>{t("marketing.onlinePaymentAvailability")}</p></details>
      <details><summary>{t("marketing.howDoClientsKnowTheirBookingStatus")}</summary><p>{t("marketing.clientsCanViewPendingConfirmedCompletedOrCancelledAppointmentsIn")}</p></details>
    </div></div>
  </section>;
}
