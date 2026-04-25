import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../Shared/lib/supabaseClient";
import { notify } from "../Shared/lib/toast.jsx";
import Icon from "../Shared/ui/Icon";
import { QRCodeSVG } from "qrcode.react";

/**
 * Public Salon Page
 * Shows specific owner's services and staff
 * URL: /salon/:slug (e.g. /salon/john-martinez)
 */

function PublicSalonPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [ownerProfile, setOwnerProfile] = useState(null);
  const [staffMembers, setStaffMembers] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (error) notify.error(error);
  }, [error]);

  // Load owner profile and their services/staff
  useEffect(() => {
    const loadSalonData = async () => {
      setLoading(true);
      setError("");

      try {
        // 1. Find owner by slug
        const { data: profiles, error: profileError } = await supabase
          .from("profiles")
          .select("id, full_name, email, phone, role, created_at")
          .eq("salon_slug", slug)
          .eq("role", "owner")
          .single();

        if (profileError) {
          if (profileError.code === "PGRST116") {
            setError("Salon not found. Please check the URL.");
          } else {
            setError(profileError.message);
          }
          setLoading(false);
          return;
        }

        setOwnerProfile(profiles);

        // 2. Fetch owner's staff
        const { data: staffData, error: staffError } = await supabase
          .from("staff")
          .select(
            "id, name, phone, email, role, schedule, is_on_shift, specialties, rating, appointments_count",
          )
          .eq("owner_id", profiles.id)
          .order("name", { ascending: true });

        if (!staffError) {
          setStaffMembers(staffData || []);
        }

        // 3. Fetch owner's services
        const { data: servicesData, error: servicesError } = await supabase
          .from("services")
          .select("id, name, description, duration, price, category, owner_id")
          .eq("owner_id", profiles.id)
          .order("category", { ascending: true });

        if (!servicesError) {
          setServices(servicesData || []);
        }
      } catch (err) {
        setError(err.message || "Failed to load salon data");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadSalonData();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-ink/60">Loading salon...</p>
        </div>
      </div>
    );
  }

  if (error || !ownerProfile) {
    return (
      <div className="bg-cream-soft flex h-screen items-center justify-center px-4">
        <div className="max-w-md text-center">
          <p className="text-ink mb-2 text-2xl font-bold">Oops!</p>
          <p className="text-ink/60">{error || "Salon not found"}</p>
          <button
            onClick={() => navigate("/")}
            className="bg-ink text-cream hover:bg-ink/90 mt-6 rounded-lg px-6 py-2 transition"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const salonUrl = `${window.location.origin}/salon/${slug}`;
  const groupedServices = services.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {});

  const handleBooking = () => {
    localStorage.setItem("owner_id", ownerProfile.id); // ✅ saved
    navigate(`/auth/client/signin?owner_id=${ownerProfile.id}`); // ✅ navigated
  };

  return (
    <div className="bg-cream-soft min-h-screen">
      {/* Header */}
      <div className="border-ink/10 sticky top-0 z-10 border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-ink text-2xl font-bold">
              {ownerProfile.full_name}
            </h1>
            <p className="text-ink/60 text-sm">Salon</p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="text-ink/60 hover:text-ink transition"
            title="Go back"
          >
            <Icon name="close" size={24} />
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-8 lg:col-span-2">
            {/* Owner Info Card */}
            <div className="border-ink/10 rounded-xl border bg-white p-6">
              <h2 className="text-ink mb-4 text-xl font-bold">About</h2>
              <div className="space-y-2 text-sm">
                <div className="text-ink/70 flex items-center gap-3">
                  <Icon name="phone" size={18} />
                  <span>{ownerProfile.phone || "Contact unavailable"}</span>
                </div>
                <div className="text-ink/70 flex items-center gap-3">
                  <Icon name="email-envelope" size={18} />
                  <span>{ownerProfile.email}</span>
                </div>
              </div>
            </div>

            {/* Services */}
            <div>
              <h2 className="text-ink mb-6 text-2xl font-bold">Services</h2>
              {services.length === 0 ? (
                <p className="text-ink/60 py-8">No services available yet</p>
              ) : (
                <div className="space-y-6">
                  {Object.entries(groupedServices).map(
                    ([category, categoryServices]) => (
                      <div key={category}>
                        <h3 className="text-ink mb-3 text-xs font-semibold tracking-widest uppercase">
                          {category}
                        </h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                          {categoryServices.map((service) => (
                            <ServiceCard key={service.id} service={service} />
                          ))}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              )}
            </div>

            {/* Staff */}
            {/* <div>
              <h2 className="text-ink mb-6 text-2xl font-bold">Our Team</h2>
              {staffMembers.length === 0 ? (
                <p className="text-ink/60 py-8">No staff members available</p>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {staffMembers.map((staff) => (
                    <StaffCard key={staff.id} staff={staff} />
                  ))}
                </div>
              )}
            </div> */}
            {Array.isArray(staffMembers.specialties) &&
              staffMembers.specialties.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {staffMembers.specialties.map((spec, idx) => (
                    <span
                      key={idx}
                      className="bg-cream-soft text-ink/70 inline-block rounded px-2 py-1 text-xs"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              )}
          </div>

          {/* Sidebar: Share & QR Code */}
          <div className="space-y-6">
            {/* Shareable Link Card */}
            <div className="border-ink/10 rounded-xl border bg-white p-6">
              <h3 className="text-ink mb-4 text-lg font-bold">Share</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  value={salonUrl}
                  readOnly
                  className="border-ink/20 bg-cream-soft text-ink/60 w-full rounded-lg border px-3 py-2 text-sm"
                />
                <button
                  onClick={() => {
                    navigator.clipboard
                      .writeText(salonUrl)
                      .then(() => notify.success("Link copied!"))
                      .catch(() =>
                        notify.error(
                          "Could not copy the link. Please try again.",
                        ),
                      );
                  }}
                  className="bg-ink text-cream hover:bg-ink/90 w-full rounded-lg px-4 py-2 text-sm font-semibold transition"
                >
                  Copy Link
                </button>
              </div>
            </div>

            {/* QR Code */}
            <div className="border-ink/10 rounded-xl border bg-white p-6">
              <h3 className="text-ink mb-4 text-lg font-bold">QR Code</h3>
              <div className="bg-cream-soft flex justify-center rounded-lg p-4">
                <QRCodeSVG
                  value={salonUrl}
                  size={200}
                  level="H"
                  includeMargin={true}
                  fgColor="#2d2620"
                  bgColor="#f7f5f0"
                />
              </div>
              <p className="text-ink/60 mt-3 text-center text-xs">
                Scan to visit this salon
              </p>
            </div>

            {/* Book Appointment CTA */}
            {/* 
            @@@@@
            @@@@@
            @@@@@
            @@@@@ fix owner id 
            @@@@@
            @@@@@
             */}

            <button
              onClick={() => handleBooking()}
              className="bg-ink text-cream hover:bg-ink/90 w-full rounded-lg px-6 py-4 text-center font-bold tracking-widest uppercase transition"
            >
              Book Appointment
            </button>

            {/* Trusted By */}
            <div className="bg-cream-deep rounded-xl p-4 text-center">
              <p className="text-ink/60 text-xs tracking-widest uppercase">
                Platform verified
              </p>
              <p className="text-ink mt-2 text-sm font-semibold">LUNARA</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============== SUB-COMPONENTS ==============

function ServiceCard({ service }) {
  return (
    <div className="border-ink/10 rounded-lg border bg-white p-4">
      <div className="mb-2 flex items-start justify-between">
        <h4 className="text-ink font-semibold">{service.name}</h4>
      </div>
      {service.description && (
        <p className="text-ink/60 mb-3 text-sm">{service.description}</p>
      )}
      <div className="flex items-center justify-between text-sm">
        <span className="text-ink/70">{service.duration || "N/A"}</span>
        <span className="text-ink font-bold">£{service.price || "TBD"}</span>
      </div>
    </div>
  );
}

function StaffCard({ staff }) {
  const initials = (staff.name || "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="border-ink/10 rounded-lg border bg-white p-4">
      <div className="mb-3 flex items-start gap-3">
        <div className="bg-ink/10 text-ink flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold">
          {initials}
        </div>
        <div className="flex-1">
          <h4 className="text-ink font-semibold">{staff.name}</h4>
          <p className="text-ink/60 text-xs">{staff.role}</p>
        </div>
      </div>
      {staff.rating && (
        <p className="text-ink text-sm">
          <span className="font-semibold">{staff.rating}</span>
          <span className="text-ink/60"> ★</span>
        </p>
      )}
      {staff.specialties && staff.specialties.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {staff.specialties.map((spec, idx) => (
            <span
              key={idx}
              className="bg-cream-soft text-ink/70 inline-block rounded px-2 py-1 text-xs"
            >
              {spec}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default PublicSalonPage;
