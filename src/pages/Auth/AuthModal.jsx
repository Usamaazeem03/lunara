import React, { useEffect, useRef, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import clientLoginImg from "../../assets/images/client-login-img.jpg";
import ownerLoginImg from "../../assets/images/owner-login-img.jpg";

/* ─── snap positions as % of screen height from the TOP ─── */
const SNAP_PEEK = 78; // collapsed  — just handle + title peeking
const SNAP_HALF = 52; // mid        — form partially visible
const SNAP_FULL = 8; // expanded   — sheet nearly full screen

function AuthModal() {
  const navigate = useNavigate();
  const location = useLocation();

  /* ── routing helpers ── */
  const getAuthFromPath = (pathname) => {
    const segments = pathname.split("/").filter(Boolean);
    const roleSegment = segments[1];
    const modeSegment = segments[2] || segments[1];
    const role = roleSegment === "owner" ? "owner" : "client";
    const mode =
      modeSegment === "login" || modeSegment === "signin" ? "login" : "signup";
    return { role, mode };
  };

  const { role, mode: authMode } = getAuthFromPath(location.pathname);
  const roleImages = { client: clientLoginImg, owner: ownerLoginImg };
  const getModeSegment = (m) => (m === "login" ? "signin" : "signup");
  const buildAuthPath = (r, m) => `/auth/${r}/${getModeSegment(m)}`;

  const handleModeChange = (nextMode) =>
    navigate(buildAuthPath(role, nextMode));
  const handleRoleChange = (nextRole) =>
    navigate(buildAuthPath(nextRole, authMode));

  useEffect(() => {
    const canonical = buildAuthPath(role, authMode);
    if (
      location.pathname.startsWith("/auth") &&
      location.pathname !== canonical
    )
      navigate(canonical, { replace: true });
  }, [location.pathname, authMode, role, navigate]);

  /* ─────────── BOTTOM SHEET DRAG LOGIC ─────────── */
  const sheetRef = useRef(null);
  const dragState = useRef(null); // { startY, startTop }
  const [topPct, setTopPct] = useState(SNAP_PEEK);
  const [dragging, setDragging] = useState(false);
  const [snapping, setSnapping] = useState(false);

  const snapTo = useCallback((pct) => {
    setSnapping(true);
    setTopPct(pct);
    setTimeout(() => setSnapping(false), 320);
  }, []);

  /* find nearest snap point */
  const nearestSnap = (pct) => {
    const snaps = [SNAP_PEEK, SNAP_HALF, SNAP_FULL];
    return snaps.reduce((a, b) =>
      Math.abs(b - pct) < Math.abs(a - pct) ? b : a,
    );
  };

  const onDragStart = useCallback(
    (clientY) => {
      dragState.current = { startY: clientY, startTop: topPct };
      setDragging(true);
      setSnapping(false);
    },
    [topPct],
  );

  const onDragMove = useCallback((clientY) => {
    if (!dragState.current) return;
    const deltaVh =
      ((clientY - dragState.current.startY) / window.innerHeight) * 100;
    const newTop = Math.min(
      SNAP_PEEK,
      Math.max(SNAP_FULL, dragState.current.startTop + deltaVh),
    );
    setTopPct(newTop);
  }, []);

  const onDragEnd = useCallback(
    (clientY) => {
      if (!dragState.current) return;
      const deltaVh =
        ((clientY - dragState.current.startY) / window.innerHeight) * 100;
      const velocity = clientY - dragState.current.startY; // positive = drag down
      const rawTop = dragState.current.startTop + deltaVh;

      let target;
      if (Math.abs(velocity) > 6) {
        // fast flick — move one snap in direction
        const snaps = [SNAP_FULL, SNAP_HALF, SNAP_PEEK];
        const cur = nearestSnap(dragState.current.startTop);
        const idx = snaps.indexOf(cur);
        target =
          velocity > 0
            ? snaps[Math.min(idx + 1, snaps.length - 1)] // drag down → collapse
            : snaps[Math.max(idx - 1, 0)]; // drag up   → expand
      } else {
        target = nearestSnap(rawTop);
      }

      dragState.current = null;
      setDragging(false);
      snapTo(target);
    },
    [snapTo],
  );

  /* ── mouse events ── */
  const onMouseDown = (e) => {
    e.preventDefault();
    onDragStart(e.clientY);
  };
  useEffect(() => {
    if (!dragging) return;
    const move = (e) => onDragMove(e.clientY);
    const up = (e) => onDragEnd(e.clientY);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, [dragging, onDragMove, onDragEnd]);

  /* ── touch events ── */
  const onTouchStart = (e) => onDragStart(e.touches[0].clientY);
  const onTouchMove = (e) => {
    e.preventDefault();
    onDragMove(e.touches[0].clientY);
  };
  const onTouchEnd = (e) => onDragEnd(e.changedTouches[0].clientY);

  const isExpanded = topPct <= SNAP_HALF;

  /* ──────────────────────────────────────────────── */
  return (
    <>
      {/* ══════════════════ MOBILE LAYOUT ══════════════════ */}
      {/* Outer frame — bg + padding gives the "border + breathing room" like desktop */}
      <div className="relative w-full h-screen overflow-hidden md:hidden bg-[#f4f1ec] px-3 py-4">
        {/* Inner card — rounded, clipped, fills the padded area */}
        <div className="relative w-full h-full overflow-hidden rounded-2xl shadow-[0_20px_70px_rgba(0,0,0,0.4)]">
          {/* Full-screen background image */}
          <img
            src={roleImages[role]}
            alt="Salon"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/70" />

          {/* Brand + tagline overlay */}
          <div className="absolute top-0 left-0 right-0 p-7 z-10 pointer-events-none">
            <h1 className="text-3xl uppercase tracking-[0.45em] text-white/80 font-light">
              LUNARA
            </h1>
            <p className="mt-2 text-lg font-semibold text-white leading-snug">
              Beauty Meets Simplicity
            </p>
            <p className="mt-1 text-xs text-white/70 tracking-wide">
              Book, manage, and glow — all in one place.
            </p>
          </div>

          {/* Close button */}
          <button
            type="button"
            aria-label="Close"
            onClick={() => navigate("/")}
            className="fixed right-4 top-4 z-50 grid h-10 w-10 place-items-center border border-white/40 bg-black/30 backdrop-blur-sm text-sm font-semibold text-white transition-colors hover:bg-white hover:text-black"
          >
            ✕
          </button>

          {/* 3 Step boxes — bottom-left of image, above the sheet */}
          <div
            className="absolute left-0 right-0 z-10 px-4 flex gap-2 transition-all duration-300"
            style={{
              bottom: `calc(${100 - topPct}vh + 12px)`,
              opacity: topPct >= SNAP_HALF ? 1 : 0,
              pointerEvents: "none",
            }}
          >
            {[
              {
                step: "01",
                title: "Create Account",
                sub: "Sign up in seconds.",
              },
              {
                step: "02",
                title: "Choose Service",
                sub: "Hair, skin or groom.",
              },
              {
                step: "03",
                title: "Book & Relax",
                sub: "Pick time, you're set.",
              },
            ].map(({ step, title, sub }) => (
              <div
                key={step}
                className="flex-1 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 px-3 py-2"
              >
                <p className="text-[9px] font-semibold text-white/50 uppercase tracking-widest">
                  {step}
                </p>
                <p className="mt-1 text-[11px] font-semibold text-white leading-tight">
                  {title}
                </p>
                <p className="mt-0.5 text-[9px] text-white/60 leading-tight">
                  {sub}
                </p>
              </div>
            ))}
          </div>

          {/* ── DRAGGABLE BOTTOM SHEET ── */}
          <div
            ref={sheetRef}
            className="absolute left-0 right-0 bottom-0 z-20 rounded-t-3xl bg-[#f7f5f0] shadow-[0_-20px_60px_rgba(0,0,0,0.35)]"
            style={{
              top: `${topPct}vh`,
              transition: snapping
                ? "top 0.32s cubic-bezier(0.32,0.72,0,1)"
                : "none",
              willChange: "top",
            }}
          >
            {/* ── Drag handle zone ── */}
            <div
              className="flex flex-col items-center pt-3 pb-2 cursor-grab active:cursor-grabbing select-none"
              onMouseDown={onMouseDown}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              style={{ touchAction: "none" }}
            >
              {/* Pill handle */}
              <div
                className="w-10 h-1.5 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: isExpanded ? "#00000040" : "#000000aa",
                }}
              />
              {/* Collapsed hint text */}
              {topPct >= SNAP_HALF && (
                <p className="mt-2 text-[11px] uppercase tracking-[0.3em] text-black/40 select-none">
                  {authMode === "signup" ? "Create Account" : "Sign In"} — drag
                  up
                </p>
              )}
            </div>

            {/* ── Sheet content ── */}
            <div
              className="px-6 pb-10 overflow-y-auto"
              style={{ maxHeight: `calc(${100 - topPct}vh - 40px)` }}
            >
              <p className="text-xs uppercase tracking-[0.4em] text-black/40">
                Welcome to Lunara
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-[0.15em] text-black">
                {authMode === "signup" ? "Create Your Account" : "Welcome Back"}
              </h2>
              <p className="mt-1 text-sm text-black/55">
                {authMode === "signup"
                  ? "Begin your glow journey with a few quick details."
                  : "Sign in to manage your bookings and profile."}
              </p>

              {/* Role toggle */}
              <div className="mt-4 inline-flex rounded-full border border-black/10 bg-black/5 p-1">
                <button
                  type="button"
                  onClick={() => handleRoleChange("client")}
                  className={`px-5 py-2 text-xs uppercase tracking-[0.2em] transition rounded-full cursor-pointer ${
                    role === "client"
                      ? "bg-black text-white shadow-sm"
                      : "text-black/60 hover:text-black"
                  }`}
                >
                  Client
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange("owner")}
                  className={`px-5 py-2 text-xs uppercase tracking-[0.2em] transition rounded-full cursor-pointer ${
                    role === "owner"
                      ? "bg-black text-white shadow-sm"
                      : "text-black/60 hover:text-black"
                  }`}
                >
                  Owner
                </button>
              </div>

              <AuthForm mode={authMode} onModeChange={handleModeChange} />
            </div>
          </div>
        </div>
        {/* end inner card */}
      </div>
      {/* end outer frame */}

      {/* ══════════════════ DESKTOP LAYOUT (original — untouched) ══════════════════ */}
      <div className="relative hidden md:grid w-full max-w-6xl h-[94vh] max-h-[94vh] overflow-y-auto overflow-x-hidden border-8 border-[#f4f1ec] bg-[#f4f1ec] shadow-[0_30px_90px_rgba(0,0,0,0.35)] md:grid-cols-2 md:overflow-hidden transition-all duration-300">
        {/* Close Button */}
        <button
          type="button"
          aria-label="Close"
          onClick={() => navigate("/")}
          className="absolute right-6 top-6 z-20 grid h-10 w-10 place-items-center border border-neutral-300 bg-white text-sm font-semibold uppercase tracking-[0.2em] text-neutral-700 transition-colors hover:bg-neutral-900 hover:text-white"
        >
          X
        </button>

        {/* Left image */}
        <div className="relative min-h-[240px] md:min-h-full">
          <img
            src={roleImages[role]}
            alt="Salon"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/50 to-black/10" />
          <div className="absolute -left-16 -top-16 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 right-0 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <div className="relative z-10 flex h-full flex-col p-8 text-white md:p-10">
            <h1 className="mb-4 text-4xl uppercase tracking-[0.4em] text-white/70">
              LUNARA
            </h1>
            <div className="mt-auto">
              <p className="text-4xl font-bold">Beauty Meets Simplicity</p>
              <p className="mt-4 max-w-md text-base leading-relaxed text-white/85 md:text-lg">
                Book, manage, and glow - all in one place.
              </p>
              <div className="mt-6 grid gap-4 text-xs uppercase tracking-[0.2em] text-white/80 sm:grid-cols-3">
                <div className="rounded-xl bg-white/30 px-4 py-3 pl-6">
                  <p className="text-[10px] text-white/60">Step 1</p>
                  <p className="mt-2 text-sm font-semibold normal-case text-white">
                    Create Account
                  </p>
                  <p className="mt-1 text-[11px] normal-case text-white/70">
                    Sign up in seconds.
                  </p>
                </div>
                <div className="rounded-xl bg-white/30 px-4 py-3 pl-6">
                  <p className="text-[10px] text-white/60">Step 2</p>
                  <p className="mt-2 text-sm font-semibold normal-case text-white">
                    Choose Service
                  </p>
                  <p className="mt-1 text-[11px] normal-case text-white/70">
                    Skin, hair or grooming.
                  </p>
                </div>
                <div className="rounded-xl bg-white/30 px-4 py-3 pl-6">
                  <p className="text-[10px] text-white/60">Step 3</p>
                  <p className="mt-2 text-sm font-semibold normal-case text-white">
                    Book Appointment
                  </p>
                  <p className="mt-1 text-[11px] normal-case text-white/70">
                    Pick time and relax.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right form */}
        <div className="relative flex flex-col justify-center bg-[#f7f5f0] p-8 md:p-12">
          <div className="mx-auto w-full max-w-md">
            <p className="text-xs uppercase tracking-[0.4em] text-black/50">
              Welcome to Lunara
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-[0.2em] text-black md:text-4xl">
              {authMode === "signup" ? "Create Your Account" : "Welcome Back"}
            </h2>
            <p className="mt-3 text-sm text-black/60">
              {authMode === "signup"
                ? "Begin your glow journey with a few quick details."
                : "Sign in to manage your bookings and profile."}
            </p>
            <div className="mt-5 inline-flex rounded-full border border-black/10 bg-black/5 p-1">
              <button
                type="button"
                onClick={() => handleRoleChange("client")}
                className={`px-6 py-2 text-xs uppercase tracking-[0.2em] transition rounded-full cursor-pointer ${
                  role === "client"
                    ? "bg-black text-white shadow-sm"
                    : "text-black/60 hover:text-black"
                }`}
              >
                Client
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange("owner")}
                className={`px-6 py-2 text-xs uppercase tracking-[0.2em] transition rounded-full cursor-pointer ${
                  role === "owner"
                    ? "bg-black text-white shadow-sm"
                    : "text-black/60 hover:text-black"
                }`}
              >
                Owner
              </button>
            </div>
            {role === "client" && (
              <AuthForm mode={authMode} onModeChange={handleModeChange} />
            )}
            {role === "owner" && (
              <AuthForm mode={authMode} onModeChange={handleModeChange} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function AuthForm({ mode, onModeChange }) {
  const navigate = useNavigate();
  const inputBase =
    "w-full border border-black/10 bg-white/80 px-4 py-3 text-sm text-black placeholder:text-black/40 focus:border-black/40 focus:ring-1 focus:ring-black/30 focus:outline-none transition";
  const isSignup = mode === "signup";

  return (
    <div className="scrollbar-wow mt-6 md:mt-8 md:max-h-[50vh] md:overflow-y-auto md:pr-3">
      {isSignup && (
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-black/60">
            Full name
          </label>
          <input
            type="text"
            placeholder="Full name"
            className={`${inputBase} mt-2`}
          />
        </div>
      )}

      <div className={isSignup ? "mt-5" : ""}>
        <label className="text-xs uppercase tracking-[0.2em] text-black/60">
          Email
        </label>
        <input
          type="email"
          placeholder="you@lunara.com"
          className={`${inputBase} mt-2`}
        />
      </div>

      {isSignup && (
        <div className="mt-5">
          <label className="text-xs uppercase tracking-[0.2em] text-black/60">
            Phone number
          </label>
          <div className="mt-2 flex">
            <span className="flex items-center border border-black/10 bg-black/5 px-3 text-xs uppercase tracking-[0.2em] text-black/60">
              PK +92
            </span>
            <input
              type="text"
              placeholder="300 000 0000"
              className={`${inputBase} border-l-0`}
            />
          </div>
        </div>
      )}

      <div className="mt-5">
        <label className="text-xs uppercase tracking-[0.2em] text-black/60">
          Password
        </label>
        <input
          type="password"
          placeholder={isSignup ? "Create a password" : "Enter your password"}
          className={`${inputBase} mt-2`}
        />
      </div>

      {!isSignup && (
        <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-black/50">
          <label className="flex items-center gap-2 normal-case">
            <input type="checkbox" className="h-4 w-4 accent-black" />
            Remember me
          </label>
          <button
            type="button"
            className="text-black/70 underline decoration-black/30 hover:text-black"
          >
            Forgot password?
          </button>
        </div>
      )}

      <button
        onClick={() => navigate("/dashboard", { replace: true })}
        type="button"
        className="mt-7 w-full bg-black py-3 text-sm uppercase tracking-[0.3em] text-white transition hover:bg-black/85"
      >
        {isSignup ? "Create Account" : "Log in"}
      </button>

      <p className="mt-4 text-center text-sm text-black/60">
        {isSignup ? "Already have an account?" : "New to Lunara?"}{" "}
        <button
          type="button"
          onClick={() => onModeChange(isSignup ? "login" : "signup")}
          className="text-black underline cursor-pointer hover:text-black/80"
        >
          {isSignup ? "Log in" : "Create account"}
        </button>
      </p>

      <button
        type="button"
        className="mt-6 mb-8 md:mb-2 flex w-full items-center justify-center gap-3 border border-black/30 bg-white/80 py-3 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="google"
          className="h-5 w-5"
        />
        Continue with Google
      </button>
    </div>
  );
}

export default AuthModal;
