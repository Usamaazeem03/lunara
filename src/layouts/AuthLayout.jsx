// Renders landing content in the background and auth routes as a centered modal overlay.
import { Outlet } from "react-router-dom";
import LandingPage from "../pages/LandingPage";

function AuthLayout() {
  return (
    <>
      <LandingPage />
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-md transition-all duration-300 md:px-10">
        <Outlet />
      </div>
    </>
  );
}

export default AuthLayout;
