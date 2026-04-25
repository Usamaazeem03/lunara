// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { supabase } from "../Shared/lib/supabaseClient";
// import { notify } from "../Shared/lib/toast.jsx";

// function SalonPage() {
//   const { slug } = useParams();
//   const [salon, setSalon] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (error) notify.error(error);
//   }, [error]);

//   useEffect(() => {
//     if (!loading && !salon && !error && slug) {
//       notify.error(`No salon with slug "${slug}" exists.`);
//     }
//   }, [loading, salon, error, slug]);

//   useEffect(() => {
//     const fetchSalon = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         // Select only existing columns - no created_at
//         const { data, error: queryError } = await supabase
//           .from("profiles")
//           .select("id, full_name, email, phone, role, salon_slug")
//           .eq("salon_slug", slug)
//           .single();

//         if (queryError) {
//           console.error("Supabase query error:", queryError);
//           setError(queryError.message);
//           setSalon(null);
//         } else {
//           console.log("Salon data fetched successfully:", data);
//           setSalon(data);
//         }
//       } catch (err) {
//         console.error("Error fetching salon:", err);
//         setError(err.message);
//         setSalon(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (slug) {
//       fetchSalon();
//     }
//   }, [slug]);

//   if (loading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center">
//         <p className="text-lg text-gray-600">Loading salon information...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex min-h-screen items-center justify-center">
//         <div className="text-center">
//           <p className="text-lg font-semibold text-red-600">
//             Error loading salon
//           </p>
//           <p className="mt-2 text-sm text-gray-600">{error}</p>
//         </div>
//       </div>
//     );
//   }

//   if (!salon) {
//     return (
//       <div className="flex min-h-screen items-center justify-center">
//         <div className="text-center">
//           <p className="text-lg text-gray-600">Salon not found</p>
//           <p className="mt-2 text-sm text-gray-500">
//             No salon with slug "{slug}" exists
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold">{salon.full_name}</h1>
//       <p className="mt-2 text-gray-600">{salon.email}</p>
//       {salon.phone && <p className="text-gray-600">{salon.phone}</p>}
//       {salon.role && (
//         <p className="text-sm text-gray-500">Role: {salon.role}</p>
//       )}
//     </div>
//   );
// }

// export default SalonPage;
