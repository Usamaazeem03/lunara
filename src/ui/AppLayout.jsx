import Sidebar from "./Sidebar";
import Header from "./Header";

function AppLayout() {
  return (
    <div className="flex h-full">
      <Sidebar />
      <Header />
      <div>main page</div>
    </div>
  );
}

export default AppLayout;
