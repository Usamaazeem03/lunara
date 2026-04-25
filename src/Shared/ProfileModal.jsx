import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../Shared/lib/supabaseClient";

// ─── Shared input style ───────────────────────────────────────────────────────
const inputBase =
  "w-full border border-black/10 bg-white px-4 py-3 text-sm text-black placeholder:text-black/30 focus:border-black/40 focus:ring-1 focus:ring-black/20 focus:outline-none transition rounded-lg";

// ─── Small reusable field wrapper ─────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-medium tracking-[0.18em] text-black/50 uppercase">
        {label}
      </label>
      {children}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
const ProfileModal = ({
  onClose = () => {},
  onLogout = () => {},
  brand = "LUNARA",
  salonUrl = null, // still accepted as prop (optional), but auto-generated below if not provided
}) => {
  const { user, profile, updateProfile, uploadAvatar } = useAuth();

  // ── AUTO-GENERATE salonUrl if not passed as prop ──────────────────────────
  // When owner scans QR → opens /book/:ownerId (ClientBookingPage)
  const resolvedSalonUrl = useMemo(() => {
    if (salonUrl) return salonUrl; // use prop if provided
    if (!user?.id) return null;
    return `${window.location.origin}/book/${user.id}`;
  }, [salonUrl, user?.id]);

  const isGoogleLogin = user?.app_metadata?.provider === "google";
  const fileInputRef = useRef(null);

  // ── Initial (saved) values — used to detect real changes ─────────────────
  const getInitialFields = useCallback(
    () => ({
      fullName:
        profile?.full_name ||
        user?.user_metadata?.full_name ||
        user?.email?.split("@")[0] ||
        "",
      email: profile?.email || user?.email || "",
      phone: profile?.phone || "",
    }),
    [profile, user],
  );

  // ── Form fields ───────────────────────────────────────────────────────────
  const [fields, setFields] = useState(getInitialFields);
  const [initialFields, setInitialFields] = useState(getInitialFields);

  useEffect(() => {
    const fresh = getInitialFields();
    setFields(fresh);
    setInitialFields(fresh);
  }, [getInitialFields]);

  const setField = (key) => (e) =>
    setFields((prev) => ({ ...prev, [key]: e.target.value }));

  // ── Avatar ────────────────────────────────────────────────────────────────
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [avatarChanged, setAvatarChanged] = useState(false);

  const displayAvatar =
    previewUrl || profile?.avatar_img || user?.user_metadata?.picture || null;

  const handleAvatarUpload = useCallback(
    async (e) => {
      const file = e.target.files?.[0];
      if (!file || !user?.id) return;

      const blobUrl = URL.createObjectURL(file);
      setPreviewUrl(blobUrl);
      setUploading(true);
      setUploadStatus(null);
      setAvatarChanged(false);

      try {
        const { publicUrl } = await uploadAvatar(user.id, file);
        if (publicUrl) {
          setPreviewUrl(publicUrl);
          setAvatarChanged(true);
        }
        setUploadStatus("success");
        setTimeout(() => setUploadStatus(null), 3000);
      } catch (err) {
        setPreviewUrl(null);
        setAvatarChanged(false);
        setUploadStatus("error:" + err.message);
        setTimeout(() => setUploadStatus(null), 4000);
      } finally {
        setUploading(false);
        URL.revokeObjectURL(blobUrl);
      }
    },
    [user?.id, uploadAvatar],
  );

  // ── Detect real changes ───────────────────────────────────────────────────
  const hasChanges = useMemo(() => {
    if (avatarChanged) return true;
    return (
      fields.fullName.trim() !== initialFields.fullName.trim() ||
      fields.email.trim() !== initialFields.email.trim() ||
      fields.phone.trim() !== initialFields.phone.trim()
    );
  }, [fields, initialFields, avatarChanged]);

  // ── Save profile ──────────────────────────────────────────────────────────
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const handleSave = useCallback(async () => {
    if (!user?.id || !hasChanges) return;
    setSaving(true);
    setSaveStatus(null);

    try {
      await updateProfile(user.id, {
        full_name: fields.fullName,
        phone: fields.phone,
        email: fields.email,
      });

      if (!isGoogleLogin && fields.email !== user.email) {
        const { error } = await supabase.auth.updateUser({
          email: fields.email,
        });
        if (error) throw error;
        setSaveStatus("email-confirm");
      } else {
        setSaveStatus("success");
      }

      setInitialFields({ ...fields });
      setAvatarChanged(false);
    } catch (err) {
      setSaveStatus("error:" + err.message);
    } finally {
      setSaving(false);
      setTimeout(() => setSaveStatus(null), 5000);
    }
  }, [user?.id, user?.email, fields, updateProfile, isGoogleLogin, hasChanges]);

  // ── Copy salon link ───────────────────────────────────────────────────────
  const [copied, setCopied] = useState(false);
  const handleCopyLink = () => {
    if (!resolvedSalonUrl) return;
    navigator.clipboard.writeText(resolvedSalonUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const roleLabel = profile?.role === "owner" ? "Salon Owner" : "Client";
  const displayName = fields.fullName || "User";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm md:px-10">
      <div className="relative grid h-[94vh] max-h-[94vh] w-full max-w-6xl overflow-x-hidden overflow-y-auto border-8 border-[#f4f1ec] bg-[#f4f1ec] shadow-[0_30px_90px_rgba(0,0,0,0.35)] md:grid-cols-2 md:overflow-hidden">
        {/* ── Close ── */}
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute top-5 right-5 z-20 grid h-9 w-9 place-items-center border border-neutral-300 bg-white text-xs font-bold text-neutral-600 uppercase transition hover:bg-neutral-900 hover:text-white"
        >
          ✕
        </button>

        {/* ════════════════════════════════════════
            LEFT — Avatar panel
        ════════════════════════════════════════ */}
        <div className="relative min-h-[280px] md:min-h-full">
          {displayAvatar ? (
            <img
              src={displayAvatar}
              alt={displayName}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-neutral-300 to-neutral-400">
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white/20 text-5xl font-bold text-white">
                {displayName.charAt(0).toUpperCase()}
              </div>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

          {/* Camera upload button — non-Google users only */}
          {!isGoogleLogin && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                disabled={uploading}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                title="Upload profile photo"
                className="absolute top-4 left-4 z-10 flex items-center gap-2 rounded-full border border-white/30 bg-black/40 px-3 py-1.5 text-[11px] tracking-wide text-white backdrop-blur-sm transition hover:bg-black/70 disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <span className="inline-block h-3 w-3 animate-spin rounded-full border border-white border-t-transparent" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <svg
                      className="h-3.5 w-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                    Change photo
                  </>
                )}
              </button>

              {uploadStatus === "success" && (
                <div className="absolute top-14 left-4 z-10 rounded-full bg-green-500/90 px-3 py-1 text-[11px] text-white">
                  ✓ Photo updated
                </div>
              )}
              {uploadStatus?.startsWith("error:") && (
                <div className="absolute top-14 left-4 z-10 rounded-full bg-red-500/90 px-3 py-1 text-[11px] text-white">
                  Upload failed
                </div>
              )}
            </>
          )}

          {/* Name + role at bottom */}
          <div className="absolute right-0 bottom-0 left-0 z-10 p-8 md:p-10">
            <p className="text-4xl font-bold text-white">{displayName}</p>
            <p className="mt-1.5 text-sm tracking-[0.2em] text-white/70 uppercase">
              {roleLabel}
            </p>
            {isGoogleLogin && (
              <span className="mt-3 inline-block rounded bg-white/20 px-2 py-0.5 text-[11px] tracking-wider text-white/60">
                ✓ Google Account
              </span>
            )}
          </div>
        </div>

        {/* ════════════════════════════════════════
            RIGHT — Form panel
        ════════════════════════════════════════ */}
        <div className="flex flex-col overflow-y-auto bg-[#f7f5f0] p-8 md:p-12">
          <div className="mx-auto w-full max-w-md">
            <p className="text-[11px] tracking-[0.4em] text-black/40 uppercase">
              {brand}
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-[0.15em] text-black md:text-4xl">
              My Profile
            </h2>
            <p className="mt-2 text-sm text-black/50">
              Update your personal information below.
            </p>

            <div className="mt-8 space-y-5">
              {/* ── Personal Info ── */}
              <div className="rounded-2xl border border-black/8 bg-white p-5 shadow-sm">
                <p className="mb-4 text-[11px] font-semibold tracking-[0.2em] text-black/40 uppercase">
                  Personal Information
                </p>
                <div className="space-y-4">
                  <Field label="Full name">
                    <input
                      type="text"
                      value={fields.fullName}
                      onChange={setField("fullName")}
                      placeholder="Your full name"
                      className={inputBase}
                    />
                  </Field>
                  <Field label="Email address">
                    <input
                      type="email"
                      value={fields.email}
                      onChange={setField("email")}
                      placeholder="you@example.com"
                      disabled={isGoogleLogin}
                      className={`${inputBase} ${isGoogleLogin ? "cursor-not-allowed bg-black/5 text-black/40" : ""}`}
                    />
                    {isGoogleLogin && (
                      <p className="mt-1 text-[11px] text-black/35">
                        Managed by your Google account
                      </p>
                    )}
                  </Field>
                  <Field label="Phone number">
                    <input
                      type="tel"
                      value={fields.phone}
                      onChange={setField("phone")}
                      placeholder="+1 234 567 8900"
                      className={inputBase}
                    />
                  </Field>
                </div>
              </div>

              {/* ── Salon Sharing — owners only, auto URL ── */}
              {profile?.role === "owner" && resolvedSalonUrl && (
                <div className="rounded-2xl border border-black/8 bg-white p-5 shadow-sm">
                  <p className="mb-1 text-[11px] font-semibold tracking-[0.2em] text-black/40 uppercase">
                    Salon Booking Link
                  </p>
                  <p className="mb-4 text-[11px] text-black/40">
                    Share this link or QR code with clients so they can book
                    directly.
                  </p>
                  <Field label="Your Salon URL">
                    <input
                      type="text"
                      value={resolvedSalonUrl}
                      readOnly
                      className={`${inputBase} cursor-text bg-black/5 text-xs`}
                    />
                  </Field>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="mt-3 w-full border border-black/25 py-2 text-xs tracking-[0.25em] text-black uppercase transition hover:bg-black hover:text-white"
                  >
                    {copied ? "✓ Copied!" : "Copy Link"}
                  </button>
                  <div className="mt-5 flex flex-col items-center gap-2">
                    <p className="text-[11px] tracking-[0.2em] text-black/40 uppercase">
                      QR Code — Clients scan this
                    </p>
                    <div className="rounded-xl border border-black/8 bg-white p-3">
                      <QRCodeSVG
                        value={resolvedSalonUrl}
                        size={130}
                        level="H"
                        includeMargin
                        fgColor="#2d2620"
                        bgColor="#ffffff"
                      />
                    </div>
                    <p className="text-center text-[10px] text-black/30">
                      Scan opens booking page for your salon only
                    </p>
                  </div>
                </div>
              )}

              {/* ── Account Security ── */}
              <div className="rounded-2xl border border-black/8 bg-white p-5 shadow-sm">
                <p className="mb-4 text-[11px] font-semibold tracking-[0.2em] text-black/40 uppercase">
                  Account Security
                </p>
                <div className="space-y-3">
                  <input
                    type="password"
                    placeholder="Current password"
                    className={inputBase}
                  />
                  <input
                    type="password"
                    placeholder="New password"
                    className={inputBase}
                  />
                  <input
                    type="password"
                    placeholder="Confirm password"
                    className={inputBase}
                  />
                </div>
                <button
                  type="button"
                  className="mt-4 w-full border border-black/25 py-2.5 text-xs tracking-[0.25em] text-black uppercase transition hover:bg-black hover:text-white"
                >
                  Change Password
                </button>
              </div>

              {/* ── Reviews ── */}
              <div className="rounded-2xl border border-black/8 bg-white p-5 shadow-sm">
                <p className="mb-4 flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] text-black/40 uppercase">
                  <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M21 15a4 4 0 0 1-4 4H7l-4 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
                  </svg>
                  Reviews &amp; Reports
                </p>
                <div className="rounded-xl border border-black/10 bg-neutral-50 px-4 py-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-black">
                        Jo Brown
                      </p>
                      <p className="text-xs text-black/50">
                        Haircut · 22 Feb 2026
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-semibold text-black">
                      4.5 <span className="text-amber-400">★</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-black/15 px-3 py-1 text-[11px] tracking-[0.15em] text-black/60 uppercase transition hover:bg-black hover:text-white"
                  >
                    Edit review
                    <svg
                      className="h-3 w-3"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                    </svg>
                  </button>
                </div>
                <div className="mt-3 rounded-xl border border-black/10 bg-neutral-50 p-4">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <Field label="Date & Time">
                      <input
                        type="text"
                        defaultValue="22 Feb 2026 / 10:00AM"
                        className={`${inputBase} py-2 text-xs`}
                      />
                    </Field>
                    <Field label="Staff">
                      <input
                        type="text"
                        defaultValue="Jo Brown"
                        className={`${inputBase} py-2 text-xs`}
                      />
                    </Field>
                    <Field label="Rating">
                      <input
                        type="text"
                        defaultValue="4.9"
                        className={`${inputBase} py-2 text-xs`}
                      />
                    </Field>
                  </div>
                  <div className="mt-3">
                    <Field label="Services">
                      <input
                        type="text"
                        defaultValue="Haircut"
                        className={`${inputBase} py-2 text-xs`}
                      />
                    </Field>
                  </div>
                  <div className="mt-3">
                    <Field label="Report">
                      <textarea
                        rows={2}
                        placeholder="Describe the issue..."
                        className={`${inputBase} resize-none py-2 text-xs`}
                      />
                    </Field>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      className="border border-black/25 bg-white px-5 py-1.5 text-[11px] tracking-[0.2em] text-black uppercase transition hover:bg-black hover:text-white"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>

              {/* ── Save status messages ── */}
              {saveStatus === "success" && (
                <div className="rounded-xl border border-green-100 bg-green-50 p-3 text-sm text-green-700">
                  ✓ Profile updated successfully!
                </div>
              )}
              {saveStatus === "email-confirm" && (
                <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-700">
                  ✓ Saved! Check your new email for a confirmation link.
                </div>
              )}
              {saveStatus?.startsWith("error:") && (
                <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">
                  {saveStatus.replace("error:", "")}
                </div>
              )}

              {/* ── Action buttons ── */}
              <div className="grid gap-3 pb-6 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving || !hasChanges}
                  title={!hasChanges ? "No changes to save" : undefined}
                  className="w-full bg-black py-3 text-sm tracking-[0.3em] text-white uppercase transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={onLogout}
                  className="w-full border border-black/35 bg-white py-3 text-sm tracking-[0.3em] text-black uppercase transition hover:bg-black hover:text-white"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
