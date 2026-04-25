// Groups dashboard routes so protected dashboard screens render without public-site chrome.
import { Outlet } from "react-router-dom";

function DashboardLayout() {
  return <Outlet />;
}

export default DashboardLayout;
