import { useState } from "react";
import CornerWord from "./CornerWord";

function ReviewSection() {
  const reviews = [
    {
      rating: 4.9,
      text: "Absolutely love my new look! The hairstylist did an amazing job and suggested a style that suits my face perfectly. The salon atmosphere was calm and professional.",
      name: "Olivia",
      date: "February 21, 2026",
      img1: "/src/assets/images/hair-before.webp",
      img2: "/src/assets/images/hair-after.webp",
    },
    {
      rating: 5.0,
      text: "My skin looks brighter and feels so much smoother after the facial. The esthetician explained each step and tailored the treatment to my skin type. The results were noticeable right away and the studio felt clean and relaxing.",
      name: "Olivia",
      date: "December 11, 2026",
      img1: "/src/assets/images/skin-before.png",
      img2: "/src/assets/images/skin-after.png",
    },
    {
      rating: 4.8,
      text: "The massage was the best I have had in years. The therapist focused on my shoulders and the room felt peaceful. I left feeling lighter and energized.",
      name: "Mia",
      date: "January 30, 2026",
      img1: "/src/assets/images/body.webp",
      img2: "/src/assets/images/salon-interior.png",
    },
  ];
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % reviews.length);
  };

  return (
    <section className="bg-[#f3efe9] px-6 py-20">
      <div className="text-center">
        {/* Heading */}
        <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-wider text-[#2d2620] sm:text-4xl lg:text-5xl">
          REAL RESULT <CornerWord>4.9 average rating</CornerWord>
          NO FILTER NO RETOUCHING JUST REAL PEOPLE
        </h2>

        {/* Slider (Right to Left) */}
        <div className="mx-auto mt-16 w-full max-w-5xl">
          <div className="overflow-hidden  border border-[#2d2620] bg-transparent">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {reviews.map((review, index) => (
                <div key={index} className="w-full shrink-0">
                  <div className="p-8 text-left md:p-10">
                    {/* Stars */}
                    <div className="mb-4 flex items-center gap-2">
                      <span className="text-xl">
                        &#9733;&#9733;&#9733;&#9733;&#9733;
                      </span>
                      <span className="font-semibold">{review.rating}</span>
                    </div>

                    {/* Review Text */}
                    <p className="leading-relaxed text-[#5f544b]">
                      {review.text}
                    </p>

                    {/* Before After Images */}
                    <div className="mt-6 flex gap-4">
                      <img
                        src={review.img1}
                        alt="before"
                        className="aspect-[3/4] w-20 object-cover"
                      />
                      <img
                        src={review.img2}
                        alt="after"
                        className="aspect-[3/4] w-20 object-cover"
                      />
                    </div>

                    {/* User */}
                    <div className="mt-4">
                      <h4 className="font-semibold text-[#2d2620]">
                        {review.name}
                      </h4>
                      <p className="text-sm text-[#5f544b]">
                        haircut review â€” {review.date}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dots + Next */}
        <div className="mx-auto mt-10 flex w-full max-w-5xl items-center justify-between">
          <div className="flex gap-3">
            {reviews.map((_, i) => (
              <span
                key={i}
                className={`h-3 w-3 ${
                  i === activeIndex ? "bg-black" : "bg-gray-300 rounded-full"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#2d2620] text-[#2d2620] transition-colors hover:bg-[#2d2620] hover:text-[#f3efe9]"
            aria-label="Next review"
            onClick={handleNext}
          >
            &#8594;
          </button>
        </div>
      </div>
    </section>
  );
}

export default ReviewSection;
