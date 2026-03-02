import { useEffect, useState, useRef } from 'react';
import api from '../api/axios';
import Footer from '../components/Footer';

const MONTH_ABBR = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
const MONTH_FULL = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_ABBR = ['S','M','T','W','T','F','S'];

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'worship', label: 'Worship / አምልኮ' },
  { key: 'youth', label: 'Youth / ወጣቶች' },
  { key: 'outreach', label: 'Outreach / ተደራሽ' },
];

const CATEGORY_COLORS = {
  worship: '#0ea5e9',
  youth: '#8b5cf6',
  outreach: '#10b981',
  prayer: '#f59e0b',
};

const WEEKLY_GATHERINGS = [
  { name: 'Sunday Service', time: '9:00 AM' },
  { name: 'Bible Study (Wed)', time: '6:00 PM' },
  { name: 'Youth Program (Fri)', time: '5:00 PM' },
];

const FALLBACK_EVENTS = [
  {
    _id: 'f1',
    title: 'Sunday Worship Service / ጠባበት',
    titleAm: 'ጠባበት',
    description: 'Join us for a time of powerful worship and sermon. Let\'s come together to praise His name.',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 15, 9, 0).toISOString(),
    endTime: '11:30 AM',
    location: 'Main Sanctuary, Addis Ababa',
    category: 'worship',
    image: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=600&h=400&fit=crop',
    ctaLabel: 'Register / ተመዝገቡ',
  },
  {
    _id: 'f2',
    title: 'Youth Night: Faith & Future / ወጣቶች ፕሮግራም',
    titleAm: 'ወጣቶች ፕሮግራም',
    description: 'An evening of fellowship, music, and discussion about navigating life with faith.',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 20, 17, 0).toISOString(),
    endTime: '07:30 PM',
    location: 'Youth Hall, Building B',
    category: 'youth',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop',
    ctaLabel: 'Register / ተመዝገቡ',
  },
  {
    _id: 'f3',
    title: 'Community Outreach / የማህበረሰብ አገልግሎት',
    titleAm: 'አገልግሎት',
    description: 'We are visiting the local shelter to provide food and clothes. Volunteers needed.',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 28, 8, 0).toISOString(),
    endTime: '01:00 PM',
    location: 'Meeting Point: Church Parking',
    category: 'outreach',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&h=400&fit=crop',
    ctaLabel: 'Volunteer / በፈቃደኝነት',
  },
  {
    _id: 'f4',
    title: 'All Night Prayer / የሌሊት ጸሎት',
    titleAm: 'የሌሊት ጸሎት',
    description: 'Dedicated time for intercession and spiritual breakthrough.',
    date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1, 22, 0).toISOString(),
    endTime: '04:00 AM',
    location: 'Prayer Hall / የጸሎት ቤት',
    category: 'prayer',
    image: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=600&h=400&fit=crop',
    ctaLabel: 'Join Us / ይቀላቀሉን',
  },
];

const eventsPageCSS = `
@keyframes eventsHeroFadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes eventsCardSlideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes eventsBadgePop {
  0% { transform: scale(0.7); opacity: 0; }
  60% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes eventsCalendarFade {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes eventsCategoryPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(14,165,233,0.3); }
  50% { box-shadow: 0 0 0 6px rgba(14,165,233,0); }
}
@keyframes eventsTagFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}

.events-hero-content {
  animation: eventsHeroFadeIn 0.8s ease forwards;
}
.events-card-anim {
  opacity: 0;
  animation: eventsCardSlideUp 0.6s ease forwards;
}
.events-card-anim:nth-child(1) { animation-delay: 0.1s; }
.events-card-anim:nth-child(2) { animation-delay: 0.2s; }
.events-card-anim:nth-child(3) { animation-delay: 0.3s; }
.events-card-anim:nth-child(4) { animation-delay: 0.4s; }

.events-calendar-anim {
  animation: eventsCalendarFade 0.6s ease forwards;
}

.events-card-hover {
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.events-card-hover:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.12);
}

.events-cta-btn {
  transition: background 0.2s ease, transform 0.15s ease;
}
.events-cta-btn:hover {
  background: #0284c7 !important;
  transform: translateY(-1px);
}

.events-filter-btn {
  transition: all 0.2s ease;
  cursor: pointer;
}
.events-filter-btn:hover {
  border-color: #0ea5e9 !important;
  color: #0ea5e9 !important;
}

.events-tab-btn {
  transition: all 0.2s ease;
  cursor: pointer;
}
.events-tab-btn:hover {
  color: #0f172a !important;
}

.events-cat-tag {
  animation: eventsTagFloat 3s ease-in-out infinite;
}

.events-nav-arrow {
  transition: background 0.15s ease, color 0.15s ease;
  cursor: pointer;
}
.events-nav-arrow:hover {
  background: #0ea5e9 !important;
  color: #fff !important;
}

.events-cal-day {
  transition: background 0.15s ease, color 0.15s ease;
  cursor: pointer;
}
.events-cal-day:hover {
  background: #e0f2fe;
  border-radius: 50%;
}
`;

function getCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);
  return days;
}

function CalendarWidget({ currentDate, eventDays = [15] }) {
  const [calMonth, setCalMonth] = useState(currentDate.getMonth());
  const [calYear, setCalYear] = useState(currentDate.getFullYear());
  const today = new Date();
  const days = getCalendarDays(calYear, calMonth);

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); }
    else setCalMonth(calMonth - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); }
    else setCalMonth(calMonth + 1);
  };

  const isToday = (day) =>
    day === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear();

  const isEventDay = (day) => eventDays.includes(day);

  return (
    <div style={calStyles.wrapper}>
      <div style={calStyles.header}>
        <button className="events-nav-arrow" onClick={prevMonth} style={calStyles.arrow}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
        </button>
        <span style={calStyles.monthLabel}>{MONTH_FULL[calMonth]} {calYear}</span>
        <button className="events-nav-arrow" onClick={nextMonth} style={calStyles.arrow}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
        </button>
      </div>
      <div style={calStyles.dayNames}>
        {DAY_ABBR.map((d, i) => (
          <span key={i} style={calStyles.dayName}>{d}</span>
        ))}
      </div>
      <div style={calStyles.grid}>
        {days.map((day, i) => {
          const today_ = isToday(day);
          const event_ = isEventDay(day) && !today_;
          return (
            <span
              key={i}
              className={day ? 'events-cal-day' : ''}
              style={{
                ...calStyles.day,
                ...(day === null ? { visibility: 'hidden' } : {}),
                ...(today_ ? calStyles.today : {}),
                ...(event_ ? calStyles.eventDay : {}),
              }}
            >
              {day}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function WeeklyGatherings() {
  return (
    <div style={gatherStyles.wrapper}>
      <h4 style={gatherStyles.heading}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
          <rect x="3" y="4" width="18" height="18" rx="2" stroke="#0ea5e9" strokeWidth="2" fill="none"/>
          <path d="M3 10h18" stroke="#0ea5e9" strokeWidth="2"/>
          <path d="M8 2v4M16 2v4" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="8" cy="15" r="1.5" fill="#0ea5e9"/>
          <circle cx="12" cy="15" r="1.5" fill="#0ea5e9"/>
          <circle cx="16" cy="15" r="1.5" fill="#0ea5e9"/>
        </svg>
        Weekly Gatherings
      </h4>
      {WEEKLY_GATHERINGS.map((g, i) => (
        <div key={i} style={{
          ...gatherStyles.row,
          ...(i === WEEKLY_GATHERINGS.length - 1 ? { borderBottom: 'none' } : {}),
        }}>
          <span style={gatherStyles.name}>{g.name}</span>
          <span style={gatherStyles.time}>{g.time}</span>
        </div>
      ))}
    </div>
  );
}

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#0ea5e9" style={{ flexShrink: 0 }}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
  </svg>
);

const LocationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#0ea5e9" style={{ flexShrink: 0 }}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
);

function EventCard({ event, index }) {
  const d = new Date(event.date);
  const month = MONTH_ABBR[d.getMonth()];
  const day = d.getDate();
  const timeStr = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const endTime = event.endTime || '';
  const category = event.category || 'worship';
  const catColor = CATEGORY_COLORS[category] || '#0ea5e9';
  const catLabel = category.charAt(0).toUpperCase() + category.slice(1);
  const ctaLabel = event.ctaLabel || 'Register / ተመዝገቡ';
  const imgSrc = event.image
    ? (event.image.startsWith('http') ? event.image : `/uploads/${event.image}`)
    : `https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=600&h=400&fit=crop`;

  return (
    <div className="events-card-anim events-card-hover" style={cardStyles.card}>
      <div style={cardStyles.imageWrap}>
        <img src={imgSrc} alt={event.title} style={cardStyles.image} />
        <div style={cardStyles.dateBadge}>
          <span style={cardStyles.badgeMonth}>{month}</span>
          <span style={cardStyles.badgeDay}>{day}</span>
        </div>
        <span className="events-cat-tag" style={{ ...cardStyles.categoryTag, background: catColor }}>
          {catLabel}
        </span>
      </div>
      <div style={cardStyles.body}>
        <h3 style={cardStyles.title}>{event.title}</h3>
        <p style={cardStyles.desc}>{event.description}</p>
        <div style={cardStyles.metaRow}>
          <ClockIcon />
          <span style={cardStyles.metaText}>
            {timeStr}{endTime ? ` - ${endTime}` : ''}
          </span>
        </div>
        {event.location && (
          <div style={cardStyles.metaRow}>
            <LocationIcon />
            <span style={cardStyles.metaText}>{event.location}</span>
          </div>
        )}
        <button className="events-cta-btn" style={cardStyles.ctaBtn}>
          {ctaLabel} &nbsp;&rarr;
        </button>
      </div>
    </div>
  );
}

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [activeFilter, setActiveFilter] = useState('all');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const styleRef = useRef(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = eventsPageCSS;
    document.head.appendChild(style);
    styleRef.current = style;

    api.get('/events')
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setEvents(res.data.map((e, i) => ({
            ...e,
            category: e.category || ['worship', 'youth', 'outreach', 'prayer'][i % 4],
            ctaLabel: e.ctaLabel || FALLBACK_EVENTS[i % FALLBACK_EVENTS.length]?.ctaLabel,
            endTime: e.endTime || FALLBACK_EVENTS[i % FALLBACK_EVENTS.length]?.endTime,
          })));
        } else {
          setEvents(FALLBACK_EVENTS);
        }
      })
      .catch(() => setEvents(FALLBACK_EVENTS))
      .finally(() => setLoading(false));

    return () => { style.remove(); };
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) setSubscribed(true);
  };

  const now = new Date();
  const filteredEvents = events.filter((e) => {
    const isPast = new Date(e.date) < now;
    if (activeTab === 'upcoming' && isPast) return false;
    if (activeTab === 'past' && !isPast) return false;
    if (activeFilter !== 'all' && e.category !== activeFilter) return false;
    return true;
  });

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section style={heroStyles.section}>
        <div style={heroStyles.overlay} />
        <div className="events-hero-content" style={heroStyles.content}>
          <h1 style={heroStyles.title}>
            Church Events / የቤተክርስቲያን<br />ፕሮግራሞች
          </h1>
          <p style={heroStyles.scripture}>
            &ldquo;Not neglecting to meet together...&rdquo; - Hebrews 10:25
          </p>
        </div>
      </section>

      {/* ── Tabs & Filters ──────────────────────────────── */}
      <section style={filterStyles.section}>
        <div style={filterStyles.inner}>
          <div style={filterStyles.tabGroup}>
            <div style={filterStyles.tabPill}>
              <button
                className="events-tab-btn"
                onClick={() => setActiveTab('upcoming')}
                style={{
                  ...filterStyles.tab,
                  ...(activeTab === 'upcoming' ? filterStyles.tabActive : {}),
                }}
              >
                Upcoming Events
              </button>
              <button
                className="events-tab-btn"
                onClick={() => setActiveTab('past')}
                style={{
                  ...filterStyles.tab,
                  ...(activeTab === 'past' ? filterStyles.tabActive : {}),
                }}
              >
                Past Events
              </button>
            </div>
          </div>
          <div style={filterStyles.filterGroup}>
            <span style={filterStyles.filterLabel}>Filter by:</span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                className="events-filter-btn"
                onClick={() => setActiveFilter(cat.key)}
                style={{
                  ...filterStyles.filterBtn,
                  ...(activeFilter === cat.key ? filterStyles.filterActive : {}),
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main Content: Calendar + Events Grid ────────── */}
      <section style={mainStyles.section}>
        <div style={mainStyles.inner}>

          {/* Left Sidebar: Calendar + Weekly Gatherings */}
          <aside className="events-calendar-anim" style={mainStyles.sidebar}>
            <CalendarWidget currentDate={now} />
            <WeeklyGatherings />
          </aside>

          {/* Right: Events Grid */}
          <div style={mainStyles.eventsArea}>
            {loading ? (
              <p style={{ color: '#6b7280', textAlign: 'center', padding: '3rem' }}>
                Loading events...
              </p>
            ) : filteredEvents.length === 0 ? (
              <p style={{ color: '#6b7280', textAlign: 'center', padding: '3rem' }}>
                No {activeTab} events{activeFilter !== 'all' ? ` in ${activeFilter}` : ''} at this time.
              </p>
            ) : (
              <div style={mainStyles.eventsGrid}>
                {filteredEvents.map((event, i) => (
                  <EventCard key={event._id} event={event} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Stay Connected ───────────────────────────────── */}
      <section style={newsletterStyles.section}>
        <div style={newsletterStyles.inner}>
          <div style={newsletterStyles.textCol}>
            <h2 style={newsletterStyles.heading}>Stay Connected</h2>
            <p style={newsletterStyles.sub}>
              Get the latest updates on events and church news.
            </p>
          </div>
          <div style={newsletterStyles.formCol}>
            {subscribed ? (
              <p style={newsletterStyles.thanks}>Thank you for subscribing!</p>
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
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* ─── Hero Styles ──────────────────────────────────────────── */
const heroStyles = {
  section: {
    position: 'relative',
    minHeight: '340px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: "url('/hero.jpg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center top',
    color: '#fff',
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to bottom, rgba(10,20,50,0.75) 0%, rgba(10,20,50,0.68) 100%)',
  },
  content: {
    position: 'relative',
    zIndex: 1,
    textAlign: 'center',
    padding: '4.5rem 2rem',
    maxWidth: '700px',
  },
  title: {
    fontSize: 'clamp(1.75rem, 4vw, 2.6rem)',
    fontWeight: '800',
    lineHeight: 1.2,
    margin: '0 0 1.25rem',
    color: '#ffffff',
  },
  scripture: {
    fontSize: '1rem',
    color: '#94a3b8',
    margin: 0,
    fontStyle: 'italic',
    lineHeight: 1.5,
  },
};

/* ─── Filter/Tabs Styles ──────────────────────────────────── */
const filterStyles = {
  section: {
    background: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    padding: '1.5rem 2rem',
  },
  inner: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  tabGroup: {
    display: 'flex',
  },
  tabPill: {
    display: 'flex',
    background: '#f1f5f9',
    borderRadius: '8px',
    padding: '4px',
    gap: '0',
  },
  tab: {
    padding: '0.5rem 1.35rem',
    border: 'none',
    background: 'transparent',
    color: '#94a3b8',
    fontSize: '0.88rem',
    fontWeight: '500',
    cursor: 'pointer',
    outline: 'none',
    borderRadius: '6px',
    transition: 'all 0.2s ease',
  },
  tabActive: {
    background: '#ffffff',
    color: '#0f172a',
    fontWeight: '600',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  filterGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  filterLabel: {
    fontSize: '0.85rem',
    color: '#64748b',
    fontWeight: '500',
    marginRight: '0.25rem',
  },
  filterBtn: {
    padding: '0.4rem 1rem',
    border: '1px solid #e2e8f0',
    borderRadius: '20px',
    background: '#ffffff',
    color: '#64748b',
    fontSize: '0.82rem',
    fontWeight: '500',
    cursor: 'pointer',
    outline: 'none',
  },
  filterActive: {
    background: '#0ea5e9',
    color: '#ffffff',
    borderColor: '#0ea5e9',
    fontWeight: '600',
  },
};

/* ─── Main Layout Styles ──────────────────────────────────── */
const mainStyles = {
  section: {
    background: '#f8f8f8',
    padding: '2.5rem 2rem 4rem',
  },
  inner: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    gap: '2rem',
    alignItems: 'flex-start',
  },
  sidebar: {
    width: '280px',
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  eventsArea: {
    flex: 1,
    minWidth: 0,
  },
  eventsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1.5rem',
  },
};

/* ─── Calendar Styles ──────────────────────────────────────── */
const calStyles = {
  wrapper: {
    background: '#ffffff',
    borderRadius: '14px',
    padding: '1.5rem',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    border: '1px solid #f1f5f9',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    padding: '0 0.25rem',
  },
  arrow: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    border: 'none',
    background: 'transparent',
    color: '#64748b',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    outline: 'none',
    fontWeight: '600',
    lineHeight: 1,
    padding: 0,
  },
  monthLabel: {
    fontSize: '1.05rem',
    fontWeight: '700',
    color: '#0f172a',
  },
  dayNames: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    marginBottom: '0.75rem',
  },
  dayName: {
    textAlign: 'center',
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#94a3b8',
    padding: '0.25rem 0',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    rowGap: '8px',
  },
  day: {
    textAlign: 'center',
    fontSize: '0.82rem',
    color: '#374151',
    borderRadius: '50%',
    width: '34px',
    height: '34px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    fontWeight: '500',
  },
  today: {
    background: '#0ea5e9',
    color: '#ffffff',
    fontWeight: '700',
    borderRadius: '50%',
  },
  eventDay: {
    border: '2px solid #0ea5e9',
    color: '#0f172a',
    fontWeight: '600',
    borderRadius: '50%',
  },
};

/* ─── Weekly Gatherings Styles ─────────────────────────────── */
const gatherStyles = {
  wrapper: {
    background: '#e8f7fa',
    borderRadius: '14px',
    padding: '1.35rem 1.5rem',
    border: '1px solid #d1eef5',
  },
  heading: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.6rem 0',
    borderBottom: '1px solid rgba(14,165,233,0.12)',
  },
  name: {
    fontSize: '0.88rem',
    color: '#374151',
    fontWeight: '500',
  },
  time: {
    fontSize: '0.88rem',
    color: '#0f172a',
    fontWeight: '700',
  },
};

/* ─── Event Card Styles ────────────────────────────────────── */
const cardStyles = {
  card: {
    background: '#ffffff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
    border: '1px solid #f1f5f9',
  },
  imageWrap: {
    position: 'relative',
    height: '200px',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  dateBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    background: 'rgba(255,255,255,0.95)',
    borderRadius: '8px',
    padding: '6px 10px',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    minWidth: '44px',
  },
  badgeMonth: {
    display: 'block',
    fontSize: '0.6rem',
    fontWeight: '800',
    color: '#ef4444',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  badgeDay: {
    display: 'block',
    fontSize: '1.35rem',
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: 1.1,
  },
  categoryTag: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    color: '#ffffff',
    fontSize: '0.7rem',
    fontWeight: '700',
    padding: '3px 10px',
    borderRadius: '12px',
    letterSpacing: '0.03em',
    textTransform: 'capitalize',
  },
  body: {
    padding: '1.25rem',
  },
  title: {
    fontSize: '1.05rem',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 0.5rem',
    lineHeight: 1.3,
  },
  desc: {
    fontSize: '0.85rem',
    color: '#64748b',
    margin: '0 0 0.85rem',
    lineHeight: 1.55,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.4rem',
  },
  metaText: {
    fontSize: '0.82rem',
    color: '#64748b',
    fontWeight: '500',
  },
  ctaBtn: {
    width: '100%',
    padding: '0.65rem 1rem',
    background: '#0ea5e9',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.88rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '0.75rem',
    outline: 'none',
    textAlign: 'center',
  },
};

/* ─── Newsletter / Stay Connected Styles ───────────────────── */
const newsletterStyles = {
  section: {
    background: '#ffffff',
    padding: '3.5rem 2rem',
    borderTop: '1px solid #e2e8f0',
  },
  inner: {
    maxWidth: '1000px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '2rem',
    flexWrap: 'wrap',
  },
  textCol: {
    flex: 1,
  },
  heading: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 0.35rem',
  },
  sub: {
    fontSize: '0.92rem',
    color: '#64748b',
    margin: 0,
    lineHeight: 1.5,
  },
  formCol: {
    display: 'flex',
    alignItems: 'center',
  },
  form: {
    display: 'flex',
    gap: '0.5rem',
  },
  input: {
    padding: '0.65rem 1rem',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    fontSize: '0.9rem',
    background: '#f8fafc',
    color: '#0f172a',
    outline: 'none',
    width: '260px',
  },
  btn: {
    background: '#ef4444',
    color: '#fff',
    border: 'none',
    padding: '0.65rem 1.5rem',
    borderRadius: '6px',
    fontWeight: '700',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'background 0.15s ease',
  },
  thanks: {
    color: '#10b981',
    fontWeight: '600',
    fontSize: '1rem',
    margin: 0,
  },
};
