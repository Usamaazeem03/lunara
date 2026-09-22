const steps = [
  ["Make it yours", "Create your salon account. Add services, prices, staff, and opening hours."],
  ["Open the door", "Share your salon page so clients can choose a service, specialist, and time."],
  ["Find your rhythm", "Manage requests, complete visits, and keep client history ready for next time."],
];
export default function WorkflowStepsSection() {
  return <section id="workflow" className="marketing-section marketing-container">
    <div className="marketing-section-heading"><div><p className="marketing-eyebrow">From setup to your next appointment</p><h2>A simpler way<br />to <em>get going.</em></h2></div><p>Start with your salon essentials. Bring the rest of your day into focus.</p></div>
    <ol className="marketing-workflow">{steps.map(([title, text], index) => <li key={title}><span className="marketing-step-number">0{index + 1}</span><h3>{title}</h3><p>{text}</p></li>)}</ol>
  </section>;
}
