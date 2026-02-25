import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import clientLoginImg from "../../assets/images/client-login-img.jpg";
import ownerLoginImg from "../../assets/images/owner-login-img.jpg";

function AuthModal() {
  const navigate = useNavigate();
  const location = useLocation();
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
  const roleImages = {
    client: clientLoginImg,
    owner: ownerLoginImg,
  };
  const getModeSegment = (mode) => (mode === "login" ? "signin" : "signup");
  const buildAuthPath = (nextRole, nextMode) =>
    `/auth/${nextRole}/${getModeSegment(nextMode)}`;
  const handleModeChange = (nextMode) => {
    const target = buildAuthPath(role, nextMode);
    navigate(target);
  };
  const handleRoleChange = (nextRole) => {
    const target = buildAuthPath(nextRole, authMode);
    navigate(target);
  };

  useEffect(() => {
    const canonicalPath = buildAuthPath(role, authMode);
    if (
      location.pathname.startsWith("/auth") &&
      location.pathname !== canonicalPath
    ) {
      navigate(canonicalPath, { replace: true });
    }
  }, [location.pathname, authMode, role, navigate]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm md:px-10">
      {/* Modal Container */}
      <div className="relative grid w-full max-w-6xl h-[94vh] max-h-[94vh] overflow-y-auto overflow-x-hidden border-8 border-[#f4f1ec] bg-[#f4f1ec] shadow-[0_30px_90px_rgba(0,0,0,0.35)] md:grid-cols-2 md:overflow-hidden">
        {/* Close Button */}
        <button
          type="button"
          aria-label="Close"
          onClick={() => navigate("/")}
          className="absolute right-6 top-6 z-20 grid h-10 w-10 place-items-center border border-neutral-300 bg-white text-sm font-semibold uppercase tracking-[0.2em] text-neutral-700 transition-colors hover:bg-neutral-900 hover:text-white"
        >
          X
        </button>

        {/* ================= LEFT SIDE IMAGE ================= */}
        <div className="relative min-h-[240px] md:min-h-full">
          <img
            src={roleImages[role]}
            alt="Salon"
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/50 to-black/10" />
          <div className="absolute -left-16 -top-16 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 right-0 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

          {/* Text Overlay */}
          <div className="relative z-10 flex h-full flex-col p-8 text-white md:p-10">
            <h1 className="mb-4 text-4xl uppercase tracking-[0.4em] text-white/70">
              LUNARA
            </h1>
            <div className="mt-auto">
              <p className="text-4xl font-bold">Beauty Meets Simplicity</p>

              <p className="mt-4 max-w-md text-base leading-relaxed text-white/85 md:text-lg">
                Book, manage, and glow - all in one place.
              </p>

              {/* Steps */}
              <div className="mt-6 grid gap-4 text-xs uppercase tracking-[0.2em] text-white/80 sm:grid-cols-3">
                <div className="rounded-xl bg-white/30 px-4 py-3 pl-6">
                  <p className="text-[10px] text-white/60 ">Step 1</p>
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

        {/* ================= RIGHT SIDE FORM ================= */}
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

            {/* Role Toggle */}
            <div className="mt-5 inline-flex rounded-full border border-black/10 bg-black/5 p-1 ">
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

            {/* Form */}
            {role === "client" && (
              <AuthForm mode={authMode} onModeChange={handleModeChange} />
            )}
            {role === "owner" && (
              <AuthForm mode={authMode} onModeChange={handleModeChange} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AuthForm({ mode, onModeChange }) {
  const inputBase =
    "w-full border border-black/10 bg-white/80 px-4 py-3 text-sm text-black placeholder:text-black/40 focus:border-black/40 focus:ring-1 focus:ring-black/30 focus:outline-none transition";
  const isSignup = mode === "signup";

  return (
    <div className="scrollbar-wow mt-8 max-h-[50vh] min-h-[50vh] overflow-y-auto pr-3 md:min-h-0">
      {/* Full Name */}
      {isSignup && (
        <>
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
        </>
      )}

      {/* Email */}
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
        <>
          {/* Phone */}
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
        </>
      )}

      {/* Password */}
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

      {/* Primary Button */}
      <button
        type="button"
        className="mt-7 w-full bg-black py-3 text-sm uppercase tracking-[0.3em] text-white transition hover:bg-black/85"
      >
        {isSignup ? "Create Account" : "Log in"}
      </button>

      {/* Login Link */}
      <p className="mt-4 text-center text-sm text-black/60 ">
        {isSignup ? "Already have an account?" : "New to Lunara?"}{" "}
        <button
          type="button"
          onClick={() => onModeChange(isSignup ? "login" : "signup")}
          className="text-black underline cursor-pointer hover:text-black/80"
        >
          {isSignup ? "Log in" : "Create account"}
        </button>
      </p>

      {/* Google Button */}
      <button
        type="button"
        className="mt-6 flex w-full items-center justify-center gap-3 border border-black/30 bg-white/80 py-3 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
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
