// Root application router using createBrowserRouter layout groups.
import { Suspense, lazy } from "react";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
  useRouteError,
} from "react-router-dom";

import ProtectedRoute from "../components/ProtectedRoute";
import AuthCallback from "../features/auth/AuthCallback";
import AuthModal from "../features/auth/AuthModal";
import AuthLayout from "../layouts/AuthLayout";
import AppLayoutByRole from "../AppLayout/AppLayoutByRole";
import PublicLayout from "../layouts/PublicLayout";
import LandingPage from "../pages/LandingPage";
import PublicSalonPage from "../pages/PublicSalonPage";
import ClientBookingPage from "../pages/ClientBookingPage";
import AppToaster from "../Shared/ui/AppToaster";
import Spinner from "../ui/Spinner";

const Dashboard = lazy(() => import("../AppLayout/AppLayoutByRole"));

const dashboardElement = (
  <Suspense
    fallback={
      <div className="flex h-screen items-center justify-center bg-[#f7f5f0]">
        <div className="text-center">
          {/* <div className="border-ink mx-auto h-12 w-12 animate-spin rounded-full border-b-2" /> */}
          <Spinner />
          <p className="text-ink/60 mt-4 font-medium">Loading dashboard...</p>
        </div>
      </div>
    }
  >
    <AppLayoutByRole />
  </Suspense>
);

function RouteErrorBoundary() {
  const error = useRouteError();
  const message =
    error instanceof Error
      ? error.message
      : "Something went wrong while loading this page.";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f5f0] px-6 py-12">
      <section className="border-ink/20 w-full max-w-lg border-2 bg-white p-8 text-center shadow-sm">
        <p className="text-ink-muted text-xs tracking-[0.2em] uppercase">
          Page unavailable
        </p>
        <h1 className="text-ink mt-3 text-2xl font-semibold">
          We couldn&apos;t load this page
        </h1>
        <p className="text-ink-muted mt-3 text-sm leading-6">{message}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="bg-ink text-cream border-ink hover:text-ink mt-6 border-2 px-5 py-3 text-xs tracking-widest uppercase transition hover:bg-transparent"
        >
          Try again
        </button>
      </section>
    </main>
  );
}

const router = createBrowserRouter([
  {
    errorElement: <RouteErrorBoundary />,
    element: <PublicLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "salon/:slug", element: <PublicSalonPage /> },
      { path: "book/:ownerId", element: <ClientBookingPage /> }, //temp
    ],
  },
  {
    errorElement: <RouteErrorBoundary />,
    element: <AuthLayout />,
    children: [
      { path: "auth/:role", element: <AuthModal /> },
      { path: "auth/:role/:mode", element: <AuthModal /> },
    ],
  },
  {
    errorElement: <RouteErrorBoundary />,
    element: (
      <ProtectedRoute>
        <AppLayoutByRole />
      </ProtectedRoute>
    ),
    children: [
      { path: "profile", element: dashboardElement },
      { path: "dashboard", element: dashboardElement },
      { path: "dashboard/:page", element: dashboardElement },
      { path: "owner/salon/:slug", element: dashboardElement },
      {
        path: "owner/salon/:slug/:page/:clientSlug",
        element: dashboardElement,
      },
      { path: "owner/salon/:slug/:page", element: dashboardElement },
      { path: "dashboard/:role/salon/:slug", element: dashboardElement },
      {
        path: "dashboard/:role/salon/:slug/:page/:clientSlug",
        element: dashboardElement,
      },
      {
        path: "dashboard/:role/salon/:slug/:page",
        element: dashboardElement,
      },
    ],
  },
  {
    errorElement: <RouteErrorBoundary />,
    children: [
      { path: "auth/callback", element: <AuthCallback /> },
      {
        path: "auth/reset-password",
        element: <Navigate to="/auth/client/reset-password" replace />,
      },
    ],
  },
  {
    errorElement: <RouteErrorBoundary />,
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
