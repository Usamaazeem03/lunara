import skinGlow from "../assets/images/skin-glow.webp";
import newHair from "../assets/images/new-hair.webp";
import skinTip from "../assets/images/skin-tip.webp";

function NewsSection() {
  const articles = [
    {
      title: "SKIN Glow Up Skincare Trends This Season",
      dateLabel: "Feb 4, 2026",
      dateISO: "2026-02-04",
      img: skinGlow,
      alt: "Close-up of glowing skin",
    },
    {
      title: "New Hair Styles & Makeover Ideas",
      dateLabel: "Feb 2, 2026",
      dateISO: "2026-02-02",
      img: newHair,
      alt: "Modern hairstyle with soft waves",
    },
    {
      title: "Beauty Tips, Offers & Salon Updates",
      dateLabel: "Feb 1, 2026",
      dateISO: "2026-02-01",
      img: skinTip,
      alt: "Skincare products arranged on a vanity",
    },
  ];

  return (
    <section
      className="bg-[#f3efe9] py-16 px-6"
      aria-labelledby="newsletter-heading"
    >
      <div className="text-center">
        {/* Heading */}
        <h2
          id="newsletter-heading"
          className="text-3xl sm:text-4xl font-semibold tracking-widest text-[#2d2620]"
        >
          NEWSLETTER
        </h2>

        {/* Cards */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {articles.map((item, i) => (
            <li key={item.title} className="relative group overflow-hidden">
              <article className="h-full">
                {/* Image */}
                <img
                  src={item.img}
                  alt={item.alt}
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                  fetchPriority={i === 0 ? "high" : "low"}
                  className="w-full aspect-[2/3] object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition"></div>

                {/* Text */}
                <div className="absolute bottom-6 left-6 text-white text-left">
                  <h3 className="text-xl font-semibold tracking-wide">
                    {item.title}
                  </h3>
                  <time
                    dateTime={item.dateISO}
                    className="text-sm opacity-80"
                  >
                    {item.dateLabel}
                  </time>
                </div>
              </article>
            </li>
          ))}
        </ul>

        {/* View All */}
        <button
          type="button"
          className="mt-10 border border-[#2d2620] text-[#2d2620] px-8 py-3 text-sm tracking-widest uppercase hover:bg-[#2d2620] hover:text-white transition-colors"
        >
          See More
        </button>
      </div>
    </section>
  );
}

export default NewsSection;
