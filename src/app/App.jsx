import { useTranslation } from "react-i18next";
// Root application router using createBrowserRouter layout groups.
import { Suspense } from "react";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
  useRouteError,
} from "react-router-dom";

import ProtectedRoute from "../components/ProtectedRoute";
import AuthProvider from "./AuthProvider";
import AuthCallback from "../features/auth/AuthCallback";
import AuthModal from "../features/auth/AuthModal";
import AuthLayout from "../layouts/AuthLayout";
import AppLayoutByRole from "../AppLayout/AppLayoutByRole";
import PublicLayout from "../layouts/PublicLayout";
import LandingPage from "../pages/LandingPage";
import PublicSalonPage from "../pages/PublicSalonPage";
import ClientBookingPage from "../pages/ClientBookingPage";
import ResetPassword from "../pages/ResetPassword";
import AppToaster from "../Shared/ui/AppToaster";
import Spinner from "../ui/Spinner";

function DashboardLoading() {
  const { t } = useTranslation();
  return <p className="text-ink/60 mt-4 font-medium">{t("common.loadingDashboard")}</p>;
}

const dashboardElement = (
  <Suspense
    fallback={
      <div className="flex h-screen items-center justify-center bg-[#f7f5f0]">
        <div className="text-center">
          <Spinner />
          <DashboardLoading />
        </div>
      </div>
    }
  >
    <AppLayoutByRole />
  </Suspense>
);

function RouteErrorBoundary() {
  const { t } = useTranslation();
  const error = useRouteError();
  const message =
    error instanceof Error
      ? error.message
      : t("common.somethingWentWrongWhileLoadingThisPage");

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f5f0] px-6 py-12">
      <section className="border-ink/20 w-full max-w-lg border-2 bg-white p-8 text-center shadow-sm">
        <p className="text-ink-muted text-xs tracking-[0.2em] uppercase"> {t("common.pageUnavailable")} </p>
        <h1 className="text-ink mt-3 text-2xl font-semibold"> {t("common.weCouldnTLoadThisPage")} </h1>
        <p className="text-ink-muted mt-3 text-sm leading-6">{message}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="bg-ink text-cream border-ink hover:text-ink mt-6 border-2 px-5 py-3 text-xs tracking-widest uppercase transition hover:bg-transparent"
        > {t("common.tryAgain")} </button>
      </section>
    </main>
  );
}

const routes = [
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
        element: <ResetPassword />,
      },
    ],
  },
  {
    errorElement: <RouteErrorBoundary />,
    path: "*",
    element: <Navigate to="/" replace />,
  },
];

// One persistent auth provider can now read route context without remounting
// the session subscription when moving between public and protected pages.
const router = createBrowserRouter([
  { element: <AuthProvider />, children: routes },
]);

function App() {
  useTranslation();
  return (
    <>
      <RouterProvider router={router} />
      <AppToaster />
    </>
  );
}

export default App;
