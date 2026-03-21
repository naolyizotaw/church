import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/',         label: 'Home',     icon: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z' },
  { to: '/about',    label: 'About',    icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { to: '/services', label: 'Services', icon: 'M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z' },
  { to: '/events',   label: 'Events',   icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { to: '/sermons',  label: 'Sermons',  icon: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { to: '/contact',  label: 'Contact',  icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { to: '/give',     label: 'Give',     icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
];

const SWIPE_THRESHOLD = 60;

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const touchStartX = useRef(null);
  const drawerRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `text-[0.95rem] transition-colors duration-150 pb-0.5 border-b-2 ${
      isActive(path)
        ? 'text-sky-500 font-semibold border-sky-500'
        : 'text-gray-700 font-medium border-transparent hover:text-sky-500'
    }`;

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    if (!mobileOpen) return;
    const drawer = drawerRef.current;
    if (!drawer) return;

    const onTouchStart = (e) => {
      touchStartX.current = e.touches[0].clientX;
    };
    const onTouchEnd = (e) => {
      if (touchStartX.current === null) return;
      const diff = e.changedTouches[0].clientX - touchStartX.current;
      if (diff > SWIPE_THRESHOLD) closeMobile();
      touchStartX.current = null;
    };

    drawer.addEventListener('touchstart', onTouchStart, { passive: true });
    drawer.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      drawer.removeEventListener('touchstart', onTouchStart);
      drawer.removeEventListener('touchend', onTouchEnd);
    };
  }, [mobileOpen, closeMobile]);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-16 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 no-underline shrink-0">
          <img src="/logo.png" alt="Kerabu Church Logo" className="w-[42px] h-[42px] object-contain" />
          <span className="hidden sm:inline leading-tight">
            <span className="block text-[0.92rem] font-bold text-slate-900">Kerabu Full Gospel</span>
            <span className="block text-[0.62rem] font-medium tracking-[0.12em] text-slate-400 uppercase">Church</span>
          </span>
          <span className="sm:hidden leading-tight">
            <span className="block text-[0.72rem] font-bold text-slate-900">Kerabu Full Gospel</span>
            <span className="block text-[0.55rem] font-medium tracking-[0.12em] text-slate-400 uppercase">Church</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map(({ to, label }) => (
            <Link key={to} to={to} className={linkClass(to)}>{label}</Link>
          ))}
          <Link
            to="/contact"
            className="bg-sky-500 text-white no-underline px-5 py-2 rounded-md text-[0.9rem] font-semibold transition-colors duration-150 hover:bg-sky-600"
          >
            Join Us
          </Link>
          <button className="bg-transparent border border-slate-200 rounded-md px-3 py-1.5 text-[0.82rem] font-medium text-gray-700 cursor-pointer font-[inherit] hover:border-sky-300 hover:text-sky-600 transition-colors">
            EN | አማ
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Overlay — backdrop blur */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
          mobileOpen
            ? 'bg-black/30 backdrop-blur-sm pointer-events-auto'
            : 'bg-transparent backdrop-blur-none pointer-events-none'
        }`}
        onClick={closeMobile}
        aria-hidden={!mobileOpen}
      />

      {/* Mobile Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 h-full w-[280px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header — branded */}
        <div className="flex items-center justify-between px-5 h-[68px] border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2.5 no-underline" onClick={closeMobile}>
            <img src="/logo.png" alt="Logo" className="w-9 h-9 object-contain" />
            <div className="leading-tight">
              <div className="font-bold text-[0.8rem] text-slate-900">Kerabu Full Gospel</div>
              <div className="text-[0.58rem] font-medium tracking-[0.12em] text-slate-400 uppercase">Church</div>
            </div>
          </Link>
          <button
            onClick={closeMobile}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            aria-label="Close menu"
          >
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer Links — staggered animation + active accent */}
        <div className="py-3 px-3 overflow-y-auto max-h-[calc(100vh-10rem)]">
          {NAV_LINKS.map(({ to, label, icon }, i) => {
            const active = isActive(to);
            return (
              <Link
                key={to}
                to={to}
                onClick={closeMobile}
                className={`
                  group flex items-center gap-3.5 px-3 py-3 rounded-xl text-[0.92rem] no-underline
                  transition-all duration-200 relative mb-0.5
                  ${active
                    ? 'bg-sky-50 text-sky-600 font-semibold'
                    : 'text-slate-700 font-medium hover:bg-gray-50 hover:text-sky-600'
                  }
                `}
                style={mobileOpen ? {
                  opacity: 0,
                  transform: 'translateX(20px)',
                  animation: `drawerLinkIn 0.35s ease forwards`,
                  animationDelay: `${0.08 + i * 0.045}s`,
                } : { opacity: 0 }}
              >
                {/* Active accent bar */}
                {active && (
                  <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-sky-500" />
                )}
                {/* Icon */}
                <span className={`shrink-0 w-5 h-5 ${active ? 'text-sky-500' : 'text-slate-400 group-hover:text-sky-500'} transition-colors`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <path d={icon} />
                  </svg>
                </span>
                {label}
              </Link>
            );
          })}
        </div>

        {/* Drawer Footer */}
        <div
          className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 space-y-2.5"
          style={mobileOpen ? {
            opacity: 0,
            animation: 'drawerLinkIn 0.35s ease forwards',
            animationDelay: `${0.08 + NAV_LINKS.length * 0.045 + 0.05}s`,
          } : { opacity: 0 }}
        >
          <Link
            to="/contact"
            className="block w-full text-center bg-sky-500 text-white no-underline px-5 py-2.5 rounded-xl text-[0.88rem] font-semibold hover:bg-sky-600 transition-colors"
            onClick={closeMobile}
          >
            Join Us
          </Link>
          <button className="w-full bg-transparent border border-slate-200 rounded-xl px-3 py-2 text-[0.82rem] font-medium text-gray-600 cursor-pointer font-[inherit] hover:border-sky-300 transition-colors">
            EN | አማ
          </button>
        </div>
      </div>

      {/* Drawer animation keyframes */}
      <style>{`
        @keyframes drawerLinkIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </nav>
  );
}
