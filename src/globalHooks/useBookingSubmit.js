import { useState } from "react";
import { supabase } from "../services/supabase.js";
import { toTime24 } from "../utils/appointmentUtils.js";
import { notify } from "../Shared/lib/toast.jsx";
import useCreateAppointment from "../features/Appointments/useCreateAppointment.js";
import useResolveClient from "../features/Appointments/useResolveClient.js";
// ─── Helper: Supabase table missing error check ───────────────────────────────
const isMissingTableError = (error) => {
  if (!error) return false;
  if (error.code === "42P01") return true;
  const msg = `${error.message ?? ""} ${error.details ?? ""}`.toLowerCase();
  return msg.includes("relation") && msg.includes("does not exist");
};

const isClientForeignKeyError = (error) => {
  if (!error) return false;
  const message = `${error.message ?? ""} ${error.details ?? ""} ${
    error.hint ?? ""
  }`.toLowerCase();

  return (
    error.code === "23503" &&
    (message.includes("appointments_client_id_fkey") ||
      (message.includes("client_id") && message.includes("foreign key")))
  );
};

// ─── Main Hook ────────────────────────────────────────────────────────────────

export function useBookingSubmit(mode = "client") {
  const isOwner = mode === "owner";
  const { resolveOwnerClientProfile, resolveClientSalonProfile } =
    useResolveClient();
  const { createAppointmentAsync, isCreatingAppointment } =
    useCreateAppointment(null, { notifyErrors: false });

  const isSaving = isCreatingAppointment;
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");

  const handleBooking = async (params) => {
    const {
      ownerId,
      services,
      staff,
      appointmentDate,
      appointmentTime,
      paymentOption = null,
      paymentMethod = null,
      clientId = null,
      clientName = null,
      clientPhone = null,
      clientEmail = null,
      status = "Pending",
      notes = null,
      isAppointmentTableReady = true,
      onSuccess = null,
      onLocalDraft = null,
      onMissingTable = null,
      onDone = null,
    } = params;

    setSaveError("");
    setSaveSuccess("");

    // ── Step 1: Client side mein user + profile fetch karo ─────────────────
    let finalClientId = isOwner ? (clientId ?? null) : null;
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

      if (ownerId) {
        try {
          await resolveClientSalonProfile({
            ownerId,
            userId: user.id,
            fullName: finalClientName,
            clientPhone: finalClientPhone,
            clientEmail: finalClientEmail,
          });
        } catch (linkError) {
          console.warn(
            "Could not create salon-specific client profile:",
            linkError,
          );
        }
      }
    }

    // ── Step 2: Date + Time validate karo ──────────────────────────────────
    if (!appointmentDate) {
      const msg = "Please select a date first";
      if (isOwner) setSaveError(msg);
      else notify.error(msg);
      return;
    }

    const time24 = toTime24(appointmentTime);
    if (!time24) {
      const msg = "Please select a time slot";
      if (isOwner) setSaveError(msg);
      else notify.error(msg);
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
        return;
      }

      if (conflicts?.length > 0) {
        const msg = `⚠️ ${staffName} is already booked at this time.\nPlease choose a different time or staff member.`;
        if (isOwner) setSaveError(msg);
        else notify.error(msg);
        return;
      }
    }

    // ── Step 5: Single combined appointment ─────────────────────────
    if (isOwner) {
      const resolvedClient = await resolveOwnerClientProfile({
        ownerId,
        clientId,
        clientName,
        clientPhone,
        clientEmail,
      });

      finalClientId = resolvedClient.auth_id ?? resolvedClient.id;
      finalClientName = resolvedClient.full_name ?? finalClientName;
      finalClientPhone = resolvedClient.phone ?? finalClientPhone;
      finalClientEmail = resolvedClient.email ?? finalClientEmail;
    }

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
      service_id: services[0]?.id ?? null,

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
      return;
    }

    // ── Step 7: Create appointment ──────────────────────────────────────────
    let savePayload = payload;

    let data;

    try {
      data = await createAppointmentAsync(savePayload);
    } catch (error) {
      if (
        isOwner &&
        savePayload.client_id !== null &&
        isClientForeignKeyError(error)
      ) {
        console.warn(
          "Client link failed, retrying appointment insert without client_id.",
          error,
        );

        savePayload = {
          ...savePayload,
          client_id: null,
        };

        try {
          data = await createAppointmentAsync(savePayload);
        } catch (retryError) {
          if (isOwner && isMissingTableError(retryError)) {
            onMissingTable?.([savePayload]);
            onDone?.();
          } else {
            const msg = "Booking failed: " + retryError.message;

            if (isOwner) setSaveError(msg);
            else notify.error(msg);
          }

          return;
        }
      } else {
        if (isOwner && isMissingTableError(error)) {
          onMissingTable?.([savePayload]);
          onDone?.();
        } else {
          const msg = "Booking failed: " + error.message;

          if (isOwner) setSaveError(msg);
          else notify.error(msg);
        }

        return;
      }
    }

    // ── Step 8: Success ─────────────────────────────────────────────────────
    onSuccess?.(data);
    const successMsg = isOwner
      ? "Appointment saved successfully."
      : "Appointment booked successfully. Status: Pending.";
    if (isOwner) setSaveSuccess(successMsg);
    else notify.success(successMsg);
    onDone?.();
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
