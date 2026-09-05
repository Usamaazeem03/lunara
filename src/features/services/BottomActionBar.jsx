function BottomActionBar({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const firstVisiblePage = Math.floor((currentPage - 1) / 10) * 10 + 1;
  const lastVisiblePage = Math.min(firstVisiblePage + 9, totalPages);

  return (
    <div className="border-ink/20 flex flex-wrap items-center justify-center gap-2 border-2 bg-white/90 p-3 sm:p-4">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="border-ink/20 hover:border-ink rounded-full border-2 bg-white px-4 py-2 text-xs tracking-widest uppercase transition disabled:cursor-not-allowed disabled:opacity-40"
      >
        Previous
      </button>

      {Array.from(
        { length: lastVisiblePage - firstVisiblePage + 1 },
        (_, index) => {
          const page = firstVisiblePage + index;
          const isActive = page === currentPage;

          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              disabled={isActive}
              aria-current={isActive ? "page" : undefined}
              className={`h-9 w-9 rounded-full border-2 text-xs tracking-widest transition disabled:cursor-default ${
                isActive
                  ? "border-ink bg-cream text-ink"
                  : "border-ink/20 text-ink-muted hover:border-ink bg-white"
              }`}
            >
              {page}
            </button>
          );
        },
      )}

      <span
        aria-label={`Page ${currentPage} of ${totalPages}`}
        className="text-ink-muted px-2 text-xs tracking-widest"
      >
        {currentPage} / {totalPages}
      </span>

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="border-ink/20 hover:border-ink rounded-full border-2 bg-white px-4 py-2 text-xs tracking-widest uppercase transition disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}

export default BottomActionBar;
