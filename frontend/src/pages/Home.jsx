import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Footer from '../components/Footer';

function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return ref;
}

const MONTH_ABBR = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

const EVENT_GRADIENTS = [
  'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
  'linear-gradient(135deg, #10b981 0%, #0ea5e9 100%)',
  'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
];

const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="mr-1.5">
    <circle cx="8" cy="8" r="8" fill="rgba(255,255,255,0.25)" />
    <polygon points="6,4.5 12,8 6,11.5" fill="white" />
  </svg>
);

export default function Home() {
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [verse, setVerse] = useState(null);

  const heroRef = useScrollReveal(0.1);
  const scriptureRef = useScrollReveal(0.2);
  const eventsRef = useScrollReveal(0.1);
  const newsletterRef = useScrollReveal(0.2);

  useEffect(() => {
    api.get('/events')
      .then((res) => setEvents(res.data.slice(0, 3)))
      .catch(() => {})
      .finally(() => setEventsLoading(false));
    api.get('/verses/today')
      .then((res) => setVerse(res.data))
      .catch(() => {});
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) setSubscribed(true);
  };

  return (
    <div className="font-[Segoe_UI,system-ui,sans-serif]">

      {/* Hero */}
      <section
        ref={heroRef}
        className="reveal-hero relative min-h-[400px] sm:min-h-[480px] md:min-h-[520px] flex items-center bg-cover bg-center-top text-white"
        style={{ backgroundImage: `url('/hero.jpg')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(10,20,50,0.72)] to-[rgba(10,20,50,0.65)]" />
        <div className="hero-glow-sweep" />
        <div className="relative z-[1] max-w-[800px] mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-18 md:py-20 text-center">
          <h1 className="hero-title text-[clamp(1.5rem,4vw,2.8rem)] font-extrabold leading-[1.25] mb-3 text-white">
            Welcome to Kerabu Full Gospel<br className="hidden sm:inline" />Believers Church
          </h1>
          <p className="hero-amharic text-base sm:text-lg text-slate-300 mb-3 italic">
            እንኳን ወደ ከራቡ ሙሉ ወንጌል አማኞች ቤተክርስቲያን በደህና መጡ
          </p>
          <p className="hero-sub text-sm sm:text-base text-slate-300 mb-6 sm:mb-8">
            A place of faith, hope, and community where everyone is welcome.
          </p>
          <div className="hero-buttons flex gap-3 sm:gap-4 justify-center flex-wrap">
            <Link
              className="hero-btn-primary bg-gradient-to-br from-sky-500 to-sky-400 text-white no-underline px-5 sm:px-8 py-3 rounded-lg font-bold text-sm sm:text-[0.95rem] relative overflow-hidden z-0 tracking-wide"
              to="/events"
            >
              Join Us This Sunday
            </Link>
            <Link
              className="hero-btn-secondary bg-white/10 border-[1.5px] border-white/45 text-white no-underline px-5 sm:px-8 py-3 rounded-lg font-semibold text-sm sm:text-[0.95rem] flex items-center relative overflow-hidden tracking-wide"
              to="/sermons"
            >
              <PlayIcon />
              Watch Sermons
            </Link>
          </div>
        </div>
      </section>

      {/* Scripture of the Day */}
      <section
        ref={scriptureRef}
        className="reveal-scripture relative overflow-hidden py-10 sm:py-14 md:py-16 px-4 sm:px-6"
        style={{ background: 'linear-gradient(180deg, #f1f5f9 0%, #fef9ef 70%, #fffbeb 100%)' }}
      >
        <div className="scripture-glow" />
        <div className="scripture-sparkles">
          <span /><span /><span /><span />
          <span /><span /><span /><span />
        </div>
        <div
          className="scripture-card-glass relative z-[1] max-w-[700px] mx-auto rounded-2xl px-5 sm:px-8 md:px-12 py-8 sm:py-10 text-center cursor-default"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(254,249,239,0.75) 30%, rgba(240,249,255,0.8) 60%, rgba(255,255,255,0.85) 100%)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1.5px solid rgba(14,165,233,0.2)',
            boxShadow: '0 4px 30px rgba(14,165,233,0.08), 0 0 40px rgba(14,165,233,0.04), inset 0 1px 0 rgba(255,255,255,0.6)',
          }}
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="scripture-dot-anim w-8 h-[3px] rounded-sm inline-block" style={{ background: 'linear-gradient(90deg, #0ea5e9, #f59e0b)', animation: 'scriptureDotPulse 3s ease-in-out infinite' }} />
            <span className="text-[0.72rem] font-bold tracking-[0.12em] uppercase bg-gradient-to-r from-sky-500 to-sky-700 bg-clip-text text-transparent">
              SCRIPTURE OF THE DAY &nbsp;|&nbsp; የዕለቱ ቃል
            </span>
            <span className="scripture-dot-anim w-8 h-[3px] rounded-sm inline-block" style={{ background: 'linear-gradient(90deg, #0ea5e9, #f59e0b)', animation: 'scriptureDotPulse 3s ease-in-out infinite' }} />
          </div>
          <div className="text-[3rem] sm:text-[4.5rem] leading-[0.8] mb-2 font-serif" style={{ animation: 'scriptureQuoteGlow 5s ease-in-out infinite' }}>&ldquo;</div>
          <blockquote className="text-lg sm:text-xl md:text-[1.4rem] font-semibold text-slate-800 leading-relaxed mb-3 font-serif tracking-wide not-italic m-0">
            "{verse?.textEnglish || 'Jesus Christ is the same yesterday and today and forever.'}"
          </blockquote>
          <div className="w-[60px] h-[2px] mx-auto my-3 rounded-sm" style={{ background: 'linear-gradient(90deg, transparent, #f59e0b, transparent)' }} />
          {(verse?.textAmharic) && (
            <p className="text-sm sm:text-base text-slate-600 mb-5 italic leading-relaxed">
              "{verse.textAmharic}"
            </p>
          )}
          <p className="m-0 text-center">
            <span className="inline-block text-[0.78rem] font-semibold text-sky-700 bg-sky-500/8 border border-sky-500/15 rounded-full px-4 py-1.5 tracking-wide">
              {verse?.referenceEnglish || 'Hebrews 13:8'}
              {(verse?.referenceAmharic) ? ` \u00A0|\u00A0 ${verse.referenceAmharic}` : ''}
            </span>
          </p>
        </div>
      </section>

      {/* Upcoming Events */}
      <section
        ref={eventsRef}
        className="reveal-events relative overflow-hidden py-10 sm:py-14 md:py-16 px-4 sm:px-6"
        style={{ background: 'linear-gradient(180deg, #fffbeb 0%, #fff7ed 30%, #ffffff 100%)' }}
      >
        <div className="home-light-rays" />
        <div className="home-sparkles">
          <span /><span /><span /><span /><span />
          <span /><span /><span /><span /><span />
          <span /><span /><span /><span /><span />
        </div>
        <div className="relative z-[1] max-w-[1100px] mx-auto">
          <div className="events-header-anim flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2 mb-6 sm:mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-[1.75rem] font-bold text-slate-900 mb-1">Upcoming Events</h2>
              <p className="text-slate-500 m-0 text-sm sm:text-[0.95rem]">የቅርብ ጊዜ መርሃ ግብሮች</p>
            </div>
            <Link to="/events" className="text-sky-500 no-underline font-semibold text-sm whitespace-nowrap">View All Events &rarr;</Link>
          </div>

          {eventsLoading ? (
            <p className="text-gray-500 text-center py-8">Loading events…</p>
          ) : events.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No upcoming events at this time.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
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
                    <div className="events-card-inner bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] border border-[#e8ecf1]">
                      <div className="events-card-top-accent" />
                      <div className="relative h-[180px] sm:h-[200px] overflow-hidden">
                        {imgSrc ? (
                          <img className="events-card-img w-full h-full object-cover block" src={imgSrc} alt={event.title} />
                        ) : (
                          <div className="events-card-img w-full h-full" style={{ background: EVENT_GRADIENTS[i % 3] }} />
                        )}
                        <div className="events-card-overlay" />
                        <div className="events-badge-wrap absolute top-3.5 left-3.5 bg-white rounded-[10px] px-3 py-[7px] text-center shadow-[0_4px_14px_rgba(0,0,0,0.12)] min-w-[48px] z-[2]">
                          <span className="block text-[0.6rem] font-extrabold text-red-500 tracking-widest uppercase leading-snug">{month}</span>
                          <span className="block text-2xl font-extrabold text-slate-900 leading-none">{isMultiDay ? `${day}–${endRaw.getDate()}` : day}</span>
                        </div>
                      </div>
                      <div className="p-4 sm:p-5">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="events-meta-icon">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="#0ea5e9" className="shrink-0">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
                            </svg>
                          </span>
                          <span className="text-[0.84rem] text-slate-600 font-medium">{timeDisplay}</span>
                        </div>
                        <h3 className="text-base sm:text-[1.08rem] font-bold text-slate-900 mb-2 leading-snug">{event.title}</h3>
                        <p className="text-[0.86rem] text-slate-500 mb-4 leading-relaxed line-clamp-2">{event.description}</p>
                        {event.location && (
                          <div className="flex items-center gap-2 mb-2">
                            <span className="events-meta-icon">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="#0ea5e9" className="shrink-0">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                              </svg>
                            </span>
                            <span className="text-[0.84rem] text-slate-600 font-medium">{event.location}</span>
                          </div>
                        )}
                        <Link to="/events" className="text-sky-500 no-underline text-[0.88rem] font-semibold hover:text-sky-600 transition-colors">Learn More &rsaquo;</Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Stay Connected */}
      <section ref={newsletterRef} className="reveal-newsletter bg-[#1e3a5f] py-10 sm:py-14 px-4 sm:px-6">
        <div className="max-w-[900px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-1.5">Stay Connected with Kerabu</h2>
            <p className="text-slate-400 m-0 text-sm sm:text-[0.95rem]">Get updates on services, events, and prayer requests.</p>
          </div>
          {subscribed ? (
            <p className="text-green-400 font-semibold text-base">Thank you for subscribing! ✓</p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2 flex-wrap justify-center md:justify-end w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="px-4 py-2.5 border border-slate-700 rounded-md text-sm sm:text-[0.95rem] bg-white text-slate-900 outline-none w-full sm:w-[240px]"
              />
              <button type="submit" className="bg-sky-500 text-white border-none px-6 py-2.5 rounded-md font-bold text-sm sm:text-[0.95rem] cursor-pointer hover:bg-sky-600 transition-colors w-full sm:w-auto">
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
