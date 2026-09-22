const EarnRow = ({ item }) => {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#2d2620]/20 bg-[#f3efe9]">
        <img src={item.icon} alt="" className="h-4 w-4 opacity-70" />
      </div>
      <div>
        <p className="text-sm font-semibold">{item.title}</p>
        <p className="text-xs text-[#5f544b]">{item.description}</p>
      </div>
    </div>
  );
};

export default EarnRow;
