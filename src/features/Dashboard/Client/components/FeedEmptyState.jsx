const FeedEmptyState = ({ message }) => {
  return (
    <div className="border-2 border-dashed border-[#2d2620]/20 bg-[#f7f2ec]/70 px-3 py-4 text-center text-xs text-[#5f544b]">
      {message}
    </div>
  );
};

export default FeedEmptyState;
