function Navbar() {
  return (
    <nav className="absolute top-0 left-0 w-full flex items-center justify-between px-10 py-6 z-20 text-white">
      <h1 className="text-3xl font-bold tracking-widest">LUNARA</h1>

      <ul className="hidden md:flex gap-10 text-lg opacity-80">
        <li>About</li>
        <li>Service</li>
        <li>Blog</li>
      </ul>

      <button className="bg-white/5 backdrop-blur px-6 py-2  border border-white/60">
        Login
      </button>
    </nav>
  );
}

export default Navbar;
