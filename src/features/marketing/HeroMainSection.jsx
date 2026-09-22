import { Link } from "react-router-dom";
import ProductPreview from "./ProductPreview";

export default function HeroMainSection() {
  return (
    <section className="marketing-hero marketing-container" aria-labelledby="hero-title">
      <div className="marketing-hero-copy">
        <p className="marketing-eyebrow"><span className="marketing-dot" /> A little calm for your salon</p>
        <h1 id="hero-title">Less admin.<br />More <em>beautiful</em><br />days.</h1>
        <p className="marketing-lead">Your bookings, your team, your clients. One thoughtful space to bring the whole salon together.</p>
        <div className="marketing-actions">
          <Link className="marketing-button" to="/auth/owner/signup">Set up your salon <span aria-hidden="true">↗</span></Link>
          <Link className="marketing-text-link" to="/auth/client/signup">Here to book? <span aria-hidden="true">→</span></Link>
        </div>
        <p className="marketing-hero-note">Made for salon owners. Loved by your daily routine.</p>
      </div>
      <div className="marketing-hero-stage">
        <div className="marketing-orbit" aria-hidden="true" />
        <div className="marketing-stage-caption"><span>LESS JUGGLING, MORE FLOW</span><span aria-hidden="true">✳</span></div>
        <ProductPreview role="owner" compact />
        <div className="marketing-stage-note"><span className="marketing-note-icon" aria-hidden="true">✓</span><div><strong>Everything has its place.</strong><span>From the first booking to the next visit.</span></div></div>
      </div>
    </section>
  );
}
