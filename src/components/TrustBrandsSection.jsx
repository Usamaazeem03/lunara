function TrustBrandsSection({ trustLogos }) {
  return (
    <section className="border-y border-black/10 bg-[#f3efe9] py-6">
      <div className="flex flex-col gap-4 px-6 md:flex-row md:items-center md:justify-between md:px-12 lg:px-20">
        <p className="text-xs uppercase tracking-[0.35em] text-black/50">
          Trusted by growing studios
        </p>
        <div className="marquee">
          <div className="marquee-track">
            {trustLogos.concat(trustLogos).map((brand, index) => (
              <span
                key={`${brand}-${index}`}
                className="text-xs uppercase tracking-[0.35em] text-black/50"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default TrustBrandsSection;
