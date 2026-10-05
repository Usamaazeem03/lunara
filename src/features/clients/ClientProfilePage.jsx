import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import AppHeader from "../../AppLayout/AppHeader";
import Button from "../../Shared/Button";
import Icon from "../../Shared/ui/Icon";
import StatCards from "../Dashboard/Client/StatCards";
import AppointmentDetailsModal from "../Dashboard/Admin/AppointmentDetailsModal";
import ClientProfileSummary from "./ClientProfileSummary";
import ClientRewards from "./ClientRewards";
import ClientAppointmentHistory from "./ClientAppointmentHistory";
import { useClientProfile } from "./useClientProfile";
import { formatCurrency } from "../../utils/currency";

function ClientProfilePage() {
  const { t } = useTranslation();
  const {
    ownerId,
    client,
    avatarUrl,
    avatarError,
    rows,
    metrics,
    currencyCode,
    currencyLoading,
    currencyError,
    isLoading,
    loadError,
    backPath,
    retry,
  } = useClientProfile();
  const [selectedId, setSelectedId] = useState(null);
  const selected = rows.find((row) => row.id === selectedId);
  const selectedAppointment = selected ? { ...selected, avatarUrl } : null;
  const nextAppointment = rows.find(
    (row) => row.id === metrics.nextAppointment?.id,
  );
  const money = (value) =>
    currencyLoading
      ? "..."
      : currencyError || !currencyCode
        ? t("common.unavailable")
        : formatCurrency(value, currencyCode);
  const stats = [
    {
      title: t("clients.totalBookings"),
      value: String(metrics.appointmentCount),
      subtitle: t("clients.allStatuses"),
      icon: (
        <Icon name="calendar-week" size={20} className="text-ink-muted/70" />
      ),
    },
    {
      title: t("common.completedVisits"),
      value: String(metrics.completedCount),
      subtitle: t("clients.atThisSalon"),
      icon: (
        <Icon name="assept-document" size={20} className="text-ink-muted/70" />
      ),
    },
    {
      title: t("clients.totalSpent"),
      value: money(metrics.totalSpent),
      subtitle: t("clients.completedVisitsOnly"),
      icon: (
        <Icon name="credit-card-alt" size={20} className="text-ink-muted/70" />
      ),
    },
    {
      title: t("clients.averageVisit"),
      value: money(metrics.averageSpent),
      subtitle: t("clients.perCompletedVisit"),
      icon: (
        <Icon
          name="tachometer-average"
          size={20}
          className="text-ink-muted/70"
        />
      ),
    },
  ];
  return (
    <section className="flex min-w-0 flex-col pb-4">
      <AppHeader
        eyebrow={t("nav.clients")}
        title={client?.full_name || t("clients.clientProfile")}
        description={t("clients.contactDetailsUpcomingBookingsAndAppointmentHistory")}
      >
        <Button to={backPath} variant="secondary"> {t("clients.backToClients")} </Button>
      </AppHeader>
      {loadError ? (
        <div
          role="alert"
          className="border-danger/30 bg-danger/5 mt-4 border p-5 text-sm"
        >
          <p>{loadError}</p>
          <Button className="mt-3" onClick={() => retry()}> {t("common.tryAgain")} </Button>
        </div>
      ) : isLoading ? (
        <div
          role="status"
          className="border-ink/20 text-ink-muted mt-4 border-2 bg-white/90 p-8 text-sm"
        > {t("clients.loadingClientProfile")} </div>
      ) : !client ? (
        <div className="border-ink/20 bg-cream mt-4 border-2 border-dashed p-8 text-center">
          <h2 className="font-semibold">{t("clients.clientProfileUnavailable")}</h2>
          <p className="text-ink-muted mt-2 text-sm"> {t("clients.returnToClientsAndSelectThePersonYouWantTo")} </p>
        </div>
      ) : (
        <>
          <StatCards stats={stats} lgGridCols={4} />
          <ClientRewards client={client} ownerId={ownerId} />
          {(currencyError || avatarError) && (
            <p role="status" className="text-ink-muted mt-3 text-xs">
              {currencyError
                ? t("clients.salonCurrencyCouldNotBeLoadedAmountsAreTemporarilyUnavailable")
                : t("clients.theProfilePhotoCouldNotBeLoaded")}
            </p>
          )}
          <div className="mt-5 grid items-start gap-4 xl:grid-cols-[minmax(260px,0.7fr)_minmax(0,2fr)]">
            <ClientProfileSummary
              client={client}
              avatarUrl={avatarUrl}
              nextAppointment={nextAppointment}
              upcomingCount={metrics.upcomingCount}
              onSelectAppointment={(row) => setSelectedId(row.id)}
            />
            <ClientAppointmentHistory
              rows={rows}
              onSelect={(row) => setSelectedId(row.id)}
            />
          </div>
        </>
      )}
      <AppointmentDetailsModal
        appointment={selectedAppointment}
        onClose={() => setSelectedId(null)}
        showActions={false}
      />
    </section>
  );
}

export default function ClientProfileRoute() {
  useTranslation();
  const { clientSlug } = useParams();
  const location = useLocation();
  const clientId =
    new URLSearchParams(location.search).get("client") ||
    location.state?.clientId ||
    "";
  return <ClientProfilePage key={`${clientSlug}:${clientId}`} />;
}
