export default function AdminSettings() {
  return (
    <div>
      <div style={st.header}>
        <h1 style={st.title}>Settings</h1>
        <p style={st.subtitle}>Configure your admin portal and church information</p>
      </div>
      <div style={st.card}>
        <div style={st.placeholder}>
          <div style={st.iconWrap}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="7" stroke="#94a3b8" strokeWidth="2" fill="none"/>
              <path d="M24 8V12M24 36V40M8 24H12M36 24H40M12.69 12.69L15.52 15.52M32.48 32.48L35.31 35.31M35.31 12.69L32.48 15.52M15.52 32.48L12.69 35.31" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h2 style={st.placeholderTitle}>Settings Management</h2>
          <p style={st.placeholderText}>
            This feature is coming soon. You will be able to manage church information,
            user accounts, and system preferences from this page.
          </p>
          <div style={st.featureList}>
            {['Update church name, address, and contact details', 'Manage admin user accounts and roles', 'Configure notification preferences', 'Customize site appearance and branding'].map((f, i) => (
              <div key={i} style={st.featureItem}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="#0ea5e9" strokeWidth="1.5"/>
                  <path d="M5 8L7 10L11 6" stroke="#0ea5e9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const st = {
  header: { marginBottom: 20 },
  title: { fontSize: 26, fontWeight: 700, color: '#0f172a', margin: 0 },
  subtitle: { fontSize: 14, color: '#64748b', margin: '4px 0 0' },
  card: { background: '#fff', borderRadius: 14, border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
  placeholder: { padding: '60px 40px', textAlign: 'center', maxWidth: 480, margin: '0 auto' },
  iconWrap: { width: 80, height: 80, borderRadius: 20, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' },
  placeholderTitle: { fontSize: 20, fontWeight: 700, color: '#0f172a', margin: '0 0 10px' },
  placeholderText: { fontSize: 14, color: '#64748b', lineHeight: 1.6, margin: '0 0 24px' },
  featureList: { display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left', maxWidth: 360, margin: '0 auto' },
  featureItem: { display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#334155' },
};
