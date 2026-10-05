import { useTranslation } from "react-i18next";
import ClientPageHeader from "../Dashboard/Client/components/ClientPageHeader";
import ClientInformation from "./ClientInformation";
import AccountSecurity from "./AccountSecurity";
import LanguageSelector from "../../Shared/ui/LanguageSelector.jsx";

export default function ClientSettingsPage() {
  const { t } = useTranslation();
  return (
    <section className="mx-auto max-w-3xl">
      <ClientPageHeader
        eyebrow={t("clients.yourAccount")}
        title={t("nav.settings")}
        description={t("clients.updateYourPersonalInformationAndManageYourAccountSecurity")}
      />
      <div className="space-y-5">
        <ClientInformation />
        <LanguageSelector variant="client" />
        <AccountSecurity variant="client" />
      </div>
    </section>
  );
}
