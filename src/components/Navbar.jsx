import { useNavigate } from "react-router-dom";
import Button from "../Dashboard/Shared/Button";

function Navbar() {
  const navigate = useNavigate();
  return (
    <nav className="absolute top-0 left-0 w-full flex items-center justify-between px-10 py-6 z-20 text-white">
      <h1 className="text-3xl font-bold tracking-widest">LUNARA</h1>

      <ul className="hidden md:flex gap-10 text-lg opacity-80">
        <li>About</li>
        <li>Service</li>
        <li>Blog</li>
      </ul>

      <Button
        type="button"
        variant="custom"
        unstyled
        onClick={() => navigate("/auth/login", { replace: true })}
        className="bg-white/10 backdrop-blur-md border border-white/40 px-6 py-2 text-sm uppercase tracking-widest text-white/90 transition hover:bg-white/20 hover:text-white"
      >
        Login
      </Button>
    </nav>
  );
}

export default Navbar;
