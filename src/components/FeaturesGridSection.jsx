function FeaturesGridSection({ features }) {
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
        {features.map((feature) => (
          <div
            key={feature.title}
            className="group border border-black/10 bg-white/70 p-6 transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white">
                {typeof feature.icon === "string" ? (
                  <img
                    src={feature.icon}
                    alt=""
                    className="h-6 w-6"
                    aria-hidden="true"
                  />
                ) : (
                  feature.icon
                )}
              </div>
              <h3 className="text-xl font-semibold tracking-wide">
                {feature.title}
              </h3>
            </div>
            <p className="mt-4 text-sm text-black/70">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturesGridSection;
