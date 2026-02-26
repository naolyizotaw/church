import Footer from '../components/Footer';

export default function Give() {
  return (
    <div>
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '4rem 2rem', textAlign: 'center' }}>
        <h1 style={{ color: '#0f172a', marginBottom: '0.5rem' }}>Give Online</h1>
        <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem' }}>
          Your generosity makes a difference. Support Kerabu Full Gospel Church and help us continue
          to spread the gospel, serve our community, and make disciples.
        </p>
        <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '12px', padding: '2.5rem' }}>
          <p style={{ color: '#0369a1', fontWeight: '600', marginBottom: '1.5rem', fontSize: '1rem' }}>
            Online giving coming soon. To give today, contact us directly.
          </p>
          <a
            href="mailto:info@kerabu.org"
            style={{ display: 'inline-block', background: '#0ea5e9', color: '#fff', textDecoration: 'none', padding: '0.75rem 2rem', borderRadius: '6px', fontWeight: '700' }}
          >
            Contact Us to Give
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
}
