import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `text-[0.95rem] transition-colors duration-150 pb-0.5 border-b-2 ${
      isActive(path)
        ? 'text-sky-500 font-semibold border-sky-500'
        : 'text-gray-700 font-medium border-transparent hover:text-sky-500'
    }`;

  const mobileLinkClass = (path) =>
    `block px-4 py-3 text-base transition-colors duration-150 border-b border-gray-100 ${
      isActive(path)
        ? 'text-sky-500 font-semibold bg-sky-50'
        : 'text-gray-700 font-medium hover:bg-gray-50 hover:text-sky-500'
    }`;

  const closeMobile = () => setMobileOpen(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-16 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 no-underline shrink-0">
          <img src="/logo.png" alt="Kerabu Church Logo" className="w-[42px] h-[42px] object-contain" />
          <span className="font-bold text-base text-slate-900 leading-tight hidden sm:inline">
            Kerabu Full Gospel Church
          </span>
          <span className="font-bold text-sm text-slate-900 leading-tight sm:hidden">
            KFGC
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-7">
          <Link to="/" className={linkClass('/')}>Home</Link>
          <Link to="/about" className={linkClass('/about')}>About</Link>
          <Link to="/services" className={linkClass('/services')}>Services</Link>
          <Link to="/events" className={linkClass('/events')}>Events</Link>
          <Link to="/sermons" className={linkClass('/sermons')}>Sermons</Link>
          <Link to="/contact" className={linkClass('/contact')}>Contact</Link>
          <Link to="/give" className={linkClass('/give')}>Give</Link>
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

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={closeMobile} />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-gray-100">
          <span className="font-bold text-sm text-slate-900">Menu</span>
          <button
            onClick={closeMobile}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer Links */}
        <div className="py-2 overflow-y-auto max-h-[calc(100vh-8rem)]">
          <Link to="/" className={mobileLinkClass('/')} onClick={closeMobile}>Home</Link>
          <Link to="/about" className={mobileLinkClass('/about')} onClick={closeMobile}>About</Link>
          <Link to="/services" className={mobileLinkClass('/services')} onClick={closeMobile}>Services</Link>
          <Link to="/events" className={mobileLinkClass('/events')} onClick={closeMobile}>Events</Link>
          <Link to="/sermons" className={mobileLinkClass('/sermons')} onClick={closeMobile}>Sermons</Link>
          <Link to="/contact" className={mobileLinkClass('/contact')} onClick={closeMobile}>Contact</Link>
          <Link to="/give" className={mobileLinkClass('/give')} onClick={closeMobile}>Give</Link>
        </div>

        {/* Drawer Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 space-y-3">
          <Link
            to="/contact"
            className="block w-full text-center bg-sky-500 text-white no-underline px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-sky-600 transition-colors"
            onClick={closeMobile}
          >
            Join Us
          </Link>
          <button className="w-full bg-transparent border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 cursor-pointer font-[inherit] hover:border-sky-300 transition-colors">
            EN | አማ
          </button>
        </div>
      </div>
    </nav>
  );
}
