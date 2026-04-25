import Button from "../../Shared/Button";

function PricingSection() {
  const plans = [
    {
      title: "Starter",
      price: "$29",
      note: "Per location / month",
      features: ["Single calendar", "Client reminders", "Basic reports"],
    },
    {
      title: "Growth",
      price: "$59",
      note: "Most popular",
      features: ["Multiple staff", "Payments", "Marketing tools"],
    },
    {
      title: "Studio",
      price: "$99",
      note: "Multi-location",
      features: ["Advanced analytics", "Custom branding", "Priority"],
    },
  ];

  return (
    <section id="pricing" className="bg-[#f3efe9] px-6 py-16 md:px-12 lg:px-20">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-black/50">
          Simple pricing
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-widest sm:text-4xl">
          Plans that scale with your studio.
        </h2>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.title}
            className="flex h-full flex-col border border-black/10 bg-white/80 p-6"
          >
            <h3 className="text-xl font-semibold tracking-widest">
              {plan.title}
            </h3>
            <p className="mt-3 text-4xl font-semibold">{plan.price}</p>
            <p className="text-xs uppercase tracking-[0.25em] text-black/50">
              {plan.note}
            </p>
            <div className="mt-6 space-y-2 text-sm text-black/70">
              {plan.features.map((item) => (
                <div key={item}>{item}</div>
              ))}
            </div>
            <Button
              type="button"
              variant="custom"
              unstyled
              className="mt-6 border border-black/60 px-6 py-3 text-xs uppercase tracking-[0.35em] text-black transition hover:bg-black hover:text-[#f3efe9]"
            >
              Choose plan
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default PricingSection;
