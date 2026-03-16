import { NavLink } from "react-router-dom";

function LandingHeader() {
  return (
    <nav className="relative z-20 flex items-center justify-between px-6 py-6 md:px-12 lg:px-20">
      <div className="text-2xl font-bold tracking-widest">LUNARA</div>
      <div className="hidden items-center gap-8 text-xs uppercase tracking-[0.3em] md:flex">
        <a href="#features" className="text-black/70 hover:text-black">
          Features
        </a>
        <a href="#workflow" className="text-black/70 hover:text-black">
          Workflow
        </a>
        <a href="#preview" className="text-black/70 hover:text-black">
          Preview
        </a>
        <a href="#pricing" className="text-black/70 hover:text-black">
          Pricing
        </a>
      </div>
      <div className="flex items-center gap-3">
        <NavLink
          to="/auth/owner/signin"
          className="text-xs uppercase tracking-[0.3em] text-black/70 hover:text-black"
        >
          Login
        </NavLink>
        <NavLink
          to="/auth/owner/signup"
          className="border border-ink px-4 py-2 text-xs uppercase tracking-[0.3em] text-ink transition hover:bg-ink hover:text-cream"
        >
          Start Free
        </NavLink>
      </div>
    </nav>
  );
}

export default LandingHeader;
