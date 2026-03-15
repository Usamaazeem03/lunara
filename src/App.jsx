import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import LandingPageLayout from "./pages/Landing/LandingPageLayout";
import AuthModal from "./pages/Auth/AuthModal";
import Dashboard from "./Dashboard/Client/Dashboard";
import LandingPage from "./pages/Landing/LandingPage";
import GoToTopButton from "./components/GoToTopButton";

function AppContent() {
  const location = useLocation();
  const isAuthRoute = location.pathname.startsWith("/auth");

  return (
    <>
      <Routes>
        <Route index element={<LandingPage />} />
        <Route path="auth/:role" element={<LandingPage />} />
        <Route path="auth/:role/signup" element={<LandingPage />} />
        <Route path="auth/:role/login" element={<LandingPage />} />
        <Route path="auth/:role/signin" element={<LandingPage />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Routes>

      {/* Modal Route Pattern: AuthModal overlays on top of landing page */}
      {isAuthRoute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md px-4 md:px-10 transition-all duration-300">
          <AuthModal />
        </div>
      )}

      {/* Go to Top Button */}
      <GoToTopButton />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
