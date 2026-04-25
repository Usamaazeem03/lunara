import { useState } from "react";

import homeIcon from "../../Shared/assets/icons/home.svg";
import creditCardIcon from "../../Shared/assets/icons/credit-card.svg";
import bellIcon from "../../Shared/assets/icons/bell.svg";
import DashboardHeader from "../../Shared/layouts/DashboardHeader";
import Button from "../../Shared/Button";
import { notify } from "../../Shared/lib/toast.jsx";

const SettingsPage = () => {
  // Salon Info State
  const [salonInfo, setSalonInfo] = useState({
    name: "Lunara Salon",
    address: "123 Main Street, New York, NY 10001",
    phone: "(555) 123-4567",
    email: "info@lunarasalon.com",
  });

  // Currency & Payments State
  const [currency, setCurrency] = useState("GBP");
  const [taxRate, setTaxRate] = useState("8.5");
  const [enablePayments, setEnablePayments] = useState(true);

  // Notifications State
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsReminders, setSmsReminders] = useState(true);
  const [paymentNotifications, setPaymentNotifications] = useState(true);

  const handleSave = () => {
    notify.success("Settings saved!");
  };

  return (
    <section className="flex flex-col gap-4">
      <DashboardHeader
        eyebrow="Settings"
        title="Settings"
        description="Manage your salon settings and preferences."
      />

      <section className="grid gap-4 lg:grid-cols-2">
        {/* Salon Information */}
        <div className="border-ink/20 relative flex flex-col gap-4 border-2 bg-white/90 p-4 sm:p-5">
          <div className="bg-ink/5 absolute -top-10 -right-10 h-24 w-24 rounded-full"></div>
          <SectionTitle icon={homeIcon} title="Salon Information" />

          <div className="grid gap-4">
            <div className="space-y-2">
              <label className="text-ink-muted text-xs tracking-widest uppercase">
                Salon Name
              </label>
              <input
                type="text"
                value={salonInfo.name}
                onChange={(e) =>
                  setSalonInfo((prev) => ({ ...prev, name: e.target.value }))
                }
                className="border-ink/20 text-ink focus:border-ink w-full rounded-xl border-2 bg-white px-4 py-2 text-sm focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-ink-muted text-xs tracking-widest uppercase">
                Address
              </label>
              <input
                type="text"
                value={salonInfo.address}
                onChange={(e) =>
                  setSalonInfo((prev) => ({ ...prev, address: e.target.value }))
                }
                className="border-ink/20 text-ink focus:border-ink w-full rounded-xl border-2 bg-white px-4 py-2 text-sm focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-ink-muted text-xs tracking-widest uppercase">
                Phone
              </label>
              <input
                type="tel"
                value={salonInfo.phone}
                onChange={(e) =>
                  setSalonInfo((prev) => ({ ...prev, phone: e.target.value }))
                }
                className="border-ink/20 text-ink focus:border-ink w-full rounded-xl border-2 bg-white px-4 py-2 text-sm focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-ink-muted text-xs tracking-widest uppercase">
                Email
              </label>
              <input
                type="email"
                value={salonInfo.email}
                onChange={(e) =>
                  setSalonInfo((prev) => ({ ...prev, email: e.target.value }))
                }
                className="border-ink/20 text-ink focus:border-ink w-full rounded-xl border-2 bg-white px-4 py-2 text-sm focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Currency & Payments */}
        <div className="border-ink/20 relative flex flex-col gap-4 border-2 bg-white/90 p-4 sm:p-5">
          <div className="bg-ink/5 absolute -top-10 -right-10 h-24 w-24 rounded-full"></div>
          <SectionTitle icon={creditCardIcon} title="Currency & Payments" />

          <div className="grid gap-4">
            <div className="space-y-2">
              <label className="text-ink-muted text-xs tracking-widest uppercase">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="border-ink/20 text-ink focus:border-ink w-full rounded-xl border-2 bg-white px-4 py-2 text-sm focus:outline-none"
              >
                <option value="USD">USD - US Dollar ($)</option>
                <option value="GBP">GBP - British Pound (£)</option>
                <option value="EUR">EUR - Euro (€)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-ink-muted text-xs tracking-widest uppercase">
                Tax Rate (%)
              </label>
              <input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                className="border-ink/20 text-ink focus:border-ink w-full rounded-xl border-2 bg-white px-4 py-2 text-sm focus:outline-none"
              />
            </div>

            <ToggleRow
              label="Enable online payments"
              checked={enablePayments}
              onChange={() => setEnablePayments((prev) => !prev)}
            />
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="border-ink/20 relative flex flex-col gap-4 border-2 bg-white/90 p-4 sm:p-5">
          <div className="bg-ink/5 absolute -top-10 -right-10 h-24 w-24 rounded-full"></div>
          <SectionTitle icon={bellIcon} title="Notifications" />

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

      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={() => window.location.reload()}>
          Reset
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </section>
  );
};

const SectionTitle = ({ icon, title }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="border-ink/20 bg-cream flex h-11 w-11 items-center justify-center rounded-2xl border-2">
        <img src={icon} alt="" className="h-5 w-5 opacity-70" />
      </div>
      <h2 className="text-lg font-semibold">{title}</h2>
    </div>
  );
};

const ToggleRow = ({ label, description, checked, onChange }) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-semibold">{label}</p>
        {description && <p className="text-ink-muted text-xs">{description}</p>}
      </div>
      <button
        type="button"
        onClick={onChange}
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
