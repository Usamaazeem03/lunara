export default function PricingSection() {
  return <section id="pricing" className="marketing-section marketing-container">
    <div className="marketing-payments"><div className="marketing-payment-symbol" aria-hidden="true">↗</div><div><p className="marketing-eyebrow">On the horizon</p><h2>Online payments.</h2><p>Book your appointment with Lunara and pay at the salon. Online payments and paid plans are coming soon.</p></div><span className="marketing-coming-soon">Coming soon</span></div>
    <div className="marketing-faq"><div><p className="marketing-eyebrow">A few helpful details</p><h2>Good to <em>know.</em></h2></div><div>
      <details><summary>Is Lunara for owners or clients?</summary><p>Both. Owners manage salon services, staff, appointments, clients, and reports. Clients have their own space to book visits, view appointment updates, and access salon rewards.</p></details>
      <details><summary>Can clients pay online?</summary><p>Not yet. Payments are made at the salon. Online payments are coming soon; there is no online checkout or paid-plan purchase available here.</p></details>
      <details><summary>How do clients know their booking status?</summary><p>Clients can view pending, confirmed, completed, or cancelled appointments in their account and open their booking pass for visit details.</p></details>
    </div></div>
  </section>;
}
