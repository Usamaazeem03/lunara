function CornerWord({ children }) {
  return (
    <span className="relative inline-block px-2 mx-1">
      {/* Top-left corner */}
      <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#2d2620]" />
      {/* Top-right corner */}
      <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#2d2620]" />
      {/* Bottom-left corner */}
      <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#2d2620]" />
      {/* Bottom-right corner */}
      <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#2d2620]" />
      {children}
    </span>
  );
}

export default CornerWord;
