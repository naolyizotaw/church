import { useEffect, useState, useRef } from 'react';
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

const CTA_FLOAT_SHAPES = [
  { symbol: '✝', left: '10%', delay: '0s', duration: '9s' },
  { symbol: '🕊', left: '25%', delay: '2s', duration: '11s' },
  { symbol: '✝', left: '45%', delay: '4s', duration: '8s' },
  { symbol: '🕊', left: '62%', delay: '1s', duration: '10s' },
  { symbol: '✝', left: '78%', delay: '3s', duration: '9.5s' },
  { symbol: '🕊', left: '92%', delay: '5s', duration: '12s' },
];

const CTA_FLOAT_SPARKLES = Array.from({ length: 16 }, () => ({
  left: `${Math.random() * 100}%`,
  delay: `${Math.random() * 6}s`,
  duration: `${3 + Math.random() * 4}s`,
  size: `${2 + Math.random() * 3}px`,
}));

const FALLBACK_PROGRAMS = [
  { _id: 'f1', title: 'Youth Aflame Ministry', titleAmharic: 'ወጣት አገልግሎት', description: 'A vibrant community for young people to explore their faith, ask tough questions, and build lasting friendships.', icon: 'youth', day: 'Fridays', time: '6:00 PM', location: 'Youth Hall', category: 'youth' },
  { _id: 'f2', title: 'Intercessory Prayer', titleAmharic: 'የምልጃ ጸሎት', description: 'Join us as we stand in the gap for our church, our nation, and the world. Power in unity and prayer.', icon: 'prayer', day: 'Wednesdays', time: '6:00 PM', location: 'Prayer Room', category: 'prayer' },
  { _id: 'f3', title: 'Deep Dive Bible Study', titleAmharic: 'የመጽሐፍ ቅዱስ ጥናት', description: 'Explore the depths of scripture with detailed exposition and group discussions. Available online via Zoom.', icon: 'bible-study', day: 'Thursdays', time: '7:00 PM', location: 'Zoom', category: 'bible-study' },
  { _id: 'f4', title: 'Kids Kingdom', titleAmharic: 'ህፃናት አገልግሎት', description: 'Fun, safe, and biblical learning environment for children ages 3-12 during the main service.', icon: 'children', day: 'Sundays', time: '10:30 AM', location: 'Kids Hall', category: 'children' },
  { _id: 'f5', title: 'Women of Faith', titleAmharic: 'የእምነት አገልግሎት', description: 'Empowering women to grow in Christ and support one another through fellowship and mentoring.', icon: 'women', day: 'Saturdays', time: '4:00 PM', location: 'Fellowship Hall', category: 'women' },
  { _id: 'f6', title: 'Choir Practice', titleAmharic: 'የመዘምራን ልምምድ', description: 'Preparing our hearts and voices to lead the congregation in worship. Open to auditions.', icon: 'choir', day: 'Tuesdays', time: '6:00 PM', location: 'Music Room', category: 'choir' },
];

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const MapPinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const GridViewIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const ListViewIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
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
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const HeartIcon = ({ color = '#0ea5e9' }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const ICON_CYAN = '#34C9E0';
const BADGE_PALE = '#E0F7FA';

/* Three figures interconnected in circle — community/unity */
const YouthAflameIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill={ICON_CYAN}>
    <circle cx="12" cy="9" r="2.5" />
    <path d="M8 19c0-2.2 1.8-4 4-4s4 1.8 4 4" />
    <path d="M9 13l-2-1.5" />
    <path d="M15 13l2-1.5" />
    <path d="M12 7l0-1.5" />
    <circle cx="6.5" cy="10.5" r="2" />
    <path d="M5 17c0-1 .8-2 1.8-2.2" />
    <circle cx="17.5" cy="10.5" r="2" />
    <path d="M19 17c0-1-.8-2-1.8-2.2" />
  </svg>
);

/* Upward-facing hand cupping heart */
const PrayerHandsIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill={ICON_CYAN}>
    <path d="M12 4.2c0-1.1-.9-2-2-2s-2 .9-2 2c0 .6.3 1.2.8 1.5" />
    <path d="M6.5 11v-1c0-.5.4-1 1-1s1 .5 1 1v1" />
    <path d="M9.5 11V8.5c0-.5.4-1 1-1s1 .5 1 1V11" />
    <path d="M12.5 11V7c0-.5.4-1 1-1s1 .5 1 1v4" />
    <path d="M15.5 11V8.5c0-.5.4-1 1-1s1 .5 1 1v6c0 2.2-1.8 4-4 4h-1c-2.2 0-4-1.8-4-4v-2c0-.5.4-1 1-1s1 .5 1 1v1" />
    <path d="M12 2.5c-.6-.7-1.5-.7-2.1 0-.3.4-.5.8-.5 1.2 0 .4.2.8.5 1l1.6 1.6 1.6-1.6c.3-.2.5-.6.5-1 0-.4-.2-.8-.5-1.2-.6-.7-1.5-.7-2.1 0z" />
  </svg>
);

/* Open bible — spine at bottom, two pages spread, text lines on left page */
const BibleStudyIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill={ICON_CYAN}>
    <path d="M5 18V7c0-.6.4-1 1-1l5-1v14l-5-1c-.6 0-1-.4-1-1z" />
    <path d="M19 18V7c0-.6-.4-1-1-1l-5-1v14l5-1c.6 0 1-.4 1-1z" />
    <path d="M12 5v14" stroke="white" strokeWidth="0.6" strokeOpacity="0.5" fill="none" />
    <path d="M7.5 9.5h3.5M7.5 11.5h3.5M7.5 13.5h2.5" stroke={ICON_CYAN} strokeWidth="0.5" strokeOpacity="0.8" />
    <path d="M12 4V3c0-.5.4-1 1-1s1 .5 1 1v1" />
  </svg>
);

const KidsCrownIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={ICON_CYAN} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <circle cx="9" cy="10.5" r="1.1" fill={ICON_CYAN} stroke="none" />
    <circle cx="15" cy="10.5" r="1.1" fill={ICON_CYAN} stroke="none" />
    <path d="M8.5 14.5c.8 1.5 2 2.2 3.5 2.2s2.7-.7 3.5-2.2" />
  </svg>
);

const WomenFaithIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={ICON_CYAN} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="9" r="5" />
    <line x1="12" y1="14" x2="12" y2="22" />
    <line x1="9" y1="18" x2="15" y2="18" />
  </svg>
);

const ChoirNoteIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill={ICON_CYAN}>
    <ellipse cx="8" cy="18" rx="3" ry="2.2" />
    <rect x="10.5" y="5" width="1.5" height="13" />
    <path d="M12 5c2.5 1.2 5 3.5 5 6h-1.5c0-2-2-3.8-3.5-4.8V5z" />
  </svg>
);

const MINISTRY_ICONS = {
  youth: YouthAflameIcon,
  prayer: PrayerHandsIcon,
  'bible-study': BibleStudyIcon,
  children: KidsCrownIcon,
  women: WomenFaithIcon,
  choir: ChoirNoteIcon,
};

function MinistryIcon({ icon, category }) {
  const key = icon || category || 'other';
  const IconComponent = MINISTRY_ICONS[key] || KidsCrownIcon;
  return <IconComponent />;
}

export default function Services() {
  const [mainService, setMainService] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [weeklyVisible, setWeeklyVisible] = useState(false);
  const [sundayVisible, setSundayVisible] = useState(false);
  const weeklyRef = useRef(null);
  const sundayRef = useRef(null);

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setWeeklyVisible(true);
      },
      { threshold: 0.15 }
    );
    if (weeklyRef.current) observer.observe(weeklyRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setSundayVisible(true);
      },
      { threshold: 0.15 }
    );
    if (sundayRef.current) observer.observe(sundayRef.current);
    return () => observer.disconnect();
  }, []);

  const service = mainService || FALLBACK_MAIN_SERVICE;
  const displayPrograms = programs.length > 0 ? programs : FALLBACK_PROGRAMS;

  return (
    <div className="w-full overflow-x-hidden" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <style>{pageCSS}</style>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section
        className="relative min-h-[420px] w-full flex items-center justify-center bg-cover bg-top text-white"
        style={{ backgroundImage: `url('/hero.jpg')` }}
      >
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(10,20,50,0.72) 0%, rgba(10,20,50,0.68) 100%)' }} />
        <div className="relative z-10 w-full max-w-[900px] mx-auto px-4 sm:px-8 py-14 md:py-18 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-1 text-white italic">
            Worship & Community
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 mb-4 italic">አምልኮ እና ህብረት</p>
          <div className="w-[60px] h-[3px] bg-sky-500 mx-auto mb-4 rounded-sm" />
          <p className="text-sm sm:text-base text-slate-200 mb-1">
            Hebrews 10:25 - Experiencing God's presence together.
          </p>
          <p className="text-sm text-slate-400 mb-8 italic">
            ዕብራውያን 10:25 - የእግዚአብሔርን ሕልውና አንድ ላይ ማግኘት።
          </p>
          <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
            <a
              href="#sunday-service"
              className="hero-primary-btn bg-sky-500 text-white no-underline px-5 sm:px-7 py-2.5 sm:py-3 rounded-md font-bold text-sm flex items-center"
            >
              <PlayIcon />
              <span className="ml-2">Watch Live Stream</span>
            </a>
            <Link
              to="/events"
              className="hero-secondary-btn border-[1.5px] border-white/40 bg-white/10 text-white no-underline px-5 sm:px-7 py-2.5 sm:py-3 rounded-md font-semibold text-sm flex items-center"
            >
              <CalendarIcon />
              <span className="ml-2">Upcoming Events</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Sunday Service ───────────────────────────────── */}
      <section
        id="sunday-service"
        ref={sundayRef}
        className={`${sundayVisible ? 'sunday-visible' : ''} bg-slate-50 w-full py-12 sm:py-16 px-4 sm:px-6 lg:px-16`}
      >
        <div className="w-full max-w-[1600px] mx-auto px-2 sm:px-4">
          <div className="flex items-center gap-2 mb-6">
            <ChurchIcon />
            <h2 className="sunday-heading text-xl sm:text-2xl font-bold text-slate-900 m-0">Sunday Service</h2>
          </div>
          <div className="sunday-underline w-12 h-[3px] rounded-sm mb-6" style={{ background: 'linear-gradient(90deg, #0ea5e9, #38bdf8)' }} />

          <div className="service-main-card bg-white rounded-[14px] overflow-hidden border border-slate-200 grid grid-cols-1 md:grid-cols-2" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.08), 0 0 24px rgba(14,165,233,0.1), 0 0 48px rgba(14,165,233,0.05)' }}>
            <div className="p-5 sm:p-8 lg:p-10 flex flex-col justify-center">
              <span className="sunday-badge inline-flex items-center gap-1.5 text-sky-500 text-[0.68rem] font-extrabold tracking-widest px-3.5 py-1 rounded-full mb-3 w-fit border border-sky-500/15" style={{ background: 'linear-gradient(135deg, #eff6ff, #e0f2fe)' }}>
                <span className="w-[7px] h-[7px] rounded-full bg-sky-500 shrink-0" />
                MAIN EVENT
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1">{service.title}</h3>
              {service.titleAmharic && (
                <p className="text-base text-slate-500 mb-4 italic">{service.titleAmharic}</p>
              )}
              <p className="text-sm text-slate-600 leading-relaxed mb-2">{service.description}</p>
              {service.descriptionAmharic && (
                <p className="text-[0.85rem] text-slate-400 leading-relaxed mb-6 italic">{service.descriptionAmharic}</p>
              )}

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-6 py-4 border-y border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="sunday-meta-icon"><ClockIcon /></span>
                  <div className="flex flex-col">
                    <span className="text-[0.65rem] font-bold text-slate-400 tracking-wide">TIME</span>
                    <span className="text-sm font-semibold text-slate-900">
                      {service.time}{service.endTime ? ` - ${service.endTime}` : ''}
                    </span>
                  </div>
                </div>
                <div className="sunday-divider hidden sm:block w-px h-8" style={{ background: 'linear-gradient(to bottom, transparent, #0ea5e9, transparent)' }} />
                <div className="flex items-center gap-2">
                  <span className="sunday-meta-icon" style={{ animationDelay: '0.5s' }}><MapPinIcon /></span>
                  <div className="flex flex-col">
                    <span className="text-[0.65rem] font-bold text-slate-400 tracking-wide">LOCATION</span>
                    <span className="text-sm font-semibold text-slate-900">{service.location || 'Main Sanctuary'}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link to="/contact" className="sunday-plan-btn bg-sky-500 text-white no-underline px-5 sm:px-6 py-2.5 rounded-md font-bold text-sm">Plan Your Visit</Link>
                <a
                  href="https://maps.google.com/?q=Kerabu+Full+Gospel+Church+Addis+Ababa"
                  target="_blank"
                  rel="noreferrer"
                  className="sunday-directions-btn flex items-center bg-transparent text-slate-600 no-underline px-3 sm:px-4 py-2.5 rounded-md border border-slate-200 font-semibold text-sm"
                >
                  <DirectionsArrowIcon />
                  <span className="ml-1.5">Get Directions</span>
                </a>
              </div>
            </div>

            <div className="relative min-h-[240px] sm:min-h-[320px] overflow-hidden">
              <img
                src="/hero.jpg"
                alt="Sunday Service Worship"
                className="sunday-image w-full h-full object-cover block"
              />
              <div className="sunday-image-overlay absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(255,255,255,0.08) 0%, transparent 40%)' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Weekly Ministries / Programs ─────────────────── */}
      <section ref={weeklyRef} className="w-full py-12 sm:py-16 px-4 sm:px-6 lg:px-16" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)' }}>
        <div className="w-full max-w-[1600px] mx-auto px-2 sm:px-4">
          <div className="mb-8 flex flex-wrap items-start justify-between gap-4 sm:gap-6">
            <div>
              <h2 className={`${weeklyVisible ? 'weekly-header-visible' : ''} text-xl sm:text-2xl font-bold text-slate-900 mb-1`}>Weekly Ministries</h2>
              <div className={`${weeklyVisible ? 'weekly-underline-visible' : ''} w-12 h-[3px] bg-sky-500 rounded-sm mt-2 origin-left scale-x-0`} />
              <p className={`${weeklyVisible ? 'weekly-sub-visible' : ''} text-slate-500 mt-2 text-sm sm:text-base`}>Connect, grow and serve throughout the week.</p>
            </div>
            {!loading && (
              <div className="weekly-view-toggle flex gap-1">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-2 border rounded-lg cursor-pointer transition-all duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-sky-500 text-white border-sky-500'
                      : 'bg-white text-slate-500 border-slate-200'
                  }`}
                  aria-label="Grid view"
                >
                  <GridViewIcon />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-2 border rounded-lg cursor-pointer transition-all duration-200 ${
                    viewMode === 'list'
                      ? 'bg-sky-500 text-white border-sky-500'
                      : 'bg-white text-slate-500 border-slate-200'
                  }`}
                  aria-label="List view"
                >
                  <ListViewIcon />
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <p className="text-slate-500 text-center p-8">Loading programs...</p>
          ) : (
            <div className={
              viewMode === 'list'
                ? 'flex flex-col gap-4'
                : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5'
            }>
              {displayPrograms.map((prog, idx) => (
                <div
                  key={prog._id}
                  className={`program-card ${weeklyVisible ? 'program-card-visible' : ''} rounded-xl p-4 sm:p-6 border border-slate-200 cursor-default ${
                    viewMode === 'list' ? 'flex flex-row items-center gap-4 sm:gap-6 !p-4 sm:!px-6 sm:!py-5' : ''
                  }`}
                  style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    boxShadow: '0 1px 6px rgba(0,0,0,0.04), 0 0 24px rgba(14,165,233,0.1), 0 0 48px rgba(14,165,233,0.05)',
                    transitionDelay: weeklyVisible ? `${idx * 80}ms` : undefined,
                  }}
                >
                  <div className={viewMode === 'list' ? '' : 'mb-3'}>
                    <div
                      className="program-icon-badge w-11 h-11 rounded-[10px] flex items-center justify-center"
                      style={{ background: BADGE_PALE, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
                    >
                      <MinistryIcon icon={prog.icon} category={prog.category} />
                    </div>
                  </div>
                  <div className={viewMode === 'list' ? 'flex-1 flex flex-col gap-1' : ''}>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-0.5">{prog.title}</h3>
                    {prog.titleAmharic && (
                      <p className="text-sm text-slate-500 mb-2 italic">{prog.titleAmharic}</p>
                    )}
                    <p className="text-sm text-slate-600 leading-relaxed mb-4">{prog.description}</p>
                    <div className="program-meta flex flex-wrap gap-2 sm:gap-3 pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <CalendarIcon />
                        <span className="text-xs text-slate-500 font-medium">{prog.day}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <ClockIcon />
                        <span className="text-xs text-slate-500 font-medium">{prog.time}</span>
                      </div>
                      {prog.location && (
                        <div className="flex items-center gap-1.5">
                          <MapPinIcon />
                          <span className="text-xs text-slate-500 font-medium">{prog.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA: New Here / Prayer ───────────────────────── */}
      <section className="w-full py-14 sm:py-16 px-4 sm:px-6 lg:px-16 bg-white">
        <div
          className="relative w-full max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-10 py-10 sm:py-12 rounded-2xl overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #bae6fd 0%, #e0f2fe 40%, #f0f9ff 100%)' }}
        >
          <div className="cta-rays-bg" />
          <div className="cta-float-shapes">
            {CTA_FLOAT_SHAPES.map((s, i) => (
              <span
                key={i}
                className="cta-float-shape"
                style={{ left: s.left, animationDelay: s.delay, animationDuration: s.duration }}
              >
                {s.symbol}
              </span>
            ))}
          </div>
          <div className="cta-float-sparkles">
            {CTA_FLOAT_SPARKLES.map((s, i) => (
              <span
                key={i}
                className="cta-float-sparkle"
                style={{
                  left: s.left,
                  width: s.size,
                  height: s.size,
                  animationDelay: s.delay,
                  animationDuration: s.duration,
                }}
              />
            ))}
          </div>
          <div className="absolute top-0 right-0 w-[45%] h-full text-sky-500 pointer-events-none" aria-hidden="true">
            <svg viewBox="0 0 200 120" fill="currentColor" className="w-full h-full opacity-[0.06]">
              <ellipse cx="140" cy="55" rx="18" ry="22" />
              <path d="M125 95c0-8 7-15 15-15s15 7 15 15" />
              <ellipse cx="100" cy="50" rx="22" ry="26" />
              <path d="M82 98c0-10 9-18 18-18s18 8 18 18" />
              <ellipse cx="165" cy="58" rx="14" ry="18" />
              <path d="M153 92c0-6 5-12 12-12s12 6 12 12" />
            </svg>
          </div>
          <div className="relative z-10 w-full flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 flex-wrap">
            <div className="flex-1 min-w-[240px] sm:min-w-[280px]">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">New Here? Need Prayer?</h2>
              <p className="text-slate-600 mb-1 text-sm sm:text-base leading-relaxed">
                We would love to connect with you. Plan a visit or send us your prayer request.
              </p>
              <p className="text-slate-500 text-sm leading-relaxed">
                አዲስ ነዎት? ጸሎት ይፈልጋሉ? ከእርስዎ ጋር መገናኘት እንወዳለን።
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/contact" className="cta-primary-btn bg-sky-500 text-white no-underline px-5 sm:px-7 py-3 rounded-lg font-bold text-sm">I'm New Here</Link>
              <Link to="/contact" className="cta-secondary-btn bg-white text-slate-700 no-underline px-5 sm:px-7 py-3 rounded-lg font-semibold text-sm border border-slate-300 flex items-center">
                <HeartIcon />
                <span className="ml-2">Prayer Request</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full h-px" style={{ background: 'linear-gradient(90deg, transparent 5%, #e2e8f0 30%, #e2e8f0 70%, transparent 95%)' }} />

      <Footer />
    </div>
  );
}

/* ─── CSS Animations ─────────────────────────────────────── */

const pageCSS = `
  /* ── Sunday Service card ── */
  .service-main-card {
    transition: box-shadow 0.4s ease, transform 0.4s ease;
    opacity: 0;
    transform: translateY(30px) scale(0.98);
    position: relative;
    overflow: hidden;
  }
  .sunday-visible .service-main-card {
    opacity: 1;
    transform: translateY(0) scale(1);
    transition: opacity 0.7s ease 0.2s, transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s, box-shadow 0.4s ease;
  }
  .service-main-card:hover {
    box-shadow: 0 12px 40px rgba(14,165,233,0.15),
                0 0 48px rgba(14,165,233,0.1),
                0 0 80px rgba(14,165,233,0.05) !important;
    transform: translateY(-4px) scale(1.005);
  }
  .service-main-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, #0ea5e9, #38bdf8, #0ea5e9, transparent);
    background-size: 200% 100%;
    border-radius: 14px 14px 0 0;
    animation: topLinePulse 3s ease-in-out infinite;
    z-index: 2;
  }
  .service-main-card::after {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 60%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(14,165,233,0.03) 30%,
      rgba(255,255,255,0.12) 50%,
      rgba(14,165,233,0.03) 70%,
      transparent 100%
    );
    animation: shimmerSweep 6s ease-in-out infinite;
    pointer-events: none;
    z-index: 1;
  }

  /* ── Sunday heading ── */
  .sunday-heading {
    opacity: 0;
    transform: translateY(12px);
  }
  .sunday-visible .sunday-heading {
    animation: weeklyHeaderFade 0.6s ease forwards;
  }
  .sunday-underline {
    transform: scaleX(0);
    transform-origin: left;
  }
  .sunday-visible .sunday-underline {
    animation: weeklyUnderline 0.6s ease 0.2s forwards;
  }

  /* ── Ken Burns on image ── */
  .sunday-image {
    animation: kenBurns 20s ease-in-out infinite alternate;
  }
  @keyframes kenBurns {
    0%   { transform: scale(1) translate(0, 0); }
    100% { transform: scale(1.08) translate(-1.5%, -1%); }
  }
  .sunday-image-overlay {
    animation: overlayShift 10s ease-in-out infinite alternate;
  }
  @keyframes overlayShift {
    0%   { background: linear-gradient(to right, rgba(255,255,255,0.06) 0%, rgba(14,165,233,0.08) 100%); }
    100% { background: linear-gradient(to right, rgba(14,165,233,0.06) 0%, rgba(15,23,42,0.1) 100%); }
  }

  /* ── Badge pulse ── */
  .sunday-badge {
    animation: badgePulse 2.5s ease-in-out infinite;
  }
  @keyframes badgePulse {
    0%, 100% { transform: scale(1); box-shadow: 0 0 0 rgba(14,165,233,0); }
    50%      { transform: scale(1.05); box-shadow: 0 0 12px rgba(14,165,233,0.18); }
  }

  /* ── Button hovers ── */
  .sunday-plan-btn {
    transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
  }
  .sunday-plan-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 20px rgba(14,165,233,0.35);
    background: #0284c7 !important;
  }
  .sunday-directions-btn {
    transition: border-color 0.25s ease, color 0.25s ease, transform 0.25s ease;
  }
  .sunday-directions-btn:hover {
    border-color: #0ea5e9 !important;
    color: #0ea5e9 !important;
    transform: translateX(3px);
  }
  .sunday-directions-btn:hover svg {
    transform: translateX(2px);
    transition: transform 0.25s ease;
  }

  /* ── Meta icon breathing ── */
  .sunday-meta-icon {
    display: inline-flex;
    animation: metaIconPulse 3s ease-in-out infinite;
  }
  @keyframes metaIconPulse {
    0%, 100% { transform: scale(1); opacity: 0.85; }
    50%      { transform: scale(1.15); opacity: 1; }
  }
  .sunday-divider {
    transition: background 0.3s ease;
  }

  /* ── Hero button animations ── */
  @keyframes heroBtnPulse {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(14,165,233,0.6),
                  0 4px 16px rgba(14,165,233,0.3);
    }
    50% {
      box-shadow: 0 0 0 10px rgba(14,165,233,0),
                  0 4px 22px rgba(14,165,233,0.4);
    }
  }
  @keyframes heroBtnShimmer {
    0% { left: -100%; }
    100% { left: 200%; }
  }
  .hero-primary-btn {
    position: relative;
    overflow: hidden;
    animation: heroBtnPulse 2.5s ease-in-out infinite;
    transition: transform 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
  }
  .hero-primary-btn::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 60%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    pointer-events: none;
    animation: heroBtnShimmer 3s ease-in-out infinite;
  }
  .hero-primary-btn:hover {
    transform: scale(1.06);
    background: #0284c7 !important;
    box-shadow: 0 6px 28px rgba(14,165,233,0.5);
  }
  .hero-primary-btn:hover svg {
    transform: scale(1.2);
    transition: transform 0.25s ease;
  }
  .hero-secondary-btn {
    position: relative;
    overflow: hidden;
    transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
  }
  .hero-secondary-btn::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 60%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
    pointer-events: none;
    animation: heroBtnShimmer 4s ease-in-out 1.5s infinite;
  }
  .hero-secondary-btn:hover {
    transform: scale(1.06);
    background: rgba(255,255,255,0.18) !important;
    border-color: rgba(255,255,255,0.7) !important;
    box-shadow: 0 4px 20px rgba(255,255,255,0.12);
  }
  .hero-secondary-btn:hover svg {
    transform: scale(1.15);
    transition: transform 0.25s ease;
  }

  /* ── CTA button animations ── */
  @keyframes ctaPrimaryPulse {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(14,165,233,0.5),
                  0 4px 15px rgba(14,165,233,0.25);
    }
    50% {
      box-shadow: 0 0 0 10px rgba(14,165,233,0),
                  0 4px 20px rgba(14,165,233,0.35);
    }
  }
  @keyframes ctaBtnShimmer {
    0% { left: -100%; }
    100% { left: 200%; }
  }
  .cta-primary-btn {
    position: relative;
    overflow: hidden;
    animation: ctaPrimaryPulse 2.5s ease-in-out infinite;
    transition: transform 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
  }
  .cta-primary-btn::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 60%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    pointer-events: none;
    animation: ctaBtnShimmer 3s ease-in-out infinite;
  }
  .cta-primary-btn:hover {
    transform: scale(1.06);
    background: #0284c7 !important;
    box-shadow: 0 6px 24px rgba(14,165,233,0.4);
  }
  .cta-secondary-btn {
    position: relative;
    overflow: hidden;
    transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
  }
  .cta-secondary-btn::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 60%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(14,165,233,0.08), transparent);
    pointer-events: none;
    animation: ctaBtnShimmer 4s ease-in-out 1.5s infinite;
  }
  .cta-secondary-btn:hover {
    transform: scale(1.06);
    border-color: #0ea5e9 !important;
    box-shadow: 0 4px 20px rgba(14,165,233,0.2);
    background: #f0f9ff !important;
  }
  .cta-secondary-btn:hover svg {
    transform: scale(1.15);
    transition: transform 0.25s ease;
  }

  /* ── CTA floating animations ── */
  @keyframes ctaFloatShape {
    0% { transform: translateY(0) rotate(0deg); opacity: 0; }
    15% { opacity: 0.12; }
    85% { opacity: 0.08; }
    100% { transform: translateY(-180px) rotate(20deg); opacity: 0; }
  }
  @keyframes ctaSparkle {
    0% { transform: translateY(0) scale(1); opacity: 0; }
    15% { opacity: 0.8; }
    85% { opacity: 0.6; }
    100% { transform: translateY(-90px) scale(0); opacity: 0; }
  }
  @keyframes ctaRays {
    0%, 100% { opacity: 0.03; transform: scale(1) rotate(0deg); }
    50% { opacity: 0.08; transform: scale(1.06) rotate(2deg); }
  }
  .cta-float-shapes {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
  }
  .cta-float-shape {
    position: absolute;
    bottom: -20px;
    color: #0ea5e9;
    font-size: 1.6rem;
    animation: ctaFloatShape linear infinite;
    pointer-events: none;
    user-select: none;
  }
  .cta-float-sparkles {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
  }
  .cta-float-sparkle {
    position: absolute;
    bottom: 0;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(14,165,233,0.6), transparent);
    animation: ctaSparkle linear infinite;
  }
  .cta-rays-bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(ellipse at center, rgba(14,165,233,0.06) 0%, transparent 70%);
    animation: ctaRays 6s ease-in-out infinite;
  }

  .program-card {
    opacity: 0;
    transform: translateY(24px) scale(0.98);
    transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
                box-shadow 0.3s ease,
                opacity 0.4s ease,
                border-color 0.3s ease,
                background 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  .program-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, #0ea5e9, #38bdf8, #0ea5e9, transparent);
    background-size: 200% 100%;
    border-radius: 12px 12px 0 0;
    animation: topLinePulse 3s ease-in-out infinite;
  }
  .program-card::after {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 60%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(14,165,233,0.04) 30%,
      rgba(255,255,255,0.15) 50%,
      rgba(14,165,233,0.04) 70%,
      transparent 100%
    );
    animation: shimmerSweep 5s ease-in-out infinite;
    pointer-events: none;
  }
  @keyframes topLinePulse {
    0%, 100% { background-position: 0% 50%; opacity: 0.5; }
    50% { background-position: 200% 50%; opacity: 1; }
  }
  @keyframes shimmerSweep {
    0% { left: -100%; }
    40% { left: 150%; }
    100% { left: 150%; }
  }
  .program-card-visible {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  .program-card:hover {
    transform: translateY(-8px) scale(1.02) rotate(1deg);
    box-shadow: 0 12px 32px rgba(14,165,233,0.15),
                0 0 0 1px rgba(14,165,233,0.2),
                0 0 40px rgba(14,165,233,0.12),
                0 0 80px rgba(14,165,233,0.06) !important;
  }
  .program-card:hover .program-icon-badge {
    transform: scale(1.1);
    background: #7dd3fc !important;
    box-shadow: 0 0 20px rgba(14,165,233,0.4),
                0 0 40px rgba(14,165,233,0.2) !important;
    animation: none;
  }
  .program-icon-badge {
    transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
    animation: iconGlowPulse 3s ease-in-out infinite;
  }
  @keyframes iconGlowPulse {
    0%, 100% { box-shadow: 0 0 12px rgba(14,165,233,0.15); }
    50% { box-shadow: 0 0 18px rgba(14,165,233,0.25); }
  }
  .program-meta svg {
    transition: stroke 0.25s ease, color 0.25s ease;
  }
  .program-card:hover .program-meta svg {
    stroke: #0284c7 !important;
  }
  .weekly-header-visible {
    animation: weeklyHeaderFade 0.6s ease forwards;
  }
  .weekly-underline-visible {
    animation: weeklyUnderline 0.6s ease 0.2s forwards;
  }
  .weekly-sub-visible {
    opacity: 0;
    animation: weeklyHeaderFade 0.6s ease 0.15s forwards;
  }
  @keyframes weeklyHeaderFade {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes weeklyUnderline {
    from { transform: scaleX(0); }
    to { transform: scaleX(1); }
  }
  .weekly-view-toggle button:hover {
    opacity: 0.9;
  }
`;
