import Navbar from "./Navbar";
import { NavLink } from "react-router-dom";

function HeroSection() {
  return (
    <>
      <Navbar />
      <main className="relative min-h-screen bg-[#c5ced6] overflow-hidden">
        {/* BIG BACKGROUND TEXT */}
        <h1
          className={`absolute bottom-10 left-10 xl:text-[9em] font-extrabold text-white tracking-wider select-none z-20 
          }`}
        >
          LUNARA-SALON
        </h1>

        {/* LEFT CONTENT */}
        <div
          className={`absolute left-10 top-[60%] -translate-y-1/2 z-10 max-w-xl hero-reveal 
          }`}
        >
          <p className="text-white/80 text-2xl mb-4">
            You glow banging here. welcome to Lunara
          </p>

          <NavLink
            to="/auth/client/signup"
            className="!text-white hover:!text-white text-2xl !underline cursor-pointer"
          >
            Book an Appointment
          </NavLink>
        </div>

        {/* RIGHT IMAGE */}
        <div
          className={`absolute right-0 bottom-0 h-[90vh] w-[min(52vw,640px)] flex items-end 
          }`}
        >
          <div className="hero-float">
            <img
              src="/src/assets/images/hero-img.png"
              alt="model"
              className="h-full w-full object-contain"
            />
          </div>
        </div>
      </main>
    </>
  );
}

export default HeroSection;

{
  /* NAVBAR */
}
