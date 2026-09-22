import ClientPageHeader from "../Dashboard/Client/components/ClientPageHeader";
import ClientInformation from "./ClientInformation";
import AccountSecurity from "./AccountSecurity";

export default function ClientSettingsPage() {
  return (
    <section className="mx-auto max-w-3xl">
      <ClientPageHeader
        eyebrow="Your account"
        title="Settings"
        description="Update your personal information and manage your account security."
      />
      <div className="space-y-5">
        <ClientInformation />
        <AccountSecurity variant="client" />
      </div>
    </section>
  );
}
