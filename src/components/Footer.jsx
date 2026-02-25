function Footer() {
  return (
    <footer className="bg-[#f3efe9] py-16 px-6">
      {/* Top Section */}
      <div className="grid md:grid-cols-4 gap-10">
        {/* Left Content */}
        <div className="md:col-span-2">
          <h2 className="text-3xl font-bold tracking-widest mb-4">LUNARA</h2>

          <p className="text-gray-700 leading-relaxed max-w-md mb-8">
            Join our newsletter to receive beauty tips, latest styles, and
            exclusive salon offers directly in your inbox. Stay updated with
            Lunara and never miss a glow moment.
          </p>

          {/* Email Input */}
          <div className="flex items-center gap-4">
            <input
              type="email"
              placeholder="Email"
              className="bg-transparent border-b border-gray-400 outline-none py-2 w-64 placeholder-gray-400"
            />
            <button className="bg-black text-white px-6 py-2  hover:bg-gray-800 transition">
              Subscribe
            </button>
          </div>
        </div>

        {/* Top Services */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Top Services</h3>
          <ul className="space-y-2 text-gray-700">
            <li>Haircut</li>
            <li>Facials</li>
            <li>Makeup</li>
            <li>Coloring</li>
            <li>Nails</li>
          </ul>
        </div>

        {/* Navigation + Social */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Navigation</h3>
          <ul className="space-y-2 text-gray-700 mb-6">
            <li>About</li>
            <li>Services</li>
            <li>Blog</li>
          </ul>

          <h3 className="font-semibold text-lg mb-4">Follow US</h3>
          <ul className="space-y-2 text-gray-700">
            <li>Instagram</li>
            <li>LinkedIn</li>
          </ul>
        </div>
      </div>

      {/* Big Bottom Text */}
      <div className="mt-16">
        <h1 className="text-6xl xl:text-[9em] font-extrabold tracking-wider">
          LUNARA-SALON
        </h1>
      </div>

      {/* Bottom Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-6 text-sm text-gray-700">
        <p>© Lunara 2026</p>
        <p>Private policy ● Terms</p>
      </div>
    </footer>
  );
}

export default Footer;
