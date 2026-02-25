import CornerWord from "./CornerWord";

function AboutSection() {
  return (
    <section className="bg-[#f3efe9] flex justify-center items-center flex-col text-center px-6 py-16 sm:py-20">
      <div>
        <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#2d2620] leading-tight tracking-wider">
          WE DON'T JUST <CornerWord>STYLE</CornerWord> — WE CREATE
          <CornerWord>MOMENTS</CornerWord> OF BEAUTY, CONFIDENCE &
          <CornerWord>GLOW</CornerWord> FOR YOU.
        </h2>
        <p className="mt-6 text-lg text-[#5f544b] leading-relaxed">
          Lunara is a modern beauty studio dedicated to enhancing your natural
          glow. From expert hair styling to personalized skin and beauty
          treatments, we focus on creating experiences that make you feel
          confident, refreshed, and truly radiant.
        </p>{" "}
        <button className="mt-10 border border-[#2d2620] text-[#2d2620] px-8 py-3 text-sm tracking-widest uppercase hover:bg-[#2d2620] hover:text-white transition-colors">
          {" "}
          Read More
        </button>
      </div>
    </section>
  );
}
export default AboutSection;
