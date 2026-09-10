import { supabase } from "../../services/supabase.js";

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

export default function useResolveClient() {
  return {
    resolveOwnerClientProfile,
    resolveClientSalonProfile,
  };
}
