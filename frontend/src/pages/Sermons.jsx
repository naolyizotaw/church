import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Sermons() {
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/sermons')
      .then((res) => setSermons(res.data))
      .catch(() => setError('Failed to load sermons.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={styles.center}>Loading sermons…</p>;
  if (error) return <p style={{ ...styles.center, color: '#dc2626' }}>{error}</p>;

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Sermons</h1>
      {sermons.length === 0 ? (
        <p style={styles.center}>No sermons available yet.</p>
      ) : (
        <div style={styles.list}>
          {sermons.map((sermon) => (
            <div key={sermon._id} style={styles.card}>
              <div style={styles.meta}>
                <h3 style={styles.title}>{sermon.title}</h3>
                <span style={styles.speaker}>{sermon.speaker}</span>
                <span style={styles.date}>
                  {sermon.date && new Date(sermon.date).toLocaleDateString()}
                </span>
              </div>
              {sermon.description && <p style={styles.desc}>{sermon.description}</p>}
              {sermon.videoUrl && (
                <a href={sermon.videoUrl} target="_blank" rel="noreferrer" style={styles.link}>
                  Watch Sermon →
                </a>
              )}
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
    borderLeft: '4px solid #e2b04a',
  },
  meta: { display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.5rem' },
  title: { margin: 0, color: '#1a1a2e', flex: 1 },
  speaker: { color: '#6b7280', fontSize: '0.9rem' },
  date: { color: '#9ca3af', fontSize: '0.85rem' },
  desc: { color: '#374151', fontSize: '0.9rem', margin: '0 0 0.75rem' },
  link: { color: '#e2b04a', fontWeight: '600', fontSize: '0.9rem' },
};
