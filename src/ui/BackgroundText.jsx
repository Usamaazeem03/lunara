import { useTranslation } from "react-i18next";
function BackgroundText() {
  useTranslation();
  return (
    <div className="pointer-events-none absolute top-6 -right-10 text-[7.5rem] font-extrabold tracking-widest text-[#2d2620]/5 xl:block">
      LUNARA
    </div>
  );
}

export default BackgroundText;
