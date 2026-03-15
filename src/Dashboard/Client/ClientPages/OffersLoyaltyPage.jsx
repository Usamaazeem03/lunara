import giftIcon from "../../../assets/icons/gift-box-benefits.svg";
import calendarIcon from "../../../assets/icons/calendar.svg";
import hairCareIcon from "../../../assets/icons/hair-care.svg";
import skinCareIcon from "../../../assets/icons/skin-care.svg";
import bodyRelaxIcon from "../../../assets/icons/body-relax.svg";
import DashboardHeader from "../../Shared/DashboardHeader";
import InfoCard from "../InfoCard";

const OffersLoyaltyPage = () => {
  const loyaltyPoints = 550;
  const nextRewardPoints = 600;
  const pointsToGo = Math.max(0, nextRewardPoints - loyaltyPoints);
  const progress = Math.min(
    100,
    Math.round((loyaltyPoints / nextRewardPoints) * 100),
  );

  const rewards = [
    {
      title: "10% Off Next Visit",
      points: 100,
      description: "Save on any appointment.",
    },
    {
      title: "10% Off Next Visit",
      points: 100,
      description: "Save on any appointment.",
    },
    {
      title: "10% Off Next Visit",
      points: 100,
      description: "Save on any appointment.",
    },
    {
      title: "Free Haircut",
      points: 250,
      description: "Redeem for any haircut service.",
    },
    {
      title: "Free Spa Treatment",
      points: 600,
      description: "Unlock your next premium spa session.",
    },
    {
      title: "Free Spa Treatment",
      points: 600,
      description: "Unlock your next premium spa session.",
    },
    {
      title: "Free Spa Treatment",
      points: 600,
      description: "Unlock your next premium spa session.",
    },
    {
      title: "Free Spa Treatment",
      points: 600,
      description: "Unlock your next premium spa session.",
    },
  ];

  const earnWays = [
    {
      title: "Book Services",
      description: "Earn 10 points per GBP 1 spent.",
      icon: calendarIcon,
    },
    {
      title: "Leave a Review",
      description: "Get 50 points for a verified review.",
      icon: giftIcon,
    },
    {
      title: "Refer a Friend",
      description: "Both of you earn 150 points.",
      icon: bodyRelaxIcon,
    },
  ];

  return (
    <section className="flex h-full flex-col">
      {/* <header className="flex flex-col gap-2">
        <span className="w-fit rounded-full bg-[#e9e1d8] px-4 py-1 text-xs uppercase tracking-widest text-[#5f544b]">
          Offers & Loyalty
        </span>
        <h1 className="text-2xl font-semibold tracking-wide sm:text-3xl">
          Offers & Loyalty
        </h1>
        <p className="max-w-2xl text-sm text-[#5f544b]">
          Redeem your points and discover exclusive member-only rewards.
        </p>
      </header> */}
      <DashboardHeader
        eyebrow={"Offers & Loyalty"}
        title={"Offers & Loyalty"}
        description={`Redeem your points and discover exclusive member-only rewards.`}
      />

      <InfoCard
        layout="loyalty"
        label="Loyalty Points"
        title={loyaltyPoints}
        meta="Progress to next reward"
        rightContent={
          <img src={giftIcon} alt="" className="h-6 w-6 opacity-70" />
        }
        progress={progress}
        progressLeft="Next reward: Free Spa Treatment"
        progressRight={`${pointsToGo} points to go`}
        padding="p-3 sm:p-4"
      />

      <div className="mt-3 grid min-h-0 flex-1 gap-3 lg:grid-cols-[1.6fr_1fr]">
        <div className="relative flex flex-col border-2 border-[#2d2620]/20 bg-white/90 p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">Rewards Catalog</h2>
              <p className="text-sm text-[#5f544b]">
                Redeem your points for amazing rewards.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full border-2 border-[#2d2620]/30 bg-[#f3efe9] px-3 py-1 text-[0.65rem] uppercase tracking-widest text-[#2d2620]">
                {rewards.length} rewards
              </span>
            </div>
          </div>
          <div className="mt-3 flex min-h-0 flex-1 flex-col ">
            <div className="hidden border-b-2 border-[#2d2620] bg-[#f3efe9] text-xs uppercase tracking-widest text-[#5f544b] sm:grid sm:grid-cols-[1.6fr_0.6fr_0.6fr]">
              <span className="px-3 py-2">Reward</span>
              <span className="px-3 py-2">Points</span>
              <span className="px-3 py-2">Action</span>
            </div>
            <div className="scrollbar-hidden max-h-[40vh] overflow-y-auto bg-white/80 pr-2">
              {rewards.map((reward) => (
                <RewardRow key={reward.title} reward={reward} />
              ))}
            </div>
          </div>
        </div>

        <aside className="flex flex-col gap-3">
          <div className="bg-[#2d2620] p-3 text-[#f3efe9]">
            <p className="text-xs uppercase tracking-widest text-[#f3efe9]/70">
              Member Tier
            </p>
            <p className="mt-2 text-2xl font-semibold">Gold Member</p>
            <p className="mt-2 text-xs text-[#f3efe9]/80">
              Enjoy priority booking, birthday perks, and bonus points.
            </p>
            <button className="mt-3 w-full border border-[#f3efe9] px-4 py-2 text-[0.65rem] uppercase tracking-widest transition hover:bg-[#f3efe9] hover:text-[#2d2620] sm:text-xs">
              View Benefits
            </button>
          </div>

          <div className="border-2 border-[#2d2620]/20 bg-white/80 p-3">
            <p className="text-xs uppercase tracking-widest text-[#5f544b]">
              How to Earn Points
            </p>
            <div className="mt-2 space-y-3">
              {earnWays.map((item) => (
                <EarnRow key={item.title} item={item} />
              ))}
            </div>
          </div>

          <div className="border-2 border-dashed border-[#2d2620]/40 bg-[#f7f2ec] p-3 text-sm">
            <p className="text-xs uppercase tracking-widest text-[#5f544b]">
              Refer & Earn
            </p>
            <p className="mt-2 font-semibold">
              Invite a friend and unlock 150 points.
            </p>
            <p className="text-xs text-[#5f544b]">
              Share your referral link at checkout.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
};

const OfferCard = ({ offer }) => {
  return (
    <div className="flex h-full min-h-[140px] flex-col gap-3 border-2 border-[#2d2620]/30 bg-white p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-semibold leading-snug">{offer.title}</p>
          <p className="text-xs leading-relaxed text-[#5f544b]">
            {offer.description}
          </p>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#2d2620]/20 bg-[#f3efe9]">
          <img src={offer.icon} alt="" className="h-4 w-4 opacity-70" />
        </div>
      </div>
      <div className="mt-auto flex items-center justify-between gap-2 text-[0.65rem] uppercase tracking-widest text-[#5f544b]">
        <span>{offer.validUntil}</span>
        <span className="rounded-full border border-[#2d2620]/30 bg-[#f3efe9] px-2 py-0.5 text-[#2d2620]">
          {offer.code}
        </span>
      </div>
    </div>
  );
};

const RewardRow = ({ reward }) => {
  return (
    <div className="grid gap-3 px-4 py-2.5 text-sm transition hover:bg-[#f3efe9]/60 sm:grid-cols-[1.6fr_0.6fr_0.6fr] sm:items-center">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-widest text-[#5f544b] sm:hidden">
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
        <p className="text-xs uppercase tracking-widest text-[#5f544b] sm:hidden">
          Points
        </p>
        <span className="text-xs uppercase tracking-widest text-[#5f544b]">
          {reward.points} pts
        </span>
      </div>

      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <p className="text-xs uppercase tracking-widest text-[#5f544b] sm:hidden">
          Action
        </p>
        <button className="border-2 border-[#2d2620] px-3 py-1 text-[0.65rem] uppercase tracking-widest transition hover:bg-[#2d2620] hover:text-[#f3efe9]">
          Redeem
        </button>
      </div>
    </div>
  );
};

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

export default OffersLoyaltyPage;
