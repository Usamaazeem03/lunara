import { useTranslation } from "react-i18next";
import AppHeader from "../../AppLayout/AppHeader";
import Button from "../../Shared/Button";
import ClientFilter from "./ClientFilter";
import ClientsTable from "./ClientsTable";
import ClientsStats from "./ClientsStats";
import CreateClientForm from "./CreateClientForm";
import { useClientsPage } from "./useClientsPage";

export default function ClientsPage() {
  const { t } = useTranslation();
  const {
    ownerId,
    currencyCode,
    isLoading,
    isCurrencyLoading,
    loadError,
    clients,
    filteredClients,
    searchQuery,
    setSearchQuery,
    showForm,
    openCreateForm,
    closeForm,
    viewProfile,
  } = useClientsPage();

  return (
    <>
      <section className="flex h-full flex-col">
        <AppHeader
          eyebrow={t("nav.clients")}
          title={t("nav.clients")}
          description={t("clients.manageYourClientDatabase")}
        >
          <Button
            variant="primary"
            onClick={openCreateForm}
            disabled={!ownerId}
          > {t("clients.addNewClient")} </Button>
        </AppHeader>
        <ClientsStats
          clients={clients}
          currencyCode={currencyCode}
          isLoading={isLoading || isCurrencyLoading}
          error={loadError}
        />
        <div className="mt-5 grid gap-3">
          <ClientFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          <ClientsTable
            clients={filteredClients}
            currencyCode={currencyCode}
            isLoading={isLoading}
            loadError={loadError}
            searchQuery={searchQuery}
            onViewProfile={viewProfile}
          />
        </div>
      </section>
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <CreateClientForm ownerId={ownerId} onCloseForm={closeForm} />
        </div>
      )}
    </>
  );
}
