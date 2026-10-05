import { useTranslation } from "react-i18next";
import { useState } from "react";

import creditCardIcon from "../../Shared/assets/icons/credit-card.svg";
import bellIcon from "../../Shared/assets/icons/bell.svg";
import AppHeader from "../../AppLayout/AppHeader.jsx";

import Currencies from "./Currencies.jsx";
import SalonInformation from "./SalonInformation.jsx";
import AccountSecurity from "./AccountSecurity.jsx";
import LanguageSelector from "../../Shared/ui/LanguageSelector.jsx";
import AddWebsite from "./AddWebsite.jsx";
import SocialLinks from "./SocialLinks.jsx";

const SettingsPage = () => {
  const { t } = useTranslation();
  // Notifications State
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsReminders, setSmsReminders] = useState(true);
  const [paymentNotifications, setPaymentNotifications] = useState(true);

  return (
    <section className="flex flex-col gap-4">
      <AppHeader
        eyebrow={t("nav.settings")}
        title={t("nav.settings")}
        description={t("settings.manageYourSalonSettingsAndPreferences")}
      />

      <section className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="min-w-0 space-y-5">
          <SalonInformation />
          <AccountSecurity />
        </div>
        <div className="min-w-0 space-y-5">
          <LanguageSelector />
          {/* Currency & Payments */}
          <Currencies creditCardIcon={creditCardIcon} />
          <AddWebsite />
          <SocialLinks />
          <div className="border-ink/20 relative flex flex-col gap-4 rounded-none border-2 bg-white/90 p-4 sm:p-5">
            <SectionTitle icon={bellIcon} title={t("settings.notifications")} />
            <p className="text-ink-muted text-sm">
              {" "}
              {t("settings.notificationPreferencesAreComingSoon")}{" "}
            </p>

            <div className="space-y-4">
              <ToggleRow
                label={t("dashboard.emailNotifications")}
                description={t("settings.receiveEmailUpdatesAboutAppointments")}
                checked={emailNotifications}
                onChange={() => setEmailNotifications((prev) => !prev)}
              />
              <ToggleRow
                label={t("settings.smsReminders")}
                description={t("settings.sendSmsRemindersToClients")}
                checked={smsReminders}
                onChange={() => setSmsReminders((prev) => !prev)}
              />
              <ToggleRow
                label={t("dashboard.paymentNotifications")}
                description={t("settings.getNotifiedAboutNewPayments")}
                checked={paymentNotifications}
                onChange={() => setPaymentNotifications((prev) => !prev)}
              />
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export const SectionTitle = ({ icon, title }) => {
  useTranslation();
  return (
    <div className="flex items-center gap-3">
      <div className="border-ink/20 bg-cream flex h-11 w-11 items-center justify-center rounded-none border-2">
        <img src={icon} alt="" className="h-5 w-5 opacity-70" />
      </div>
      <h2 className="text-lg font-semibold">{title}</h2>
    </div>
  );
};

export const ToggleRow = ({ label, description, checked, onChange }) => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-semibold">{label}</p>
        {description && <p className="text-ink-muted text-xs">{description}</p>}
      </div>
      <button
        type="button"
        onClick={onChange}
        disabled
        title={t("common.comingSoon")}
        aria-pressed={checked}
        className={`relative h-6 w-12 rounded-full border-2 transition ${
          checked ? "border-ink bg-ink" : "border-ink/30 bg-cream"
        }`}
      >
        <span
          className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full transition ${
            checked ? "bg-cream left-6" : "bg-ink/40 left-1"
          }`}
        />
      </button>
    </div>
  );
};

export default SettingsPage;
