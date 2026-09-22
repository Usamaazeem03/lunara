import { useState } from "react";
import { Link } from "react-router-dom";

const links = [
  ["Features", "#features"], ["Inside Lunara", "#preview"],
  ["How it works", "#workflow"], ["Payments", "#pricing"],
];

export default function LandingHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="marketing-header">
      <nav className="marketing-nav marketing-container" aria-label="Main navigation">
        <Link to="/" className="marketing-logo" aria-label="Lunara home">LUNARA<span aria-hidden="true">✦</span></Link>
        <div className="marketing-desktop-nav">
          {links.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
        </div>
        <div className="marketing-nav-actions">
          <Link to="/auth/client/signin" className="marketing-login">Log in <span aria-hidden="true">↗</span></Link>
          <button className="marketing-menu-toggle" type="button" aria-expanded={open} aria-controls="marketing-mobile-menu" onClick={() => setOpen(!open)}>
            {open ? "Close" : "Menu"} <span aria-hidden="true">{open ? "−" : "+"}</span>
          </button>
        </div>
      </nav>
      {open && <nav id="marketing-mobile-menu" className="marketing-mobile-menu" aria-label="Mobile navigation">
        {links.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}<span aria-hidden="true">↗</span></a>)}
        <Link to="/auth/owner/signup">Create a salon account <span aria-hidden="true">↗</span></Link>
        <Link to="/auth/owner/signin">Owner login <span aria-hidden="true">↗</span></Link>
      </nav>}
    </header>
  );
}
