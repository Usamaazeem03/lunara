import Icon from "../../Shared/ui/Icon";

const defaultFeatures = [
  {
    title: "Smart Scheduling",
    description:
      "Prevent double bookings, balance staff time, and keep calendars clean.",
    icon: <Icon name="calendar" />,
  },
  {
    title: "Automated Reminders",
    description: "Text and email nudges that reduce last-minute cancellations.",
    icon: <Icon name="bell" />,
  },
  {
    title: "Payments and Deposits",
    description: "Collect deposits or full payment before the visit.",
    icon: <Icon name="credit-card" />,
  },
  {
    title: "Team Availability",
    description: "Control shifts, breaks, and services per specialist.",
    icon: <Icon name="clock" />,
  },
  {
    title: "Client Profiles",
    description: "Track preferences, visit history, and notes in one view.",
    icon: <Icon name="home" />,
  },
  {
    title: "Packages and Gifts",
    description: "Offer bundles, memberships, and gift cards with ease.",
    icon: <Icon name="gift-box-benefits" />,
  },
];

function FeatureCard({ title, description, icon }) {
  return (
    <div className="group border border-black/10 bg-white/70 p-6 transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center gap-4">
        {icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white">
            {typeof icon === "string" ? (
              <img src={icon} alt="" className="h-6 w-6" aria-hidden="true" />
            ) : (
              icon
            )}
          </div>
        )}
        {title && <h3 className="text-xl font-semibold tracking-wide">{title}</h3>}
      </div>
      {description && <p className="mt-4 text-sm text-black/70">{description}</p>}
    </div>
  );
}

function FeaturesGridSection({ features = defaultFeatures }) {
  return (
    <section
      id="features"
      className="bg-[#f3efe9] px-6 py-16 md:px-12 lg:px-20"
    >
      <div className="text-center">
        <h2 className="text-3xl font-semibold tracking-widest sm:text-4xl">
          FEATURES BUILT FOR BOOKING
        </h2>
        <p className="mt-4 text-lg text-black/70">
          Everything you need to run schedules, protect revenue, and grow your
          client base.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => {
          const title = feature.title || feature.label || "";
          const description = feature.description || feature.subtitle || "";
          const key = feature.id || title || index;

          return (
            <FeatureCard
              key={key}
              title={title}
              description={description}
              icon={feature.icon}
            />
          );
        })}
      </div>
    </section>
  );
}

export default FeaturesGridSection;
