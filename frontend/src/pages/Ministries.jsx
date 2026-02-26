import Footer from '../components/Footer';

const ministries = [
  { name: 'Youth Ministry', desc: 'Empowering the next generation through faith, fellowship, and fun.' },
  { name: 'Women\'s Fellowship', desc: 'A community of women growing together in faith and service.' },
  { name: 'Men\'s Ministry', desc: 'Building strong men of God through discipleship and accountability.' },
  { name: 'Children\'s Church', desc: 'Nurturing young hearts with the love of Jesus Christ.' },
  { name: 'Community Outreach', desc: 'Serving those in need and sharing the love of Christ in Addis Ababa.' },
  { name: 'Prayer Ministry', desc: 'Interceding for the church, community, and the world.' },
];

export default function Ministries() {
  return (
    <div>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '4rem 2rem' }}>
        <h1 style={{ color: '#0f172a', marginBottom: '0.5rem' }}>Ministries</h1>
        <p style={{ color: '#64748b', marginBottom: '2.5rem' }}>
          We offer a variety of ministries to help you grow in your faith and find your place in our community.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {ministries.map((m) => (
            <div key={m.name} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.5rem', borderTop: '3px solid #0ea5e9' }}>
              <h3 style={{ color: '#0f172a', margin: '0 0 0.5rem' }}>{m.name}</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0, lineHeight: 1.6 }}>{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
