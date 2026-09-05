function ServiceFilter({ categories, selectedCategory, setActiveCategory }) {
  return (
    <div className="border-ink/20 border-2 bg-white/90 p-3 sm:p-4">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const isActive = category === selectedCategory;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-full border-2 px-4 py-2 text-xs tracking-widest uppercase transition ${
                isActive
                  ? "border-ink bg-cream text-ink"
                  : "border-ink/20 text-ink-muted hover:border-ink bg-white"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ServiceFilter;
