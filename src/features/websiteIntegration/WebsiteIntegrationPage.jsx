import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import Button from "../../Shared/Button";
import Icon from "../../Shared/ui/Icon";
import { notify } from "../../Shared/lib/toast";
import { useAuth } from "../../hooks/useAuth";
import { supabaseUrl } from "../../services/supabase";

const resources = [
  {
    key: "services",
    icon: "sparkles",
    fields: ["names", "descriptions", "prices", "duration", "images"],
  },
  {
    key: "staff",
    icon: "staff",
    fields: ["names", "roles", "specialties", "ratingAndShift"],
  },
  {
    key: "workingHours",
    icon: "clock",
    fields: ["openClosed", "openingTime", "closingTime", "breaks"],
  },
  {
    key: "salonInformation",
    icon: "barber-shop",
    fields: ["salonName", "image", "address", "phone", "email"],
  },
  { key: "settings", icon: "settings", fields: ["currency"] },
];

export default function WebsiteIntegrationPage() {
  const { t } = useTranslation();
  const { profile, loading, profileError, refetchProfile } = useAuth();
  const [responseOpen, setResponseOpen] = useState(false);
  const salonSlug = profile?.salon_slug?.trim();
  const publicApiUrl =
    salonSlug && supabaseUrl
      ? `${supabaseUrl}/functions/v1/public-salon?slug=${encodeURIComponent(salonSlug)}`
      : "";
  const fetchExample = publicApiUrl
    ? `fetch(${JSON.stringify(publicApiUrl)})\n  .then((response) => response.json())\n  .then((data) => console.log(data));`
    : "";

  // Fetch the raw response only for explicit developer actions.
  // Existing profile and public salon queries remain unchanged.
  const connection = useQuery({
    queryKey: ["website-integration-response", publicApiUrl],
    enabled: false,
    retry: false,
    networkMode: "always",
    queryFn: async ({ signal }) => {
      const response = await fetch(publicApiUrl, {
        method: "GET",
        credentials: "omit",
        signal: AbortSignal.any([signal, AbortSignal.timeout(15000)]),
      });
      const data = await response.json();
      return {
        data,
        status: response.status,
        ok: response.ok && data?.success === true,
      };
    },
  });
  const canConnect = Boolean(publicApiUrl) && !loading;
  const checking = connection.isFetching;
  const failed = connection.isError || connection.data?.ok === false;
  const connected = connection.data?.ok === true && !connection.isError;
  const statusKey = !canConnect
    ? "notReady"
    : checking
      ? "checking"
      : failed
        ? "connectionIssue"
        : "apiReady";

  async function copyText(text, successKey) {
    try {
      await navigator.clipboard.writeText(text);
      notify.success(t(successKey));
    } catch {
      notify.error(t("websiteIntegration.copyError"));
    }
  }

  function viewResponse() {
    setResponseOpen((open) => !open);
    if (!responseOpen && !connection.data && !checking) connection.refetch();
  }

  return (
    <section className="text-ink mx-auto flex w-full max-w-7xl min-w-0 flex-col gap-10 pb-6 sm:gap-12">
      <header>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-wide sm:text-3xl md:text-4xl">
            {t("nav.websiteIntegration")}
          </h1>
          <span
            className="border-ink/15 inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[0.65rem] tracking-widest uppercase"
            role="status"
          >
            <span
              aria-hidden="true"
              className={`h-1.5 w-1.5 shrink-0 rounded-full ${checking ? "bg-ink motion-safe:animate-pulse" : canConnect && !failed ? "bg-ink" : "bg-ink/30"}`}
            />
            {t(`websiteIntegration.${statusKey}`)}
          </span>
        </div>
        <div className="mt-7 grid items-center gap-8 bg-white/50 p-5 sm:p-8 xl:grid-cols-[1fr_1.2fr] xl:gap-12">
          <div>
            <p className="text-ink-muted mb-3 font-mono text-[0.65rem] tracking-widest uppercase">
              {t("websiteIntegration.heroEyebrow")}
            </p>
            <h2 className="max-w-sm text-2xl leading-tight font-semibold sm:text-3xl">
              {t("websiteIntegration.heroTitle")}
            </h2>
            <p className="text-ink-muted mt-4 max-w-sm text-sm leading-6">
              {t("websiteIntegration.heroDescription")}
            </p>
          </div>
          <figure className="min-w-0">
            <div className="flex flex-col items-stretch sm:flex-row sm:items-center">
              <ConnectionNode
                icon="category-alt"
                title="LUNARA API"
                detail={t("websiteIntegration.publicData")}
                dark
              />
              <div className="flex shrink-0 flex-col items-center justify-center gap-1 px-3 py-3 sm:w-28 sm:px-2">
                <span className="text-ink-muted text-center font-mono text-[0.6rem] tracking-wider uppercase">
                  {t(
                    `websiteIntegration.${checking ? "checking" : connected ? "connected" : failed ? "connectionIssue" : "dataFlow"}`,
                  )}
                </span>
                <svg
                  viewBox="0 0 100 16"
                  fill="none"
                  className="hidden h-5 w-full sm:block"
                  aria-hidden="true"
                >
                  <path
                    d="M0 8h96m-6-6 6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                </svg>
                <svg
                  viewBox="0 0 16 36"
                  fill="none"
                  className="h-9 w-4 sm:hidden"
                  aria-hidden="true"
                >
                  <path
                    d="M8 0v32m-6-6 6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                </svg>
              </div>
              <ConnectionNode
                icon="globe"
                title={t("websiteIntegration.yourWebsite")}
                detail={t("websiteIntegration.yourDesign")}
              />
            </div>
            <figcaption className="text-ink-muted mt-4 text-center text-xs leading-5">
              {t("websiteIntegration.diagramCaption")}
            </figcaption>
          </figure>
        </div>
      </header>

      <section aria-labelledby="public-api-heading" className="min-w-0">
        <SectionHeading
          number="01"
          id="public-api-heading"
          title={t("websiteIntegration.publicApi")}
        />
        {loading ? (
          <p role="status" className="text-ink-muted mt-5 text-sm">
            {t("websiteIntegration.loading")}
          </p>
        ) : profileError && !profile ? (
          <div className="mt-5">
            <p role="alert" className="text-sm">
              {t("common.yourAccountCouldNotBeLoadedPleaseTryAgain")}
            </p>
            <Button onClick={() => refetchProfile()} className="mt-4">
              {t("common.tryAgain")}
            </Button>
          </div>
        ) : !salonSlug ? (
          <div className="mt-5 bg-white/60 p-5" role="status">
            <h3 className="font-semibold">
              {t("websiteIntegration.missingSlugTitle")}
            </h3>
            <p className="text-ink-muted mt-2 text-sm leading-6">
              {t("websiteIntegration.missingSlugDescription")}
            </p>
          </div>
        ) : (
          <div className="mt-5 bg-white/70 p-5 sm:p-6">
            <dl className="mb-5 flex flex-wrap gap-x-8 gap-y-3 text-sm">
              <div className="flex items-center gap-2">
                <dt className="text-ink-muted">
                  {t("websiteIntegration.status")}:
                </dt>
                <dd className="font-medium">
                  {t(
                    `websiteIntegration.${!canConnect ? "notReady" : checking ? "checking" : failed ? "connectionIssue" : "ready"}`,
                  )}
                </dd>
              </div>
              <div className="flex min-w-0 items-baseline gap-2">
                <dt className="text-ink-muted">
                  {t("websiteIntegration.salon")}:
                </dt>
                <dd className="min-w-0 font-mono break-all">{salonSlug}</dd>
              </div>
            </dl>
            {publicApiUrl ? (
              <>
                <div className="bg-ink text-cream min-w-0 p-4 sm:p-5">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <p
                      id="public-api-label"
                      className="text-cream/65 text-[0.65rem] tracking-widest uppercase"
                    >
                      {t("websiteIntegration.endpoint")}
                    </p>
                    <Button
                      variant="custom"
                      className="border-cream/30 hover:bg-cream/10 min-h-11 border"
                      aria-label={t("websiteIntegration.copyEndpoint")}
                      onClick={() =>
                        copyText(
                          publicApiUrl,
                          "websiteIntegration.endpointCopied",
                        )
                      }
                    >
                      {t("websiteIntegration.copy")}
                    </Button>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-cream/60 pt-0.5 font-mono text-xs">
                      GET
                    </span>
                    <code
                      aria-labelledby="public-api-label"
                      className="min-w-0 font-mono text-sm leading-6 break-all select-all"
                    >
                      {publicApiUrl}
                    </code>
                  </div>
                </div>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Button
                    variant="secondary"
                    disabled={checking}
                    onClick={() => connection.refetch()}
                    className="inline-flex min-h-11 items-center justify-center gap-2"
                  >
                    <Icon
                      name="refresh-rotate"
                      size={16}
                      aria-hidden="true"
                      className={checking ? "motion-safe:animate-spin" : ""}
                    />
                    {t(
                      `websiteIntegration.${checking ? "testing" : "testConnection"}`,
                    )}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={viewResponse}
                    aria-expanded={responseOpen}
                    aria-controls="api-response-panel"
                    className="inline-flex min-h-11 items-center justify-center gap-2"
                  >
                    <Icon name="file-document" size={16} aria-hidden="true" />
                    {t(
                      `websiteIntegration.${responseOpen ? "hideResponse" : "viewResponse"}`,
                    )}
                  </Button>
                </div>
                <div
                  role="status"
                  aria-live="polite"
                  className="text-ink-muted mt-3 text-xs leading-5"
                >
                  {checking
                    ? t("websiteIntegration.testingDescription")
                    : failed
                      ? t("websiteIntegration.testError")
                      : connected
                        ? t("websiteIntegration.testSuccess")
                        : t("websiteIntegration.testHint")}
                </div>
                <div
                  id="api-response-panel"
                  hidden={!responseOpen}
                  className="bg-ink text-cream mt-5 min-w-0"
                >
                  <div className="border-cream/15 flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3 font-mono text-xs">
                    <span>response.json</span>
                    {!checking && !connection.isError && connection.data && (
                      <span>HTTP {connection.data.status}</span>
                    )}
                  </div>
                  {checking ? (
                    <p className="p-5 text-sm" role="status">
                      {t("websiteIntegration.loadingResponse")}
                    </p>
                  ) : connection.isError ? (
                    <p className="p-5 text-sm">
                      {t("websiteIntegration.testError")}
                    </p>
                  ) : connection.data ? (
                    <pre
                      tabIndex={0}
                      aria-label={t("websiteIntegration.responseLabel")}
                      className="max-h-96 overflow-auto p-5 font-mono text-xs leading-6 break-all whitespace-pre-wrap focus-visible:outline-2 focus-visible:outline-offset-2"
                    >
                      <code>
                        {JSON.stringify(connection.data.data, null, 2)}
                      </code>
                    </pre>
                  ) : null}
                </div>
              </>
            ) : (
              <p role="alert" className="text-ink-muted text-sm">
                {t("websiteIntegration.unavailable")}
              </p>
            )}
          </div>
        )}
      </section>

      <section aria-labelledby="available-data-heading">
        <SectionHeading
          number="02"
          id="available-data-heading"
          title={t("websiteIntegration.availableData")}
          description={t("websiteIntegration.resourcesDescription")}
        />
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {resources.map(({ key, icon, fields }) => (
            <article
              key={key}
              className="flex min-w-0 flex-col bg-white/65 p-5 sm:p-6"
            >
              <div className="mb-5 flex items-center justify-between gap-3">
                <Icon name={icon} size={24} aria-hidden="true" />
                <span className="text-ink-muted font-mono text-[0.6rem] tracking-widest uppercase">
                  {t("websiteIntegration.resource")}
                </span>
              </div>
              <h3 className="text-lg font-semibold">
                {t(`websiteIntegration.${key}`)}
              </h3>
              <p className="text-ink-muted mt-2 mb-5 text-sm leading-6">
                {t(`websiteIntegration.resourceDescriptions.${key}`)}
              </p>
              <ul className="mt-auto flex flex-wrap gap-2">
                {fields.map((field) => (
                  <li
                    key={field}
                    className="bg-ink/5 px-2 py-1 text-xs leading-5"
                  >
                    {t(`websiteIntegration.fields.${field}`)}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="developer-setup-heading" className="min-w-0">
        <SectionHeading
          number="03"
          id="developer-setup-heading"
          title={t("websiteIntegration.developerSetup")}
          description={t("websiteIntegration.developerDescription")}
        />
        {fetchExample && !loading ? (
          <div className="bg-ink text-cream mt-5 min-w-0">
            <div className="border-cream/15 flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3">
              <span className="text-cream/70 font-mono text-xs">
                JavaScript / fetch
              </span>
              <Button
                variant="custom"
                className="border-cream/30 hover:bg-cream/10 min-h-11 border"
                aria-label={t("websiteIntegration.copyExample")}
                onClick={() =>
                  copyText(fetchExample, "websiteIntegration.exampleCopied")
                }
              >
                {t("websiteIntegration.copy")}
              </Button>
            </div>
            <pre
              tabIndex={0}
              aria-label={t("websiteIntegration.fetchExample")}
              className="overflow-auto p-5 font-mono text-sm leading-7 break-all whitespace-pre-wrap focus-visible:outline-2 focus-visible:outline-offset-2 sm:p-6"
            >
              <code>{fetchExample}</code>
            </pre>
          </div>
        ) : (
          <p className="text-ink-muted mt-5 text-sm">
            {t("websiteIntegration.setupUnavailable")}
          </p>
        )}
      </section>

      <aside
        className="border-ink/15 flex items-start gap-4 border-t pt-6"
        aria-labelledby="public-security-heading"
      >
        <Icon
          name="access-control-password"
          size={22}
          className="mt-1 shrink-0"
          aria-hidden="true"
        />
        <div>
          <h2 id="public-security-heading" className="text-sm font-semibold">
            {t("websiteIntegration.publicReadOnly")}
          </h2>
          <p className="text-ink-muted mt-2 max-w-3xl text-sm leading-6">
            {t("websiteIntegration.securityDescription")}
          </p>
        </div>
      </aside>
    </section>
  );
}

function SectionHeading({ number, id, title, description }) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="text-ink-muted font-mono text-xs" aria-hidden="true">
          {number}
        </span>
        <h2 id={id} className="text-xl font-semibold sm:text-2xl">
          {title}
        </h2>
      </div>
      {description && (
        <p className="text-ink-muted mt-2 max-w-2xl text-sm leading-6">
          {description}
        </p>
      )}
    </div>
  );
}

function ConnectionNode({ icon, title, detail, dark = false }) {
  return (
    <div
      className={`flex min-w-0 flex-1 flex-col items-center p-5 text-center ${dark ? "bg-ink text-cream" : "border-ink/15 border bg-white/80"}`}
    >
      <Icon name={icon} size={26} aria-hidden="true" />
      <p className="mt-4 text-xs font-semibold tracking-widest uppercase">
        {title}
      </p>
      <p
        className={`mt-2 text-xs ${dark ? "text-cream/65" : "text-ink-muted"}`}
      >
        {detail}
      </p>
    </div>
  );
}
