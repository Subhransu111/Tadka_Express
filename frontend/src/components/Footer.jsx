import { Link } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const Footer = () => {
  const { dark } = useContext(ThemeContext);

  return (
    <footer
      className={`relative overflow-hidden transition-colors duration-500 ${
        dark ? "bg-[#0A0A0A]" : "bg-[#1a0f00]"
      }`}
    >
      {/* Top orange glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(234,88,12,0.2) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Curved top edge */}
      <div className="w-full overflow-hidden leading-[0]">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-14 block"
          style={{ fill: dark ? "#0F0F0F" : "#FFF4EC" }}>
          <path d="M0,0 C360,60 1080,60 1440,0 L1440,0 L0,0 Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-10 pt-6 relative z-10">

        {/* Main grid */}
        <div className="grid md:grid-cols-12 gap-10 mb-14">

          {/* Brand — wider col */}
          <div className="md:col-span-4">
            <Link to="/" className="inline-flex items-center gap-3 group mb-5">
              <div className="w-11 h-11 bg-orange-600 text-white flex items-center justify-center rounded-xl font-bold shadow-lg shadow-orange-900/40 group-hover:rotate-12 transition-transform text-xl">
                🍲
              </div>
              <span className="text-2xl font-black tracking-tighter text-white">
                TADKA <span className="text-orange-500">EXPRESS</span>
              </span>
            </Link>

            <p className="text-sm leading-relaxed text-gray-400 max-w-xs">
              Fresh homemade meals delivered daily with love and hygiene. Your desi kitchen, on time, every time.
            </p>

            {/* Social icons */}
            <div className="flex gap-3 mt-6">
              {[
                {
                  label: "Instagram",
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
                    </svg>
                  ),
                  href: "#",
                },
                {
                  label: "Facebook",
                  icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                    </svg>
                  ),
                  href: "#",
                },
                {
                  label: "WhatsApp",
                  icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.128.558 4.122 1.532 5.859L.057 23.428a.5.5 0 0 0 .614.614l5.569-1.475A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.9 9.9 0 0 1-5.032-1.374l-.36-.214-3.742.99.997-3.638-.235-.374A9.861 9.861 0 0 1 2.1 12C2.1 6.534 6.534 2.1 12 2.1c5.466 0 9.9 4.434 9.9 9.9 0 5.466-4.434 9.9-9.9 9.9z"/>
                    </svg>
                  ),
                  href: "#",
                },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-orange-600 transition-all duration-300"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-black tracking-widest uppercase text-orange-500 mb-5">
              Navigate
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Home", to: "/" },
                { label: "How It Works", to: "/#how" },
                { label: "Pricing", to: "/#pricing" },
                { label: "Menu", to: "/menu" },
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="text-sm text-gray-400 hover:text-orange-400 transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-orange-700 group-hover:bg-orange-400 transition-colors" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-black tracking-widest uppercase text-orange-500 mb-5">
              Account
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Login", to: "/login" },
                { label: "Register", to: "/register" },
                { label: "Dashboard", to: "/dashboard" },
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="text-sm text-gray-400 hover:text-orange-400 transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-orange-700 group-hover:bg-orange-400 transition-colors" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-black tracking-widest uppercase text-orange-500 mb-5">
              Get In Touch
            </h4>

            <div className="space-y-4">
              {[
                {
                  icon: "📧",
                  label: "Email",
                  value: "thetadkaxpress@gmail.com",
                  href: "mailto:thetadkaxpress@gmail.com",
                },
                {
                  icon: "📞",
                  label: "Phone",
                  value: "+91 8114360439",
                  href: "tel:+918114360439",
                },
                {
                  icon: "📍",
                  label: "Location",
                  value: "Bhubaneswar, Odisha",
                  href: null,
                },
              ].map((c) => (
                <div key={c.label} className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 mt-0.5"
                    style={{ background: "rgba(234,88,12,0.12)", border: "1px solid rgba(234,88,12,0.2)" }}
                  >
                    {c.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-widest uppercase text-gray-600 mb-0.5">
                      {c.label}
                    </p>
                    {c.href ? (
                      <a href={c.href} className="text-sm text-gray-300 hover:text-orange-400 transition-colors">
                        {c.value}
                      </a>
                    ) : (
                      <p className="text-sm text-gray-300">{c.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          className="h-px mb-8"
          style={{
            background: "linear-gradient(to right, transparent, rgba(234,88,12,0.3), transparent)",
          }}
        />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            © 2026 Tadka Express. All rights reserved.
          </p>
          <div className="flex gap-5">
            {["Privacy Policy", "Terms of Service"].map((t) => (
              <a key={t} href="#" className="text-xs text-gray-600 hover:text-orange-400 transition-colors">
                {t}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;