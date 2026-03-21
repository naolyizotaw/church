import { useState, useEffect, useRef, useCallback } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const sidebarLinks = [
  { to: '/admin', icon: 'dashboard', label: 'Dashboard', end: true },
  { heading: 'CONTENT MANAGEMENT' },
  { to: '/admin/pages', icon: 'pages', label: 'Pages' },
  { to: '/admin/sermons', icon: 'sermons', label: 'Sermons' },
  { to: '/admin/events', icon: 'events', label: 'Events' },
  { to: '/admin/media', icon: 'media', label: 'Media Library' },
  { heading: 'ADMINISTRATION' },
  { to: '/admin/donations', icon: 'donations', label: 'Donations' },
  { to: '/admin/reports', icon: 'reports', label: 'Reports' },
  { to: '/admin/contacts', icon: 'contacts', label: 'Contacts' },
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
  media: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="3" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <circle cx="7" cy="8" r="2" stroke="currentColor" strokeWidth="1.2" fill="none"/>
      <path d="M2 14L6 10L10 14L14 9L18 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  ),
  reports: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="2" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <line x1="6" y1="6" x2="14" y2="6" stroke="currentColor" strokeWidth="1.2"/>
      <line x1="6" y1="9" x2="14" y2="9" stroke="currentColor" strokeWidth="1.2"/>
      <line x1="6" y1="12" x2="10" y2="12" stroke="currentColor" strokeWidth="1.2"/>
      <rect x="11" y="11" width="3" height="4" rx="0.5" stroke="currentColor" strokeWidth="1" fill="none"/>
    </svg>
  ),
  contacts: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="4" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M3 6L10 11L17 6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    </svg>
  ),
};

const notifTypeConfig = {
  donation: { color: '#0ea5e9', icon: 'ETB', route: '/admin/donations' },
  contact: { color: '#f43f5e', icon: 'MSG', route: '/admin/contacts' },
  registration: { color: '#f59e0b', icon: 'REG', route: '/admin/events' },
  event_reminder: { color: '#8b5cf6', icon: 'EVT', route: '/admin/events' },
  system: { color: '#64748b', icon: 'SYS', route: '/admin' },
};

function formatNotifTime(dateStr) {
  const now = new Date();
  const d = new Date(dateStr);
  const diffMin = Math.floor((now - d) / 60000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDays = Math.floor(diffHr / 24);
  return `${diffDays}d ago`;
}

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const notifRef = useRef(null);
  const searchRef = useRef(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await api.get('/notifications?limit=15');
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch {
      /* silent */
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifPanel(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchResults(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
      /* silent */
    }
  };

  const handleNotifClick = async (notif) => {
    if (!notif.isRead) {
      try {
        await api.put(`/notifications/${notif._id}/read`);
        setNotifications(prev => prev.map(n => n._id === notif._id ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch {
        /* silent */
      }
    }
    const cfg = notifTypeConfig[notif.type] || notifTypeConfig.system;
    setShowNotifPanel(false);
    navigate(cfg.route);
  };

  const handleSearch = async (q) => {
    setSearchQuery(q);
    if (q.length < 2) { setSearchResults(null); return; }
    try {
      const [sermons, events, contacts] = await Promise.all([
        api.get(`/sermons?search=${encodeURIComponent(q)}&limit=3`).catch(() => ({ data: { sermons: [] } })),
        api.get('/events').catch(() => ({ data: [] })),
        api.get('/contacts').catch(() => ({ data: [] })),
      ]);
      const sData = sermons.data?.sermons || (Array.isArray(sermons.data) ? sermons.data : []);
      const eData = (Array.isArray(events.data) ? events.data : [])
        .filter(e => e.title?.toLowerCase().includes(q.toLowerCase())).slice(0, 3);
      const cData = (Array.isArray(contacts.data) ? contacts.data : [])
        .filter(c => c.name?.toLowerCase().includes(q.toLowerCase()) || c.subject?.toLowerCase().includes(q.toLowerCase())).slice(0, 3);
      setSearchResults({ sermons: sData.slice(0, 3), events: eData, contacts: cData });
    } catch {
      setSearchResults(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const totalSearchResults = searchResults
    ? (searchResults.sermons?.length || 0) + (searchResults.events?.length || 0) + (searchResults.contacts?.length || 0)
    : 0;

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={styles.wrapper}>
      {/* Mobile hamburger button */}
      <button
        className="fixed top-4 left-4 z-[201] lg:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-white shadow-md text-gray-600 hover:bg-gray-50 transition-colors"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
        )}
      </button>
      {sidebarOpen && <div className="admin-sidebar-overlay lg:hidden" onClick={() => setSidebarOpen(false)} style={{ display: 'block', position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 199 }} />}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`} style={styles.sidebar}>
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

      <main className="admin-main-content" style={styles.main}>
        <header className="admin-topbar" style={styles.topbar}>
          <div style={styles.searchBox} ref={searchRef}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}>
              <circle cx="8" cy="8" r="5.5" stroke="#94a3b8" strokeWidth="1.5"/>
              <line x1="12" y1="12" x2="16" y2="16" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Search sermons, events, contacts..."
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              style={styles.searchInput}
            />
            {searchResults && (
              <div style={styles.searchDropdown}>
                {totalSearchResults === 0 ? (
                  <div style={{ padding: '16px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>No results found</div>
                ) : (
                  <>
                    {searchResults.sermons?.length > 0 && (
                      <>
                        <div style={styles.searchCategory}>Sermons</div>
                        {searchResults.sermons.map(s => (
                          <div key={s._id} style={styles.searchItem} onClick={() => { navigate('/admin/sermons'); setSearchResults(null); setSearchQuery(''); }}>
                            <span style={{ ...styles.searchDot, background: '#3b82f6' }} />
                            <span>{s.title}</span>
                          </div>
                        ))}
                      </>
                    )}
                    {searchResults.events?.length > 0 && (
                      <>
                        <div style={styles.searchCategory}>Events</div>
                        {searchResults.events.map(e => (
                          <div key={e._id} style={styles.searchItem} onClick={() => { navigate('/admin/events'); setSearchResults(null); setSearchQuery(''); }}>
                            <span style={{ ...styles.searchDot, background: '#f59e0b' }} />
                            <span>{e.title}</span>
                          </div>
                        ))}
                      </>
                    )}
                    {searchResults.contacts?.length > 0 && (
                      <>
                        <div style={styles.searchCategory}>Contacts</div>
                        {searchResults.contacts.map(c => (
                          <div key={c._id} style={styles.searchItem} onClick={() => { navigate('/admin/contacts'); setSearchResults(null); setSearchQuery(''); }}>
                            <span style={{ ...styles.searchDot, background: '#f43f5e' }} />
                            <span>{c.name} - {c.subject || 'No subject'}</span>
                          </div>
                        ))}
                      </>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
          <div style={styles.topbarRight}>
            <div style={styles.notifWrapper} ref={notifRef}>
              <button style={styles.notifBtn} onClick={() => setShowNotifPanel(p => !p)}>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M11 3C8.23858 3 6 5.23858 6 8V12L4 15H18L16 12V8C16 5.23858 13.7614 3 11 3Z" stroke="#334155" strokeWidth="1.5" fill="none"/>
                  <path d="M9 17C9 18.1046 9.89543 19 11 19C12.1046 19 13 18.1046 13 17" stroke="#334155" strokeWidth="1.5"/>
                </svg>
                {unreadCount > 0 && (
                  <span style={styles.notifBadge}>{unreadCount > 9 ? '9+' : unreadCount}</span>
                )}
              </button>
              {showNotifPanel && (
                <div style={styles.notifPanel}>
                  <div style={styles.notifPanelHeader}>
                    <span style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>Notifications</span>
                    {unreadCount > 0 && (
                      <button style={styles.markAllBtn} onClick={handleMarkAllRead}>Mark all read</button>
                    )}
                  </div>
                  <div style={styles.notifList}>
                    {notifications.length === 0 ? (
                      <div style={{ padding: '24px 16px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>No notifications yet</div>
                    ) : notifications.map(n => {
                      const cfg = notifTypeConfig[n.type] || notifTypeConfig.system;
                      return (
                        <div
                          key={n._id}
                          style={{ ...styles.notifItem, background: n.isRead ? '#fff' : '#f0f9ff' }}
                          onClick={() => handleNotifClick(n)}
                        >
                          <div style={{ ...styles.notifTypeIcon, background: cfg.color + '18', color: cfg.color }}>
                            {cfg.icon}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: n.isRead ? 400 : 600, color: '#0f172a', marginBottom: 2 }}>{n.title}</div>
                            <div style={{ fontSize: 12, color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.message}</div>
                          </div>
                          <div style={{ fontSize: 11, color: '#94a3b8', whiteSpace: 'nowrap', flexShrink: 0 }}>{formatNotifTime(n.createdAt)}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
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
  notifWrapper: {
    position: 'relative',
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
  notifBadge: {
    position: 'absolute',
    top: 0,
    right: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    background: '#ef4444',
    color: '#fff',
    fontSize: 10,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 4px',
    border: '2px solid #ffffff',
  },
  notifPanel: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: 8,
    width: 380,
    maxHeight: 480,
    background: '#fff',
    borderRadius: 14,
    boxShadow: '0 12px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
    border: '1px solid #e2e8f0',
    zIndex: 200,
    overflow: 'hidden',
  },
  notifPanelHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 16px',
    borderBottom: '1px solid #f1f5f9',
  },
  markAllBtn: {
    background: 'none',
    border: 'none',
    color: '#0ea5e9',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    padding: 0,
  },
  notifList: {
    maxHeight: 400,
    overflowY: 'auto',
  },
  notifItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '12px 16px',
    cursor: 'pointer',
    borderBottom: '1px solid #f8fafc',
    transition: 'background 0.1s',
  },
  notifTypeIcon: {
    width: 34,
    height: 34,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: '0.02em',
    flexShrink: 0,
  },
  searchDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 4,
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
    border: '1px solid #e2e8f0',
    zIndex: 200,
    maxHeight: 360,
    overflowY: 'auto',
  },
  searchCategory: {
    padding: '10px 14px 4px',
    fontSize: 10,
    fontWeight: 700,
    color: '#94a3b8',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },
  searchItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 14px',
    fontSize: 13,
    color: '#334155',
    cursor: 'pointer',
    transition: 'background 0.1s',
  },
  searchDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    flexShrink: 0,
  },
  content: {
    flex: 1,
    padding: '28px 32px 40px',
  },
};
