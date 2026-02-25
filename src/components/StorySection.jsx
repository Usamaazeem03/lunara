import styles from "./StorySection.module.css";
function StorySection() {
  return (
    <section
      className="
        relative min-h-screen w-full overflow-hidden
        flex items-center
      "
    >
      {/* BACKGROUND IMAGE WITH SOFT ZOOM */}
      <div
        className={`absolute inset-0 ${styles.storyBg} pointer-events-none`}
        aria-hidden="true"
      ></div>

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none"></div>

      {/* CONTENT WRAPPER */}
      <div
        className="
        relative z-10
        w-full
        px-6 md:px-12 lg:px-20
        flex justify-end
      "
      >
        <div
          className="
          text-white
          max-w-xl
        "
        >
          {/* HEADING */}
          <h2
            className="
            text-3xl sm:text-4xl lg:text-7xl
            font-semibold
            tracking-widest
            leading-tight
          "
          >
            THE STORY
            <br />
            OF LUNARA
          </h2>

          {/* PARAGRAPH */}
          <p className="mt-6 text-2xl leading-relaxed text-white/90">
            Lunara began with a simple idea — to create a space where beauty
            meets confidence. A modern salon built on care, creativity, and
            detail… where every glow has a story.
          </p>

          {/* OPENING HOURS */}
          <div className="mt-10">
            <h3 className="text-2xl tracking-widest font-medium">
              OPENING HOURS
            </h3>

            <div
              className="
              mt-4
              grid grid-cols-2 sm:grid-cols-3
              gap-6 text-xl
            "
            >
              <div>
                <p className="font-semibold">Weekdays</p>
                <p className="text-white/80">10 AM – 8 PM</p>
              </div>

              <div>
                <p className="font-semibold">Weekend</p>
                <p className="text-white/80">11 AM – 9 PM</p>
              </div>

              <div>
                <p className="font-semibold">Sunday</p>
                <p className="text-white/80">By Appointment</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StorySection;
