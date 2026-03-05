import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Footer from '../components/Footer';

const MONTH_ABBR = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

const EVENT_GRADIENTS = [
  'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
  'linear-gradient(135deg, #10b981 0%, #0ea5e9 100%)',
  'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
];


const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{ marginRight: 6 }}>
    <circle cx="8" cy="8" r="8" fill="rgba(255,255,255,0.25)" />
    <polygon points="6,4.5 12,8 6,11.5" fill="white" />
  </svg>
);

export default function Home() {
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    api.get('/events')
      .then((res) => setEvents(res.data.slice(0, 3)))
      .catch(() => {})
      .finally(() => setEventsLoading(false));
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) setSubscribed(true);
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section style={heroStyles.section}>
        <div style={heroStyles.overlay} />
        <div style={heroStyles.content}>
          <h1 style={heroStyles.title}>
            Welcome to Kerabu Full Gospel<br />Believers Church
          </h1>
          <p style={heroStyles.amharic}>
            እንኳን ወደ ከራቡ ሙሉ ወንጌል አማኞች ቤተክርስቲያን በደህና መጡ
          </p>
          <p style={heroStyles.subtitle}>
            A place of faith, hope, and community where everyone is welcome.
          </p>
          <div style={heroStyles.buttons}>
            <Link to="/events" style={heroStyles.primaryBtn}>Join Us This Sunday</Link>
            <Link to="/sermons" style={heroStyles.secondaryBtn}>
              <PlayIcon />
              Watch Sermons
            </Link>
          </div>
        </div>
      </section>

      {/* ── Scripture of the Day ─────────────────────────── */}
      <section style={scriptureStyles.section}>
        <div style={scriptureStyles.card}>
          <div style={scriptureStyles.label}>
            <span style={scriptureStyles.dot} />
            <span style={scriptureStyles.labelText}>SCRIPTURE OF THE DAY &nbsp;|&nbsp; የዕለቱ ቃል</span>
            <span style={scriptureStyles.dot} />
          </div>
          <div style={scriptureStyles.quoteIcon}>&ldquo;</div>
          <blockquote style={scriptureStyles.quote}>
            "Jesus Christ is the same yesterday and today and forever."
          </blockquote>
          <p style={scriptureStyles.amharic}>
            "ኢየሱስ ክርስቶስ ትናንትና ዛሬ እንዲሁም ለዘላለም አንድ ነው::"
          </p>
          <p style={scriptureStyles.reference}>Hebrews 13:8 &nbsp;|&nbsp; ዕብራውያን 13:8</p>
        </div>
      </section>

      {/* ── Upcoming Events ──────────────────────────────── */}
      <section style={eventStyles.section}>
        <div style={eventStyles.inner}>
          <div style={eventStyles.header}>
            <div>
              <h2 style={eventStyles.heading}>Upcoming Events</h2>
              <p style={eventStyles.subheading}>የቅርብ ጊዜ መርሃ ግብሮች</p>
            </div>
            <Link to="/events" style={eventStyles.viewAll}>View All Events &rarr;</Link>
          </div>

          {eventsLoading ? (
            <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>Loading events…</p>
          ) : events.length === 0 ? (
            <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>No upcoming events at this time.</p>
          ) : (
            <div style={eventStyles.grid}>
              {events.map((event, i) => {
                const d = new Date(event.date);
                const month = MONTH_ABBR[d.getMonth()];
                const day = d.getDate();
                const timeStr = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                const endRaw = event.endDate ? new Date(event.endDate) : null;
                const isMultiDay = endRaw && endRaw.toDateString() !== d.toDateString();
                const sameDay = endRaw && !isMultiDay;
                const endTimeStr = sameDay ? endRaw.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '';
                const timeDisplay = isMultiDay
                  ? `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${endRaw.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                  : `${timeStr}${endTimeStr ? ` – ${endTimeStr}` : ''}`;
                const imgSrc = event.posterUrl || null;
                return (
                  <div key={event._id} className="events-card-anim events-card-wrap">
                    <div className="events-card-inner" style={eventStyles.card}>
                      <div className="events-card-top-accent" />
                      <div style={eventStyles.cardImg}>
                        {imgSrc ? (
                          <img className="events-card-img" src={imgSrc} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        ) : (
                          <div className="events-card-img" style={{ width: '100%', height: '100%', background: EVENT_GRADIENTS[i % 3] }} />
                        )}
                        <div className="events-card-overlay" />
                        <div className="events-badge-wrap" style={eventStyles.dateBadge}>
                          <span style={eventStyles.badgeMonth}>{month}</span>
                          <span style={eventStyles.badgeDay}>{isMultiDay ? `${day}–${endRaw.getDate()}` : day}</span>
                        </div>
                      </div>
                      <div style={eventStyles.cardBody}>
                        <div style={eventStyles.metaRow}>
                          <span className="events-meta-icon">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="#0ea5e9" style={{ flexShrink: 0 }}>
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
                            </svg>
                          </span>
                          <span style={eventStyles.metaText}>{timeDisplay}</span>
                        </div>
                        <h3 style={eventStyles.cardTitle}>{event.title}</h3>
                        <p style={eventStyles.cardDesc}>{event.description}</p>
                        {event.location && (
                          <div style={eventStyles.metaRow}>
                            <span className="events-meta-icon">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="#0ea5e9" style={{ flexShrink: 0 }}>
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                              </svg>
                            </span>
                            <span style={eventStyles.metaText}>{event.location}</span>
                          </div>
                        )}
                        <Link to="/events" style={eventStyles.learnMore}>Learn More &rsaquo;</Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Stay Connected ───────────────────────────────── */}
      <section style={newsletterStyles.section}>
        <div style={newsletterStyles.inner}>
          <div style={newsletterStyles.text}>
            <h2 style={newsletterStyles.heading}>Stay Connected with Kerabu</h2>
            <p style={newsletterStyles.sub}>Get updates on services, events, and prayer requests.</p>
          </div>
          {subscribed ? (
            <p style={newsletterStyles.thanks}>Thank you for subscribing! ✓</p>
          ) : (
            <form onSubmit={handleSubscribe} style={newsletterStyles.form}>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={newsletterStyles.input}
              />
              <button type="submit" style={newsletterStyles.btn}>Subscribe</button>
            </form>
          )}
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <Footer />
    </div>
  );
}

/* ─── Styles ──────────────────────────────────────────────── */

const heroStyles = {
  section: {
    position: 'relative',
    minHeight: '520px',
    display: 'flex',
    alignItems: 'center',
    backgroundImage: `url('/hero.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center top',
    color: '#fff',
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to bottom, rgba(10,20,50,0.72) 0%, rgba(10,20,50,0.65) 100%)',
  },
  content: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '800px',
    margin: '0 auto',
    padding: '5rem 2rem',
    textAlign: 'center',
  },
  title: {
    fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
    fontWeight: '800',
    lineHeight: 1.25,
    margin: '0 0 0.75rem',
    color: '#ffffff',
  },
  amharic: {
    fontSize: '1.1rem',
    color: '#cbd5e1',
    margin: '0 0 0.75rem',
    fontStyle: 'italic',
  },
  subtitle: {
    fontSize: '1.05rem',
    color: '#cbd5e1',
    margin: '0 0 2rem',
  },
  buttons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  primaryBtn: {
    background: '#0ea5e9',
    color: '#fff',
    textDecoration: 'none',
    padding: '0.75rem 1.75rem',
    borderRadius: '6px',
    fontWeight: '700',
    fontSize: '0.95rem',
  },
  secondaryBtn: {
    background: 'rgba(255,255,255,0.12)',
    border: '1.5px solid rgba(255,255,255,0.5)',
    color: '#fff',
    textDecoration: 'none',
    padding: '0.75rem 1.75rem',
    borderRadius: '6px',
    fontWeight: '600',
    fontSize: '0.95rem',
    display: 'flex',
    alignItems: 'center',
  },
};

const scriptureStyles = {
  section: {
    background: '#f1f5f9',
    padding: '4rem 2rem',
  },
  card: {
    background: '#ffffff',
    maxWidth: '700px',
    margin: '0 auto',
    borderRadius: '12px',
    padding: '2.5rem 3rem',
    boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
    textAlign: 'center',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    marginBottom: '1.25rem',
  },
  dot: {
    width: '28px',
    height: '3px',
    background: '#0ea5e9',
    borderRadius: '2px',
    display: 'inline-block',
  },
  labelText: {
    fontSize: '0.75rem',
    fontWeight: '700',
    letterSpacing: '0.1em',
    color: '#0ea5e9',
    textTransform: 'uppercase',
  },
  quoteIcon: {
    fontSize: '4rem',
    color: '#e2e8f0',
    lineHeight: 0.8,
    marginBottom: '0.5rem',
    fontFamily: 'Georgia, serif',
  },
  quote: {
    fontSize: '1.35rem',
    fontWeight: '600',
    color: '#1e293b',
    lineHeight: 1.5,
    margin: '0 0 0.75rem',
    fontStyle: 'normal',
    fontFamily: 'Georgia, serif',
  },
  amharic: {
    fontSize: '1rem',
    color: '#475569',
    margin: '0 0 1rem',
    fontStyle: 'italic',
  },
  reference: {
    fontSize: '0.9rem',
    color: '#94a3b8',
    margin: 0,
    fontWeight: '500',
  },
};

const eventStyles = {
  section: {
    background: '#ffffff',
    padding: '4rem 2rem',
  },
  inner: {
    maxWidth: '1100px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: '2rem',
  },
  heading: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 0.25rem',
  },
  subheading: {
    color: '#64748b',
    margin: 0,
    fontSize: '0.95rem',
  },
  viewAll: {
    color: '#0ea5e9',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '0.9rem',
    whiteSpace: 'nowrap',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    position: 'relative',
    background: '#ffffff',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
    border: '1px solid #e8ecf1',
  },
  cardImg: {
    position: 'relative',
    height: '200px',
    overflow: 'hidden',
  },
  dateBadge: {
    position: 'absolute',
    top: '14px',
    left: '14px',
    background: '#ffffff',
    borderRadius: '10px',
    padding: '7px 12px',
    textAlign: 'center',
    boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
    minWidth: '48px',
    zIndex: 2,
  },
  badgeMonth: {
    display: 'block',
    fontSize: '0.6rem',
    fontWeight: '800',
    color: '#ef4444',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    lineHeight: 1.3,
  },
  badgeDay: {
    display: 'block',
    fontSize: '1.5rem',
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: 1.1,
  },
  cardBody: {
    padding: '1.35rem 1.4rem 1.25rem',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.55rem',
    marginBottom: '0.45rem',
  },
  metaText: {
    fontSize: '0.84rem',
    color: '#475569',
    fontWeight: '500',
  },
  cardTitle: {
    fontSize: '1.08rem',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 0.55rem',
    lineHeight: 1.35,
  },
  cardDesc: {
    fontSize: '0.86rem',
    color: '#64748b',
    margin: '0 0 1rem',
    lineHeight: 1.6,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  learnMore: {
    color: '#0ea5e9',
    textDecoration: 'none',
    fontSize: '0.88rem',
    fontWeight: '600',
  },
};

const newsletterStyles = {
  section: {
    background: '#1e3a5f',
    padding: '3.5rem 2rem',
  },
  inner: {
    maxWidth: '900px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '2rem',
    flexWrap: 'wrap',
  },
  text: {
    flex: 1,
  },
  heading: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#ffffff',
    margin: '0 0 0.4rem',
  },
  sub: {
    color: '#94a3b8',
    margin: 0,
    fontSize: '0.95rem',
  },
  form: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  input: {
    padding: '0.65rem 1rem',
    border: '1px solid #334155',
    borderRadius: '6px',
    fontSize: '0.95rem',
    background: '#ffffff',
    color: '#0f172a',
    outline: 'none',
    width: '240px',
  },
  btn: {
    background: '#0ea5e9',
    color: '#fff',
    border: 'none',
    padding: '0.65rem 1.5rem',
    borderRadius: '6px',
    fontWeight: '700',
    fontSize: '0.95rem',
    cursor: 'pointer',
  },
  thanks: {
    color: '#4ade80',
    fontWeight: '600',
    fontSize: '1rem',
  },
};
