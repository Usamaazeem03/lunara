import { useEffect, useState } from "react";
import CornerWord from "./CornerWord";
import Button from "../Dashboard/Shared/Button";

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
      rating: 5.0,
      text: "My skin looks brighter and feels so much smoother after the facial. The esthetician explained each step and tailored the treatment to my skin type. The results were noticeable right away and the studio felt clean and relaxing.",
      name: "Olivia",
      date: "December 11, 2026",
      img1: "/src/assets/images/skin-before.png",
      img2: "/src/assets/images/skin-after.png",
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
      rating: 5.0,
      text: "My skin looks brighter and feels so much smoother after the facial. The esthetician explained each step and tailored the treatment to my skin type. The results were noticeable right away and the studio felt clean and relaxing.",
      name: "Olivia",
      date: "December 11, 2026",
      img1: "/src/assets/images/skin-before.png",
      img2: "/src/assets/images/skin-after.png",
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
  const slides = [];
  for (let i = 0; i < reviews.length; i += 2) {
    slides.push(reviews.slice(i, i + 2));
  }
  const slidesWithLoop = slides.length > 0 ? [...slides, slides[0]] : [];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  const handleNext = () => {
    if (slides.length === 0) {
      return;
    }
    setIsAnimating(true);
    setActiveIndex((prev) => (prev < slides.length ? prev + 1 : prev));
  };

  const handleTransitionEnd = () => {
    if (activeIndex === slides.length) {
      setIsAnimating(false);
      setActiveIndex(0);
    }
  };

  useEffect(() => {
    if (!isAnimating && activeIndex === 0) {
      const id = requestAnimationFrame(() => setIsAnimating(true));
      return () => cancelAnimationFrame(id);
    }
    return undefined;
  }, [activeIndex, isAnimating]);

  const activeDotIndex =
    slides.length > 0 && activeIndex >= slides.length ? 0 : activeIndex;

  return (
    <section className="bg-[#f3efe9] px-6 py-20">
      <div className="text-center">
        {/* Heading */}
        <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-wider text-[#2d2620] sm:text-4xl lg:text-5xl">
          REAL RESULT <CornerWord>4.9 average rating</CornerWord>
          NO FILTER NO RETOUCHING JUST REAL PEOPLE
        </h2>

        {/* Slider (Right to Left) */}
        <div className="mx-auto mt-16 w-full ">
          <div className="overflow-hidden bg-transparent">
            <div
              className={`flex ${
                isAnimating
                  ? "transition-transform duration-500 ease-out"
                  : "transition-none"
              }`}
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              onTransitionEnd={handleTransitionEnd}
            >
              {slidesWithLoop.map((slide, slideIndex) => (
                <div key={slideIndex} className="w-full shrink-0">
                  <div className="grid gap-6 md:grid-cols-2">
                    {slide.map((review, index) => (
                      <div
                        key={`${slideIndex}-${index}`}
                        className="border border-[#2d2620] p-8 text-left md:p-10"
                      >
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
                            className="`aspect-[3/4]` w-20 object-cover"
                          />
                          <img
                            src={review.img2}
                            alt="after"
                            className="`aspect-[3/4]` w-20 object-cover"
                          />
                        </div>

                        {/* User */}
                        <div className="mt-4">
                          <h4 className="font-semibold text-[#2d2620]">
                            {review.name}
                          </h4>
                          <p className="text-sm text-[#5f544b]">
                            haircut review -- {review.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dots + Next */}
        <div className="mx-auto mt-10 flex w-full items-center justify-between">
          <div className="flex gap-3">
            {slides.map((_, i) => (
              <span
                key={i}
                className={`h-3 w-3 ${
                  i === activeDotIndex
                    ? "bg-black"
                    : "bg-gray-300 rounded-full"
                }`}
              />
            ))}
          </div>
          <Button
            type="button"
            variant="custom"
            unstyled
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#2d2620] text-[#2d2620] transition-colors hover:bg-[#2d2620] hover:text-[#f3efe9]"
            aria-label="Next review"
            onClick={handleNext}
          >
            &#8594;
          </Button>
        </div>
      </div>
    </section>
  );
}

export default ReviewSection;
