import Icon from "./ui/Icon";
import { useState, useMemo, useId, useEffect, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useAuth } from "../hooks/useAuth";
import "./profileMobile.css";

// ─── Shared input style ───────────────────────────────────────────────────────
const inputBase =
  "w-full border border-black/10 bg-white px-4 py-3 text-sm text-black placeholder:text-black/30 focus:border-black/40 focus:ring-1 focus:ring-black/20 focus:outline-none transition rounded-lg";

// ─── Small reusable field wrapper ─────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div>
      <label htmlFor="profile-salon-url" className="mb-1.5 block text-[11px] font-medium tracking-[0.18em] text-black/50 uppercase">
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
  const { user, profile } = useAuth();
  const titleId = useId();
  const dialogRef = useRef(null);
  const copyTimeout = useRef(null);

  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
      clearTimeout(copyTimeout.current);
    };
  }, []);

  const handleDialogKeyDown = (event) => {
    if (event.key === "Escape") onClose();
    if (event.key !== "Tab") return;
    const controls = [...dialogRef.current.querySelectorAll("button, input, a[href]")]
      .filter((element) => !element.disabled && element.getClientRects().length);
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  };

  // ── AUTO-GENERATE salonUrl if not passed as prop ──────────────────────────
  // When owner scans QR → opens /book/:ownerId (ClientBookingPage)
  const resolvedSalonUrl = useMemo(() => {
    if (salonUrl) return salonUrl; // use prop if provided
    if (!user?.id) return null;
    return `${window.location.origin}/book/${user.id}`;
  }, [salonUrl, user?.id]);

  const isGoogleLogin = user?.app_metadata?.provider === "google";

  const fields = {
    fullName:
      profile?.full_name ||
      user?.user_metadata?.full_name ||
      user?.email?.split("@")[0] ||
      "",
    email: profile?.email || user?.email || "",
    phone: profile?.phone || "",
  };
  const displayAvatar = profile?.avatar_img || null;

  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");
  const handleCopyLink = async () => {
    if (!resolvedSalonUrl) return;
    setCopyError("");
    try {
      await navigator.clipboard.writeText(resolvedSalonUrl);
      setCopied(true);
      clearTimeout(copyTimeout.current);
      copyTimeout.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
      setCopyError("Could not copy the link. Select the address above to copy it.");
    }
  };

  const roleLabel = profile?.role === "owner" ? "Salon Owner" : "Client";
  const displayName = fields.fullName || "User";

  return (
    <div
      className="profile-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm md:px-10"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} onKeyDown={handleDialogKeyDown} className="profile-dialog relative grid h-[94vh] max-h-[94vh] w-full max-w-6xl overflow-x-hidden overflow-y-auto border-8 border-[#f4f1ec] bg-[#f4f1ec] shadow-[0_30px_90px_rgba(0,0,0,0.35)] md:grid-cols-2 md:overflow-hidden">
        {/* ── Close ── */}
        <div className="profile-toolbar">
          <p className="profile-mobile-title" aria-hidden="true">My Profile</p>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="profile-close absolute top-5 right-5 z-20 grid h-9 w-9 place-items-center border border-neutral-300 bg-white text-xs font-bold text-neutral-600 uppercase transition hover:bg-neutral-900 hover:text-white"
        >
          <Icon name="close-x" size={18} aria-hidden="true" />
        </button>
        </div>

        {/* ════════════════════════════════════════
            LEFT — Avatar panel
        ════════════════════════════════════════ */}
        <div className="profile-identity relative min-h-[280px] md:min-h-full">
          {displayAvatar ? (
            <img
              src={displayAvatar}
              alt={displayName}
              className="profile-photo absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="profile-photo profile-photo-fallback absolute inset-0 flex items-center justify-center bg-gradient-to-br from-neutral-300 to-neutral-400">
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white/20 text-5xl font-bold text-white">
                <Icon name="user-profile" size={72} aria-label="User profile" />
              </div>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="profile-photo-shade absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

          {/* Name + role at bottom */}
          <div className="profile-identity-copy absolute right-0 bottom-0 left-0 z-10 p-8 md:p-10">
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
        <div className="profile-content flex flex-col overflow-y-auto bg-[#f7f5f0] p-8 md:p-12">
          <div className="mx-auto w-full max-w-md">
            <p className="profile-brand text-[11px] tracking-[0.4em] text-black/40 uppercase">
              {brand}
            </p>
            <h2 id={titleId} className="profile-heading mt-2 text-3xl font-bold tracking-[0.15em] text-black md:text-4xl">
              My Profile
            </h2>
            <p className="profile-description mt-2 text-sm text-black/50">
              Your personal information.
            </p>

            <div className="profile-sections mt-8 space-y-5">
              {/* ── Personal Info ── */}
              <div className="profile-info-card rounded-2xl border border-black/8 bg-white p-5 shadow-sm">
                <p className="mb-4 text-[11px] font-semibold tracking-[0.2em] text-black/40 uppercase">
                  Personal Information
                </p>
                <dl className="space-y-4">
                  {[
                    ["Full name", fields.fullName],
                    ["Email address", fields.email],
                    ["Phone number", fields.phone],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <dt className="mb-1.5 text-[11px] font-medium tracking-[0.18em] text-black/50 uppercase">
                        {label}
                      </dt>
                      <dd className="text-sm break-words text-black">
                        {value || "Not provided"}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* ── Salon Sharing — owners only, auto URL ── */}
              {profile?.role === "owner" && resolvedSalonUrl && (
                <div className="profile-share-card rounded-2xl border border-black/8 bg-white p-5 shadow-sm">
                  <p className="mb-1 text-[11px] font-semibold tracking-[0.2em] text-black/40 uppercase">
                    Salon Booking Link
                  </p>
                  <p className="mb-4 text-[11px] text-black/40">
                    Share this link or QR code with clients so they can book
                    directly.
                  </p>
                  <Field label="Your Salon URL">
                    <input
                      id="profile-salon-url"
                      type="text"
                      value={resolvedSalonUrl}
                      readOnly
                      className={`${inputBase} cursor-text bg-black/5 text-xs`}
                    />
                  </Field>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="profile-copy mt-3 w-full border border-black/25 py-2 text-xs tracking-[0.25em] text-black uppercase transition hover:bg-black hover:text-white"
                  >
                    {copied ? "✓ Copied!" : "Copy Link"}
                  </button>
                  {copyError && <p role="alert" className="mt-2 text-xs text-red-700">{copyError}</p>}
                  <span className="sr-only" role="status">{copied ? "Booking link copied" : ""}</span>
                  <div className="profile-qr mt-5 flex flex-col items-center gap-2">
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

              <div className="profile-actions pb-6">
                <button
                  type="button"
                  onClick={onLogout}
                  className="profile-logout w-full border border-black/35 bg-white py-3 text-sm tracking-[0.3em] text-black uppercase transition hover:bg-black hover:text-white"
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
