import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => ({
    color: isActive(path) ? '#0ea5e9' : '#374151',
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: isActive(path) ? '600' : '500',
    paddingBottom: '2px',
    borderBottom: isActive(path) ? '2px solid #0ea5e9' : '2px solid transparent',
    transition: 'color 0.15s',
  });

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <Link to="/" style={styles.brand}>
          <img src="/logo.png" alt="Kerabu Church Logo" style={styles.logo} />
          <span style={styles.brandText}>Kerabu Full Gospel Church</span>
        </Link>
        <div style={styles.links}>
          <Link to="/" style={linkStyle('/')}>Home</Link>
          <Link to="/about" style={linkStyle('/about')}>About Us</Link>
          <Link to="/ministries" style={linkStyle('/ministries')}>Ministries</Link>
          <Link to="/sermons" style={linkStyle('/sermons')}>Sermons</Link>
          <Link to="/give" style={styles.giveBtn}>Give</Link>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    background: '#ffffff',
    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    width: '100%',
  },
  inner: {
    width: '100%',
    padding: '0 4rem',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    textDecoration: 'none',
  },
  logo: {
    width: '42px',
    height: '42px',
    objectFit: 'contain',
  },
  brandText: {
    fontWeight: '700',
    fontSize: '1rem',
    color: '#0f172a',
    lineHeight: 1.2,
  },
  links: {
    display: 'flex',
    gap: '1.75rem',
    alignItems: 'center',
  },
  giveBtn: {
    background: '#0ea5e9',
    color: '#ffffff',
    textDecoration: 'none',
    padding: '0.5rem 1.25rem',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: '600',
    transition: 'background 0.15s',
  },
};
