export default function ButtonSpinner() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="inline-block h-4 w-4 shrink-0 animate-spin motion-reduce:animate-none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" opacity="0.25" />
      <path d="M12 3a9 9 0 0 1 9 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
