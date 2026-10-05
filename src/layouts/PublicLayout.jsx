// Wraps public-facing routes and attaches the shared go-to-top control.
import { Outlet, useLocation } from "react-router-dom";
import GoToTopButton from "../components/GoToTopButton";

function PublicLayout() {
  const { pathname } = useLocation();
  return (
    <>
      <Outlet />
      {!pathname.startsWith("/salon/") && <GoToTopButton />}
    </>
  );
}

export default PublicLayout;
