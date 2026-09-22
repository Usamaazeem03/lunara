import giftIcon from "../../../../Shared/assets/icons/gift-box-benefits.svg";

const RewardRow = ({ reward }) => {
  return (
    <div className="grid gap-3 px-4 py-2.5 text-sm transition hover:bg-[#f3efe9]/60 sm:grid-cols-[1.6fr_0.6fr_0.6fr] sm:items-center">
      <div className="space-y-2">
        <p className="text-xs tracking-widest text-[#5f544b] uppercase sm:hidden">
          Reward
        </p>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[#2d2620]/20 bg-[#f3efe9]">
            <img src={giftIcon} alt="" className="h-4 w-4 opacity-70" />
          </div>
          <div>
            <p className="text-sm font-semibold">{reward.title}</p>
            <p className="text-xs text-[#5f544b]">{reward.description}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 sm:justify-start">
        <p className="text-xs tracking-widest text-[#5f544b] uppercase sm:hidden">
          Points
        </p>
        <span className="text-xs tracking-widest text-[#5f544b] uppercase">
          {reward.points} pts
        </span>
      </div>

      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <p className="text-xs tracking-widest text-[#5f544b] uppercase sm:hidden">
          Action
        </p>
        <button className="border-2 border-[#2d2620] px-3 py-1 text-[0.65rem] tracking-widest uppercase transition hover:bg-[#2d2620] hover:text-[#f3efe9]">
          Redeem
        </button>
      </div>
    </div>
  );
};

export default RewardRow;
