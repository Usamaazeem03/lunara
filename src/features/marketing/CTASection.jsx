import { NavLink } from "react-router-dom";
import Button from "../../Shared/Button";

function CTASection() {
  const ctaButtons = [
    {
      label: "Start free trial",
      to: "/auth/owner/signup",
      className:
        "bg-[#f3efe9] px-6 py-3 text-xs uppercase tracking-[0.35em] text-[#2d2620] transition hover:bg-white",
    },
    {
      label: "Owner Login",
      to: "/auth/owner/signin",
      className:
        "border border-[#f3efe9]/60 px-6 py-3 text-xs uppercase tracking-[0.35em] text-[#f3efe9] transition hover:bg-[#f3efe9] hover:text-[#2d2620]",
    },
  ];
  return (
    <section
      id="demo"
      className="bg-[#2d2620] px-6 py-16 text-[#f3efe9] md:px-12 lg:px-20"
    >
      <div className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
        <div>
          <h2 className="text-3xl font-semibold tracking-widest sm:text-4xl">
            Ready to book smarter?
          </h2>
          <p className="mt-4 text-lg text-[#f3efe9]/80">
            Set up your studio in minutes. Import clients, open your calendar,
            and start collecting deposits today.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          {/* <NavLink
            to="/auth/owner/signup"
            className="bg-[#f3efe9] px-6 py-3 text-xs uppercase tracking-[0.35em] text-[#2d2620] transition hover:bg-white"
          >
            Start free trial
          </NavLink>
          <NavLink
            to="/auth/owner/signin"
            className="border border-[#f3efe9]/60 px-6 py-3 text-xs uppercase tracking-[0.35em] text-[#f3efe9] transition hover:bg-[#f3efe9] hover:text-[#2d2620]"
          >
            Owner login
          </NavLink> */}
          {ctaButtons.map((btn) => (
            <Button
              key={btn.label}
              to={btn.to}
              variant="custom"
              className={btn.className}
            >
              {btn.label}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CTASection;
