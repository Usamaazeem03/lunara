import { useState, useEffect } from "react";
import Button from "../Shared/Button";

function GoToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    isVisible && (
      <Button
        onClick={scrollToTop}
        unstyled
        variant="custom"
        className="fixed bottom-6 right-6 z-40 border border-ink px-6 py-3 text-xs uppercase tracking-[0.35em] text-ink transition hover:bg-ink hover:text-cream bg-cream shadow-lg rounded-full"
        aria-label="Go to top"
      >
        ↑ Top
      </Button>
    )
  );
}

export default GoToTopButton;
