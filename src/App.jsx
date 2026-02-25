import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPageLayout from "./pages/Landing/LandingPageLayout";
import AuthModal from "./pages/Auth/AuthModal";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<LandingPageLayout />} />

        <Route path="auth/:role" element={<AuthModal />} />
        <Route path="auth/:role/signup" element={<AuthModal />} />
        <Route path="auth/:role/login" element={<AuthModal />} />
        <Route path="auth/:role/signin" element={<AuthModal />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
