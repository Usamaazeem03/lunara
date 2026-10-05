import { localizedError } from "../i18n/localizedError.js";
import { generateSlugFromName } from "../utils/slugGenerator.js";
import { validateInternationalPhone } from "../Shared/lib/phoneValidation.js";

// Dependencies are supplied once by apiAuth and replaced by fakes in tests.
export function createAuthApi({
  supabase,
  initializeCurrencyCode,
  getOrigin,
  getPublicUrl,
}) {
  const profileRequests = new Map();
  function getAuthProfile(userId) {
    if (!userId)
      return Promise.reject(localizedError("auth.signInToLoadYourProfile"));
    if (!profileRequests.has(userId)) {
      const request = fetchProfile(userId).finally(() => {
        if (profileRequests.get(userId) === request)
          profileRequests.delete(userId);
      });
      profileRequests.set(userId, request);
    }
    return profileRequests.get(userId);
  }

  async function fetchProfile(userId) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (error) throw error;
    return data;
  }

  async function updateAuthProfile(userId, updates) {
    if (!userId) throw localizedError("auth.signInToUpdateYourProfile");
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();
    if (error) throw error;
    profileRequests.delete(userId);
    return data;
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async function prepareProfile(user, intendedRole) {
    let profile = await getAuthProfile(user.id);
    const role = profile.role || user.user_metadata?.role || intendedRole;
    if (!["client", "owner"].includes(role))
      throw localizedError("auth.yourAccountHasNoPortalRolePleaseContactSupport");
    if (intendedRole && role !== intendedRole) {
      await signOut();
      throw localizedError("auth.thisAccountIsRegisteredAsAPleaseUseThePortal", { value1: role, value2: role });
    }
    const updates = {};
    if (!profile.role) updates.role = role;
    if (role === "owner" && !profile.salon_slug) {
      const name =
        profile.full_name || user.user_metadata?.full_name || "salon";
      updates.salon_slug = `${generateSlugFromName(name) || "salon"}-${user.id.slice(0, 8)}`;
    }
    if (Object.keys(updates).length)
      profile = await updateAuthProfile(user.id, updates);
    if (role === "owner")
      await initializeCurrencyCode(
        user.id,
        user.user_metadata?.currency_code || "USD",
      );
    return profile;
  }

  async function signIn({ email, password, expectedRole }) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) throw error;
    const profile = await prepareProfile(data.user, expectedRole);
    return { ...data, profile };
  }

  async function resumeSavedAccount({ email, expectedRole, savedSession }) {
    const { data: current, error: sessionError } =
      await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    const matchesEmail = (user) =>
      user?.email?.toLowerCase() === email.toLowerCase();
    const activeSession = matchesEmail(current.session?.user)
      ? current.session
      : null;
    const refreshToken =
      activeSession?.refresh_token || savedSession?.refresh_token;
    if (!refreshToken)
      throw localizedError("auth.signInOnceWithYourPasswordAndSelectRememberAccount");
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });
    if (error)
      throw localizedError("auth.thisSavedSessionHasExpiredSignInAgainToRemember");
    if (
      !matchesEmail(data.user) ||
      (savedSession?.userId && data.user?.id !== savedSession.userId)
    ) {
      await signOut();
      throw localizedError("auth.thisSavedSessionDoesNotMatchTheSelectedAccountPlease");
    }
    const profile = await prepareProfile(data.user, expectedRole);
    return { ...data, profile };
  }

  async function signUp({
    email,
    password,
    fullName,
    phone,
    role,
    currencyCode = "USD",
  }) {
    if (!["client", "owner"].includes(role))
      throw localizedError("auth.chooseAValidAccountType");
    const name = String(fullName ?? "").trim();
    if (!name) throw localizedError("common.fullNameIsRequired");
    const phoneNumber = String(phone ?? "").trim();
    const phoneValidation = validateInternationalPhone(phoneNumber);
    if (phoneValidation !== true) throw new Error(phoneValidation);
    const redirect = new URL("/auth/callback", getOrigin());
    redirect.searchParams.set("role", role);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: redirect.toString(),
        data: {
          full_name: name,
          phone: phoneNumber,
          role,
          currency_code: currencyCode,
        },
      },
    });
    if (error) throw error;
    // Confirmation-required signup has a user but no session. Finish setup after verification.
    if (data.session)
      await updateAuthProfile(data.user.id, {
        full_name: name,
        email: email.trim(),
        phone: phoneNumber,
        role,
      });
    const profile = data.session ? await prepareProfile(data.user, role) : null;
    return { ...data, profile };
  }

  async function signInWithGoogle(role) {
    const redirect = new URL("/auth/callback", getOrigin());
    if (["client", "owner"].includes(role))
      redirect.searchParams.set("role", role);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: redirect.toString() },
    });
    if (error) throw error;
    return data;
  }

  async function requestPasswordReset({ email, role = "client" }) {
    const safeRole = role === "owner" ? "owner" : "client";
    const origin = getPublicUrl();
    const { data, error } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      { redirectTo: `${origin}/auth/${safeRole}/reset-password` },
    );
    if (error) throw error;
    return data;
  }

  async function resetRecoveredPassword({ password }) {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
    await signOut();
  }

  async function completeAuthCallback(role) {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) throw error;
    if (!session)
      throw localizedError("auth.thisLinkHasExpiredPleaseSignInOrRequestA");
    const profile = await prepareProfile(
      session.user,
      ["client", "owner"].includes(role) ? role : undefined,
    );
    return { user: session.user, profile };
  }

  return {
    getAuthProfile,
    updateAuthProfile,
    signOut,
    signIn,
    resumeSavedAccount,
    signUp,
    signInWithGoogle,
    requestPasswordReset,
    resetRecoveredPassword,
    completeAuthCallback,
  };
}
