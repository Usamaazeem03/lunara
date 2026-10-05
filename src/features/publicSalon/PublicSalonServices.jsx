import { useState } from "react";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "../../utils/currency.js";
import Icon from "../../Shared/ui/Icon";
import { getServiceIcon } from "../../Shared/lib/serviceCategories";
const PAGE_SIZE = 6;

export default function PublicSalonServices({ services, currencyCode }) {
  const { t, i18n } = useTranslation();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const categories = [
    ...new Set(
      services
        .map((service) => service.category)
        .filter((value) => typeof value === "string" && value.trim()),
    ),
  ];
  const search = query.trim().toLocaleLowerCase(i18n.resolvedLanguage);
  const filtered = services.filter(
    (service) =>
      (!category || service.category === category) &&
      [service.name, service.description, service.category]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase(i18n.resolvedLanguage)
        .includes(search),
  );
  return (
    <section id="salon-services">
      <div className="salon-section-heading">
        <div>
          <p className="salon-eyebrow">{t("salon.whatWeOffer")}</p>
          <h2>{t("salon.page.findYourMoment")}</h2>
        </div>
        <span className="salon-count">
          {services.length} {t("nav.services")}
        </span>
      </div>
      <p className="salon-section-description">
        {t("salon.page.servicesDescription")}
      </p>
      {services.length > 0 && (
        <>
          <label className="salon-search">
            <Icon name="search" size={19} aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setLimit(PAGE_SIZE);
              }}
              placeholder={t("salon.page.searchServices")}
              aria-label={t("salon.page.searchServices")}
            />
            {query && (
              <button
                type="button"
                aria-label={t("salon.page.clearSearch")}
                onClick={() => {
                  setQuery("");
                  setLimit(PAGE_SIZE);
                }}
              >
                <Icon name="close-x" size={16} aria-hidden="true" />
              </button>
            )}
          </label>
          {categories.length > 0 && (
            <div
              className="salon-filters"
              role="group"
              aria-label={t("salon.page.serviceCategories")}
            >
              <button
                type="button"
                aria-pressed={!category}
                onClick={() => {
                  setCategory("");
                  setLimit(PAGE_SIZE);
                }}
              >
                {t("salon.page.allServices")}
              </button>
              {categories.map((value) => (
                <button
                  type="button"
                  key={value}
                  aria-pressed={category === value}
                  onClick={() => {
                    setCategory(value);
                    setLimit(PAGE_SIZE);
                  }}
                >
                  {value}
                </button>
              ))}
            </div>
          )}
        </>
      )}
      <div
        className="salon-service-list"
        aria-live="polite"
        aria-atomic="false"
      >
        {filtered.length === 0 ? (
          <div className="salon-empty">
            <Icon name="search" size={28} aria-hidden="true" />
            <p>
              {t(
                services.length
                  ? "salon.page.noResults"
                  : "salon.noServicesListedYet",
              )}
            </p>
            {services.length > 0 && (
              <button
                className="salon-text-button"
                onClick={() => {
                  setQuery("");
                  setCategory("");
                  setLimit(PAGE_SIZE);
                }}
              >
                {t("salon.page.resetFilters")}
              </button>
            )}
          </div>
        ) : (
          filtered.slice(0, limit).map((service) => (
            <article className="salon-service" key={service.id}>
              <span className="salon-service-icon">
                <Icon
                  name={getServiceIcon(service.category)}
                  size={23}
                  aria-hidden="true"
                />
              </span>
              <div className="salon-service-info">
                <h3>{service.name}</h3>
                {service.description && <p>{service.description}</p>}
                <div className="salon-service-meta">
                  {(service.duration_minutes || service.duration) && (
                    <span>
                      <Icon name="clock" size={13} aria-hidden="true" />
                      {service.duration_minutes
                        ? t("common.min", { value1: service.duration_minutes })
                        : service.duration}
                    </span>
                  )}
                  {service.category && <span>{service.category}</span>}
                </div>
              </div>
              <strong className="salon-service-price">
                {formatCurrency(service.price, currencyCode)}
              </strong>
            </article>
          ))
        )}
      </div>
      {filtered.length > PAGE_SIZE && (
        <div className="salon-list-footer">
          <span>
            {t("salon.page.showingServices", {
              shown: Math.min(limit, filtered.length),
              total: filtered.length,
            })}
          </span>
          <button
            type="button"
            className="salon-text-button"
            onClick={() =>
              setLimit(limit >= filtered.length ? PAGE_SIZE : limit + PAGE_SIZE)
            }
          >
            {t(
              limit >= filtered.length
                ? "salon.showLess"
                : "salon.page.showMore",
            )}{" "}
            <span aria-hidden="true">
              {limit >= filtered.length ? "−" : "+"}
            </span>
          </button>
        </div>
      )}
    </section>
  );
}
