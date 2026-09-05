import { useCallback, useEffect, useState } from "react";

import calendarIcon from "../../../Shared/assets/icons/calendar.svg";
import clockIcon from "../../../Shared/assets/icons/clock.svg";
import creditCardIcon from "../../../Shared/assets/icons/credit-card.svg";
import giftIcon from "../../../Shared/assets/icons/gift-box-benefits.svg";
import { useNavigate, useParams } from "react-router-dom";
import AppHeader from "../../../AppLayout/AppHeader";

import StatCards from "../Client/StatCards";
import Button from "../../../Shared/Button";
import { supabase } from "../../../services/supabase";
import { getInitials } from "../../../Shared/utils/appointmentUtils";

const normalizeComparableText = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

const normalizePhoneText = (value) => String(value ?? "").replace(/\D/g, "");

const slugifyClientName = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "client";

const appointmentMatchesClient = (appointment, client) => {
  if (!appointment || !client) return false;

  if (
    appointment.client_id &&
    (String(appointment.client_id) === String(client.id) ||
      String(appointment.client_id) === String(client.auth_id ?? ""))
  ) {
    return true;
  }

  const appointmentName = normalizeComparableText(appointment.client_name);
  const clientName = normalizeComparableText(client.full_name);
  if (appointmentName && clientName && appointmentName === clientName) {
    return true;
  }

  const appointmentPhone = normalizePhoneText(appointment.client_phone);
  const clientPhone = normalizePhoneText(client.phone);
  if (appointmentPhone && clientPhone && appointmentPhone === clientPhone) {
    return true;
  }

  const appointmentEmail = normalizeComparableText(appointment.client_email);
  const clientEmail = normalizeComparableText(client.email);
  if (appointmentEmail && clientEmail && appointmentEmail === clientEmail) {
    return true;
  }

  return false;
};

const createAppointmentClientRecord = (appointment, fallbackIndex) => ({
  id:
    appointment.client_id ??
    appointment.id ??
    `appointment-client-${fallbackIndex + 1}`,
  auth_id: appointment.client_id ?? null,
  full_name: appointment.client_name ?? "Unknown Client",
  phone: appointment.client_phone ?? null,
  email: appointment.client_email ?? null,
});

const fillMissingClientDetails = (client, appointment) => ({
  ...client,
  auth_id: client.auth_id ?? appointment.client_id ?? null,
  full_name:
    client.full_name && client.full_name !== "Unknown Client"
      ? client.full_name
      : (appointment.client_name ?? client.full_name),
  phone: client.phone ?? appointment.client_phone ?? null,
  email: client.email ?? appointment.client_email ?? null,
});

const ClientPage = () => {
  const navigate = useNavigate();
  const { slug: ownerRouteSlug } = useParams();
  const [clientsData, setClientsData] = useState([]);
  const [ownerId, setOwnerId] = useState(null);
  const [clientsAppointmentsData, setClientsAppointmentsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // to show add client tab
  const [showAddClient, setShowAddClient] = useState(false);
  // add form state
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
  });

  // handle form input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // handle form submission to add new client to database
  const handleAddClient = async (e) => {
    e.preventDefault();
    if (!ownerId) {
      console.error("Owner ID is not ready yet.");
      return;
    }

    const { full_name, phone, email } = formData;
    const { error } = await supabase.from("profiles").insert([
      {
        full_name,
        phone,
        email,
        role: "client",
        owner_id: ownerId,
      },
    ]);
    if (error) {
      console.error("Error adding client:", error);
      return;
    }
    // ✅ refresh list
    await fetchClients();

    // ✅ close modal
    setShowAddClient(false);

    // ✅ reset form
    setFormData({ full_name: "", phone: "", email: "" });
  };

  //________fetch clients from database table profiles and appointments
  const fetchClients = useCallback(async () => {
    if (!ownerId) return;
    // fetch clients from database and set to state
    const { data, error } = await supabase
      .from("profiles")
      .select("id, auth_id, full_name, phone, email, owner_id")
      .eq("role", "client")
      .eq("owner_id", ownerId)
      .order("full_name", { ascending: true });
    if (error) {
      console.error("Error fetching clients:", error);
    } else {
      setClientsData(data);
    }
  }, [ownerId]);

  //_________fetch appointments to get last visit and total spent for each client
  const fetchAppointments = useCallback(async () => {
    if (!ownerId) return;
    // fetch appointments and calculate last visit and total spent for each client
    const { data, error } = await supabase
      .from("appointments")
      .select(
        "id, client_id, client_name, client_phone, client_email, appointment_date, price",
      )
      .eq("owner_id", ownerId);
    if (error) {
      console.error("Error fetching appointments:", error);
    } else {
      setClientsAppointmentsData(data);
    }
  }, [ownerId]);
  // call these functions in useEffect on component mount
  // useEffect(() => {
  //   const loadData = async () => {
  //     setIsLoading(true);
  //     await fetchClients();
  //     await fetchAppointments();
  //     setIsLoading(false);
  //   };

  //   loadData();
  // }, []);
  // Step 1 — get owner id on mount
  useEffect(() => {
    const getOwner = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setOwnerId(user.id);
    };
    getOwner();
  }, []);

  // Step 2 — load data only after ownerId is ready
  useEffect(() => {
    const loadData = async () => {
      if (!ownerId) return; // ← wait until ownerId exists
      setIsLoading(true);
      await fetchClients();
      await fetchAppointments();
      setIsLoading(false);
    };
    loadData();
  }, [ownerId, fetchAppointments, fetchClients]); // ← re-runs when ownerId becomes available
  // Merge profile-backed clients with appointment-only customers.
  const profileClients = clientsData.map((client) => ({
    id: client.id,
    auth_id: client.auth_id ?? null,
    full_name: client.full_name ?? "Unknown Client",
    phone: client.phone ?? null,
    email: client.email ?? null,
  }));

  const appointmentOnlyClients = [];

  clientsAppointmentsData.forEach((appointment, index) => {
    const matchesProfileClient = profileClients.some((client) =>
      appointmentMatchesClient(appointment, client),
    );

    if (matchesProfileClient) {
      return;
    }

    const existingFallbackClient = appointmentOnlyClients.find((client) =>
      appointmentMatchesClient(appointment, client),
    );

    if (existingFallbackClient) {
      Object.assign(
        existingFallbackClient,
        fillMissingClientDetails(existingFallbackClient, appointment),
      );
      return;
    }

    appointmentOnlyClients.push(
      createAppointmentClientRecord(appointment, index),
    );
  });

  const allClientRecords = [...profileClients, ...appointmentOnlyClients].sort(
    (a, b) =>
      String(a.full_name ?? "").localeCompare(String(b.full_name ?? "")) ||
      String(a.id ?? "").localeCompare(String(b.id ?? "")),
  );

  const mergedClients = allClientRecords.map((client) => {
    const clientAppointments = clientsAppointmentsData.filter((appt) =>
      appointmentMatchesClient(appt, client),
    );
    let totalSpent = 0;
    let lastVisit = null;

    clientAppointments.forEach((appt) => {
      totalSpent += Number(appt.price) || 0;

      if (!lastVisit || new Date(appt.appointment_date) > new Date(lastVisit)) {
        lastVisit = appt.appointment_date;
      }
    });
    return {
      id: client.id,
      full_name: client.full_name || client.name || "Unknown Client",
      initials: getInitials(client.full_name || client.name),
      phone: client.phone,
      email: client.email,
      lastVisit: lastVisit || "No visits",
      totalSpent: `GBP ${totalSpent}`,
    };
  });
  ////////////////////////////////////////////////////
  // cade dates and numbers for stats cards
  // total clients used in stats card
  const totalClients = mergedClients.length;
  // active clients used in stats card (visited in last 90 days)
  const activeClients = mergedClients.filter((client) => {
    if (!client.lastVisit || client.lastVisit === "No visits") return false;

    const last = new Date(client.lastVisit);
    const now = new Date();
    return (now - last) / (1000 * 60 * 60 * 24) <= 90; // active if visited in last 90 days
  }).length;
  // total revenue used in stats card
  const totalRevenue = mergedClients.reduce((sum, client) => {
    const amount = Number(String(client.totalSpent).replace(/[^0-9.-]/g, ""));
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);
  // average lifetime value used in stats card
  const avgValue =
    totalClients > 0 ? Math.round(totalRevenue / totalClients) : 0;

  const stats = [
    {
      title: "Total Clients",
      value: totalClients,
      subtitle: "All time",
      icon: giftIcon,
    },
    {
      title: "Active Clients",
      value: activeClients,
      subtitle: "Visited in 90 days",
      icon: clockIcon,
    },
    {
      title: "Total Revenue",
      value: `GBP ${totalRevenue}`,
      subtitle: "From clients",
      icon: creditCardIcon,
    },
    {
      title: "Avg. Lifetime Value",
      value: `GBP ${avgValue}`,
      subtitle: "Per client",
      icon: calendarIcon,
    },
  ];
  /////////////////////////////////////////////////////////////////////////

  // make search featuer
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClients = mergedClients.filter(
    (client) =>
      (client.full_name || client.name)
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone?.includes(searchQuery),
  );

  const handleViewProfile = useCallback(
    (client) => {
      const clientSlug = slugifyClientName(client.full_name || client.name);
      const salonSlug = ownerRouteSlug || ownerId || "salon";

      navigate(`/owner/salon/${salonSlug}/clients/${clientSlug}`, {
        state: {
          clientId: client.id,
          clientName: client.full_name || client.name || "Unknown Client",
        },
      });
    },
    [navigate, ownerId, ownerRouteSlug],
  );

  return (
    <>
      <section className="flex h-full flex-col">
        <AppHeader
          eyebrow="Clients"
          title="Clients"
          description="Manage your client database."
        >
          <Button
            variant="primary"
            onClick={() => setShowAddClient(true)}
            disabled={!ownerId}
          >
            Add New Client
          </Button>
        </AppHeader>

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
              {/* {filteredClients.map((client) => (
              <ClientRow key={client.id} client={client} />
            ))} */}
              <div className="scrollbar-hidden flex-1 overflow-y-auto">
                {isLoading ? (
                  <div className="p-4 text-center text-sm text-gray-500">
                    Loading clients...
                  </div>
                ) : filteredClients.length > 0 ? (
                  filteredClients.map((client) => (
                    <ClientRow
                      key={client.id}
                      client={client}
                      onViewProfile={handleViewProfile}
                    />
                  ))
                ) : (
                  <div className="border-ink/30 bg-cream text-ink-muted m-4 border-2 border-dashed p-4 text-center text-sm">
                    {searchQuery ? (
                      <>
                        <span className="font-semibold">"{searchQuery}"</span>{" "}
                        is not found.
                      </>
                    ) : (
                      "No clients available."
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>{" "}
      {showAddClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          {/* Modal Panel - larger size with header and close button */}
          <div className="border-ink/20 relative z-10 flex max-h-[95vh] w-full max-w-2xl flex-col overflow-y-auto border-2 bg-white sm:mx-4 sm:max-h-[92vh]">
            {/* Top accent bar */}
            <div className="bg-ink h-1 w-full" />

            {/* Header with Close Button */}
            <div className="border-ink/10 flex items-start justify-between border-b-2 px-5 py-4">
              <div>
                <p className="text-ink text-base leading-tight font-semibold">
                  Add New Client
                </p>
              </div>

              <button
                onClick={() => setShowAddClient(false)}
                className="border-ink/20 text-ink-muted hover:border-ink hover:text-ink flex h-8 w-8 shrink-0 items-center justify-center border-2 text-xs transition"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Form Content */}
            <div className="overflow-y-auto p-4 sm:p-5">
              <form onSubmit={handleAddClient} className="space-y-4">
                <p className="text-ink-muted text-xs tracking-widest uppercase">
                  Add New Client
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="text-ink-muted text-xs tracking-widest uppercase">
                    Full Name *
                    <input
                      name="full_name"
                      type="text"
                      onChange={handleInputChange}
                      placeholder="e.g. Emily Parker"
                      className="border-ink/20 text-ink focus:border-ink mt-2 w-full border-2 bg-white px-3 py-2 text-sm focus:outline-none"
                      required
                    />
                  </label>

                  <label className="text-ink-muted text-xs tracking-widest uppercase">
                    Phone
                    <input
                      name="phone"
                      type="tel"
                      onChange={handleInputChange}
                      placeholder="(555) 111-2222"
                      className="border-ink/20 text-ink focus:border-ink mt-2 w-full border-2 bg-white px-3 py-2 text-sm focus:outline-none"
                    />
                  </label>

                  <label className="text-ink-muted text-xs tracking-widest uppercase">
                    Email
                    <input
                      name="email"
                      type="email"
                      onChange={handleInputChange}
                      placeholder="client@email.com"
                      className="border-ink/20 text-ink focus:border-ink mt-2 w-full border-2 bg-white px-3 py-2 text-sm focus:outline-none"
                    />
                  </label>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button type="submit" variant="primary" disabled={!ownerId}>
                    Save Client
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowAddClient(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const ClientRow = ({ client, onViewProfile }) => {
  return (
    <div className="border-ink/10 hover:bg-cream/50 grid gap-3 border-b px-4 py-3 text-sm transition sm:grid-cols-[1.4fr_1.6fr_1fr_0.9fr_0.8fr] sm:items-center">
      <p className="text-ink-muted text-xs tracking-widest uppercase sm:hidden">
        Name
      </p>
      <div className="flex items-center gap-3">
        <span className="border-ink/20 bg-cream text-ink-muted flex h-10 w-10 items-center justify-center rounded-full border text-xs font-semibold uppercase">
          {client.initials}
        </span>
        <span className="font-semibold">
          {client.full_name || client.name || "Unknown Client"}
        </span>
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
      <button
        type="button"
        onClick={() => onViewProfile?.(client)}
        className="border-ink hover:bg-ink hover:text-cream w-fit border-2 px-3 py-1 text-xs tracking-widest uppercase transition"
      >
        View Profile
      </button>
    </div>
  );
};

export default ClientPage;
