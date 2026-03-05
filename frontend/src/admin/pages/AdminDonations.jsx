export default function AdminDonations() {
  return (
    <div>
      <div style={st.header}>
        <h1 style={st.title}>Donations</h1>
        <p style={st.subtitle}>Manage and track church donations</p>
      </div>
      <div style={st.card}>
        <div style={st.placeholder}>
          <div style={st.iconWrap}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect x="6" y="14" width="36" height="24" rx="4" stroke="#94a3b8" strokeWidth="2" fill="none"/>
              <line x1="6" y1="22" x2="42" y2="22" stroke="#94a3b8" strokeWidth="2"/>
              <circle cx="34" cy="30" r="3" stroke="#94a3b8" strokeWidth="1.5" fill="none"/>
            </svg>
          </div>
          <h2 style={st.placeholderTitle}>Donations Management</h2>
          <p style={st.placeholderText}>
            This feature is coming soon. You will be able to track donations, generate reports,
            and manage giving categories from this page.
          </p>
          <div style={st.featureList}>
            {['Track online and offline donations', 'Generate monthly and yearly reports', 'Manage giving categories', 'Export donation records'].map((f, i) => (
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
  featureList: { display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left', maxWidth: 320, margin: '0 auto' },
  featureItem: { display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#334155' },
};
