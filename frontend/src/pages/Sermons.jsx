import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Footer from '../components/Footer';

const pageCSS = `
@keyframes sermonFadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes heroTextIn {
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes mosaicDrift {
  0% { transform: scale(1.05) translate(0, 0); }
  50% { transform: scale(1.08) translate(-1.5%, -1%); }
  100% { transform: scale(1.05) translate(0, 0); }
}
@keyframes thumbFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}

.sermon-hero-text > * {
  opacity: 0;
  animation: heroTextIn 0.6s ease forwards;
}
.sermon-hero-text > *:nth-child(1) { animation-delay: 0.1s; }
.sermon-hero-text > *:nth-child(2) { animation-delay: 0.2s; }
.sermon-hero-text > *:nth-child(3) { animation-delay: 0.3s; }
.sermon-hero-text > *:nth-child(4) { animation-delay: 0.4s; }
.sermon-hero-text > *:nth-child(5) { animation-delay: 0.5s; }

.sermon-mosaic-grid {
  animation: mosaicDrift 25s ease-in-out infinite;
}

.sermon-hero-thumb {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.sermon-hero-thumb:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 50px rgba(0,0,0,0.55) !important;
}
.sermon-hero-thumb:hover .sermon-thumb-play {
  background: rgba(10,10,18,0.45) !important;
}

.sermon-card {
  animation: sermonFadeUp 0.5s ease forwards;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.sermon-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 40px rgba(26,26,46,0.14);
}
.sermon-card-img {
  transition: transform 0.5s ease;
}
.sermon-card:hover .sermon-card-img {
  transform: scale(1.06);
}
.sermon-card:hover .sermon-play-overlay {
  opacity: 1 !important;
}
.sermon-filter-btn {
  transition: all 0.2s ease;
  cursor: pointer;
}
.sermon-filter-btn:hover {
  border-color: #d4a017 !important;
  color: #b8860b !important;
}
.sermon-search-input:focus {
  outline: none;
  border-color: #d4a017;
  box-shadow: 0 0 0 3px rgba(212,160,23,0.12);
}
.sermon-watch-btn {
  transition: all 0.2s ease;
}
.sermon-watch-btn:hover {
  background: #b8860b !important;
  transform: translateY(-1px);
}
.sermon-share-btn {
  transition: all 0.2s ease;
}
.sermon-share-btn:hover {
  background: rgba(255,255,255,0.18) !important;
  color: #fff !important;
  transform: translateY(-1px);
}
.sermon-load-more {
  transition: all 0.2s ease;
  cursor: pointer;
}
.sermon-load-more:hover {
  background: #1e3a5f !important;
  color: #fff !important;
  border-color: #1e3a5f !important;
}
.sermon-icon-btn {
  transition: color 0.15s ease;
  cursor: pointer;
}
.sermon-icon-btn:hover {
  color: #d4a017 !important;
}

.sermon-filter-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  background: #fffdf8;
  border: 1px solid #e8e0d0;
  border-radius: 10px;
  box-shadow: 0 8px 28px rgba(26,26,46,0.10);
  z-index: 50;
  min-width: 180px;
  padding: 6px 0;
  max-height: 240px;
  overflow-y: auto;
}
.sermon-filter-dropdown-item {
  padding: 8px 16px;
  font-size: 0.88rem;
  color: #1a1a2e;
  cursor: pointer;
  transition: background 0.15s;
}
.sermon-filter-dropdown-item:hover {
  background: #f5f0e8;
  color: #b8860b;
}

@media (max-width: 1024px) {
  .sermon-cards-grid { grid-template-columns: repeat(2, 1fr) !important; }
  .sermon-hero-inner { flex-direction: column !important; align-items: center !important; }
  .sermon-hero-text { align-items: center !important; }
  .sermon-hero-thumb { width: 100% !important; max-width: 480px; }
  .sermon-hero-actions { justify-content: center !important; }
  .sermon-mosaic-grid { grid-template-columns: repeat(3, 1fr) !important; }
}
@media (max-width: 640px) {
  .sermon-cards-grid { grid-template-columns: 1fr !important; }
  .sermon-mosaic-grid { grid-template-columns: repeat(2, 1fr) !important; }
}
`;

const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
    <circle cx="12" cy="12" r="12" fill="#0ea5e9"/>
    <polygon points="10,8 16,12 10,16" fill="#fff"/>
  </svg>
);

const ShareIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/>
    <polyline points="16 6 12 2 8 6"/>
    <line x1="12" y1="2" x2="12" y2="15"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const ChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const HomeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const PersonIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
);

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const MOSAIC_PLACEHOLDER_GRADIENTS = [
  'linear-gradient(145deg, #1e3a5f 0%, #16213e 100%)',
  'linear-gradient(145deg, #243b55 0%, #1a1a2e 100%)',
  'linear-gradient(145deg, #2d4a6f 0%, #1e2a3a 100%)',
  'linear-gradient(145deg, #1a2744 0%, #243352 100%)',
];

export default function Sermons() {
  const [sermons, setSermons] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [sermonsLoadError, setSermonsLoadError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ series: '', speaker: '', topic: '' });
  const [filterOptions, setFilterOptions] = useState({ series: [], speakers: [], topics: [] });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openDropdown, setOpenDropdown] = useState(null);
  const styleRef = useRef(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = pageCSS;
    document.head.appendChild(style);
    styleRef.current = style;
    return () => style.remove();
  }, []);

  useEffect(() => {
    api.get('/sermons/featured')
      .then(res => setFeatured(res.data))
      .catch(() => setFeatured(null))
      .finally(() => setFeaturedLoading(false));
  }, []);

  useEffect(() => {
    api.get('/sermons/filters')
      .then(res => setFilterOptions(res.data))
      .catch(() => setFilterOptions({ series: [], speakers: [], topics: [] }));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 6 };
    if (filters.series) params.series = filters.series;
    if (filters.speaker) params.speaker = filters.speaker;
    if (filters.topic) params.topic = filters.topic;
    if (search) params.search = search;

    api.get('/sermons', { params })
      .then(res => {
        setSermonsLoadError(false);
        if (page === 1) {
          setSermons(res.data.sermons || []);
        } else {
          setSermons(prev => [...prev, ...(res.data.sermons || [])]);
        }
        setTotalPages(res.data.pages || 1);
      })
      .catch(() => {
        if (page === 1) {
          setSermonsLoadError(true);
          setSermons([]);
          setTotalPages(1);
        } else {
          setTotalPages(Math.max(1, page - 1));
        }
      })
      .finally(() => setLoading(false));
  }, [page, filters, search]);

  useEffect(() => {
    const handleClick = () => setOpenDropdown(null);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: prev[key] === value ? '' : value }));
    setPage(1);
    setOpenDropdown(null);
  };

  const clearFilters = () => {
    setFilters({ series: '', speaker: '', topic: '' });
    setPage(1);
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: '#faf8f5', minHeight: '100vh' }}>

      {/* ── Hero / Featured Sermon ── */}
      <section style={heroStyles.section}>
        <div style={heroStyles.mosaicWrap}>
          <div className="sermon-mosaic-grid" style={heroStyles.mosaicGrid}>
            {sermons.length > 0
              ? Array.from({ length: 12 }, (_, i) => {
                  const s = sermons[i % sermons.length];
                  return (
                    <div key={i} style={heroStyles.mosaicTile}>
                      <img
                        src={s.thumbnailUrl || '/hero.jpg'}
                        alt=""
                        style={heroStyles.mosaicImg}
                      />
                    </div>
                  );
                })
              : Array.from({ length: 12 }, (_, i) => (
                  <div
                    key={i}
                    style={{
                      ...heroStyles.mosaicTile,
                      background: MOSAIC_PLACEHOLDER_GRADIENTS[i % MOSAIC_PLACEHOLDER_GRADIENTS.length],
                      minHeight: '100%',
                    }}
                  />
                ))}
          </div>
          <div style={heroStyles.mosaicOverlay} />
        </div>

        <div className="sermon-hero-inner" style={heroStyles.inner}>
          {featuredLoading ? (
            <div style={heroStyles.textCol}>
              <span style={heroStyles.tag}>LATEST MESSAGE</span>
              <h1 style={heroStyles.title}>Sermons</h1>
              <p style={heroStyles.placeholderText}>Loading featured message…</p>
            </div>
          ) : featured ? (
            <>
              <div style={heroStyles.textCol}>
                <span style={heroStyles.tag}>{featured.series || 'LATEST MESSAGE'}</span>
                <h1 style={heroStyles.title}>{featured.title}</h1>
                <div style={heroStyles.meta}>
                  <span style={heroStyles.metaItem}>
                    <PersonIcon /> {featured.speaker}
                  </span>
                  <span style={heroStyles.metaDot}>&bull;</span>
                  <span style={heroStyles.metaItem}>
                    <CalendarIcon /> {formatDate(featured.date)}
                  </span>
                </div>
                <div className="sermon-hero-actions" style={heroStyles.actions}>
                  <Link to={`/sermons/${featured._id}?play=1`} className="sermon-watch-btn" style={{ ...heroStyles.watchBtn, textDecoration: 'none' }}>
                    <PlayIcon /> Watch Now
                  </Link>
                  <button
                    type="button"
                    className="sermon-share-btn"
                    style={heroStyles.shareBtn}
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/sermons/${featured._id}`);
                    }}
                  >
                    <ShareIcon /> Share
                  </button>
                </div>
              </div>
              <Link to={`/sermons/${featured._id}?play=1`} className="sermon-hero-thumb" style={heroStyles.playerFrame}>
                <div style={heroStyles.playerImgWrap}>
                  <img
                    src={featured.thumbnailUrl || '/hero.jpg'}
                    alt={featured.title}
                    style={heroStyles.playerImg}
                  />
                  <div className="sermon-thumb-play" style={heroStyles.playerPlayBtn}>
                    <div style={heroStyles.playerPlayCircle}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><polygon points="9,5 19,12 9,19"/></svg>
                    </div>
                  </div>
                </div>
                <div style={heroStyles.playerBar}>
                  <div style={heroStyles.playerProgress} />
                </div>
              </Link>
            </>
          ) : (
            <div style={heroStyles.textCol}>
              <span style={heroStyles.tag}>MESSAGES</span>
              <h1 style={heroStyles.title}>Sermons</h1>
              <p style={heroStyles.placeholderText}>
                No featured sermon is available right now. When the server is online, the latest message will appear here.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── Recent Sermons Header ── */}
      <section style={sectionStyles.wrapper}>
        <div style={sectionStyles.header}>
          <h2 style={sectionStyles.title}>Recent Sermons</h2>
          <div style={sectionStyles.searchWrap}>
            <SearchIcon />
            <input
              className="sermon-search-input"
              type="text"
              placeholder="Search sermons by title, topic"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              style={sectionStyles.searchInput}
            />
          </div>
        </div>

        {/* ── Filters ── */}
        <div style={filterStyles.row}>
          <FilterButton
            label={filters.series || 'All Series'}
            active={!!filters.series}
            isOpen={openDropdown === 'series'}
            onToggle={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === 'series' ? null : 'series'); }}
            options={filterOptions.series}
            selected={filters.series}
            onSelect={(val) => handleFilterChange('series', val)}
          />
          <FilterButton
            label={filters.speaker || 'Speaker'}
            active={!!filters.speaker}
            isOpen={openDropdown === 'speaker'}
            onToggle={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === 'speaker' ? null : 'speaker'); }}
            options={filterOptions.speakers}
            selected={filters.speaker}
            onSelect={(val) => handleFilterChange('speaker', val)}
          />
          <FilterButton
            label={filters.topic || 'Topic'}
            active={!!filters.topic}
            isOpen={openDropdown === 'topic'}
            onToggle={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === 'topic' ? null : 'topic'); }}
            options={filterOptions.topics}
            selected={filters.topic}
            onSelect={(val) => handleFilterChange('topic', val)}
          />
          <div className="sermon-filter-btn" onClick={(e) => { e.stopPropagation(); }} style={{ ...filterStyles.btn, cursor: 'default' }}>
            Date <ChevronDown />
          </div>
          {(filters.series || filters.speaker || filters.topic) && (
            <button onClick={clearFilters} style={filterStyles.clearBtn}>Clear</button>
          )}
        </div>

        {/* ── Cards Grid ── */}
        {loading && sermons.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#8a8494' }}>
            <div style={{ fontSize: '1.1rem' }}>Loading sermons...</div>
          </div>
        ) : sermons.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#8a8494' }}>
            <div style={{ fontSize: '1.1rem' }}>
              {sermonsLoadError
                ? 'Could not load sermons. Check that the server is running and try again.'
                : 'No sermons found.'}
            </div>
          </div>
        ) : (
          <div className="sermon-cards-grid" style={cardStyles.grid}>
            {sermons.map((sermon, i) => (
              <SermonCard key={sermon._id} sermon={sermon} index={i} />
            ))}
          </div>
        )}

        {/* ── Load More ── */}
        {page < totalPages && (
          <div style={{ display: 'flex', justifyContent: 'center', margin: '2.5rem 0 1rem' }}>
            <button
              className="sermon-load-more"
              onClick={() => setPage(p => p + 1)}
              style={loadMoreStyles.btn}
            >
              Load More <ChevronDown />
            </button>
          </div>
        )}
      </section>

      {/* ── Footer ── */}
      <Footer />
    </div>
  );
}


function FilterButton({ label, active, isOpen, onToggle, options, selected, onSelect }) {
  return (
    <div style={{ position: 'relative' }}>
      <div
        className="sermon-filter-btn"
        onClick={onToggle}
        style={{
          ...filterStyles.btn,
          borderColor: active ? '#d4a017' : '#e8e0d0',
          color: active ? '#b8860b' : '#1a1a2e',
          background: active ? '#fdf6e3' : '#fffdf8',
        }}
      >
        {label} <ChevronDown />
      </div>
      {isOpen && options && options.length > 0 && (
        <div className="sermon-filter-dropdown" onClick={(e) => e.stopPropagation()}>
          {selected && (
            <div
              className="sermon-filter-dropdown-item"
              style={{ color: '#a89880', fontStyle: 'italic' }}
              onClick={() => onSelect(selected)}
            >
              Clear
            </div>
          )}
          {options.map(opt => (
            <div
              key={opt}
              className="sermon-filter-dropdown-item"
              style={opt === selected ? { color: '#b8860b', fontWeight: '600' } : {}}
              onClick={() => onSelect(opt)}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


function SermonCard({ sermon, index }) {
  return (
    <Link
      to={`/sermons/${sermon._id}?play=1`}
      className="sermon-card"
      style={{ ...cardStyles.card, animationDelay: `${index * 0.08}s`, textDecoration: 'none', color: 'inherit', display: 'block' }}
    >
      <div style={cardStyles.imgWrap}>
        <img
          className="sermon-card-img"
          src={sermon.thumbnailUrl || '/hero.jpg'}
          alt={sermon.title}
          style={cardStyles.img}
        />
        {sermon.duration && (
          <span style={cardStyles.duration}>{sermon.duration}</span>
        )}
        <div className="sermon-play-overlay" style={cardStyles.playOverlay}>
          <div style={cardStyles.playCircle}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><polygon points="9,6 18,12 9,18"/></svg>
          </div>
        </div>
      </div>
      <div style={cardStyles.body}>
        <div style={cardStyles.tagRow}>
          {sermon.series && <span style={cardStyles.seriesTag}>{sermon.series}</span>}
          <span style={cardStyles.date}>{formatDate(sermon.date)}</span>
        </div>
        <h3 style={cardStyles.title}>{sermon.title}</h3>
        <div style={cardStyles.footer}>
          <div style={cardStyles.speaker}>
            <div style={cardStyles.avatar}>
              {sermon.speaker ? sermon.speaker.charAt(0).toUpperCase() : 'P'}
            </div>
            <span style={cardStyles.speakerName}>{sermon.speaker}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}


/* ═══════ Styles ═══════ */

const heroStyles = {
  section: {
    position: 'relative',
    overflow: 'hidden',
    padding: '3.5rem 4rem',
    minHeight: '340px',
  },
  mosaicWrap: {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
  },
  mosaicGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gridTemplateRows: 'repeat(3, 1fr)',
    position: 'absolute',
    inset: '-10%',
    gap: '4px',
    filter: 'blur(6px) saturate(0.5)',
  },
  mosaicTile: {
    overflow: 'hidden',
  },
  mosaicImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  mosaicOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, rgba(26,26,46,0.92) 0%, rgba(22,33,62,0.88) 40%, rgba(30,58,95,0.85) 100%)',
  },
  inner: {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    alignItems: 'center',
    gap: '3rem',
  },
  textCol: {
    flex: 1,
    minWidth: 0,
  },
  tag: {
    display: 'inline-block',
    background: 'transparent',
    border: '1.5px solid #d4a017',
    fontSize: '0.72rem',
    fontWeight: '700',
    padding: '5px 18px',
    borderRadius: '20px',
    letterSpacing: '0.08em',
    marginBottom: '16px',
    width: 'fit-content',
    textTransform: 'uppercase',
    backgroundImage: 'linear-gradient(90deg, #d4a017 0%, #f0d060 50%, #d4a017 100%)',
    backgroundSize: '200% auto',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    animation: 'shimmer 3s linear infinite',
  },
  title: {
    color: '#fff',
    fontSize: '2.5rem',
    fontWeight: '800',
    lineHeight: 1.15,
    margin: '0 0 16px',
    maxWidth: '600px',
    textShadow: '0 2px 16px rgba(0,0,0,0.35)',
  },
  placeholderText: {
    color: 'rgba(232,224,208,0.88)',
    fontSize: '1.05rem',
    lineHeight: 1.6,
    maxWidth: '520px',
    margin: 0,
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '24px',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    color: '#e8e0d0',
    fontSize: '0.85rem',
  },
  metaDot: {
    color: '#a89880',
  },
  actions: {
    display: 'flex',
    gap: '12px',
  },
  watchBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#d4a017',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '11px 26px',
    fontSize: '0.9rem',
    fontWeight: '700',
    cursor: 'pointer',
    fontFamily: 'inherit',
    boxShadow: '0 4px 16px rgba(212,160,23,0.3)',
  },
  shareBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(255,255,255,0.08)',
    color: '#d0c8b8',
    border: '1px solid rgba(255,255,255,0.18)',
    borderRadius: '8px',
    padding: '10px 24px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  playerFrame: {
    display: 'block',
    width: '460px',
    flexShrink: 0,
    borderRadius: '10px',
    overflow: 'hidden',
    background: '#0a0a12',
    boxShadow: '0 12px 44px rgba(0,0,0,0.5)',
    textDecoration: 'none',
  },
  playerBar: {
    height: '28px',
    background: '#111118',
    display: 'flex',
    alignItems: 'center',
    padding: '0 12px',
    position: 'relative',
  },
  playerProgress: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '35%',
    height: '3px',
    background: '#d4a017',
    borderRadius: '0 2px 2px 0',
  },
  playerImgWrap: {
    position: 'relative',
    width: '100%',
  },
  playerImg: {
    display: 'block',
    width: '100%',
    aspectRatio: '16/9',
    objectFit: 'cover',
  },
  playerPlayBtn: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(10,10,18,0.35)',
    transition: 'background 0.2s ease',
  },
  playerPlayCircle: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: 'rgba(212,160,23,0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 20px rgba(212,160,23,0.4)',
    transition: 'transform 0.2s ease',
  },
};

const sectionStyles = {
  wrapper: {
    width: '100%',
    padding: '2.5rem 4rem 3rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.25rem',
  },
  title: {
    fontSize: '1.6rem',
    fontWeight: '700',
    color: '#1a1a2e',
    margin: 0,
  },
  searchWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#fffdf8',
    border: '1px solid #e8e0d0',
    borderRadius: '10px',
    padding: '9px 14px',
    width: '300px',
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    fontSize: '0.88rem',
    color: '#1a1a2e',
    width: '100%',
    background: 'transparent',
    fontFamily: 'inherit',
  },
};

const filterStyles = {
  row: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
  },
  btn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '7px 16px',
    border: '1px solid #e8e0d0',
    borderRadius: '20px',
    background: '#fffdf8',
    fontSize: '0.85rem',
    fontWeight: '500',
    color: '#1a1a2e',
    fontFamily: 'inherit',
  },
  clearBtn: {
    background: 'none',
    border: 'none',
    color: '#b8860b',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
};

const cardStyles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1.8rem',
  },
  card: {
    background: '#fffdf8',
    borderRadius: '14px',
    overflow: 'hidden',
    border: '1px solid #ece5d8',
    opacity: 0,
    boxShadow: '0 2px 12px rgba(26,26,46,0.06)',
  },
  imgWrap: {
    position: 'relative',
    width: '100%',
    paddingTop: '56.25%',
    overflow: 'hidden',
    background: '#1a1a2e',
  },
  img: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  duration: {
    position: 'absolute',
    bottom: '10px',
    right: '10px',
    background: 'rgba(26,26,46,0.85)',
    color: '#fff',
    fontSize: '0.75rem',
    fontWeight: '600',
    padding: '3px 8px',
    borderRadius: '4px',
    zIndex: 2,
    letterSpacing: '0.02em',
  },
  playOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(26,26,46,0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  playCircle: {
    width: 52,
    height: 52,
    borderRadius: '50%',
    background: 'rgba(212,160,23,0.92)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 16px rgba(212,160,23,0.35)',
  },
  body: {
    padding: '14px 16px 16px',
    borderTop: '2px solid #d4a017',
  },
  tagRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
  },
  seriesTag: {
    fontSize: '0.7rem',
    fontWeight: '700',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    color: '#b8860b',
    background: '#fdf6e3',
    padding: '2px 8px',
    borderRadius: '4px',
  },
  date: {
    fontSize: '0.78rem',
    color: '#8a8494',
    marginLeft: 'auto',
  },
  title: {
    fontSize: '1.02rem',
    fontWeight: '700',
    color: '#1a1a2e',
    margin: '0 0 6px',
    lineHeight: 1.35,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  desc: {
    fontSize: '0.82rem',
    color: '#6b6b7b',
    margin: '0 0 14px',
    lineHeight: 1.5,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '10px',
    borderTop: '1px solid #f0ece4',
  },
  speaker: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  avatar: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: '#1e3a5f',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.72rem',
    fontWeight: '700',
  },
  speakerName: {
    fontSize: '0.82rem',
    color: '#1a1a2e',
    fontWeight: '600',
  },
};

const loadMoreStyles = {
  btn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 28px',
    border: '1.5px solid #1e3a5f',
    borderRadius: '8px',
    background: '#fffdf8',
    color: '#1e3a5f',
    fontSize: '0.9rem',
    fontWeight: '600',
    fontFamily: 'inherit',
  },
};

