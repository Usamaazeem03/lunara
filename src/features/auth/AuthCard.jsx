import Button from "../../Shared/Button";
import Icon from "../../Shared/ui/Icon";

const CARD_CLASSES = [
  "relative w-full",
  "md:grid md:grid-cols-2",
  "bg-white/80 backdrop-blur-xl border border-ink/10 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)]",
  "md:h-[800px] md:bg-[#f4f1ec] md:border-8 md:border-[#f4f1ec] md:rounded-none md:shadow-[0_30px_90px_rgba(0,0,0,0.35)]",
  "overflow-hidden",
].join(" ");

function AuthCard({ children, onClose }) {
  return (
    <div className={CARD_CLASSES} style={{ maxHeight: "94vh" }}>
      <CloseButton onClick={onClose} />
      {children}
    </div>
  );
}

function CloseButton({ onClick }) {
  return (
    <Button
      aria-label="Close"
      onClick={onClick}
      unstyled
      variant="custom"
      className="absolute z-20 top-6  right-6  md:top-6 md:right-6 md:grid md:h-10 md:w-10 md:place-items-center md:border md:bg-white text-sm text-ink/60 md:text-neutral-700 hover:text-ink md:hover:bg-neutral-900 md:hover:text-white transition"
    >
      <Icon name="close-x" size={18} />
    </Button>
  );
}

export default AuthCard;
