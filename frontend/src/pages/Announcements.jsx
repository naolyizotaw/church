import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/announcements')
      .then((res) => setAnnouncements(res.data))
      .catch(() => setError('Failed to load announcements.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={styles.center}>Loading…</p>;
  if (error) return <p style={{ ...styles.center, color: '#dc2626' }}>{error}</p>;

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Announcements</h1>
      {announcements.length === 0 ? (
        <p style={styles.center}>No announcements at this time.</p>
      ) : (
        <div style={styles.list}>
          {announcements.map((a) => (
            <div key={a._id} style={styles.card}>
              <h3 style={styles.title}>{a.title}</h3>
              <p style={styles.date}>
                {new Date(a.createdAt || a.date).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
              </p>
              <p style={styles.content}>{a.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { maxWidth: '800px', margin: '0 auto', padding: '2rem' },
  heading: { color: '#1a1a2e', marginBottom: '1.5rem' },
  center: { textAlign: 'center', padding: '3rem', color: '#6b7280' },
  list: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  card: {
    background: '#fff',
    borderRadius: '10px',
    padding: '1.5rem',
    boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
  },
  title: { margin: '0 0 0.25rem', color: '#1a1a2e' },
  date: { color: '#9ca3af', fontSize: '0.85rem', margin: '0 0 0.75rem' },
  content: { color: '#374151', margin: 0, lineHeight: 1.6 },
};
