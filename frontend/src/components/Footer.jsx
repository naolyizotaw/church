import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const footerCSS = `
.footer-wave { display: block; width: 100%; line-height: 0; }
.footer-wave svg { display: block; width: 100%; height: 50px; }
@keyframes footerWaveShift {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.footer-wave-path {
  animation: footerWaveShift 8s linear infinite;
}
@keyframes footerColIn {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.footer-col { opacity: 0; }
.footer-grid.visible .footer-col {
  animation: footerColIn 0.6s ease forwards;
}
@keyframes footerLogoPulse {
  0%, 100% { filter: drop-shadow(0 0 0 transparent); }
  50% { filter: drop-shadow(0 0 8px rgba(14,165,233,0.35)); }
}
.footer-grid.visible .footer-logo {
  animation: footerLogoPulse 3s ease-in-out 0.8s infinite;
}
@keyframes footerSocialGlow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(14,165,233,0); }
  50% { box-shadow: 0 0 8px 2px rgba(14,165,233,0.15); }
}
.footer-social {
  transition: transform 0.3s ease, color 0.3s ease, border-color 0.3s ease,
              box-shadow 0.3s ease, background 0.3s ease;
}
.footer-grid.visible .footer-social {
  animation: footerSocialGlow 3s ease-in-out 1s infinite;
}
.footer-social:hover {
  transform: translateY(-4px) scale(1.12);
  color: #fff !important;
  background: #0ea5e9 !important;
  border-color: #0ea5e9 !important;
  box-shadow: 0 6px 16px rgba(14,165,233,0.35);
}
.footer-link {
  position: relative;
  display: inline-block;
  transition: color 0.25s ease;
}
.footer-link::after {
  content: '';
  position: absolute;
  bottom: -1px; left: 0;
  width: 0; height: 1.5px;
  background: #0ea5e9;
  transition: width 0.3s ease;
}
.footer-link:hover { color: #0ea5e9; }
.footer-link:hover::after { width: 100%; }

/* Church nav: obvious tap targets on small screens; classic text links on lg */
.footer-church-link {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.8125rem;
  letter-spacing: 0.02em;
  color: #0369a1;
  background: #fff;
  border: 1px solid #bae6fd;
  border-radius: 9999px;
  padding: 0.45rem 0.9rem;
  text-decoration: none;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.06);
  transition: color 0.2s ease, background 0.2s ease, border-color 0.2s ease,
              box-shadow 0.2s ease, transform 0.15s ease;
  -webkit-tap-highlight-color: transparent;
}
.footer-church-link:hover {
  color: #0c4a6e;
  background: #f0f9ff;
  border-color: #7dd3fc;
  box-shadow: 0 2px 10px rgba(14, 165, 233, 0.14);
}
.footer-church-link:active {
  transform: scale(0.97);
}
.footer-church-link:focus-visible {
  outline: 2px solid #0ea5e9;
  outline-offset: 2px;
}
@media (min-width: 1024px) {
  .footer-church-link {
    display: inline-block;
    font-weight: 500;
    font-size: 0.88rem;
    letter-spacing: normal;
    color: #64748b;
    background: transparent;
    border: none;
    border-radius: 0;
    padding: 0;
    box-shadow: none;
  }
  .footer-church-link:hover {
    color: #0ea5e9;
    background: transparent;
    box-shadow: none;
  }
  .footer-church-link:active {
    transform: none;
  }
  .footer-church-link:focus-visible {
    outline-offset: 3px;
  }
  .footer-church-link::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 0;
    height: 1.5px;
    background: #0ea5e9;
    transition: width 0.3s ease;
  }
  .footer-church-link:hover::after {
    width: 100%;
  }
}

@keyframes footerMapGlow {
  0%, 100% { box-shadow: 0 0 0 1px #e2e8f0; }
  50% { box-shadow: 0 0 12px 2px rgba(14,165,233,0.2), 0 0 0 1px #bae6fd; }
}
.footer-grid.visible .footer-map {
  animation: footerMapGlow 4s ease-in-out 1.2s infinite;
}
@keyframes footerBarGradient {
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}
.footer-bottom-bar {
  position: relative;
}
.footer-bottom-bar::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #0ea5e9, #38bdf8, #0ea5e9, transparent);
  background-size: 200% 100%;
  animation: footerBarGradient 4s linear infinite;
}
`;

const YouTubeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const EmailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
  </svg>
);

const MapPinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#0ea5e9" className="mr-1.5 shrink-0 mt-0.5">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
);

const PhoneIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#0ea5e9" className="mr-1.5 shrink-0 mt-0.5">
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
  </svg>
);

const CHURCH_NAV_LINKS = [
  { to: '/about', label: 'About' },
  { to: '/ministries', label: 'Ministries' },
  { to: '/sermons', label: 'Sermons' },
  { to: '/contact', label: 'Contact' },
];

export default function Footer() {
  const gridRef = useRef(null);
  const styleRef = useRef(null);
  const [sc, setSc] = useState(null);

  useEffect(() => {
    api.get('/site-content').then(res => setSc(res.data)).catch(() => {});
  }, []);

  const churchName = sc?.churchName || 'Kerabu Church';
  const addressLines = (sc?.address || 'Addis Ababa, Ethiopia\nKerabu Full Gospel Church').split('\n');
  const phoneNum = sc?.phone || '+251 911 123 456';
  const emailAddr = sc?.email || 'info@kerabu.org';
  const mapQ = sc?.mapQuery || 'Kerabu+Full+Gospel+Church+Addis+Ababa+Ethiopia';
  const social = sc?.socialLinks || {};

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = footerCSS;
    document.head.appendChild(style);
    styleRef.current = style;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );
    if (gridRef.current) observer.observe(gridRef.current);

    return () => {
      observer.disconnect();
      style.remove();
    };
  }, []);

  return (
    <footer className="bg-slate-50 w-full border-t-0">
      {/* Wave Divider */}
      <div className="footer-wave -mt-px">
        <svg viewBox="0 0 1440 50" preserveAspectRatio="none">
          <g className="footer-wave-path">
            <path d="M0,25 C180,5 360,45 540,25 C720,5 900,45 1080,25 C1260,5 1440,45 1440,25 L1440,50 L0,50 Z" fill="#f8fafc"/>
            <path d="M1440,25 C1620,5 1800,45 1980,25 C2160,5 2340,45 2520,25 C2700,5 2880,45 2880,25 L2880,50 L1440,50 Z" fill="#f8fafc"/>
          </g>
        </svg>
      </div>

      <div
        className="footer-grid w-full px-4 sm:px-6 lg:px-16 pt-6 pb-8 sm:pt-8 sm:pb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-7 lg:gap-10"
        ref={gridRef}
      >
        {/* Col 1: Brand */}
        <div className="footer-col flex flex-col gap-2.5" style={{ animationDelay: '0s' }}>
          <div className="flex items-center gap-2.5 mb-1">
            <img className="footer-logo w-11 h-11 object-contain" src="/logo.png" alt="Kerabu Church Logo" />
            <div>
              <div className="font-extrabold text-base text-slate-900 leading-tight">{churchName}</div>
            </div>
          </div>
          <p className="text-[0.85rem] text-slate-500 leading-relaxed m-0 max-w-[220px]">
            A place of faith, prayer, and love for everyone.
          </p>
          <div className="flex gap-2.5 mt-2">
            <a href={social.youtube || '#'} target={social.youtube ? '_blank' : undefined} rel="noreferrer" className="footer-social w-9 h-9 rounded-full border border-slate-200 bg-white text-slate-500 flex items-center justify-center no-underline" aria-label="YouTube"><YouTubeIcon /></a>
            <a href={social.twitter || '#'} target={social.twitter ? '_blank' : undefined} rel="noreferrer" className="footer-social w-9 h-9 rounded-full border border-slate-200 bg-white text-slate-500 flex items-center justify-center no-underline" aria-label="Twitter"><TwitterIcon /></a>
            <a href={social.facebook || '#'} target={social.facebook ? '_blank' : undefined} rel="noreferrer" className="footer-social w-9 h-9 rounded-full border border-slate-200 bg-white text-slate-500 flex items-center justify-center no-underline" aria-label="Facebook"><FacebookIcon /></a>
            <a href={social.instagram || '#'} target={social.instagram ? '_blank' : undefined} rel="noreferrer" className="footer-social w-9 h-9 rounded-full border border-slate-200 bg-white text-slate-500 flex items-center justify-center no-underline" aria-label="Instagram"><InstagramIcon /></a>
            <a href={`mailto:${emailAddr}`} className="footer-social w-9 h-9 rounded-full border border-slate-200 bg-white text-slate-500 flex items-center justify-center no-underline" aria-label="Email"><EmailIcon /></a>
          </div>
        </div>

        {/* Col 2: Church — one short wrap row on small screens; vertical list on lg */}
        <nav
          className="footer-col flex flex-col gap-1.5 lg:gap-2.5"
          style={{ animationDelay: '0.12s' }}
          aria-label="Church pages"
        >
          <h4 className="font-bold text-[0.85rem] text-slate-900 tracking-wider max-lg:sr-only lg:mb-2">CHURCH</h4>
          <ul className="list-none p-0 m-0 flex flex-wrap gap-2 lg:flex-col lg:gap-2">
            {CHURCH_NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="footer-church-link">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Col 3: Contact */}
        <div className="footer-col flex flex-col gap-2.5" style={{ animationDelay: '0.24s' }}>
          <h4 className="font-bold text-[0.85rem] text-slate-900 mb-2 tracking-wider">CONTACT</h4>
          <div className="flex flex-col gap-3">
            <div className="flex items-start text-[0.85rem] text-slate-500 leading-relaxed">
              <MapPinIcon />
              <span>{addressLines.map((l, i) => <span key={i}>{l}{i < addressLines.length - 1 && <br />}</span>)}</span>
            </div>
            <div className="flex items-start text-[0.85rem] text-slate-500 leading-relaxed">
              <PhoneIcon />
              <span>{phoneNum}</span>
            </div>
          </div>
        </div>

        {/* Col 4: Find Us */}
        <div className="footer-col flex flex-col gap-2.5" style={{ animationDelay: '0.36s' }}>
          <h4 className="font-bold text-[0.85rem] text-slate-900 mb-2 tracking-wider">FIND US</h4>
          <div className="footer-map rounded-lg overflow-hidden border border-slate-200">
            <iframe
              title="Church Location"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQ)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              width="100%"
              className="border-0 rounded-lg block h-[96px] w-full sm:h-[130px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom-bar px-4 sm:px-6 lg:px-16 py-5 flex justify-center items-center w-full">
        <span className="text-[0.82rem] text-slate-400">
          &copy; {new Date().getFullYear()} {sc?.churchName || 'Kerabu Full Gospel Church'}. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
