// Wraps public-facing routes and attaches the shared go-to-top control.
import { Outlet } from "react-router-dom";
import GoToTopButton from "../components/GoToTopButton";

function PublicLayout() {
  return (
    <>
      <Outlet />
      <GoToTopButton />
    </>
  );
}

export default PublicLayout;
