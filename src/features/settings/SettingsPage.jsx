import { useState } from "react";

import creditCardIcon from "../../Shared/assets/icons/credit-card.svg";
import bellIcon from "../../Shared/assets/icons/bell.svg";
import AppHeader from "../../AppLayout/AppHeader.jsx";

import Currencies from "./Currencies.jsx";
import SalonInformation from "./SalonInformation.jsx";
import AccountSecurity from "./AccountSecurity.jsx";

const SettingsPage = () => {
  // Notifications State
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsReminders, setSmsReminders] = useState(true);
  const [paymentNotifications, setPaymentNotifications] = useState(true);

  return (
    <section className="flex flex-col gap-4">
      <AppHeader
        eyebrow="Settings"
        title="Settings"
        description="Manage your salon settings and preferences."
      />

      <section className="grid gap-4 lg:grid-cols-2">
        <SalonInformation />

        {/* Currency & Payments */}
        <Currencies creditCardIcon={creditCardIcon} />
      </section>

      {/* Account preferences */}
      <section className="grid items-start gap-4 lg:grid-cols-2">
        <AccountSecurity />
        <div className="border-ink/20 relative flex flex-col gap-4 border-2 bg-white/90 p-4 sm:p-5">
          <div className="bg-ink/5 absolute -top-10 -right-10 h-24 w-24 rounded-full"></div>
          <SectionTitle icon={bellIcon} title="Notifications" />
          <p className="text-ink-muted text-sm">
            Notification preferences are coming soon.
          </p>

          <div className="space-y-4">
            <ToggleRow
              label="Email Notifications"
              description="Receive email updates about appointments."
              checked={emailNotifications}
              onChange={() => setEmailNotifications((prev) => !prev)}
            />
            <ToggleRow
              label="SMS Reminders"
              description="Send SMS reminders to clients."
              checked={smsReminders}
              onChange={() => setSmsReminders((prev) => !prev)}
            />
            <ToggleRow
              label="Payment Notifications"
              description="Get notified about new payments."
              checked={paymentNotifications}
              onChange={() => setPaymentNotifications((prev) => !prev)}
            />
          </div>
        </div>
      </section>
    </section>
  );
};

export const SectionTitle = ({ icon, title }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="border-ink/20 bg-cream flex h-11 w-11 items-center justify-center rounded-2xl border-2">
        <img src={icon} alt="" className="h-5 w-5 opacity-70" />
      </div>
      <h2 className="text-lg font-semibold">{title}</h2>
    </div>
  );
};

export const ToggleRow = ({ label, description, checked, onChange }) => {
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
        title="Coming soon"
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
