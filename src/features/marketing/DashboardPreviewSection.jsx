import { useState } from "react";
import { Link } from "react-router-dom";
import ProductPreview from "./ProductPreview";

export default function DashboardPreviewSection() {
  const [role, setRole] = useState("owner");
  const owner = role === "owner";
  return (
    <section id="preview" className="marketing-preview-section">
      <div className="marketing-container marketing-preview-grid">
        <div>
          <p className="marketing-eyebrow">Take a look inside</p>
          <h2>Two perspectives.<br />One <em>connected</em> space.</h2>
          <div className="marketing-preview-switch" role="group" aria-label="Choose product preview">
            <button type="button" aria-pressed={owner} onClick={() => setRole("owner")}>For salon owners</button>
            <button type="button" aria-pressed={!owner} onClick={() => setRole("client")}>For clients</button>
          </div>
          <div className="marketing-preview-description" aria-live="polite">
            <h3>{owner ? "Your day, with room to breathe." : "Your salon visit, without the back-and-forth."}</h3>
            <p>{owner ? "See your appointments, manage your team, and get to know the people who keep coming back." : "Choose your service and time, follow your appointment status, and keep your booking pass ready for your visit."}</p>
          </div>
          <Link className="marketing-text-link" to={`/auth/${role}/signup`}>{owner ? "Create your salon account" : "Create your client account"} <span aria-hidden="true">↗</span></Link>
        </div>
        <ProductPreview role={role} />
      </div>
    </section>
  );
}
