const MenuItem = ({ iconName, text, active, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`flex w-full items-center gap-4 rounded-full px-3 py-2 text-left text-sm tracking-widest uppercase transition ${
        active ? "bg-ink text-cream" : "text-ink hover:bg-ink/10"
      }`}
    >
      <span
        className={`border-ink/20 flex h-9 w-9 items-center justify-center rounded-full border ${
          active ? "bg-ink" : "bg-white/70"
        }`}
      >
        {iconName && (
          <Icon
            name={iconName}
            size={16}
            className={active ? "text-cream" : "text-ink/70"}
            aria-hidden="true"
          />
        )}
      </span>
      {text}
    </button>
  );
};
export default MenuItem;
