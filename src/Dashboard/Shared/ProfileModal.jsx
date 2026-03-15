import profileImg from "../../assets/images/Alex-dp.png";

const fallbackProfile = {
  name: "Alex",
  role: "Salon Owner",
  email: "alex@gmail.com",
  phone: "+92 304 679 269",
  dob: "2002-03-23",
  address: "123 Main St, Apt 4B, New York, NY 10001",
};

const ProfileModal = ({
  onClose = () => {},
  onLogout = () => {},
  avatarImage = profileImg,
  brand = "LUNARA",
  profile = {},
}) => {
  const data = { ...fallbackProfile, ...profile };
  const inputBase =
    "w-full border border-black/10 bg-white/80 px-4 py-3 text-sm text-black placeholder:text-black/40 focus:border-black/40 focus:ring-1 focus:ring-black/30 focus:outline-none transition";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm md:px-10">
      <div className="relative grid w-full max-w-6xl h-[94vh] max-h-[94vh] overflow-y-auto overflow-x-hidden border-8 border-[#f4f1ec] bg-[#f4f1ec] shadow-[0_30px_90px_rgba(0,0,0,0.35)] md:grid-cols-2 md:overflow-hidden transition-all duration-300">
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-6 top-6 z-20 grid h-10 w-10 place-items-center border border-neutral-300 bg-white text-sm font-semibold uppercase tracking-[0.2em] text-neutral-700 transition-colors hover:bg-neutral-900 hover:text-white"
        >
          X
        </button>

        {/* ================= LEFT SIDE IMAGE ================= */}
        <div className="relative min-h-[240px] md:min-h-full">
          <img
            src={avatarImage}
            alt={`${data.name} profile`}
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/40 to-transparent" />
          <div className="absolute -left-16 -top-16 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 right-0 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

          {/* Text Overlay */}
          <div className="relative z-10 flex h-full flex-col justify-end p-8 text-white md:p-10">
            <div>
              <p className="text-4xl font-bold">{data.name}</p>
              <p className="mt-2 text-sm uppercase tracking-[0.2em] text-white/80">
                {data.role}
              </p>
            </div>
          </div>
        </div>

        {/* ================= RIGHT SIDE FORM ================= */}
        <div className="relative flex flex-col justify-center bg-[#f7f5f0] p-8 overflow-y-auto md:p-12 md:overflow-y-auto">
          <div className="mx-auto w-full max-w-md">
            <p className="text-xs uppercase tracking-[0.4em] text-black/50">
              {brand}
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-[0.2em] text-black md:text-4xl">
              My Profile
            </h2>
            <p className="mt-3 text-sm text-black/60">
              Manage your personal information.
            </p>

            <div className="mt-8 grid gap-5">
              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-black/60">
                  Full name
                </label>
                <input
                  type="text"
                  defaultValue={data.name}
                  className={`${inputBase} mt-2`}
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-black/60">
                  Email
                </label>
                <input
                  type="email"
                  defaultValue={data.email}
                  className={`${inputBase} mt-2`}
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-black/60">
                  Phone number
                </label>
                <input
                  type="tel"
                  defaultValue={data.phone}
                  className={`${inputBase} mt-2`}
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-black/60">
                  Date of birth
                </label>
                <input
                  type="date"
                  defaultValue={data.dob}
                  className={`${inputBase} mt-2`}
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-black/60">
                  Address
                </label>
                <textarea
                  rows={3}
                  defaultValue={data.address}
                  className={`${inputBase} mt-2 resize-none`}
                />
              </div>

              <div className="rounded-2xl border border-black/10 bg-white/80 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-black/60">
                  Account Security
                </p>
                <div className="mt-4 grid gap-3">
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
                  className="mt-4 w-full border border-black/30 bg-white/80 py-2 text-xs uppercase tracking-[0.3em] text-black transition hover:bg-black hover:text-white"
                >
                  Change password
                </button>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white/80 p-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-black/60">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-black/20 bg-white">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-3.5 w-3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M21 15a4 4 0 0 1-4 4H7l-4 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
                      <path d="M9 10h.01" />
                      <path d="M13 10h.01" />
                      <path d="M17 10h.01" />
                    </svg>
                  </span>
                  Manage review/report
                </div>

                <div className="mt-4 rounded-xl border border-black/15 bg-white px-3 py-3">
                  <div className="flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.2em] text-black/50">
                    <span>22/02/2026</span>
                    <span>Staff rating</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <div className="text-xs text-black/70">
                      <p className="text-sm font-semibold text-black">
                        Jo Brown
                      </p>
                      <p className="text-[11px] text-black/60">Haircut</p>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-semibold">
                      <span>4.5</span>
                      <span className="text-black/50">★</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="mt-3 inline-flex items-center gap-2 rounded-full border border-black/20 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-black/60 transition hover:bg-black hover:text-white"
                  >
                    Edit review
                    <svg
                      viewBox="0 0 24 24"
                      className="h-3.5 w-3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                    </svg>
                  </button>
                </div>

                <div className="mt-4 rounded-xl border border-black/15 bg-white px-3 py-3">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.2em] text-black/50">
                        Date & Time
                      </label>
                      <input
                        type="text"
                        defaultValue="22 Feb 2026 / 10:00AM"
                        className={`${inputBase} mt-2 py-2 text-xs`}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.2em] text-black/50">
                        Staff
                      </label>
                      <input
                        type="text"
                        defaultValue="Jo Brown"
                        className={`${inputBase} mt-2 py-2 text-xs`}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.2em] text-black/50">
                        Rating
                      </label>
                      <input
                        type="text"
                        defaultValue="4.9"
                        className={`${inputBase} mt-2 py-2 text-xs`}
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-black/50">
                      Services
                    </label>
                    <input
                      type="text"
                      defaultValue="Haircut"
                      className={`${inputBase} mt-2 py-2 text-xs`}
                    />
                  </div>
                  <div className="mt-3">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-black/50">
                      Report
                    </label>
                    <textarea
                      rows={2}
                      placeholder="He is ..."
                      className={`${inputBase} mt-2 resize-none py-2 text-xs`}
                    />
                  </div>
                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      className="border border-black/30 bg-white/80 px-4 py-1 text-[10px] uppercase tracking-[0.2em] text-black transition hover:bg-black hover:text-white"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  className="w-full bg-black py-3 text-sm uppercase tracking-[0.3em] text-white transition hover:bg-black/85"
                >
                  Save changes
                </button>
                <button
                  type="button"
                  onClick={onLogout}
                  className="w-full border border-black/40 bg-white/80 py-3 text-sm uppercase tracking-[0.3em] text-black transition hover:bg-black hover:text-white"
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
