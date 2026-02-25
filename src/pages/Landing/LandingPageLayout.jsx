import AboutSection from "../../components/AboutSection";
import Footer from "../../components/Footer";
import HeroSection from "../../components/HeroSection";
import NewsSection from "../../components/NewsSection";
import ReviewSection from "../../components/ReviewSection";
import ServiceSection from "../../components/ServiceSection";
import StorySection from "../../components/StorySection";
import InitialLoader from "../../components/InitialLoader";

function LandingPageLayout() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ServiceSection />
      <ReviewSection />
      <StorySection />
      <NewsSection />
      <Footer />
    </>
  );
}

export default LandingPageLayout;
