import { Link } from "react-router-dom";

export default function LandingFooter() {
  return <footer className="marketing-footer marketing-container"><div><Link to="/" className="marketing-logo">LUNARA<span aria-hidden="true">✦</span></Link><p>A little more flow. A little more you.</p></div><nav aria-label="Footer navigation"><a href="#features">Features</a><a href="#workflow">How it works</a><a href="#pricing">Payments · Coming soon</a><Link to="/auth/client/signin">Client login</Link><Link to="/auth/owner/signin">Owner login</Link></nav><div className="marketing-footer-bottom"><span>© {new Date().getFullYear()} Lunara</span><span>Thoughtfully made for salon days.</span></div></footer>;
}
