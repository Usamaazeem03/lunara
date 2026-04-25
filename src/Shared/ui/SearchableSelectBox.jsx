import { useMemo, useState } from "react";

import Icon from "./Icon";

function SearchableSelectBox({
  value,
  onValueChange,
  options,
  selectedValue,
  onOptionSelect,
  placeholder = "Select an option",
  searchable = true,
  required = false,
  noOptionsText = "No options found",
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = useMemo(
    () =>
      options.find((option) => String(option.value) === String(selectedValue)),
    [options, selectedValue],
  );

  const visibleOptions = useMemo(() => {
    if (!searchable) return options;

    const normalizedQuery = value.trim().toLowerCase();
    const selectedLabel = selectedOption?.label?.toLowerCase() ?? "";

    if (!normalizedQuery || normalizedQuery === selectedLabel) {
      return options;
    }

    return options.filter((option) =>
      option.label.toLowerCase().includes(normalizedQuery),
    );
  }, [options, searchable, selectedOption, value]);

  const handleSelect = (option) => {
    onOptionSelect?.(option);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        value={value}
        onChange={
          searchable
            ? (event) => {
                onValueChange?.(event.target.value);
                setIsOpen(true);
              }
            : undefined
        }
        onFocus={() => setIsOpen(true)}
        onClick={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 120)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && visibleOptions.length > 0) {
            event.preventDefault();
            handleSelect(visibleOptions[0]);
          }
        }}
        placeholder={placeholder}
        aria-label={placeholder}
        readOnly={!searchable}
        required={required}
        className="border-ink/20 text-ink focus:border-ink w-full border-2 bg-white px-3 py-2 pr-9 text-sm tracking-normal normal-case placeholder:text-[#5f544b]/70 focus:outline-none"
      />

      <span
        className={`pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[#5f544b] transition-transform duration-150 ${
          isOpen ? "rotate-180" : ""
        }`}
      >
        <Icon name="angle-down" size={16} className="text-[#5f544b]" />
      </span>

      {isOpen && (
        <div className="border-ink/20 absolute z-20 mt-1 max-h-44 w-full overflow-y-auto border-2 bg-white">
          {visibleOptions.length > 0 ? (
            visibleOptions.map((option) => {
              const isSelected =
                String(option.value) === String(selectedValue);

              return (
                <button
                  key={option.value}
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => handleSelect(option)}
                  className={`w-full border-b border-[#2d2620]/10 px-3 py-2 text-left text-xs tracking-widest uppercase transition last:border-b-0 ${
                    isSelected
                      ? "bg-[#f3efe9] text-[#2d2620]"
                      : "hover:bg-[#f7f2ec] text-[#5f544b]"
                  }`}
                >
                  {option.label}
                </button>
              );
            })
          ) : (
            <p className="px-3 py-2 text-xs tracking-widest text-[#5f544b] uppercase">
              {noOptionsText}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchableSelectBox;
