import skinCareIcon from "../assets/icons/skin-care.svg";
import bodyRelaxIcon from "../assets/icons/body-relax.svg";
import hairCareIcon from "../assets/icons/hair-care.svg";
import skin from "../assets/images/skin.webp";
import bodyRelax from "../assets/images/body.webp";
import hairCare from "../assets/images/hair.webp";
function ServiceSection() {
  const services = [
    {
      title: "SKIN CARE",
      count: "22 Service",
      img: skin,
      icon: skinCareIcon,
    },
    {
      title: "BODY RELAX",
      count: "18 Service",
      img: bodyRelax,
      icon: bodyRelaxIcon,
    },
    {
      title: "HAIR CARE",
      count: "12 Service",
      img: hairCare,
      icon: hairCareIcon,
    },
  ];

  return (
    <section
      className="bg-[#f3efe9] py-16 px-6"
      aria-labelledby="services-heading"
    >
      <div className=" text-center">
        {/* Heading */}
        <h2
          id="services-heading"
          className="text-3xl sm:text-4xl font-semibold tracking-widest text-[#2d2620]"
        >
          OUR SERVICE
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {services.map((item, i) => (
            <div
              key={i}
              className="relative group overflow-hidden  cursor-pointer"
            >
              {/* Image */}
              <img
                src={item.img}
                alt={item.title}
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
                fetchPriority={i === 0 ? "high" : "low"}
                className="w-full aspect-[2/3] object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition"></div>

              {/* Text */}
              <div className="absolute bottom-6 left-6 text-white text-left ">
                <h3 className="text-xl font-semibold tracking-wide">
                  {item.title}
                </h3>
                <p className="text-sm opacity-80 ">{item.count}</p>
              </div>

              {/* X Icon */}
              <div className="absolute bottom-6 right-6 text-white text-xl opacity-80">
                {item.icon ? (
                  <img
                    src={item.icon}
                    alt={`${item.title} icon`}
                    className="w-8 h-8 "
                  />
                ) : null}
              </div>
            </div>
          ))}
        </div>

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

export default ServiceSection;
