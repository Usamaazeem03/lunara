const appointments = [
  { time: "10:00", name: "Maya R.", service: "Cut & finish", initials: "MR", state: "Confirmed" },
  { time: "11:30", name: "Noor A.", service: "Skin treatment", initials: "NA", state: "Pending" },
  { time: "14:00", name: "Alex T.", service: "Colour refresh", initials: "AT", state: "Confirmed" },
];

export default function ProductPreview({ role = "owner", compact = false }) {
  const owner = role === "owner";
  return (
    <div className={`marketing-product ${compact ? "marketing-product-compact" : ""}`}>
      <div className="marketing-product-top"><span className="marketing-product-brand">LUNARA</span><span className="marketing-sample">Sample preview</span></div>
      <div className="marketing-product-body">
        <div className="marketing-product-heading"><div><p>{owner ? "YOUR SALON, AT A GLANCE" : "A LITTLE TIME FOR YOU"}</p><h3>{owner ? "Hello, beautiful day." : "Your next moment."}</h3></div><span className="marketing-avatar">{owner ? "L" : "M"}</span></div>
        {owner ? <>
          <div className="marketing-preview-stats"><div><span>Appointments</span><strong>08</strong></div><div><span>Confirmed</span><strong>06</strong></div><div><span>Pending</span><strong>02</strong></div></div>
          <div className="marketing-schedule-label"><strong>On the schedule</strong><span>Example day</span></div>
          <div className="marketing-appointments">{appointments.map(item => <div className="marketing-appointment" key={item.time}>
            <time>{item.time}</time><span className="marketing-avatar">{item.initials}</span>
            <div><strong>{item.name}</strong><span>{item.service}</span></div>
            <span className={`marketing-status ${item.state === "Pending" ? "marketing-status-pending" : ""}`}>{item.state}</span>
          </div>)}</div>
          <div className="marketing-preview-footer"><span className="marketing-dot" /> A clearer view of what comes next.</div>
        </> : <>
          <div className="marketing-client-pass"><div className="marketing-pass-top"><span>YOUR BOOKING PASS</span><span className="marketing-status">Confirmed</span></div><h4>Cut & finish</h4><p>Lunara Studio · with Alex</p><div className="marketing-pass-date"><div><span>DATE</span><strong>24 September</strong></div><div><span>TIME</span><strong>10:00 AM</strong></div></div><div className="marketing-pass-bottom">Appointment details, always with you.<span aria-hidden="true">✦</span></div></div>
          <div className="marketing-reward-preview"><span aria-hidden="true">✳</span><div><strong>A little treat for next time</strong><p>Your salon rewards, in one place.</p></div></div>
        </>}
      </div>
    </div>
  );
}
