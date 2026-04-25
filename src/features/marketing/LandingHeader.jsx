import { NavLink } from "react-router-dom";
import Button from "../../Shared/Button";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Workflow", href: "#workflow" },
  { label: "Preview", href: "#preview" },
  { label: "Pricing", href: "#pricing" },
];

const authLinks = [
  {
    label: "Login",
    to: "/auth/owner/signin",
    className:
      "text-xs uppercase tracking-[0.3em] text-black/70 hover:text-black",
  },
  {
    label: "Start Free",
    to: "/auth/owner/signup",
    className:
      "border border-ink px-4 py-2 text-xs uppercase tracking-[0.3em] text-ink transition hover:bg-ink hover:text-cream",
  },
];

function LandingHeader() {
  return (
    <nav className="relative z-20 flex items-center justify-between px-6 py-6 md:px-12 lg:px-20">
      <div className="text-2xl font-bold tracking-widest">LUNARA</div>
      <div className="hidden items-center gap-8 text-xs uppercase tracking-[0.3em] md:flex">
        {navLinks.map((link) => (
          <Button
            key={link.label}
            href={link.href}
            variant="custom"
            className="text-black/70 hover:text-black"
          >
            {link.label}
          </Button>
        ))}
      </div>
      <div className="flex items-center gap-3">
        {authLinks.map((btn) => (
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
    </nav>
  );
}
export default LandingHeader;
