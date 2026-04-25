const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1);

function AuthRoleToggle({ value, options, onChange }) {
  return (
    <div className="border-ink/10 mt-4 flex rounded-full border bg-white/70 p-1 md:border-black/10 md:bg-black/5">
      {options.map((role) => {
        const isActive = value === role;
        return (
          <button
            key={role}
            type="button"
            onClick={() => onChange(role)}
            className={`flex-1 rounded-full py-2 text-xs transition-all duration-300 ${
              isActive
                ? "bg-ink text-white shadow-md md:bg-black md:text-white"
                : "text-ink/60 hover:text-ink md:text-black/60 md:hover:text-black"
            }`}
          >
            {capitalize(role)}
          </button>
        );
      })}
    </div>
  );
}

export default AuthRoleToggle;
