import { useState } from "react";

import homeIcon from "../../assets/icons/home.svg";
import creditCardIcon from "../../assets/icons/credit-card.svg";
import clockIcon from "../../assets/icons/clock.svg";
import bellIcon from "../../assets/icons/bell.svg";
import DashboardHeader from "../Shared/DashboardHeader";
import Button from "../Shared/Button";

const SettingsPage = () => {
  const salonInfoFields = [
    { label: "Salon Name", value: "Salon Manager Pro" },
    { label: "Address", value: "123 Main Street, New York, NY 10001" },
    { label: "Phone", value: "(555) 123-4567" },
    { label: "Email", value: "info@salonmanagerpro.com" },
  ];

  const workingHours = [
    { day: "Monday", enabled: true },
    { day: "Tuesday", enabled: true },
    { day: "Wednesday", enabled: true },
    { day: "Thursday", enabled: true },
    { day: "Friday", enabled: true },
    { day: "Saturday", enabled: true },
    { day: "Sunday", enabled: false },
  ];

  const [currency, setCurrency] = useState("USD - US Dollar ($)");
  const [taxRate, setTaxRate] = useState("8.5");
  const [defaultMethod, setDefaultMethod] = useState("Credit Card");
  const [enablePayments, setEnablePayments] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsReminders, setSmsReminders] = useState(true);
  const [paymentNotifications, setPaymentNotifications] = useState(true);

  return (
    <section className="flex flex-col gap-4">
      <DashboardHeader
        eyebrow="Settings"
        title="Settings"
        description="Manage your salon settings and preferences."
      />

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="relative flex flex-col gap-4 border-2 border-ink/20 bg-white/90 p-4 sm:p-5">
          <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-ink/5"></div>
          <SectionTitle icon={homeIcon} title="Salon Information" />

          <div className="grid gap-4">
            {salonInfoFields.map((field) => (
              <div key={field.label} className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-ink-muted">
                  {field.label}
                </label>
                <input
                  type="text"
                  defaultValue={field.value}
                  className="w-full rounded-xl border-2 border-ink/20 bg-white px-4 py-2 text-sm text-ink focus:border-ink focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex flex-col gap-4 border-2 border-ink/20 bg-white/90 p-4 sm:p-5">
          <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-ink/5"></div>
          <SectionTitle icon={creditCardIcon} title="Currency & Payments" />

          <div className="grid gap-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-ink-muted">
                Currency
              </label>
              <select
                value={currency}
                onChange={(event) => setCurrency(event.target.value)}
                className="w-full rounded-xl border-2 border-ink/20 bg-white px-4 py-2 text-sm text-ink focus:border-ink focus:outline-none"
              >
                <option>USD - US Dollar ($)</option>
                <option>GBP - British Pound (£)</option>
                <option>EUR - Euro (€)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-ink-muted">
                Tax Rate (%)
              </label>
              <input
                type="number"
                value={taxRate}
                onChange={(event) => setTaxRate(event.target.value)}
                className="w-full rounded-xl border-2 border-ink/20 bg-white px-4 py-2 text-sm text-ink focus:border-ink focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-ink-muted">
                Default Payment Method
              </label>
              <select
                value={defaultMethod}
                onChange={(event) => setDefaultMethod(event.target.value)}
                className="w-full rounded-xl border-2 border-ink/20 bg-white px-4 py-2 text-sm text-ink focus:border-ink focus:outline-none"
              >
                <option>Credit Card</option>
                <option>Cash</option>
                <option>Debit Card</option>
                <option>Wallet</option>
              </select>
            </div>

            <ToggleRow
              label="Enable online payments"
              checked={enablePayments}
              onChange={() => setEnablePayments((prev) => !prev)}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="relative flex flex-col gap-4 border-2 border-ink/20 bg-white/90 p-4 sm:p-5">
          <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-ink/5"></div>
          <SectionTitle icon={clockIcon} title="Working Hours" />

          <div className="space-y-4">
            {workingHours.map((row) => (
              <div
                key={row.day}
                className="flex flex-wrap items-center justify-between gap-3"
              >
                <label className="flex items-center gap-2 text-sm font-semibold text-ink">
                  <input
                    type="checkbox"
                    defaultChecked={row.enabled}
                    className="h-4 w-4 accent-ink"
                  />
                  {row.day}
                </label>
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-ink-muted">
                  <input
                    type="time"
                    defaultValue="09:00"
                    className="rounded-lg border-2 border-ink/20 bg-white px-3 py-1 text-xs uppercase tracking-widest text-ink focus:border-ink focus:outline-none"
                  />
                  <span>to</span>
                  <input
                    type="time"
                    defaultValue="18:00"
                    className="rounded-lg border-2 border-ink/20 bg-white px-3 py-1 text-xs uppercase tracking-widest text-ink focus:border-ink focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex flex-col gap-4 border-2 border-ink/20 bg-white/90 p-4 sm:p-5">
          <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-ink/5"></div>
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

      <div className="flex justify-end">
        <Button variant="primary">Save Changes</Button>
      </div>
    </section>
  );
};

const SectionTitle = ({ icon, title }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-ink/20 bg-cream">
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
        {description && (
          <p className="text-xs text-ink-muted">{description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={onChange}
        aria-pressed={checked}
        className={`relative h-6 w-12 rounded-full border-2 transition ${
          checked
            ? "border-ink bg-ink"
            : "border-ink/30 bg-cream"
        }`}
      >
        <span
          className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full transition ${
            checked ? "left-6 bg-cream" : "left-1 bg-ink/40"
          }`}
        />
      </button>
    </div>
  );
};

export default SettingsPage;
