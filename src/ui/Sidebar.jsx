import Logo from "./Logo";
import MainNav from "./MainNav";
function Sidebar() {
  return (
    <aside className="border-ink/15 bg-cream-soft sticky hidden h-screen w-72 flex-col border-r p-6 lg:flex">
      <Logo />
      <MainNav />
    </aside>
  );
}

export default Sidebar;
