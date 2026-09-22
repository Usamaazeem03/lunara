import Icon from "../../Shared/ui/Icon";

const features = [
  { number: "01", icon: "calendar-week", title: "A schedule that makes sense.", description: "Review appointment requests, confirm visits, and keep track of completed and cancelled bookings.", detail: "Appointments, all together", tone: "sage" },
  { number: "02", icon: "razor-barber", title: "Your team. In sync.", description: "Manage your staff and services, set prices and durations, and keep salon opening hours up to date.", detail: "Staff · Services · Working hours", tone: "cream" },
  { number: "03", icon: "users", title: "Remember the little things.", description: "Keep client profiles and appointment history together, so the next visit starts with a familiar face.", detail: "A home for every client", tone: "peach" },
  { number: "04", icon: "sparkles", title: "A reason to come back.", description: "Give clients rewards they can view in their account and apply to an eligible booking.", detail: "Client rewards", tone: "cream" },
  { number: "05", icon: "tachometer-average", title: "See the bigger picture.", description: "Review revenue records, popular services, and staff performance. Export reports when you need them.", detail: "Reports & payment records", tone: "cream" },
  { number: "06", icon: "date-time", title: "Their next visit, sorted.", description: "Clients choose a salon, service, specialist, and time. Appointment updates and a booking pass stay close at hand.", detail: "A dedicated client space", tone: "sage" },
];

export default function FeaturesGridSection() {
  return (
    <section id="features" className="marketing-section marketing-container">
      <div className="marketing-section-heading">
        <div><p className="marketing-eyebrow">Built around your everyday</p><h2>Good days start<br />with a little <em>order.</em></h2></div>
        <p>Useful tools for the work behind the beauty. All connected, without the clutter.</p>
      </div>
      <div className="marketing-features">
        {features.map(feature => <article key={feature.number} className={`marketing-feature marketing-tone-${feature.tone}`}>
          <div className="marketing-feature-top"><Icon name={feature.icon} size={25} aria-hidden="true" /><span>{feature.number}</span></div>
          <h3>{feature.title}</h3><p>{feature.description}</p>
          <div className="marketing-feature-detail">{feature.detail}<span aria-hidden="true">↗</span></div>
        </article>)}
      </div>
    </section>
  );
}
