import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { toTime24 } from "../utils/appointmentUtils";
import { notify } from "../lib/toast.jsx";

// ─── Helper: Supabase table missing error check ───────────────────────────────
const isMissingTableError = (error) => {
  if (!error) return false;
  if (error.code === "42P01") return true;
  const msg = `${error.message ?? ""} ${error.details ?? ""}`.toLowerCase();
  return msg.includes("relation") && msg.includes("does not exist");
};

// ─── Main Hook ────────────────────────────────────────────────────────────────
// mode = "client" → client side (alert dikhata hai, profile fetch karta hai)
// mode = "owner"  → owner side  (state use karta hai, local draft support hai)
export function useBookingSubmit(mode = "client") {
  const isOwner = mode === "owner";

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");

  // ─── handleBooking: yahi woh ek function hai dono sides ke liye ──────────
  //
  // CLIENT SIDE se bhejo:
  //   ownerId, services, staff,
  //   appointmentDate, appointmentTime,
  //   paymentOption, paymentMethod
  //   (user + profile hook khud fetch karega)
  //
  // OWNER SIDE se bhejo:
  //   ownerId, services, staff,
  //   appointmentDate, appointmentTime,
  //   clientName, clientPhone, clientEmail,
  //   status, notes,
  //   isAppointmentTableReady,
  //   onSuccess, onLocalDraft, onMissingTable, onDone  (callbacks)

  const handleBooking = async (params) => {
    const {
      ownerId,
      services,
      staff,
      appointmentDate,
      appointmentTime,
      paymentOption = null,
      paymentMethod = null,
      // owner side client info (form se)
      clientName = null,
      clientPhone = null,
      clientEmail = null,
      status = "Pending",
      notes = null,
      // owner side table fallback
      isAppointmentTableReady = true,
      // owner side callbacks
      onSuccess = null,
      onLocalDraft = null,
      onMissingTable = null,
      onDone = null,
    } = params;

    setIsSaving(true);
    setSaveError("");
    setSaveSuccess("");

    // ── Step 1: Client side mein user + profile fetch karo ─────────────────
    let finalClientId = null;
    let finalClientName = clientName;
    let finalClientPhone = clientPhone;
    let finalClientEmail = clientEmail;

    if (!isOwner) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, phone, email")
        .eq("id", user.id)
        .single();

      finalClientId = user.id;
      finalClientName = profile?.full_name ?? user.email;
      finalClientPhone = profile?.phone ?? null;
      finalClientEmail = profile?.email ?? user.email;
    }

    // ── Step 2: Date + Time validate karo ──────────────────────────────────
    if (!appointmentDate) {
      const msg = "Please select a date first";
      if (isOwner) setSaveError(msg);
      else notify.error(msg);
      setIsSaving(false);
      return;
    }

    const time24 = toTime24(appointmentTime);
    if (!time24) {
      const msg = "Please select a time slot";
      if (isOwner) setSaveError(msg);
      else notify.error(msg);
      setIsSaving(false);
      return;
    }

    // ── Step 3: Staff decide karo ───────────────────────────────────────────
    const isNoPreference = !staff || staff.id === "no-preference";
    const staffId = isNoPreference ? null : Number(staff.id);
    const staffName = isNoPreference ? "No Preference" : staff.name;

    // ── Step 4: Double-booking conflict check ───────────────────────────────
    if (!isNoPreference) {
      const { data: conflicts, error: conflictError } = await supabase
        .from("appointments")
        .select("id")
        .eq("owner_id", ownerId)
        .eq("staff_id", Number(staffId))
        .eq("appointment_date", appointmentDate)
        .eq("appointment_time", time24)
        .not("status", "eq", "Cancelled")
        .limit(1);

      if (conflictError) {
        const msg = "Could not verify availability: " + conflictError.message;
        if (isOwner) setSaveError(msg);
        else notify.error(msg);
        setIsSaving(false);
        return;
      }

      if (conflicts?.length > 0) {
        const msg = `⚠️ ${staffName} is already booked at this time.\nPlease choose a different time or staff member.`;
        if (isOwner) setSaveError(msg);
        else notify.error(msg);
        setIsSaving(false);
        return;
      }
    }

    // ── Step 5: Single combined appointment ─────────────────────────
    const totalPrice = services.reduce(
      (sum, s) => sum + (s.priceValue || 0),
      0,
    );

    const totalDuration = services.reduce(
      (sum, s) => sum + (s.durationValue || 0),
      0,
    );

    const serviceNames = services.map((s) => s.title).join(", ");

    const payload = {
      owner_id: ownerId,
      client_id: finalClientId,
      client_name: finalClientName,
      client_phone: finalClientPhone,
      client_email: finalClientEmail,

      // ✅ combined services
      service_name: serviceNames,
      service_id: null, // optional (since multiple)

      staff_id: staffId,
      staff_name: staffName,

      appointment_date: appointmentDate,
      appointment_time: time24,

      duration_minutes: totalDuration,
      price: totalPrice,

      status,
      notes,
      payment_option: paymentOption,
      payment_method: paymentMethod,

      source: isOwner ? "owner" : "client",
    };

    // ── Step 6: Owner side — table ready nahi toh local draft ──────────────
    if (isOwner && !isAppointmentTableReady) {
      onLocalDraft?.([payload]);
      setSaveSuccess(`Saved locally (${services.length} service/s).`);
      onDone?.();
      setIsSaving(false);
      return;
    }

    // ── Step 7: Supabase mein insert karo ──────────────────────────────────
    const { data, error } = await supabase
      .from("appointments")
      .insert([payload])
      .select("*");

    if (error) {
      if (isOwner && isMissingTableError(error)) {
        // onMissingTable?.(payloads);
        onMissingTable?.([payload]);
        onDone?.();
      } else {
        const msg = "Booking failed: " + error.message;
        if (isOwner) setSaveError(msg);
        else notify.error(msg);
      }
      setIsSaving(false);
      return;
    }

    // ── Step 8: Success ─────────────────────────────────────────────────────
    onSuccess?.(data);
    const successMsg = isOwner
      ? "Appointment saved successfully."
      : "Appointment booked successfully. Status: Pending.";
    if (isOwner) setSaveSuccess(successMsg);
    else notify.success(successMsg);
    onDone?.();
    setIsSaving(false);
  };

  return {
    handleBooking,
    isSaving,
    saveError,
    setSaveError,
    saveSuccess,
    setSaveSuccess,
  };
}
