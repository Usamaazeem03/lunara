import { useState } from "react";
import { supabase } from "../../services/supabase";
import { toTime24 } from "../utils/appointmentUtils";
import { notify } from "../lib/toast.jsx";

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

const normalizeComparableText = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

const normalizePhoneText = (value) => String(value ?? "").replace(/\D/g, "");

const findClientProfileMatch = (
  rows,
  { normalizedName, normalizedPhone, normalizedEmail, userId = null },
) =>
  (rows ?? []).find((row) => {
    if (userId && String(row.auth_id ?? "") === String(userId)) {
      return true;
    }

    const rowName = normalizeComparableText(row.full_name);
    const rowPhone = normalizePhoneText(row.phone);
    const rowEmail = normalizeComparableText(row.email);

    return (
      (normalizedEmail && rowEmail && rowEmail === normalizedEmail) ||
      (normalizedPhone && rowPhone && rowPhone === normalizedPhone) ||
      (normalizedName && rowName === normalizedName)
    );
  }) ?? null;

const resolveOwnerClientProfile = async ({
  ownerId,
  clientId,
  clientName,
  clientPhone,
  clientEmail,
}) => {
  const displayName = String(clientName ?? "").trim();
  const normalizedName = normalizeComparableText(displayName);
  const normalizedPhone = normalizePhoneText(clientPhone);
  const normalizedEmail = normalizeComparableText(clientEmail);

  if (!ownerId) {
    throw new Error("Owner ID is required to create a client profile.");
  }

  if (!normalizedName && !clientId) {
    throw new Error("Please select a client or enter a client name.");
  }

  if (clientId) {
    const { data: matchedById, error: lookupByIdError } = await supabase
      .from("profiles")
      .select("id, auth_id, full_name, phone, email")
      .eq("id", clientId)
      .eq("owner_id", ownerId)
      .eq("role", "client")
      .limit(1);

    if (lookupByIdError) throw lookupByIdError;
    if (matchedById?.[0]) return matchedById[0];
  }

  const { data: ownerClients, error: lookupError } = await supabase
    .from("profiles")
    .select("id, auth_id, full_name, phone, email")
    .eq("owner_id", ownerId)
    .eq("role", "client");

  if (lookupError) throw lookupError;

  const matchedClient = findClientProfileMatch(ownerClients, {
    normalizedName,
    normalizedPhone,
    normalizedEmail,
  });

  if (matchedClient) return matchedClient;

  if (!normalizedName) {
    throw new Error("Please enter a client name.");
  }

  const { data: createdClient, error: createError } = await supabase
    .from("profiles")
    .insert([
      {
        full_name: displayName,
        phone: clientPhone || null,
        email: clientEmail || null,
        role: "client",
        owner_id: ownerId,
      },
    ])
    .select("id, full_name, phone, email")
    .single();

  if (createError) throw createError;

  return createdClient;
};

const resolveClientSalonProfile = async ({
  ownerId,
  userId,
  fullName,
  clientPhone,
  clientEmail,
}) => {
  const displayName = String(fullName ?? "").trim();
  const normalizedName = normalizeComparableText(displayName);
  const normalizedPhone = normalizePhoneText(clientPhone);
  const normalizedEmail = normalizeComparableText(clientEmail);

  if (!ownerId) {
    throw new Error("Owner ID is required to link this salon profile.");
  }

  if (!userId) {
    throw new Error("User ID is required to link this salon profile.");
  }

  const { data: salonClients, error: lookupError } = await supabase
    .from("profiles")
    .select("id, auth_id, full_name, phone, email")
    .eq("owner_id", ownerId)
    .eq("role", "client");

  if (lookupError) throw lookupError;

  const matchedClient = findClientProfileMatch(salonClients, {
    normalizedName,
    normalizedPhone,
    normalizedEmail,
    userId,
  });

  if (matchedClient) {
    if (!matchedClient.auth_id) {
      const { error: linkError } = await supabase
        .from("profiles")
        .update({ auth_id: userId })
        .eq("id", matchedClient.id);

      if (linkError) {
        console.warn("Could not link salon profile to auth user:", linkError);
      } else {
        matchedClient.auth_id = userId;
      }
    }

    return matchedClient;
  }

  if (!normalizedName) {
    throw new Error("Please enter a client name.");
  }

  const createSalonClient = async (includeAuthId) =>
    supabase
      .from("profiles")
      .insert([
        {
          full_name: displayName,
          phone: clientPhone || null,
          email: clientEmail || null,
          role: "client",
          owner_id: ownerId,
          ...(includeAuthId ? { auth_id: userId } : {}),
        },
      ])
      .select("id, auth_id, full_name, phone, email")
      .single();

  let { data: createdClient, error: createError } =
    await createSalonClient(true);

  if (
    createError &&
    (createError.code === "23505" ||
      `${createError.message ?? ""} ${createError.details ?? ""}`
        .toLowerCase()
        .includes("auth_id"))
  ) {
    ({ data: createdClient, error: createError } =
      await createSalonClient(false));
  }

  if (createError) throw createError;

  return createdClient;
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
      clientId = null,
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
    // let finalClientId = null;
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
      setIsSaving(false);
      return;
    }

    // ── Step 7: Supabase mein insert karo ──────────────────────────────────
    const insertAppointment = (appointmentPayload) =>
      supabase.from("appointments").insert([appointmentPayload]).select("*");

    let savePayload = payload;
    let { data, error } = await insertAppointment(savePayload);

    if (
      error &&
      isOwner &&
      savePayload.client_id !== null &&
      isClientForeignKeyError(error)
    ) {
      console.warn(
        "Client link failed, retrying appointment insert without client_id.",
        error,
      );
      savePayload = { ...savePayload, client_id: null };
      ({ data, error } = await insertAppointment(savePayload));
    }

    if (error) {
      if (isOwner && isMissingTableError(error)) {
        // onMissingTable?.(payloads);
        onMissingTable?.([savePayload]);
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
