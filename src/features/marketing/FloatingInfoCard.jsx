import InfoCard from "../../Shared/ui/InfoCard";

const FloatingInfoCard = ({ position, animation, infoCardProps }) => {
  return (
    <div className={`absolute z-20 hidden ${position} md:block ${animation}`}>
      <InfoCard
        {...infoCardProps}
        bg="bg-white/80" // force same semi-transparent white background
        className={` ${infoCardProps.className || ""} rounded-2xl border border-black/10 shadow-lg backdrop-blur`}
        padding={infoCardProps.padding || "p-4"} // match original spacing
        layout="stacked"
      />
    </div>
  );
};

export default FloatingInfoCard;
