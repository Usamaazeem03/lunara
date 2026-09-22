import { Link } from "react-router-dom";

export default function ClientExperienceSection() {
  return <section className="marketing-container marketing-client-section">
    <div className="marketing-client-art" aria-hidden="true"><span className="marketing-art-star">✳</span><span className="marketing-art-word">your time.<br /><em>your glow.</em></span><span className="marketing-art-foot">A MOMENT THAT'S JUST FOR YOU</span></div>
    <div className="marketing-client-copy"><p className="marketing-eyebrow">For the person in the chair</p><h2>Your next good<br />hair day <em>starts here.</em></h2><p>Find your salon, choose your service, and make time for yourself. Keep your appointments, visit updates, and rewards together in your own client space.</p><Link to="/auth/client/signup" className="marketing-button">Create a client account <span aria-hidden="true">↗</span></Link><Link to="/auth/client/signin" className="marketing-text-link">Already with us? Log in <span aria-hidden="true">→</span></Link></div>
  </section>;
}
