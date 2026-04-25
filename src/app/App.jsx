// Root application router using createBrowserRouter layout groups.
import { Suspense, lazy } from "react";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

import ProtectedRoute from "../components/ProtectedRoute";
import AuthCallback from "../features/auth/AuthCallback";
import AuthModal from "../features/auth/AuthModal";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import PublicLayout from "../layouts/PublicLayout";
import LandingPage from "../pages/LandingPage";
import PublicSalonPage from "../pages/PublicSalonPage";
import ClientBookingPage from "../pages/ClientBookingPage";
import AppToaster from "../Shared/ui/AppToaster";

const Dashboard = lazy(() => import("../Shared/layouts/Dashboard"));

const dashboardElement = (
  <Suspense
    fallback={
      <div className="flex h-screen items-center justify-center bg-[#f7f5f0]">
        <div className="text-center">
          <div className="border-ink mx-auto h-12 w-12 animate-spin rounded-full border-b-2" />
          <p className="text-ink/60 mt-4 font-medium">Loading dashboard...</p>
        </div>
      </div>
    }
  >
    <Dashboard />
  </Suspense>
);

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "salon/:slug", element: <PublicSalonPage /> },
      { path: "book/:ownerId", element: <ClientBookingPage /> }, //temp
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: "auth/:role", element: <AuthModal /> },
      { path: "auth/:role/:mode", element: <AuthModal /> },
    ],
  },
  {
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "profile", element: dashboardElement },
      { path: "dashboard", element: dashboardElement },
      { path: "dashboard/:page", element: dashboardElement },
      { path: "owner/salon/:slug", element: dashboardElement },
      { path: "owner/salon/:slug/:page", element: dashboardElement },
      { path: "dashboard/:role/salon/:slug", element: dashboardElement },
      {
        path: "dashboard/:role/salon/:slug/:page",
        element: dashboardElement,
      },
    ],
  },
  {
    children: [
      { path: "auth/callback", element: <AuthCallback /> },
      {
        path: "auth/reset-password",
        element: <Navigate to="/auth/client/reset-password" replace />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <AppToaster />
    </>
  );
}

export default App;
