const FeedSectionHeader = ({ label, count }) => {
  return (
    <div className="flex items-center justify-between border-2 border-[#2d2620]/10 bg-white/70 px-3 py-2 text-[0.65rem] tracking-widest text-[#5f544b] uppercase">
      <span>{label}</span>
      <span className="rounded-full border border-[#2d2620]/30 bg-[#f3efe9] px-2 py-0.5 text-[#2d2620]">
        {count}
      </span>
    </div>
  );
};

export default FeedSectionHeader;
