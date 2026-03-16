function TestimonialsSection({ testimonials }) {
  return (
    <section className="bg-[#f3efe9] px-6 py-16 md:px-12 lg:px-20">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-black/50">
          Loved by studios
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-widest sm:text-4xl">
          Teams that feel in control again.
        </h2>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.name}
            className="border border-black/10 bg-white/70 p-6"
          >
            <p className="text-sm text-black/70">"{testimonial.quote}"</p>
            <p className="mt-4 text-sm font-semibold tracking-wide">
              {testimonial.name}
            </p>
            <p className="text-xs uppercase tracking-[0.25em] text-black/50">
              {testimonial.role}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TestimonialsSection;
