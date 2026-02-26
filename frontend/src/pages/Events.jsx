import { useEffect, useState } from 'react';
import api from '../api/axios';
import Footer from '../components/Footer';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/events')
      .then((res) => setEvents(res.data))
      .catch(() => setError('Failed to load events.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={styles.center}>Loading events…</p>;
  if (error) return <p style={{ ...styles.center, color: '#dc2626' }}>{error}</p>;

  return (
    <div>
    <div style={styles.page}>
      <h1 style={styles.heading}>Upcoming Events</h1>
      {events.length === 0 ? (
        <p style={styles.center}>No events at the moment.</p>
      ) : (
        <div style={styles.grid}>
          {events.map((event) => (
            <div key={event._id} style={styles.card}>
              {event.image && (
                <img src={`/uploads/${event.image}`} alt={event.title} style={styles.img} />
              )}
              <div style={styles.body}>
                <h3 style={styles.title}>{event.title}</h3>
                <p style={styles.date}>
                  {new Date(event.date).toLocaleDateString('en-US', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </p>
                {event.location && <p style={styles.meta}>📍 {event.location}</p>}
                <p style={styles.desc}>{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    <Footer />
    </div>
  );
}

const styles = {
  page: { maxWidth: '1000px', margin: '0 auto', padding: '2rem' },
  heading: { color: '#1a1a2e', marginBottom: '1.5rem' },
  center: { textAlign: 'center', padding: '3rem', color: '#6b7280' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' },
  card: { background: '#fff', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', overflow: 'hidden' },
  img: { width: '100%', height: '180px', objectFit: 'cover' },
  body: { padding: '1.25rem' },
  title: { margin: '0 0 0.4rem', color: '#1a1a2e' },
  date: { color: '#e2b04a', fontWeight: '600', fontSize: '0.9rem', margin: '0 0 0.25rem' },
  meta: { color: '#6b7280', fontSize: '0.85rem', margin: '0 0 0.5rem' },
  desc: { color: '#374151', fontSize: '0.9rem', margin: 0 },
};
