import { useState } from "react";

import calendarIcon from "../../assets/icons/calendar.svg";
import clockIcon from "../../assets/icons/clock.svg";
import creditCardIcon from "../../assets/icons/credit-card.svg";
import giftIcon from "../../assets/icons/gift-box-benefits.svg";
import hairCareIcon from "../../assets/icons/hair-care.svg";
import skinCareIcon from "../../assets/icons/skin-care.svg";
import bodyRelaxIcon from "../../assets/icons/body-relax.svg";
import DashboardHeader from "../Shared/DashboardHeader";
import StatCards from "../Client/StatCards";
import Button from "../Shared/Button";

const ServicesPage = () => {
  const stats = [
    {
      title: "Total Services",
      value: "12",
      subtitle: "Across all categories",
      icon: giftIcon,
    },
    {
      title: "Avg. Price",
      value: "GBP 93",
      subtitle: "Based on catalog",
      icon: creditCardIcon,
    },
    {
      title: "Most Popular",
      value: "Haircut & Style",
      subtitle: "Top booked",
      icon: hairCareIcon,
    },
    {
      title: "Categories",
      value: "4",
      subtitle: "Service groups",
      icon: calendarIcon,
    },
  ];

  const categories = ["All", "Hair", "Grooming", "Spa", "Nails"];

  const services = [
    {
      id: "SV-101",
      title: "Haircut",
      description: "Professional haircut with style.",
      price: "GBP 45",
      duration: "45 minutes",
      category: "Hair",
      icon: hairCareIcon,
    },
    {
      id: "SV-102",
      title: "Haircut & Style",
      description: "Complete haircut with premium styling.",
      price: "GBP 85",
      duration: "60 minutes",
      category: "Hair",
      icon: hairCareIcon,
    },
    {
      id: "SV-103",
      title: "Hair Coloring",
      description: "Full hair coloring service.",
      price: "GBP 150",
      duration: "120 minutes",
      category: "Hair",
      icon: hairCareIcon,
    },
    {
      id: "SV-104",
      title: "Glow Facial",
      description: "Deep cleansing glow treatment.",
      price: "GBP 75",
      duration: "50 minutes",
      category: "Spa",
      icon: skinCareIcon,
    },
    {
      id: "SV-105",
      title: "Relax Massage",
      description: "Full body tension relief.",
      price: "GBP 90",
      duration: "60 minutes",
      category: "Spa",
      icon: bodyRelaxIcon,
    },
  ];

  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const filteredServices =
    activeCategory === "All"
      ? services
      : services.filter((service) => service.category === activeCategory);

  return (
    <section className="flex h-full flex-col">
      <DashboardHeader
        eyebrow="Services"
        title="Services"
        description="Manage your salon services and pricing."
      >
        <Button variant="primary">Add Service</Button>
      </DashboardHeader>

      <StatCards stats={stats} lgGridCols={4} />

      <div className="mt-5 flex flex-col gap-4">
        <div className="border-2 border-ink/20 bg-white/90 p-3 sm:p-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const isActive = category === activeCategory;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full border-2 px-4 py-2 text-xs uppercase tracking-widest transition ${
                    isActive
                      ? "border-ink bg-cream text-ink"
                      : "border-ink/20 bg-white text-ink-muted hover:border-ink"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ServiceCard = ({ service }) => {
  return (
    <article className="relative flex h-full flex-col border-2 border-ink/20 bg-white/90 p-4 sm:p-5">
      <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-ink/5"></div>
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-ink/20 bg-cream">
          <img src={service.icon} alt="" className="h-6 w-6 opacity-70" />
        </div>
        <span className="rounded-full border-2 border-ink/20 bg-cream px-3 py-1 text-[0.65rem] uppercase tracking-widest text-ink-muted">
          {service.category}
        </span>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">{service.title}</h3>
        <p className="mt-1 text-sm text-ink-muted">{service.description}</p>
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/20 bg-cream">
            <img src={creditCardIcon} alt="" className="h-4 w-4 opacity-70" />
          </span>
          <span className="font-semibold">{service.price}</span>
        </div>
        <div className="flex items-center gap-2 text-ink-muted">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/20 bg-cream">
            <img src={clockIcon} alt="" className="h-4 w-4 opacity-70" />
          </span>
          <span>{service.duration}</span>
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        <button className="flex-1 border-2 border-ink/20 bg-cream px-4 py-2 text-xs uppercase tracking-widest transition hover:border-ink">
          Edit
        </button>
        <button className="flex-1 border-2 border-[#b0412e]/40 bg-[#b0412e]/10 px-4 py-2 text-xs uppercase tracking-widest text-[#b0412e] transition hover:border-[#b0412e]">
          Delete
        </button>
      </div>
    </article>
  );
};

export default ServicesPage;
