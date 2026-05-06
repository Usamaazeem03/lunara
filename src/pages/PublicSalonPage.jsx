// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { supabase } from "../Shared/lib/supabaseClient";
// import { notify } from "../Shared/lib/toast.jsx";
// import Icon from "../Shared/ui/Icon";
// import { QRCodeSVG } from "qrcode.react";

// /**
//  * Public Salon Page
//  * Shows specific owner's services and staff
//  * URL: /salon/:slug (e.g. /salon/john-martinez)
//  */

// function PublicSalonPage() {
//   const { slug } = useParams();
//   const navigate = useNavigate();

//   const [ownerProfile, setOwnerProfile] = useState(null);
//   const [staffMembers, setStaffMembers] = useState([]);
//   const [services, setServices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (error) notify.error(error);
//   }, [error]);

//   // Load owner profile and their services/staff
//   useEffect(() => {
//     const loadSalonData = async () => {
//       setLoading(true);
//       setError("");

//       try {
//         // 1. Find owner by slug
//         const { data: profiles, error: profileError } = await supabase
//           .from("profiles")
//           .select("id, full_name, email, phone, role, created_at")
//           .eq("salon_slug", slug)
//           .eq("role", "owner")
//           .single();

//         if (profileError) {
//           if (profileError.code === "PGRST116") {
//             setError("Salon not found. Please check the URL.");
//           } else {
//             setError(profileError.message);
//           }
//           setLoading(false);
//           return;
//         }

//         setOwnerProfile(profiles);

//         // 2. Fetch owner's staff
//         const { data: staffData, error: staffError } = await supabase
//           .from("staff")
//           .select(
//             "id, name, phone, email, role, schedule, is_on_shift, specialties, rating, appointments_count",
//           )
//           .eq("owner_id", profiles.id)
//           .order("name", { ascending: true });

//         if (!staffError) {
//           setStaffMembers(staffData || []);
//         }

//         // 3. Fetch owner's services
//         const { data: servicesData, error: servicesError } = await supabase
//           .from("services")
//           .select("id, name, description, duration, price, category, owner_id")
//           .eq("owner_id", profiles.id)
//           .order("category", { ascending: true });

//         if (!servicesError) {
//           setServices(servicesData || []);
//         }
//       } catch (err) {
//         setError(err.message || "Failed to load salon data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (slug) {
//       loadSalonData();
//     }
//   }, [slug]);

//   if (loading) {
//     return (
//       <div className="flex h-screen items-center justify-center">
//         <div className="text-center">
//           <p className="text-ink/60">Loading salon...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error || !ownerProfile) {
//     return (
//       <div className="bg-cream-soft flex h-screen items-center justify-center px-4">
//         <div className="max-w-md text-center">
//           <p className="text-ink mb-2 text-2xl font-bold">Oops!</p>
//           <p className="text-ink/60">{error || "Salon not found"}</p>
//           <button
//             onClick={() => navigate("/")}
//             className="bg-ink text-cream hover:bg-ink/90 mt-6 rounded-lg px-6 py-2 transition"
//           >
//             Go Home
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const salonUrl = `${window.location.origin}/salon/${slug}`;
//   const groupedServices = services.reduce((acc, service) => {
//     if (!acc[service.category]) {
//       acc[service.category] = [];
//     }
//     acc[service.category].push(service);
//     return acc;
//   }, {});

//   const handleBooking = () => {
//     localStorage.setItem("owner_id", ownerProfile.id); // ✅ saved
//     navigate(`/auth/client/signin?owner_id=${ownerProfile.id}`); // ✅ navigated
//   };

//   return (
//     <div className="bg-cream-soft min-h-screen">
//       {/* Header */}
//       <div className="border-ink/10 sticky top-0 z-10 border-b bg-white">
//         <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
//           <div>
//             <h1 className="text-ink text-2xl font-bold">
//               {ownerProfile.full_name}
//             </h1>
//             <p className="text-ink/60 text-sm">Salon</p>
//           </div>
//           <button
//             onClick={() => navigate("/")}
//             className="text-ink/60 hover:text-ink transition"
//             title="Go back"
//           >
//             <Icon name="close" size={24} />
//           </button>
//         </div>
//       </div>

//       <div className="mx-auto max-w-6xl px-4 py-8">
//         <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
//           {/* Main Content */}
//           <div className="space-y-8 lg:col-span-2">
//             {/* Owner Info Card */}
//             <div className="border-ink/10 rounded-xl border bg-white p-6">
//               <h2 className="text-ink mb-4 text-xl font-bold">About</h2>
//               <div className="space-y-2 text-sm">
//                 <div className="text-ink/70 flex items-center gap-3">
//                   <Icon name="phone" size={18} />
//                   <span>{ownerProfile.phone || "Contact unavailable"}</span>
//                 </div>
//                 <div className="text-ink/70 flex items-center gap-3">
//                   <Icon name="email-envelope" size={18} />
//                   <span>{ownerProfile.email}</span>
//                 </div>
//               </div>
//             </div>

//             {/* Services */}
//             <div>
//               <h2 className="text-ink mb-6 text-2xl font-bold">Services</h2>
//               {services.length === 0 ? (
//                 <p className="text-ink/60 py-8">No services available yet</p>
//               ) : (
//                 <div className="space-y-6">
//                   {Object.entries(groupedServices).map(
//                     ([category, categoryServices]) => (
//                       <div key={category}>
//                         <h3 className="text-ink mb-3 text-xs font-semibold tracking-widest uppercase">
//                           {category}
//                         </h3>
//                         <div className="grid gap-4 sm:grid-cols-2">
//                           {categoryServices.map((service) => (
//                             <ServiceCard key={service.id} service={service} />
//                           ))}
//                         </div>
//                       </div>
//                     ),
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* Staff */}
//             {/* <div>
//               <h2 className="text-ink mb-6 text-2xl font-bold">Our Team</h2>
//               {staffMembers.length === 0 ? (
//                 <p className="text-ink/60 py-8">No staff members available</p>
//               ) : (
//                 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                   {staffMembers.map((staff) => (
//                     <StaffCard key={staff.id} staff={staff} />
//                   ))}
//                 </div>
//               )}
//             </div> */}
//             {Array.isArray(staffMembers.specialties) &&
//               staffMembers.specialties.length > 0 && (
//                 <div className="mt-3 flex flex-wrap gap-1">
//                   {staffMembers.specialties.map((spec, idx) => (
//                     <span
//                       key={idx}
//                       className="bg-cream-soft text-ink/70 inline-block rounded px-2 py-1 text-xs"
//                     >
//                       {spec}
//                     </span>
//                   ))}
//                 </div>
//               )}
//           </div>

//           {/* Sidebar: Share & QR Code */}
//           <div className="space-y-6">
//             {/* Shareable Link Card */}
//             <div className="border-ink/10 rounded-xl border bg-white p-6">
//               <h3 className="text-ink mb-4 text-lg font-bold">Share</h3>
//               <div className="space-y-3">
//                 <input
//                   type="text"
//                   value={salonUrl}
//                   readOnly
//                   className="border-ink/20 bg-cream-soft text-ink/60 w-full rounded-lg border px-3 py-2 text-sm"
//                 />
//                 <button
//                   onClick={() => {
//                     navigator.clipboard
//                       .writeText(salonUrl)
//                       .then(() => notify.success("Link copied!"))
//                       .catch(() =>
//                         notify.error(
//                           "Could not copy the link. Please try again.",
//                         ),
//                       );
//                   }}
//                   className="bg-ink text-cream hover:bg-ink/90 w-full rounded-lg px-4 py-2 text-sm font-semibold transition"
//                 >
//                   Copy Link
//                 </button>
//               </div>
//             </div>

//             {/* QR Code */}
//             <div className="border-ink/10 rounded-xl border bg-white p-6">
//               <h3 className="text-ink mb-4 text-lg font-bold">QR Code</h3>
//               <div className="bg-cream-soft flex justify-center rounded-lg p-4">
//                 <QRCodeSVG
//                   value={salonUrl}
//                   size={200}
//                   level="H"
//                   includeMargin={true}
//                   fgColor="#2d2620"
//                   bgColor="#f7f5f0"
//                 />
//               </div>
//               <p className="text-ink/60 mt-3 text-center text-xs">
//                 Scan to visit this salon
//               </p>
//             </div>

//             {/* Book Appointment CTA */}
//             {/*
//             @@@@@
//             @@@@@
//             @@@@@
//             @@@@@ fix owner id
//             @@@@@
//             @@@@@
//              */}

//             <button
//               onClick={() => handleBooking()}
//               className="bg-ink text-cream hover:bg-ink/90 w-full rounded-lg px-6 py-4 text-center font-bold tracking-widest uppercase transition"
//             >
//               Book Appointment
//             </button>

//             {/* Trusted By */}
//             <div className="bg-cream-deep rounded-xl p-4 text-center">
//               <p className="text-ink/60 text-xs tracking-widest uppercase">
//                 Platform verified
//               </p>
//               <p className="text-ink mt-2 text-sm font-semibold">LUNARA</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ============== SUB-COMPONENTS ==============

// function ServiceCard({ service }) {
//   return (
//     <div className="border-ink/10 rounded-lg border bg-white p-4">
//       <div className="mb-2 flex items-start justify-between">
//         <h4 className="text-ink font-semibold">{service.name}</h4>
//       </div>
//       {service.description && (
//         <p className="text-ink/60 mb-3 text-sm">{service.description}</p>
//       )}
//       <div className="flex items-center justify-between text-sm">
//         <span className="text-ink/70">{service.duration || "N/A"}</span>
//         <span className="text-ink font-bold">£{service.price || "TBD"}</span>
//       </div>
//     </div>
//   );
// }

// function StaffCard({ staff }) {
//   const initials = (staff.name || "")
//     .split(" ")
//     .map((n) => n[0])
//     .join("")
//     .toUpperCase();

//   return (
//     <div className="border-ink/10 rounded-lg border bg-white p-4">
//       <div className="mb-3 flex items-start gap-3">
//         <div className="bg-ink/10 text-ink flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold">
//           {initials}
//         </div>
//         <div className="flex-1">
//           <h4 className="text-ink font-semibold">{staff.name}</h4>
//           <p className="text-ink/60 text-xs">{staff.role}</p>
//         </div>
//       </div>
//       {staff.rating && (
//         <p className="text-ink text-sm">
//           <span className="font-semibold">{staff.rating}</span>
//           <span className="text-ink/60"> ★</span>
//         </p>
//       )}
//       {staff.specialties && staff.specialties.length > 0 && (
//         <div className="mt-3 flex flex-wrap gap-1">
//           {staff.specialties.map((spec, idx) => (
//             <span
//               key={idx}
//               className="bg-cream-soft text-ink/70 inline-block rounded px-2 py-1 text-xs"
//             >
//               {spec}
//             </span>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default PublicSalonPage;

// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { supabase } from "../Shared/lib/supabaseClient";
// import { notify } from "../Shared/lib/toast.jsx";
// import Icon from "../Shared/ui/Icon";
// import { QRCodeSVG } from "qrcode.react";

// function PublicSalonPage() {
//   const { slug } = useParams();
//   const navigate = useNavigate();

//   const [ownerProfile, setOwnerProfile] = useState(null);
//   const [staffMembers, setStaffMembers] = useState([]);
//   const [services, setServices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (error) notify.error(error);
//   }, [error]);

//   useEffect(() => {
//     const loadSalonData = async () => {
//       setLoading(true);
//       setError("");

//       try {
//         // ✅ OWNER (DO NOT TOUCH)
//         const { data: profile, error: profileError } = await supabase
//           .from("profiles")
//           .select("id, full_name, email, phone")
//           .eq("salon_slug", slug)
//           .eq("role", "owner")
//           .single();

//         if (profileError || !profile) {
//           setError("Salon not found");
//           return;
//         }

//         setOwnerProfile(profile);

//         // ✅ STAFF (SAFE)
//         const { data: staffData } = await supabase
//           .from("staff")
//           .select("*")
//           .eq("owner_id", profile.id);

//         setStaffMembers(Array.isArray(staffData) ? staffData : []);

//         // ✅ SERVICES (FIXED + FALLBACK)
//         let { data: servicesData, error: servicesError } = await supabase
//           .from("services")
//           .select("*")
//           .eq("owner_id", profile.id);

//         // 🔥 Fallback if owner_id mismatch
//         if (!servicesData || servicesData.length === 0) {
//           console.warn("⚠ owner_id mismatch, trying fallback...");

//           const { data: fallbackServices } = await supabase
//             .from("services")
//             .select("*");

//           servicesData = fallbackServices || [];
//         }

//         console.log("✅ Services:", servicesData);

//         setServices(Array.isArray(servicesData) ? servicesData : []);
//       } catch (err) {
//         console.error(err);
//         setError("Failed to load salon");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (slug) loadSalonData();
//   }, [slug]);

//   // ✅ SAFE TOP 3 STAFF
//   const topStaff = (Array.isArray(staffMembers) ? staffMembers : [])
//     .sort((a, b) => (b.rating || 0) - (a.rating || 0))
//     .slice(0, 3);

//   // ✅ SAFE TOP 3 SERVICES
//   const safeServices = Array.isArray(services) ? services : [];

//   const topServices = safeServices
//     .sort((a, b) => (b.price || 0) - (a.price || 0))
//     .slice(0, 3);

//   const salonUrl = `${window.location.origin}/salon/${slug}`;

//   // ✅ DO NOT TOUCH (YOUR CORE FLOW)
//   const handleBooking = () => {
//     localStorage.setItem("owner_id", ownerProfile.id);
//     localStorage.setItem("booking_mode", "quick");
//     navigate(`/auth/client/signin?owner_id=${ownerProfile.id}`);
//   };

//   if (loading) {
//     return (
//       <div className="flex h-screen items-center justify-center">
//         Loading salon...
//       </div>
//     );
//   }

//   if (error || !ownerProfile) {
//     return (
//       <div className="flex h-screen items-center justify-center">
//         {error || "Salon not found"}
//       </div>
//     );
//   }

//   return (
//     <div className="bg-cream-soft min-h-screen">
//       {/* HEADER */}
//       <div className="sticky top-0 flex justify-between border-b bg-white p-4">
//         <div>
//           <h1 className="text-xl font-bold">{ownerProfile.full_name}</h1>
//           <p className="text-sm text-gray-500">Salon</p>
//         </div>

//         <button onClick={() => navigate("/")}>
//           <Icon name="close" size={20} />
//         </button>
//       </div>

//       <div className="mx-auto grid max-w-6xl gap-6 p-6 lg:grid-cols-3">
//         {/* LEFT */}
//         <div className="space-y-8 lg:col-span-2">
//           {/* ABOUT */}
//           <div className="rounded-xl border bg-white p-5">
//             <h2 className="mb-3 font-bold">About</h2>
//             <p>{ownerProfile.phone || "No phone"}</p>
//             <p>{ownerProfile.email}</p>
//           </div>

//           {/* SERVICES */}
//           <div>
//             <h2 className="mb-4 text-xl font-bold">Popular Services</h2>

//             {safeServices.length === 0 ? (
//               <p className="text-sm text-red-500">
//                 No services found (check DB owner_id)
//               </p>
//             ) : (
//               <>
//                 <div className="grid gap-4 sm:grid-cols-2">
//                   {topServices.map((s) => (
//                     <ServiceCard key={s.id} service={s} />
//                   ))}
//                 </div>

//                 {safeServices.length > 3 && (
//                   <p className="mt-3 text-center text-sm text-gray-500">
//                     +{safeServices.length - 3} more services
//                   </p>
//                 )}
//               </>
//             )}
//           </div>

//           {/* STAFF */}
//           <div>
//             <h2 className="mb-4 text-xl font-bold">Top Staff</h2>

//             {topStaff.length === 0 ? (
//               <p>No staff available</p>
//             ) : (
//               <>
//                 <div className="grid gap-4 sm:grid-cols-2">
//                   {topStaff.map((staff) => (
//                     <StaffCard key={staff.id} staff={staff} />
//                   ))}
//                 </div>

//                 {staffMembers.length > 3 && (
//                   <p className="mt-3 text-center text-sm text-gray-500">
//                     +{staffMembers.length - 3} more staff
//                   </p>
//                 )}
//               </>
//             )}
//           </div>
//         </div>

//         {/* RIGHT */}
//         <div className="space-y-6">
//           {/* SHARE */}
//           <div className="rounded-xl border bg-white p-5">
//             <h3 className="mb-3 font-bold">Share</h3>

//             <input
//               value={salonUrl}
//               readOnly
//               className="mb-2 w-full rounded border p-2 text-sm"
//             />

//             <button
//               onClick={() => {
//                 navigator.clipboard.writeText(salonUrl);
//                 notify.success("Copied!");
//               }}
//               className="w-full rounded bg-black p-2 text-white"
//             >
//               Copy Link
//             </button>
//           </div>

//           {/* QR */}
//           <div className="rounded-xl border bg-white p-5 text-center">
//             <h3 className="mb-3 font-bold">QR Code</h3>

//             <QRCodeSVG value={salonUrl} size={160} />

//             <p className="mt-2 text-xs text-gray-500">Scan to open salon</p>
//           </div>

//           {/* BOOK */}
//           <button
//             onClick={handleBooking}
//             className="w-full rounded bg-black py-3 font-bold text-white"
//           >
//             Book Appointment
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ================= SERVICE CARD =================
// function ServiceCard({ service }) {
//   return (
//     <div className="rounded-lg border bg-white p-4">
//       <h4 className="font-semibold">{service.name}</h4>

//       {service.description && (
//         <p className="mt-1 text-sm text-gray-500">{service.description}</p>
//       )}

//       <div className="mt-3 flex justify-between text-sm">
//         <span>{service.duration || "N/A"}</span>
//         <span className="font-bold">£{service.price || "TBD"}</span>
//       </div>
//     </div>
//   );
// }

// // ================= STAFF CARD =================
// function StaffCard({ staff }) {
//   const specialtiesArray = Array.isArray(staff.specialties)
//     ? staff.specialties
//     : typeof staff.specialties === "string"
//       ? staff.specialties.split(",")
//       : [];

//   return (
//     <div className="rounded-lg border bg-white p-4">
//       <h4 className="font-semibold">{staff.name}</h4>
//       <p className="text-sm text-gray-500">{staff.role}</p>

//       {staff.rating && <p className="mt-2 text-sm">⭐ {staff.rating}</p>}

//       {specialtiesArray.length > 0 && (
//         <div className="mt-2 flex flex-wrap gap-1">
//           {specialtiesArray.map((s, i) => (
//             <span key={i} className="rounded bg-gray-100 px-2 py-1 text-xs">
//               {s.trim()}
//             </span>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default PublicSalonPage;

/////////////////////////////////////////////////////////////////////////
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../Shared/lib/supabaseClient";
import { notify } from "../Shared/lib/toast.jsx";
import Icon from "../Shared/ui/Icon";
import { QRCodeSVG } from "qrcode.react";

const PREVIEW_COUNT = 3;

function PublicSalonPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [ownerProfile, setOwnerProfile] = useState(null);
  const [staffMembers, setStaffMembers] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAllStaff, setShowAllStaff] = useState(false);
  const [showAllServices, setShowAllServices] = useState(false);

  useEffect(() => {
    if (error) notify.error(error);
  }, [error]);

  useEffect(() => {
    const loadSalonData = async () => {
      setLoading(true);
      setError("");
      try {
        // 1. Owner
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("id, full_name, email, phone, role, created_at")
          .eq("salon_slug", slug)
          .eq("role", "owner")
          .single();

        if (profileError || !profile) {
          setError(
            profileError?.code === "PGRST116"
              ? "Salon not found. Please check the URL."
              : profileError?.message || "Salon not found.",
          );
          setLoading(false);
          return;
        }
        setOwnerProfile(profile);
        console.log("✅ Owner Profile ID:", profile.id);

        // 2. Staff
        const { data: staffData } = await supabase
          .from("staff")
          .select("id, name, role, is_on_shift, specialties, rating")
          .eq("owner_id", profile.id)
          .order("name", { ascending: true });

        setStaffMembers(Array.isArray(staffData) ? staffData : []);

        // 3. Services — fetch all and filter in JavaScript
        let { data: allServices, error: servicesError } = await supabase
          .from("services")
          .select("*");

        console.log(
          "🔍 All services from DB:",
          allServices,
          "Error:",
          servicesError,
        );

        if (servicesError) {
          console.warn("⚠️ Error fetching services:", servicesError.message);
        }

        let filteredServices = [];
        if (allServices && Array.isArray(allServices)) {
          // Filter by owner_id in JavaScript
          filteredServices = allServices.filter(
            (service) => service.owner_id === profile.id,
          );
          console.log("✅ Filtered services for owner:", filteredServices);
        }

        setServices(filteredServices);
      } catch (err) {
        setError(err.message || "Failed to load salon data");
      } finally {
        setLoading(false);
      }
    };

    if (slug) loadSalonData();
  }, [slug]);

  const visibleServices = showAllServices
    ? services
    : services.slice(0, PREVIEW_COUNT);
  const visibleStaff = showAllStaff
    ? staffMembers
    : staffMembers.slice(0, PREVIEW_COUNT);
  const salonUrl = `${window.location.origin}/salon/${slug}`;

  const handleBooking = () => {
    localStorage.setItem("owner_id", ownerProfile.id);
    navigate(`/auth/client/signin?owner_id=${ownerProfile.id}`);
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="bg-cream-soft flex h-screen items-center justify-center">
        <p className="text-ink/50 text-sm tracking-widest uppercase">
          Loading salon...
        </p>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (error || !ownerProfile) {
    return (
      <div className="bg-cream-soft flex h-screen items-center justify-center px-4">
        <div className="max-w-md text-center">
          <p className="text-ink mb-2 text-2xl font-bold">Oops!</p>
          <p className="text-ink/60 mb-6">{error || "Salon not found"}</p>
          <button
            onClick={() => navigate("/")}
            className="bg-ink text-cream hover:bg-ink/90 rounded-lg px-6 py-2 transition"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream-soft min-h-screen">
      {/* ── Sticky Nav ───────────────────────────────────────────────────── */}
      <nav className="border-ink/10 sticky top-0 z-20 border-b bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="bg-ink flex h-8 w-8 items-center justify-center rounded-full">
              <span className="text-cream text-xs font-bold">L</span>
            </div>
            <div>
              <p className="text-ink text-sm leading-tight font-bold">
                {ownerProfile.full_name}
              </p>
              <p className="text-ink/40 text-[0.58rem] tracking-widest uppercase">
                Lunara Verified Salon
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleBooking}
              className="bg-ink text-cream hover:bg-ink/90 hidden rounded-lg px-5 py-2 text-xs font-semibold tracking-widest uppercase transition sm:block"
            >
              Book Now
            </button>
            <button
              onClick={() => navigate("/")}
              className="text-ink/40 hover:text-ink transition"
            >
              <Icon name="close" size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero Banner ──────────────────────────────────────────────────── */}
      <div className="bg-ink relative overflow-hidden">
        {/* decorative circles */}
        <div className="bg-cream/5 absolute -top-16 -right-16 h-64 w-64 rounded-full" />
        <div className="bg-cream/5 absolute -bottom-10 -left-10 h-40 w-40 rounded-full" />

        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <p className="text-cream/40 mb-3 text-[0.6rem] tracking-[0.3em] uppercase">
            Platform Verified · Lunara
          </p>
          <h1 className="text-cream mb-2 text-4xl font-bold sm:text-5xl">
            {ownerProfile.full_name}
          </h1>
          <p className="text-cream/50 mb-8 text-sm">
            {ownerProfile.phone && (
              <span>{ownerProfile.phone} &nbsp;·&nbsp; </span>
            )}
            {ownerProfile.email}
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap gap-8">
            <div>
              <p className="text-cream text-3xl font-bold">{services.length}</p>
              <p className="text-cream/40 text-[0.6rem] tracking-widest uppercase">
                Services
              </p>
            </div>
            <div className="bg-cream/15 w-px" />
            <div>
              <p className="text-cream text-3xl font-bold">
                {staffMembers.length}
              </p>
              <p className="text-cream/40 text-[0.6rem] tracking-widest uppercase">
                Team Members
              </p>
            </div>
            <div className="bg-cream/15 w-px" />
            <div>
              <p className="text-cream text-3xl font-bold">✓</p>
              <p className="text-cream/40 text-[0.6rem] tracking-widest uppercase">
                Verified
              </p>
            </div>
          </div>

          {/* Mobile Book button */}
          <button
            onClick={handleBooking}
            className="bg-cream text-ink hover:bg-cream/90 mt-8 rounded-lg px-8 py-3 text-sm font-bold tracking-widest uppercase transition sm:hidden"
          >
            Book Appointment
          </button>
        </div>
      </div>

      {/* ── Main Grid ────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* ── Left col ─────────────────────────────────────────────────── */}
          <div className="space-y-12 lg:col-span-2">
            {/* ── Services ─────────────────────────────────────────────── */}
            <section>
              <div className="mb-6 flex items-end justify-between">
                <div>
                  <p className="text-ink/40 mb-1 text-[0.6rem] tracking-widest uppercase">
                    What We Offer
                  </p>
                  <h2 className="text-ink text-2xl font-bold">Services</h2>
                </div>
              </div>

              {services.length === 0 ? (
                <div className="border-ink/10 rounded-xl border border-dashed py-10 text-center">
                  <p className="text-ink/40 text-sm">No services listed yet</p>
                </div>
              ) : (
                <>
                  {/* 3-column card row */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {visibleServices.map((service) => (
                      <ServiceCard key={service.id} service={service} />
                    ))}
                  </div>

                  {services.length > PREVIEW_COUNT && (
                    <button
                      onClick={() => setShowAllServices((p) => !p)}
                      className="text-ink/40 hover:text-ink mt-4 text-xs tracking-widest uppercase transition"
                    >
                      {showAllServices
                        ? "Show Less ▲"
                        : `+ ${services.length - PREVIEW_COUNT} More Services ▼`}
                    </button>
                  )}
                </>
              )}
            </section>

            {/* ── Staff ────────────────────────────────────────────────── */}
            <section>
              <div className="mb-6 flex items-end justify-between">
                <div>
                  <p className="text-ink/40 mb-1 text-[0.6rem] tracking-widest uppercase">
                    Meet The Team
                  </p>
                  <h2 className="text-ink text-2xl font-bold">Our Staff</h2>
                </div>
              </div>

              {staffMembers.length === 0 ? (
                <div className="border-ink/10 rounded-xl border border-dashed py-10 text-center">
                  <p className="text-ink/40 text-sm">
                    No team members listed yet
                  </p>
                </div>
              ) : (
                <>
                  {/* 3-column card row */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {visibleStaff.map((staff) => (
                      <StaffCard key={staff.id} staff={staff} />
                    ))}
                  </div>

                  {staffMembers.length > PREVIEW_COUNT && (
                    <button
                      onClick={() => setShowAllStaff((p) => !p)}
                      className="text-ink/40 hover:text-ink mt-4 text-xs tracking-widest uppercase transition"
                    >
                      {showAllStaff
                        ? "Show Less ▲"
                        : `+ ${staffMembers.length - PREVIEW_COUNT} More Staff ▼`}
                    </button>
                  )}
                </>
              )}
            </section>
          </div>

          {/* ── Right Sidebar ─────────────────────────────────────────────── */}
          <div className="space-y-5">
            {/* Book CTA */}
            <button
              onClick={handleBooking}
              className="bg-ink text-cream hover:bg-ink/90 w-full rounded-xl px-6 py-4 text-center text-sm font-bold tracking-widest uppercase transition"
            >
              Book Appointment
            </button>

            {/* Share Component */}
            <ShareSalon
              salonUrl={salonUrl}
              ownerName={ownerProfile.full_name}
            />

            {/* Lunara Verified Badge */}
            {/* <div className="border-ink/10 rounded-xl border bg-white p-5 text-center">
              <div className="bg-ink mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full">
                <span className="text-cream text-xs font-bold">L</span>
              </div>
              <p className="text-ink text-sm font-bold tracking-widest uppercase">
                Lunara Verified
              </p>
              <p className="text-ink/40 mt-1 text-xs">
                This salon is verified on the Lunara platform
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Service Card (one of three in a row) ─────────────────────────────────────
function ServiceCard({ service }) {
  const duration = service.duration_minutes
    ? `${service.duration_minutes} min`
    : service.duration || null;

  return (
    <div className="border-ink/10 flex flex-col justify-between rounded-xl border bg-white p-5 transition hover:shadow-md">
      <div>
        <p className="text-ink mb-1 font-semibold">{service.name}</p>
        {service.description && (
          <p className="text-ink/50 line-clamp-2 text-sm leading-relaxed">
            {service.description}
          </p>
        )}
      </div>
      <div className="mt-4 flex items-center justify-between">
        {duration ? (
          <span className="text-ink/40 text-xs tracking-widest">
            {duration}
          </span>
        ) : (
          <span />
        )}
        <span className="text-ink font-bold">
          £{Number(service.price || 0).toFixed(0)}
        </span>
      </div>
    </div>
  );
}

// ─── Staff Card (one of three in a row) ──────────────────────────────────────
function StaffCard({ staff }) {
  const initials = (staff.name || "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const specialtiesArray = Array.isArray(staff.specialties)
    ? staff.specialties
    : typeof staff.specialties === "string" && staff.specialties.trim()
      ? staff.specialties.split(",").map((s) => s.trim())
      : [];

  return (
    <div className="border-ink/10 flex flex-col rounded-xl border bg-white p-5 transition hover:shadow-md">
      {/* Avatar + name */}
      <div className="mb-4 flex items-center gap-3">
        <div className="bg-ink text-cream flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-ink truncate font-semibold">{staff.name}</p>
          <p className="text-ink/40 text-xs">{staff.role}</p>
        </div>
      </div>

      {/* Rating */}
      {staff.rating && (
        <p className="text-ink mb-3 text-sm">
          <span className="font-bold">{staff.rating}</span>
          <span className="text-ink/40"> ★</span>
        </p>
      )}

      {/* Shift dot */}
      <div className="mb-3 flex items-center gap-1.5">
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            staff.is_on_shift ? "bg-green-400" : "bg-ink/20"
          }`}
        />
        <span className="text-ink/40 text-[0.6rem] tracking-widest uppercase">
          {staff.is_on_shift ? "On Shift" : "Off Shift"}
        </span>
      </div>

      {/* Specialties */}
      {specialtiesArray.length > 0 && (
        <div className="mt-auto flex flex-wrap gap-1">
          {specialtiesArray.slice(0, 2).map((spec, idx) => (
            <span
              key={idx}
              className="bg-cream-soft text-ink/60 rounded px-2 py-0.5 text-xs"
            >
              {spec}
            </span>
          ))}
          {specialtiesArray.length > 2 && (
            <span className="text-ink/30 text-xs">
              +{specialtiesArray.length - 2}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Share Salon Component ──────────────────────────────────────────────────
function ShareSalon({ salonUrl, ownerName }) {
  const qrRef = useRef(null);
  const shareMessage = `Check out ${ownerName} on Lunara! 🌟 Book your appointment now: ${salonUrl}`;

  const handleWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(shareMessage)}`,
      "_blank",
    );
  };
  const handleFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(salonUrl)}`,
      "_blank",
    );
  };
  const handleTwitter = () => {
    const text = encodeURIComponent(
      `Discover ${ownerName} on Lunara 🌟 Book now: ${salonUrl}`,
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };
  const handleEmail = () => {
    const subject = encodeURIComponent(`Check out ${ownerName} on Lunara`);
    const body = encodeURIComponent(shareMessage);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };
  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(salonUrl)
      .then(() => notify.success("Link copied!"))
      .catch(() => notify.error("Could not copy. Try manually."));
  };
  const handleDownloadQR = () => {
    if (qrRef.current) {
      const svg = qrRef.current.querySelector("svg");
      if (svg) {
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.fillStyle = "#f7f5f0";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          const link = document.createElement("a");
          link.href = canvas.toDataURL("image/png");
          link.download = `${ownerName.toLowerCase().replace(/\s+/g, "-")}-qr.png`;
          link.click();
          notify.success("QR code downloaded!");
        };
        img.src =
          "data:image/svg+xml;base64," +
          btoa(unescape(encodeURIComponent(svgData)));
      }
    }
  };

  const socialButtons = [
    {
      label: "WhatsApp",
      onClick: handleWhatsApp,
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      ),
    },
    {
      label: "Facebook",
      onClick: handleFacebook,
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      label: "Twitter / X",
      onClick: handleTwitter,
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      label: "Email",
      onClick: handleEmail,
      icon: (
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-3">
      {/* ── Share Card ── */}
      <div className="border-ink/10 rounded-xl border bg-white p-5">
        <p className="text-ink/35 mb-1 text-[0.58rem] font-semibold tracking-[0.2em] uppercase">
          Spread the word
        </p>
        <h3 className="text-ink mb-4 text-[15px] font-bold">Share Salon</h3>

        <div className="mb-3 grid grid-cols-2 gap-2">
          {socialButtons.map(({ label, onClick, icon }) => (
            <button
              key={label}
              onClick={onClick}
              className="border-ink/12 text-ink hover:bg-ink/5 flex items-center gap-2 rounded-[9px] border bg-white px-3 py-2.5 text-xs font-semibold transition"
            >
              <span className="opacity-50">{icon}</span>
              {label}
            </button>
          ))}
        </div>

        <div className="bg-ink/8 my-3 h-px" />

        <button
          onClick={handleCopyLink}
          className="bg-ink/6 text-ink/50 hover:bg-ink/10 hover:text-ink flex w-full items-center justify-center gap-2 rounded-[9px] px-4 py-2.5 text-[11px] font-bold tracking-[0.15em] uppercase transition"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
          Copy Link
        </button>
      </div>

      {/* ── QR Card ── */}
      <div className="border-ink/10 rounded-xl border bg-white p-5">
        <p className="text-ink/35 mb-1 text-[0.58rem] font-semibold tracking-[0.2em] uppercase">
          Scan to visit
        </p>
        <h3 className="text-ink mb-4 text-[15px] font-bold">QR Code</h3>

        <div
          ref={qrRef}
          className="bg-cream-soft mb-2 flex justify-center rounded-[10px] p-4"
        >
          <QRCodeSVG
            value={salonUrl}
            size={160}
            level="H"
            includeMargin={false}
            fgColor="#2d2620"
            bgColor="#f7f5f0"
          />
        </div>

        <p className="text-ink/25 mb-3 truncate text-center font-mono text-[10px] tracking-wide">
          {salonUrl.replace("https://", "")}
        </p>

        <button
          onClick={handleDownloadQR}
          className="bg-ink text-cream hover:bg-ink/90 w-full rounded-[9px] px-4 py-2.5 text-[11px] font-bold tracking-[0.15em] uppercase transition"
        >
          Download QR
        </button>
      </div>
    </div>
  );
}

export default PublicSalonPage;
