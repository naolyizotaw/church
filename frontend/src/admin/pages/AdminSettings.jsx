import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

export default function AdminSettings() {
  const { user } = useAuth();
  const [tab, setTab] = useState('profile');

  const tabs = [
    { key: 'profile', label: 'Profile', icon: <ProfileIcon /> },
    { key: 'password', label: 'Password', icon: <LockIcon /> },
    { key: 'payment', label: 'Payment Config', icon: <PaymentIcon /> },
  ];

  return (
    <div>
      <div style={st.header}>
        <h1 style={st.title}>Settings</h1>
        <p style={st.subtitle}>Manage your account and portal configuration</p>
      </div>

      <div style={st.layout}>
        {/* Sidebar */}
        <div style={st.sidebar}>
          <div style={st.avatarSection}>
            <div style={st.avatar}>
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div style={st.avatarName}>{user?.name || 'Admin'}</div>
            <div style={st.avatarEmail}>{user?.email || ''}</div>
            <div style={st.roleBadge}>{user?.role || 'admin'}</div>
          </div>
          <div style={st.navList}>
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                style={tab === t.key ? st.navItemActive : st.navItem}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={st.content}>
          {tab === 'profile' && <ProfileSection user={user} />}
          {tab === 'password' && <PasswordSection />}
          {tab === 'payment' && <PaymentSection />}
        </div>
      </div>
    </div>
  );
}

/* ─── Profile Section ─── */
function ProfileSection({ user }) {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if (user) { setName(user.name || ''); setEmail(user.email || ''); }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      await api.put('/auth/profile', { name, email });
      setMsg({ type: 'success', text: 'Profile updated. Changes will reflect on next login.' });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 style={st.sectionTitle}>Profile Information</h2>
      <p style={st.sectionDesc}>Update your account name and email address.</p>

      {msg && (
        <div style={msg.type === 'success' ? st.successMsg : st.errorMsg}>
          {msg.text}
        </div>
      )}

      <form onSubmit={handleSave}>
        <div style={st.formGrid}>
          <div style={st.field}>
            <label style={st.label}>Full Name</label>
            <input
              style={st.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
            />
          </div>
          <div style={st.field}>
            <label style={st.label}>Email Address</label>
            <input
              style={st.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
        </div>
        <div style={st.field}>
          <label style={st.label}>Role</label>
          <input style={{ ...st.input, background: '#f1f5f9', color: '#94a3b8', cursor: 'not-allowed' }} value={user?.role || 'admin'} disabled />
          <span style={st.hint}>Role cannot be changed from here</span>
        </div>
        <div style={st.formActions}>
          <button type="submit" style={st.saveBtn} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ─── Password Section ─── */
function PasswordSection() {
  const [current, setCurrent] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    if (newPw !== confirm) {
      setMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (newPw.length < 6) {
      setMsg({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }
    setSaving(true);
    try {
      await api.put('/auth/password', { currentPassword: current, newPassword: newPw });
      setMsg({ type: 'success', text: 'Password changed successfully.' });
      setCurrent(''); setNewPw(''); setConfirm('');
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to change password' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 style={st.sectionTitle}>Change Password</h2>
      <p style={st.sectionDesc}>Update your password to keep your account secure.</p>

      {msg && (
        <div style={msg.type === 'success' ? st.successMsg : st.errorMsg}>
          {msg.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={st.field}>
          <label style={st.label}>Current Password</label>
          <input style={st.input} type="password" value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="Enter current password" required />
        </div>
        <div style={st.formGrid}>
          <div style={st.field}>
            <label style={st.label}>New Password</label>
            <input style={st.input} type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="At least 6 characters" required />
          </div>
          <div style={st.field}>
            <label style={st.label}>Confirm New Password</label>
            <input style={st.input} type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat new password" required />
          </div>
        </div>
        <div style={st.formActions}>
          <button type="submit" style={st.saveBtn} disabled={saving}>
            {saving ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ─── Payment Config Section ─── */
function PaymentSection() {
  return (
    <div>
      <h2 style={st.sectionTitle}>Payment Configuration</h2>
      <p style={st.sectionDesc}>Manage your Chapa payment integration settings.</p>

      <div style={st.infoCard}>
        <div style={st.infoCardHeader}>
          <div style={st.chapaLogo}>CHAPA</div>
          <div style={st.connectedBadge}>
            <span style={st.connectedDot} />
            Connected
          </div>
        </div>
        <p style={st.infoCardDesc}>
          Chapa is configured via your server environment variables. Your secret key is stored securely in the backend <code style={st.code}>.env</code> file.
        </p>
      </div>

      <div style={st.configCard}>
        <h3 style={st.configTitle}>Configuration Details</h3>
        <div style={st.configRow}>
          <span style={st.configLabel}>Secret Key Location</span>
          <code style={st.code}>backend/.env → CHAPA_SECRET_KEY</code>
        </div>
        <div style={st.configRow}>
          <span style={st.configLabel}>API Base URL</span>
          <code style={st.code}>https://api.chapa.co/v1</code>
        </div>
        <div style={st.configRow}>
          <span style={st.configLabel}>Callback URL</span>
          <code style={st.code}>/api/donations/callback</code>
        </div>
        <div style={st.configRow}>
          <span style={st.configLabel}>Return URL</span>
          <code style={st.code}>/give/success?tx_ref=...</code>
        </div>
        <div style={st.configRow}>
          <span style={st.configLabel}>Currency</span>
          <span style={st.configValue}>ETB (Ethiopian Birr)</span>
        </div>
        <div style={st.configRow}>
          <span style={st.configLabel}>Supported Methods</span>
          <span style={st.configValue}>Telebirr, CBE Birr, M-Pesa, Bank Transfer</span>
        </div>
      </div>

      <div style={st.tipCard}>
        <strong>How to update your Chapa key:</strong>
        <ol style={st.tipList}>
          <li>Go to <a href="https://dashboard.chapa.co" target="_blank" rel="noreferrer" style={st.tipLink}>dashboard.chapa.co</a></li>
          <li>Copy your Secret Key from Settings</li>
          <li>Open <code style={st.code}>backend/.env</code> and update <code style={st.code}>CHAPA_SECRET_KEY</code></li>
          <li>Restart the backend server</li>
        </ol>
      </div>
    </div>
  );
}

/* ─── Icons ─── */
const ProfileIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ marginRight: 10, flexShrink: 0 }}>
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ marginRight: 10, flexShrink: 0 }}>
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
);
const PaymentIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ marginRight: 10, flexShrink: 0 }}>
    <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
);

/* ─── Styles ─── */
const st = {
  header: { marginBottom: 24 },
  title: { fontSize: 26, fontWeight: 700, color: '#0f172a', margin: 0 },
  subtitle: { fontSize: 14, color: '#64748b', margin: '4px 0 0' },

  layout: {
    display: 'grid',
    gridTemplateColumns: '260px 1fr',
    gap: 24,
    alignItems: 'start',
  },

  /* Sidebar */
  sidebar: {
    background: '#fff',
    borderRadius: 16,
    border: '1px solid #f1f5f9',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    overflow: 'hidden',
  },
  avatarSection: {
    padding: '28px 20px 20px',
    textAlign: 'center',
    borderBottom: '1px solid #f1f5f9',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
    color: '#fff',
    fontSize: 26,
    fontWeight: 800,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 12px',
    boxShadow: '0 4px 14px rgba(14,165,233,0.25)',
  },
  avatarName: { fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 2 },
  avatarEmail: { fontSize: 13, color: '#64748b', marginBottom: 10 },
  roleBadge: {
    display: 'inline-block',
    padding: '3px 12px',
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    background: '#dbeafe',
    color: '#1d4ed8',
  },
  navList: {
    padding: '8px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: '11px 16px',
    border: 'none',
    borderRadius: 10,
    background: 'transparent',
    color: '#64748b',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    textAlign: 'left',
    fontFamily: 'inherit',
    transition: 'all 0.15s',
  },
  navItemActive: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: '11px 16px',
    border: 'none',
    borderRadius: 10,
    background: '#f0f9ff',
    color: '#0ea5e9',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    textAlign: 'left',
    fontFamily: 'inherit',
  },

  /* Content */
  content: {
    background: '#fff',
    borderRadius: 16,
    border: '1px solid #f1f5f9',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    padding: '28px 32px 32px',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: '#0f172a',
    margin: '0 0 4px',
  },
  sectionDesc: {
    fontSize: 14,
    color: '#64748b',
    margin: '0 0 24px',
    lineHeight: 1.5,
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
    marginBottom: 16,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: '#334155',
  },
  input: {
    padding: '10px 14px',
    borderRadius: 10,
    border: '1.5px solid #e2e8f0',
    fontSize: 14,
    color: '#0f172a',
    outline: 'none',
    background: '#fff',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
  },
  hint: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  formActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  saveBtn: {
    padding: '10px 24px',
    borderRadius: 10,
    border: 'none',
    background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
    color: '#fff',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'inherit',
    boxShadow: '0 2px 8px rgba(14,165,233,0.25)',
  },
  successMsg: {
    padding: '12px 16px',
    borderRadius: 10,
    background: '#f0fdf4',
    border: '1px solid #bbf7d0',
    color: '#16a34a',
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 20,
  },
  errorMsg: {
    padding: '12px 16px',
    borderRadius: 10,
    background: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#dc2626',
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 20,
  },

  /* Payment Config */
  infoCard: {
    background: '#f0f9ff',
    border: '1.5px solid #bae6fd',
    borderRadius: 14,
    padding: '20px 24px',
    marginBottom: 20,
  },
  infoCardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  chapaLogo: {
    fontSize: 18,
    fontWeight: 900,
    color: '#0ea5e9',
    letterSpacing: '0.06em',
  },
  connectedBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '4px 12px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 700,
    background: '#f0fdf4',
    color: '#16a34a',
    border: '1px solid #bbf7d0',
  },
  connectedDot: {
    width: 7,
    height: 7,
    borderRadius: '50%',
    background: '#22c55e',
    boxShadow: '0 0 0 2px rgba(34,197,94,0.2)',
  },
  infoCardDesc: {
    fontSize: 14,
    color: '#0369a1',
    lineHeight: 1.6,
    margin: 0,
  },
  configCard: {
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: 14,
    padding: '20px 24px',
    marginBottom: 20,
  },
  configTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: '#0f172a',
    margin: '0 0 16px',
  },
  configRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid #f8fafc',
    flexWrap: 'wrap',
    gap: 8,
  },
  configLabel: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: 500,
  },
  configValue: {
    fontSize: 13,
    color: '#0f172a',
    fontWeight: 600,
  },
  code: {
    padding: '2px 8px',
    borderRadius: 6,
    background: '#f1f5f9',
    fontSize: 12,
    color: '#334155',
    fontFamily: "'SF Mono', Menlo, Consolas, monospace",
    border: '1px solid #e2e8f0',
  },
  tipCard: {
    background: '#fffbeb',
    border: '1px solid #fde68a',
    borderRadius: 14,
    padding: '18px 24px',
    fontSize: 14,
    color: '#92400e',
    lineHeight: 1.6,
  },
  tipList: {
    margin: '10px 0 0',
    paddingLeft: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  tipLink: {
    color: '#0ea5e9',
    fontWeight: 600,
  },
};
