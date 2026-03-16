import { NavLink } from "react-router-dom";

function ClientExperienceSection() {
  return (
    <section className="bg-[#f3efe9] px-6 pb-4 pt-10 md:px-12 lg:px-20">
      <div className="grid gap-10 lg:grid-cols-[0.9fr,1.1fr] lg:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-black/50">
            Client experience
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-widest sm:text-4xl">
            A booking flow that feels premium.
          </h2>
          <p className="mt-6 text-lg text-black/70">
            Mobile-first screens, clear pricing, and auto confirmations give
            clients confidence to return again.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <NavLink
              to="/auth/owner/signup"
              className="border border-ink px-6 py-3 text-xs uppercase tracking-[0.35em] text-ink transition hover:bg-ink hover:text-cream"
            >
              Client signup
            </NavLink>
            <NavLink
              to="/auth/client/signin"
              className="border border-ink/30 px-6 py-3 text-xs uppercase tracking-[0.35em] text-ink "
            >
              Client login
            </NavLink>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ClientExperienceSection;
