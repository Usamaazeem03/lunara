import { useState } from "react";

import calendarIcon from "../../Shared/assets/icons/calendar.svg";
import clockIcon from "../../Shared/assets/icons/clock.svg";
import creditCardIcon from "../../Shared/assets/icons/credit-card.svg";
import giftIcon from "../../Shared/assets/icons/gift-box-benefits.svg";
import DashboardHeader from "../../Shared/layouts/DashboardHeader";

import StatCards from "../Client/StatCards";
import Button from "../../Shared/Button";

const ClientPage = () => {
  const stats = [
    {
      title: "Total Clients",
      value: "342",
      subtitle: "All time",
      icon: giftIcon,
    },
    {
      title: "New This Month",
      value: "28",
      subtitle: "March 2026",
      icon: calendarIcon,
    },
    {
      title: "Active Clients",
      value: "287",
      subtitle: "Visited in 90 days",
      icon: clockIcon,
    },
    {
      title: "Avg. Lifetime Value",
      value: "GBP 1,245",
      subtitle: "Per client",
      icon: creditCardIcon,
    },
  ];

  const clients = [
    {
      id: "CL-101",
      name: "Emily Parker",
      initials: "EP",
      phone: "(555) 123-4567",
      email: "emily.parker@email.com",
      lastVisit: "Jan 20, 2026",
      totalSpent: "GBP 1,240",
    },
    {
      id: "CL-102",
      name: "Michael Chen",
      initials: "MC",
      phone: "(555) 234-5678",
      email: "michael.chen@email.com",
      lastVisit: "Jan 19, 2026",
      totalSpent: "GBP 890",
    },
    {
      id: "CL-103",
      name: "Sarah Williams",
      initials: "SW",
      phone: "(555) 345-6789",
      email: "sarah.w@email.com",
      lastVisit: "Jan 18, 2026",
      totalSpent: "GBP 2,150",
    },
    {
      id: "CL-104",
      name: "James Brown",
      initials: "JB",
      phone: "(555) 456-7890",
      email: "james.b@email.com",
      lastVisit: "Jan 17, 2026",
      totalSpent: "GBP 560",
    },
  ];

  const [searchQuery, setSearchQuery] = useState("");

  return (
    <section className="flex h-full flex-col">
      <DashboardHeader
        eyebrow="Clients"
        title="Clients"
        description="Manage your client database."
      >
        <Button variant="primary">Add New Client</Button>
      </DashboardHeader>

      <StatCards stats={stats} lgGridCols={4} />

      <div className="mt-5 grid gap-3">
        <div className="border-ink/20 flex flex-wrap items-center justify-between gap-3 border-2 bg-white/90 p-3 sm:p-4">
          <div className="border-ink/20 flex w-full flex-1 items-center gap-2 border-2 bg-white px-3 py-2 sm:w-auto">
            <img src={calendarIcon} alt="" className="h-4 w-4 opacity-60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by name, email, or phone..."
              className="text-ink w-full bg-transparent text-xs tracking-widest uppercase focus:outline-none"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button className="border-ink/30 hover:border-ink border-2 bg-white px-4 py-2 text-xs tracking-widest uppercase transition">
              Filter
            </button>
            <button className="border-ink/30 hover:border-ink border-2 bg-white px-4 py-2 text-xs tracking-widest uppercase transition">
              Sort
            </button>
          </div>
        </div>

        <div className="border-ink/20 relative flex min-h-0 flex-1 flex-col border-2 bg-white/90">
          <div className="bg-ink/5 absolute -top-10 -right-10 h-24 w-24 rounded-full"></div>
          <div className="border-ink/10 bg-cream text-ink-muted hidden border-b-2 px-4 py-3 text-xs tracking-widest uppercase sm:grid sm:grid-cols-[1.4fr_1.6fr_1fr_0.9fr_0.8fr]">
            <span>Name</span>
            <span>Contact</span>
            <span>Last Visit</span>
            <span>Total Spent</span>
            <span>Actions</span>
          </div>

          <div className="scrollbar-hidden flex-1 overflow-y-auto">
            {clients.map((client) => (
              <ClientRow key={client.id} client={client} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ClientRow = ({ client }) => {
  return (
    <div className="border-ink/10 hover:bg-cream/50 grid gap-3 border-b px-4 py-3 text-sm transition sm:grid-cols-[1.4fr_1.6fr_1fr_0.9fr_0.8fr] sm:items-center">
      <p className="text-ink-muted text-xs tracking-widest uppercase sm:hidden">
        Name
      </p>
      <div className="flex items-center gap-3">
        <span className="border-ink/20 bg-cream text-ink-muted flex h-10 w-10 items-center justify-center rounded-full border text-xs font-semibold uppercase">
          {client.initials}
        </span>
        <span className="font-semibold">{client.name}</span>
      </div>

      <p className="text-ink-muted text-xs tracking-widest uppercase sm:hidden">
        Contact
      </p>
      <div className="text-ink-muted text-xs">
        <p>{client.phone}</p>
        <p>{client.email}</p>
      </div>

      <p className="text-ink-muted text-xs tracking-widest uppercase sm:hidden">
        Last Visit
      </p>
      <div className="flex items-center gap-2">
        <img src={calendarIcon} alt="" className="h-4 w-4 opacity-60" />
        <span>{client.lastVisit}</span>
      </div>

      <p className="text-ink-muted text-xs tracking-widest uppercase sm:hidden">
        Total Spent
      </p>
      <span className="font-semibold">{client.totalSpent}</span>

      <p className="text-ink-muted text-xs tracking-widest uppercase sm:hidden">
        Actions
      </p>
      <button className="border-ink hover:bg-ink hover:text-cream w-fit border-2 px-3 py-1 text-xs tracking-widest uppercase transition">
        View Profile
      </button>
    </div>
  );
};

export default ClientPage;
