import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const sidebarLinks = [
  { to: '/admin', icon: 'dashboard', label: 'Dashboard', end: true },
  { heading: 'CONTENT MANAGEMENT' },
  { to: '/admin/pages', icon: 'pages', label: 'Pages' },
  { to: '/admin/sermons', icon: 'sermons', label: 'Sermons' },
  { to: '/admin/events', icon: 'events', label: 'Events' },
  { heading: 'ADMINISTRATION' },
  { to: '/admin/donations', icon: 'donations', label: 'Donations' },
  { to: '/admin/settings', icon: 'settings', label: 'Settings' },
];

const iconMap = {
  dashboard: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="2" width="7" height="7" rx="1.5" fill="currentColor"/>
      <rect x="11" y="2" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.5"/>
      <rect x="2" y="11" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.5"/>
      <rect x="11" y="11" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.5"/>
    </svg>
  ),
  pages: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4 3C4 2.44772 4.44772 2 5 2H12L16 6V17C16 17.5523 15.5523 18 15 18H5C4.44772 18 4 17.5523 4 17V3Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M12 2V6H16" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="7" y1="9" x2="13" y2="9" stroke="currentColor" strokeWidth="1.2"/>
      <line x1="7" y1="12" x2="13" y2="12" stroke="currentColor" strokeWidth="1.2"/>
      <line x1="7" y1="15" x2="11" y2="15" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  ),
  sermons: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 3C10 2.44772 9.55228 2 9 2H4C3.44772 2 3 2.44772 3 3V17C3 17.5523 3.44772 18 4 18H9C9.55228 18 10 17.5523 10 17V3Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <circle cx="14" cy="10" r="4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M13 8.5V11.5L15.5 10L13 8.5Z" fill="currentColor"/>
    </svg>
  ),
  events: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="4" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <line x1="3" y1="8" x2="17" y2="8" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="7" y1="2" x2="7" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="13" y1="2" x2="13" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  donations: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 11C3 8 5 4 10 4C15 4 17 8 17 11" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <rect x="2" y="11" width="16" height="6" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <circle cx="10" cy="14" r="2" stroke="currentColor" strokeWidth="1.2" fill="none"/>
    </svg>
  ),
  settings: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M10 2V4M10 16V18M2 10H4M16 10H18M4.93 4.93L6.34 6.34M13.66 13.66L15.07 15.07M15.07 4.93L13.66 6.34M6.34 13.66L4.93 15.07" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
};

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div style={styles.wrapper}>
      <aside style={styles.sidebar}>
        <div style={styles.logoArea}>
          <img src="/logo.png" alt="Kerabu FGBC" style={styles.logoImg} />
          <div>
            <div style={styles.logoTitle}>Kerabu FGBC</div>
            <div style={styles.logoSub}>Admin Portal</div>
          </div>
        </div>

        <nav style={styles.nav}>
          {sidebarLinks.map((item, i) =>
            item.heading ? (
              <div key={i} style={styles.sectionHeading}>{item.heading}</div>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                style={({ isActive }) => ({
                  ...styles.navLink,
                  ...(isActive ? styles.navLinkActive : {}),
                })}
              >
                <span style={styles.navIcon}>{iconMap[item.icon]}</span>
                {item.label}
              </NavLink>
            )
          )}
        </nav>

        <div style={styles.userArea}>
          <div style={styles.userAvatar}>
            {user?.name?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          <div style={styles.userInfo}>
            <div style={styles.userName}>{user?.name || 'Pastor Admin'}</div>
            <div style={styles.userEmail}>{user?.email || 'admin@fgbc.org'}</div>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn} title="Logout">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M6 16H3C2.44772 16 2 15.5523 2 15V3C2 2.44772 2.44772 2 3 2H6" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M12 12L16 9L12 6" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="7" y1="9" x2="16" y2="9" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </aside>

      <main style={styles.main}>
        <header style={styles.topbar}>
          <div style={styles.searchBox}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}>
              <circle cx="8" cy="8" r="5.5" stroke="#94a3b8" strokeWidth="1.5"/>
              <line x1="12" y1="12" x2="16" y2="16" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Search for events, sermons or members..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <div style={styles.topbarRight}>
            <div style={styles.langToggle}>
              <button style={styles.langBtnActive}>EN</button>
              <button style={styles.langBtn}>BM</button>
            </div>
            <button style={styles.notifBtn}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M11 3C8.23858 3 6 5.23858 6 8V12L4 15H18L16 12V8C16 5.23858 13.7614 3 11 3Z" stroke="#334155" strokeWidth="1.5" fill="none"/>
                <path d="M9 17C9 18.1046 9.89543 19 11 19C12.1046 19 13 18.1046 13 17" stroke="#334155" strokeWidth="1.5"/>
              </svg>
              <span style={styles.notifDot}></span>
            </button>
          </div>
        </header>
        <div style={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    minHeight: '100vh',
    background: '#f1f5f9',
  },
  sidebar: {
    width: 240,
    background: '#ffffff',
    borderRight: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 100,
  },
  logoArea: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '20px 20px 24px',
  },
  logoImg: {
    width: 42,
    height: 42,
    borderRadius: 10,
    objectFit: 'contain',
    flexShrink: 0,
  },
  logoTitle: {
    fontWeight: 700,
    fontSize: 16,
    color: '#0f172a',
    lineHeight: 1.2,
  },
  logoSub: {
    fontSize: 12,
    color: '#94a3b8',
    lineHeight: 1.3,
  },
  nav: {
    flex: 1,
    padding: '0 12px',
    overflowY: 'auto',
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: 600,
    color: '#94a3b8',
    letterSpacing: '0.05em',
    padding: '20px 8px 8px',
    textTransform: 'uppercase',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 12px',
    borderRadius: 8,
    textDecoration: 'none',
    color: '#64748b',
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 2,
    transition: 'all 0.15s',
  },
  navLinkActive: {
    background: '#0ea5e9',
    color: '#ffffff',
  },
  navIcon: {
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
  },
  userArea: {
    padding: '16px 16px 20px',
    borderTop: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: '#e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#64748b',
    fontWeight: 600,
    fontSize: 14,
    flexShrink: 0,
  },
  userInfo: {
    flex: 1,
    minWidth: 0,
  },
  userName: {
    fontWeight: 600,
    fontSize: 13,
    color: '#0f172a',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  userEmail: {
    fontSize: 11,
    color: '#94a3b8',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  logoutBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 4,
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
  },
  main: {
    flex: 1,
    marginLeft: 240,
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  topbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 32px',
    background: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    position: 'sticky',
    top: 0,
    zIndex: 50,
  },
  searchBox: {
    position: 'relative',
    flex: 1,
    maxWidth: 440,
  },
  searchInput: {
    width: '100%',
    padding: '10px 16px 10px 42px',
    border: '1px solid #e2e8f0',
    borderRadius: 10,
    fontSize: 14,
    color: '#334155',
    background: '#f8fafc',
    outline: 'none',
  },
  topbarRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  langToggle: {
    display: 'flex',
    background: '#f1f5f9',
    borderRadius: 8,
    overflow: 'hidden',
    border: '1px solid #e2e8f0',
  },
  langBtnActive: {
    padding: '6px 12px',
    fontSize: 13,
    fontWeight: 600,
    background: '#0ea5e9',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  },
  langBtn: {
    padding: '6px 12px',
    fontSize: 13,
    fontWeight: 600,
    background: 'transparent',
    color: '#64748b',
    border: 'none',
    cursor: 'pointer',
  },
  notifBtn: {
    position: 'relative',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 6,
    display: 'flex',
    alignItems: 'center',
  },
  notifDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#ef4444',
    border: '2px solid #ffffff',
  },
  content: {
    flex: 1,
    padding: '28px 32px 40px',
  },
};
