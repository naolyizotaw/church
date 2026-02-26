import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Footer from '../components/Footer';

const FALLBACK_MAIN_SERVICE = {
  title: 'Sunday Main Service',
  titleAmharic: 'የእሁድ ዋና አገልግሎት',
  description:
    'Join us every Sunday morning for a time of uplifting worship, powerful prayer, and an inspiring message from the Word of God. Everyone is welcome in our house.',
  descriptionAmharic:
    'በየእሁዱ ጠዋት ለሚያነቃቃ አምልኮ፣ ለኃይለኛ ጸሎት እና ከእግዚአብሔር ቃል ለሚመጣ አነቃቂ መልእክት ይቀላቀሉን።',
  day: 'Sundays',
  time: '10:00 AM',
  endTime: '12:30 PM',
  location: 'Main Sanctuary',
};

const FALLBACK_PROGRAMS = [
  { _id: 'f1', title: 'Youth Aflame Ministry', titleAmharic: 'ወጣት አገልግሎት', description: 'A vibrant community for young people to explore their faith, ask tough questions, and build lasting friendships.', icon: 'youth', day: 'Fridays', time: '6:00 PM', location: 'Youth Hall', category: 'youth' },
  { _id: 'f2', title: 'Intercessory Prayer', titleAmharic: 'የምልጃ ጸሎት', description: 'Join us as we stand in the gap for our church, our nation, and the world. Power in unity and prayer.', icon: 'prayer', day: 'Wednesdays', time: '6:00 PM', location: 'Prayer Room', category: 'prayer' },
  { _id: 'f3', title: 'Deep Dive Bible Study', titleAmharic: 'የመጽሐፍ ቅዱስ ጥናት', description: 'Explore the depths of scripture with detailed exposition and group discussions. Available online via Zoom.', icon: 'bible-study', day: 'Thursdays', time: '7:00 PM', location: 'Zoom', category: 'bible-study' },
  { _id: 'f4', title: 'Kids Kingdom', titleAmharic: 'ህፃናት አገልግሎት', description: 'Fun, safe, and biblical learning environment for children ages 3-12 during the main service.', icon: 'children', day: 'Sundays', time: '10:30 AM', location: 'Kids Hall', category: 'children' },
  { _id: 'f5', title: 'Women of Faith', titleAmharic: 'የእምነት አገልግሎት', description: 'Empowering women to grow in Christ and support one another through fellowship and mentoring.', icon: 'women', day: 'Saturdays', time: '4:00 PM', location: 'Fellowship Hall', category: 'women' },
  { _id: 'f6', title: 'Choir Practice', titleAmharic: 'የመዘምራን ልምምድ', description: 'Preparing our hearts and voices to lead the congregation in worship. Open to auditions.', icon: 'choir', day: 'Tuesdays', time: '6:00 PM', location: 'Music Room', category: 'choir' },
];

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const MapPinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
    <circle cx="12" cy="12" r="12" fill="rgba(255,255,255,0.25)" />
    <polygon points="10,7 18,12 10,17" fill="white" />
  </svg>
);

const ChurchIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="#0ea5e9">
    <path d="M18 12.22V9l-5-2.5V5h2V3h-2V1h-2v2H9v2h2v1.5L6 9v3.22L2 14v8h8v-3c0-1.1.9-2 2-2s2 .9 2 2v3h8v-8l-4-1.78zM12 13.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
  </svg>
);

const DirectionsArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const HeartIcon = ({ color = '#0ea5e9' }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const ICON_COLOR = '#0ea5e9';
const S = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: ICON_COLOR, strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };

/* Person with arms raised + small flame above head */
const YouthAflameIcon = () => (
  <svg {...S}>
    <circle cx="12" cy="7" r="2.2" />
    <path d="M8 20c0-2.2 1.8-4 4-4s4 1.8 4 4" />
    <path d="M9 12l-2-2" />
    <path d="M15 12l2-2" />
    <path d="M9 12c0-1.7 1.3-3 3-3s3 1.3 3 3" />
    <path d="M12 3c0 0 .8-1.5 2-1 0 0-.5 1-2 1z" fill={ICON_COLOR} strokeWidth="0.5" />
    <path d="M11 2.5c.3-.8 1-.9 1.5-.5" />
  </svg>
);

/* Two open/raised hands with 4-point sparkle above */
const PrayerHandsIcon = () => (
  <svg {...S}>
    <path d="M8 15v-4c0-.6-.4-1-1-1s-1 .4-1 1v5c0 2 1.5 3.5 3.5 3.5h5c2 0 3.5-1.5 3.5-3.5v-5c0-.6-.4-1-1-1s-1 .4-1 1v4" />
    <path d="M10 15v-6c0-.6-.4-1-1-1s-1 .4-1 1v6" />
    <path d="M12 15v-7c0-.6-.4-1-1-1s-1 .4-1 1v7" />
    <path d="M14 15v-6c0-.6-.4-1-1-1s-1 .4-1 1v6" />
    <path d="M12 2v2M10.5 3.5l1 1M13.5 3.5l-1 1" strokeWidth="1.4" />
  </svg>
);

/* Open book — two pages fanning open */
const BibleStudyIcon = () => (
  <svg {...S}>
    <path d="M12 6v13" />
    <path d="M12 6C10 4.5 6 4 3 5v12c3-1 7-.5 9 1z" />
    <path d="M12 6c2-1.5 6-2 9-1v12c-3-1-7-.5-9 1z" />
    <path d="M6 9c1.5-.4 3-.5 4.5-.3" strokeWidth="1" />
    <path d="M6 12c1.5-.4 3-.5 4.5-.3" strokeWidth="1" />
    <path d="M6 15c1.5-.4 3-.5 4.5-.3" strokeWidth="1" />
  </svg>
);

/* Smiley face */
const KidsSmileyIcon = () => (
  <svg {...S}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="9" cy="10.5" r="1" fill={ICON_COLOR} />
    <circle cx="15" cy="10.5" r="1" fill={ICON_COLOR} />
    <path d="M8.5 14.5c1 1.5 2 2 3.5 2s2.5-.5 3.5-2" />
  </svg>
);

/* Female / Venus symbol: circle + vertical line + horizontal crossbar */
const WomenFaithIcon = () => (
  <svg {...S}>
    <circle cx="12" cy="9" r="4.5" />
    <line x1="12" y1="13.5" x2="12" y2="20" />
    <line x1="9" y1="17" x2="15" y2="17" />
  </svg>
);

/* Eighth note: filled oval head + stem + single flag */
const ChoirNoteIcon = () => (
  <svg {...S}>
    <ellipse cx="8.5" cy="17" rx="2.5" ry="1.8" fill={ICON_COLOR} stroke="none" />
    <line x1="11" y1="17" x2="11" y2="5" />
    <path d="M11 5c2 1 4 3 4 5" />
  </svg>
);

const MINISTRY_ICONS = {
  youth: YouthAflameIcon,
  prayer: PrayerHandsIcon,
  'bible-study': BibleStudyIcon,
  children: KidsSmileyIcon,
  women: WomenFaithIcon,
  choir: ChoirNoteIcon,
};

function MinistryIcon({ icon, category }) {
  const key = icon || category || 'other';
  const IconComponent = MINISTRY_ICONS[key] || KidsSmileyIcon;
  return <IconComponent />;
}

export default function Services() {
  const [mainService, setMainService] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, programsRes] = await Promise.allSettled([
          api.get('/services?type=main'),
          api.get('/programs'),
        ]);

        if (servicesRes.status === 'fulfilled' && servicesRes.value.data.length > 0) {
          setMainService(servicesRes.value.data[0]);
        }

        if (programsRes.status === 'fulfilled' && programsRes.value.data.length > 0) {
          setPrograms(programsRes.value.data);
        }
      } catch {
        // fallback data will be used
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const service = mainService || FALLBACK_MAIN_SERVICE;
  const displayPrograms = programs.length > 0 ? programs : FALLBACK_PROGRAMS;

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <style>{pageCSS}</style>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section style={hero.section}>
        <div style={hero.overlay} />
        <div style={hero.content}>
          <h1 style={hero.title}>Worship & Community</h1>
          <p style={hero.amharic}>አምልኮ እና ህብረት</p>
          <div style={hero.divider} />
          <p style={hero.verse}>
            Hebrews 10:25 - Experiencing God's presence together.
          </p>
          <p style={hero.verseAmharic}>
            ዕብራውያን 10:25 - የእግዚአብሔርን ሕልውና አንድ ላይ ማግኘት።
          </p>
          <div style={hero.buttons}>
            <a href="#sunday-service" style={hero.primaryBtn}>
              <PlayIcon />
              <span style={{ marginLeft: 8 }}>Watch Live Stream</span>
            </a>
            <Link to="/events" style={hero.secondaryBtn}>
              <CalendarIcon />
              <span style={{ marginLeft: 8 }}>Upcoming Events</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Sunday Service ───────────────────────────────── */}
      <section id="sunday-service" style={main.section}>
        <div style={main.inner}>
          <div style={main.sectionLabel}>
            <ChurchIcon />
            <h2 style={main.heading}>Sunday Service</h2>
          </div>

          <div className="service-main-card" style={main.card}>
            <div style={main.cardContent}>
              <span style={main.badge}>⛪ MAIN EVENT</span>
              <h3 style={main.cardTitle}>{service.title}</h3>
              {service.titleAmharic && (
                <p style={main.cardAmharic}>{service.titleAmharic}</p>
              )}
              <p style={main.cardDesc}>{service.description}</p>
              {service.descriptionAmharic && (
                <p style={main.cardDescAmharic}>{service.descriptionAmharic}</p>
              )}

              <div style={main.metaRow}>
                <div style={main.metaItem}>
                  <ClockIcon />
                  <div style={main.metaBlock}>
                    <span style={main.metaLabel}>TIME</span>
                    <span style={main.metaValue}>
                      {service.time}{service.endTime ? ` - ${service.endTime}` : ''}
                    </span>
                  </div>
                </div>
                <div style={main.metaDivider} />
                <div style={main.metaItem}>
                  <MapPinIcon />
                  <div style={main.metaBlock}>
                    <span style={main.metaLabel}>LOCATION</span>
                    <span style={main.metaValue}>{service.location || 'Main Sanctuary'}</span>
                  </div>
                </div>
              </div>

              <div style={main.actions}>
                <Link to="/contact" style={main.planBtn}>Plan Your Visit</Link>
                <a
                  href="https://maps.google.com/?q=Kerabu+Full+Gospel+Church+Addis+Ababa"
                  target="_blank"
                  rel="noreferrer"
                  style={main.directionsBtn}
                >
                  <DirectionsArrowIcon />
                  <span style={{ marginLeft: 6 }}>Get Directions</span>
                </a>
              </div>
            </div>

            <div style={main.cardImage}>
              <img
                src="/hero.jpg"
                alt="Sunday Service Worship"
                style={main.img}
              />
              <div style={main.imgOverlay} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Weekly Ministries / Programs ─────────────────── */}
      <section style={weekly.section}>
        <div style={weekly.inner}>
          <div style={weekly.header}>
            <h2 style={weekly.heading}>Weekly Ministries</h2>
            <p style={weekly.sub}>Connect, grow and serve throughout the week.</p>
          </div>

          {loading ? (
            <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>Loading programs...</p>
          ) : (
            <div style={weekly.grid}>
              {displayPrograms.map((prog) => (
                <div key={prog._id} className="program-card" style={weekly.card}>
                  <div style={weekly.cardTop}>
                    <div style={weekly.iconBadge}>
                      <MinistryIcon icon={prog.icon} category={prog.category} />
                    </div>
                  </div>
                  <h3 style={weekly.cardTitle}>{prog.title}</h3>
                  {prog.titleAmharic && (
                    <p style={weekly.cardAmharic}>{prog.titleAmharic}</p>
                  )}
                  <p style={weekly.cardDesc}>{prog.description}</p>
                  <div style={weekly.cardMeta}>
                    <div style={weekly.metaItem}>
                      <CalendarIcon />
                      <span style={weekly.metaText}>{prog.day}</span>
                    </div>
                    <div style={weekly.metaItem}>
                      <ClockIcon />
                      <span style={weekly.metaText}>{prog.time}</span>
                    </div>
                    {prog.location && (
                      <div style={weekly.metaItem}>
                        <MapPinIcon />
                        <span style={weekly.metaText}>{prog.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA: New Here / Prayer ───────────────────────── */}
      <section style={cta.section}>
        <div style={cta.inner}>
          <div style={cta.text}>
            <h2 style={cta.heading}>New Here? Need Prayer?</h2>
            <p style={cta.sub}>
              We would love to connect with you. Plan a visit or send us your prayer request.
            </p>
            <p style={cta.subAmharic}>
              ከእኛ ጋር ለመገናኘት እንፈልጋለን። ጉብኝት ያቅዱ ወይም የጸሎት ጥያቄዎን ይላኩልን።
            </p>
          </div>
          <div style={cta.buttons}>
            <Link to="/contact" style={cta.primaryBtn}>I'm New Here</Link>
            <Link to="/contact" style={{ ...cta.secondaryBtn, color: '#0ea5e9', borderColor: '#0ea5e9' }}>
              <HeartIcon />
              <span style={{ marginLeft: 8 }}>Prayer Request</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* ─── CSS Animations ─────────────────────────────────────── */

const pageCSS = `
  .service-main-card {
    transition: box-shadow 0.3s ease;
  }
  .service-main-card:hover {
    box-shadow: 0 8px 32px rgba(0,0,0,0.12) !important;
  }
  .program-card {
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }
  .program-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 28px rgba(0,0,0,0.1) !important;
  }
`;

/* ─── Styles ─────────────────────────────────────────────── */

const hero = {
  section: {
    position: 'relative',
    minHeight: '420px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: `url('/hero.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center top',
    color: '#fff',
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to bottom, rgba(10,20,50,0.72) 0%, rgba(10,20,50,0.68) 100%)',
  },
  content: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '750px',
    margin: '0 auto',
    padding: '4.5rem 2rem',
    textAlign: 'center',
  },
  title: {
    fontSize: 'clamp(2rem, 4.5vw, 3rem)',
    fontWeight: '800',
    lineHeight: 1.15,
    margin: '0 0 0.4rem',
    color: '#ffffff',
    fontStyle: 'italic',
  },
  amharic: {
    fontSize: '1.2rem',
    color: '#cbd5e1',
    margin: '0 0 1rem',
    fontStyle: 'italic',
  },
  divider: {
    width: '60px',
    height: '3px',
    background: '#0ea5e9',
    margin: '0 auto 1rem',
    borderRadius: '2px',
  },
  verse: {
    fontSize: '0.95rem',
    color: '#e2e8f0',
    margin: '0 0 0.3rem',
  },
  verseAmharic: {
    fontSize: '0.9rem',
    color: '#94a3b8',
    margin: '0 0 2rem',
    fontStyle: 'italic',
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
    padding: '0.7rem 1.75rem',
    borderRadius: '6px',
    fontWeight: '700',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
  },
  secondaryBtn: {
    background: 'rgba(255,255,255,0.1)',
    border: '1.5px solid rgba(255,255,255,0.4)',
    color: '#fff',
    textDecoration: 'none',
    padding: '0.7rem 1.75rem',
    borderRadius: '6px',
    fontWeight: '600',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
  },
};

const main = {
  section: {
    background: '#f8fafc',
    padding: '4rem 2rem',
  },
  inner: {
    maxWidth: '1000px',
    margin: '0 auto',
  },
  sectionLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1.5rem',
  },
  heading: {
    fontSize: '1.6rem',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0,
  },
  card: {
    background: '#ffffff',
    borderRadius: '14px',
    overflow: 'hidden',
    boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
    border: '1px solid #e2e8f0',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
  },
  cardContent: {
    padding: '2.5rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  badge: {
    display: 'inline-block',
    background: '#eff6ff',
    color: '#0ea5e9',
    fontSize: '0.7rem',
    fontWeight: '800',
    letterSpacing: '0.1em',
    padding: '4px 12px',
    borderRadius: '20px',
    marginBottom: '0.75rem',
    width: 'fit-content',
  },
  cardTitle: {
    fontSize: '1.4rem',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 0.25rem',
  },
  cardAmharic: {
    fontSize: '1rem',
    color: '#64748b',
    margin: '0 0 1rem',
    fontStyle: 'italic',
  },
  cardDesc: {
    fontSize: '0.9rem',
    color: '#475569',
    lineHeight: 1.65,
    margin: '0 0 0.5rem',
  },
  cardDescAmharic: {
    fontSize: '0.85rem',
    color: '#94a3b8',
    lineHeight: 1.55,
    margin: '0 0 1.5rem',
    fontStyle: 'italic',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    marginBottom: '1.5rem',
    padding: '1rem 0',
    borderTop: '1px solid #f1f5f9',
    borderBottom: '1px solid #f1f5f9',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  metaBlock: {
    display: 'flex',
    flexDirection: 'column',
  },
  metaLabel: {
    fontSize: '0.65rem',
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: '0.05em',
  },
  metaValue: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#0f172a',
  },
  metaDivider: {
    width: '1px',
    height: '32px',
    background: '#e2e8f0',
  },
  actions: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap',
  },
  planBtn: {
    background: '#0ea5e9',
    color: '#ffffff',
    textDecoration: 'none',
    padding: '0.6rem 1.5rem',
    borderRadius: '6px',
    fontWeight: '700',
    fontSize: '0.85rem',
  },
  directionsBtn: {
    display: 'flex',
    alignItems: 'center',
    background: 'transparent',
    color: '#475569',
    textDecoration: 'none',
    padding: '0.6rem 1rem',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
    fontWeight: '600',
    fontSize: '0.85rem',
  },
  cardImage: {
    position: 'relative',
    minHeight: '320px',
    overflow: 'hidden',
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  imgOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to right, rgba(255,255,255,0.08) 0%, transparent 40%)',
  },
};

const weekly = {
  section: {
    background: '#ffffff',
    padding: '4rem 2rem',
  },
  inner: {
    maxWidth: '1100px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '2rem',
  },
  heading: {
    fontSize: '1.6rem',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 0.3rem',
  },
  sub: {
    color: '#64748b',
    margin: 0,
    fontSize: '0.95rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1.25rem',
  },
  card: {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '1.5rem',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
    cursor: 'default',
  },
  cardTop: {
    marginBottom: '0.75rem',
  },
  iconBadge: {
    width: '44px',
    height: '44px',
    borderRadius: '10px',
    background: '#dbeafe',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: '1.05rem',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 0.15rem',
  },
  cardAmharic: {
    fontSize: '0.85rem',
    color: '#64748b',
    margin: '0 0 0.5rem',
    fontStyle: 'italic',
  },
  cardDesc: {
    fontSize: '0.85rem',
    color: '#475569',
    lineHeight: 1.55,
    margin: '0 0 1rem',
  },
  cardMeta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem',
    paddingTop: '0.75rem',
    borderTop: '1px solid #f1f5f9',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
  },
  metaText: {
    fontSize: '0.78rem',
    color: '#64748b',
    fontWeight: '500',
  },
};

const cta = {
  section: {
    background: '#f0f9ff',
    padding: '3.5rem 2rem',
    borderTop: '1px solid #e0f2fe',
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
    minWidth: '280px',
  },
  heading: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 0.5rem',
  },
  sub: {
    color: '#475569',
    margin: '0 0 0.25rem',
    fontSize: '0.95rem',
    lineHeight: 1.5,
  },
  subAmharic: {
    color: '#94a3b8',
    margin: 0,
    fontSize: '0.85rem',
    fontStyle: 'italic',
  },
  buttons: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap',
  },
  primaryBtn: {
    background: '#0ea5e9',
    color: '#ffffff',
    textDecoration: 'none',
    padding: '0.7rem 1.75rem',
    borderRadius: '6px',
    fontWeight: '700',
    fontSize: '0.9rem',
  },
  secondaryBtn: {
    background: '#ffffff',
    color: '#0f172a',
    textDecoration: 'none',
    padding: '0.7rem 1.75rem',
    borderRadius: '6px',
    fontWeight: '600',
    fontSize: '0.9rem',
    border: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
  },
};
