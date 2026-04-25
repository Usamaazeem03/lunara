function HeroHighlightItem({ heroHighlights }) {
  return (
    <div className="mt-6 grid gap-3 text-sm text-black/70 sm:grid-cols-2">
      {heroHighlights.map((item) => (
        <div key={item} className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-black/70" />
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}

export default HeroHighlightItem;
