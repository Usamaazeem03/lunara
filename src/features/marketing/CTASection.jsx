import { Link } from "react-router-dom";

export default function CTASection() {
  return <section id="demo" className="marketing-cta"><div className="marketing-container"><span className="marketing-cta-star" aria-hidden="true">✳</span><p className="marketing-eyebrow">Make space for what you love</p><h2>A beautiful business.<br />A little less <em>busywork.</em></h2><p>Bring your salon day together with Lunara.</p><div className="marketing-actions"><Link className="marketing-button marketing-button-light" to="/auth/owner/signup">Set up your salon <span aria-hidden="true">↗</span></Link><Link className="marketing-text-link" to="/auth/owner/signin">Owner login <span aria-hidden="true">→</span></Link></div></div></section>;
}
