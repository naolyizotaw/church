import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Footer from '../components/Footer';

const pageCSS = `
@keyframes sermonFadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}
.sermon-card {
  animation: sermonFadeUp 0.5s ease forwards;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.sermon-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.12);
}
.sermon-card-img {
  transition: transform 0.4s ease;
}
.sermon-card:hover .sermon-card-img {
  transform: scale(1.05);
}
.sermon-card:hover .sermon-play-overlay {
  opacity: 1 !important;
}
.sermon-filter-btn {
  transition: all 0.2s ease;
  cursor: pointer;
}
.sermon-filter-btn:hover {
  border-color: #0ea5e9 !important;
  color: #0ea5e9 !important;
}
.sermon-search-input:focus {
  outline: none;
  border-color: #0ea5e9;
  box-shadow: 0 0 0 3px rgba(14,165,233,0.1);
}
.sermon-watch-btn {
  transition: all 0.2s ease;
}
.sermon-watch-btn:hover {
  background: #0284c7 !important;
  transform: translateY(-1px);
}
.sermon-share-btn {
  transition: all 0.2s ease;
}
.sermon-share-btn:hover {
  background: #374151 !important;
  transform: translateY(-1px);
}
.sermon-load-more {
  transition: all 0.2s ease;
  cursor: pointer;
}
.sermon-load-more:hover {
  background: #0f172a !important;
  color: #fff !important;
  border-color: #0f172a !important;
}
.sermon-icon-btn {
  transition: color 0.15s ease;
  cursor: pointer;
}
.sermon-icon-btn:hover {
  color: #0ea5e9 !important;
}

.sermon-filter-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  z-index: 50;
  min-width: 180px;
  padding: 6px 0;
  max-height: 240px;
  overflow-y: auto;
}
.sermon-filter-dropdown-item {
  padding: 8px 16px;
  font-size: 0.88rem;
  color: #374151;
  cursor: pointer;
  transition: background 0.15s;
}
.sermon-filter-dropdown-item:hover {
  background: #f1f5f9;
  color: #0ea5e9;
}
`;

const fallbackSermons = [
  {
    _id: '1',
    title: 'The Power of Prayer',
    description: 'Discover how persistent prayer can shift the atmosphere and bring breakthrough in your daily life.',
    speaker: 'Pastor Abebe',
    date: '2023-10-12',
    series: 'FAITH SERIES',
    topic: 'Prayer',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=260&fit=crop',
    duration: '43:20',
  },
  {
    _id: '2',
    title: 'Living with Purpose',
    description: 'God has a unique plan for everyone. Learn to identify your calling and walk in it confidently.',
    speaker: 'Pastor John',
    date: '2023-10-05',
    series: 'PURPOSE',
    topic: 'Purpose',
    thumbnailUrl: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=400&h=260&fit=crop',
    duration: '55:15',
  },
  {
    _id: '3',
    title: '\u12E8\u12A0\u12DD\u1218\u1295\u1275\u12CE\u127D \u134D\u1245\u122D (God\'s Love)',
    description: 'Exploring the depth and breadth of God\'s unconditional love for His children.',
    speaker: 'Guest Speaker',
    date: '2023-09-28',
    series: 'SUNDAY SERVICE',
    topic: 'Amharic Service',
    thumbnailUrl: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=400&h=260&fit=crop',
    duration: '52:00',
  },
  {
    _id: '4',
    title: 'Serving One Another',
    description: 'True leadership is service. How can we better serve our neighbors and our church family?',
    speaker: 'Pastor Abebe',
    date: '2023-09-21',
    series: 'COMMUNITY',
    topic: 'Service',
    thumbnailUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=260&fit=crop',
    duration: '41:00',
  },
  {
    _id: '5',
    title: 'Understanding Romans',
    description: 'A deep dive into the book of Romans, exploring Paul\'s theology and message to the early church.',
    speaker: 'Pastor John',
    date: '2023-09-14',
    series: 'BIBLE STUDY',
    topic: 'Bible Study',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=400&h=260&fit=crop',
    duration: '48:10',
  },
  {
    _id: '6',
    title: 'Mountains Will Move',
    description: 'Have faith as small as a mustard seed, and you can say to this mountain, \'Move from here to there,\' and...',
    speaker: 'Pastor Abebe',
    date: '2023-09-01',
    series: 'FAITH SERIES',
    topic: 'Faith',
    thumbnailUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=260&fit=crop',
    duration: '42:05',
  },
];

const fallbackFeatured = {
  _id: 'featured',
  title: 'Walking in Faith: Overcoming the Impossible',
  speaker: 'Pastor Abebe',
  date: '2023-10-15',
  series: 'LATEST MESSAGE',
  thumbnailUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=260&fit=crop',
};

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

const seriesColors = {
  'FAITH SERIES': '#0ea5e9',
  'PURPOSE': '#f59e0b',
  'SUNDAY SERVICE': '#f59e0b',
  'COMMUNITY': '#0ea5e9',
  'BIBLE STUDY': '#0ea5e9',
  'LATEST MESSAGE': '#f59e0b',
};

function getSeriesColor(series) {
  return seriesColors[series] || '#0ea5e9';
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function Sermons() {
  const [sermons, setSermons] = useState([]);
  const [featured, setFeatured] = useState(null);
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
      .catch(() => setFeatured(fallbackFeatured));
  }, []);

  useEffect(() => {
    api.get('/sermons/filters')
      .then(res => setFilterOptions(res.data))
      .catch(() => {
        const series = [...new Set(fallbackSermons.map(s => s.series).filter(Boolean))];
        const speakers = [...new Set(fallbackSermons.map(s => s.speaker).filter(Boolean))];
        const topics = [...new Set(fallbackSermons.map(s => s.topic).filter(Boolean))];
        setFilterOptions({ series, speakers, topics });
      });
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
        if (page === 1) {
          setSermons(res.data.sermons || []);
        } else {
          setSermons(prev => [...prev, ...(res.data.sermons || [])]);
        }
        setTotalPages(res.data.pages || 1);
      })
      .catch(() => {
        let data = [...fallbackSermons];
        if (filters.series) data = data.filter(s => s.series === filters.series);
        if (filters.speaker) data = data.filter(s => s.speaker === filters.speaker);
        if (filters.topic) data = data.filter(s => s.topic === filters.topic);
        if (search) {
          const q = search.toLowerCase();
          data = data.filter(s =>
            s.title.toLowerCase().includes(q) ||
            (s.description && s.description.toLowerCase().includes(q)) ||
            (s.topic && s.topic.toLowerCase().includes(q))
          );
        }
        setSermons(data);
        setTotalPages(1);
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

  const heroData = featured || fallbackFeatured;

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: '#fff', minHeight: '100vh' }}>

      {/* ── Hero / Featured Sermon ── */}
      <section style={heroStyles.section}>
        <div style={heroStyles.imgWrap}>
          <img
            src={heroData.thumbnailUrl || '/hero.jpg'}
            alt={heroData.title}
            style={heroStyles.img}
          />
          <div style={heroStyles.overlay} />
        </div>
        <div style={heroStyles.content}>
          <span style={heroStyles.tag}>{heroData.series || 'LATEST MESSAGE'}</span>
          <h1 style={heroStyles.title}>{heroData.title}</h1>
          <div style={heroStyles.meta}>
            <span style={heroStyles.metaItem}>
              <PersonIcon /> {heroData.speaker}
            </span>
            <span style={heroStyles.metaDot}>&bull;</span>
            <span style={heroStyles.metaItem}>
              <CalendarIcon /> {formatDate(heroData.date)}
            </span>
          </div>
          <div style={heroStyles.actions}>
            <Link to={`/sermons/${heroData._id}?play=1`} className="sermon-watch-btn" style={{ ...heroStyles.watchBtn, textDecoration: 'none' }}>
              <PlayIcon /> Watch Now
            </Link>
            <button className="sermon-share-btn" style={heroStyles.shareBtn} onClick={() => {
              navigator.clipboard.writeText(`${window.location.origin}/sermons/${heroData._id}`);
            }}>
              <ShareIcon /> Share
            </button>
          </div>
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
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#94a3b8' }}>
            <div style={{ fontSize: '1.1rem' }}>Loading sermons...</div>
          </div>
        ) : sermons.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#94a3b8' }}>
            <div style={{ fontSize: '1.1rem' }}>No sermons found.</div>
          </div>
        ) : (
          <div style={cardStyles.grid}>
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
          borderColor: active ? '#0ea5e9' : '#e2e8f0',
          color: active ? '#0ea5e9' : '#374151',
          background: active ? '#f0f9ff' : '#fff',
        }}
      >
        {label} <ChevronDown />
      </div>
      {isOpen && options && options.length > 0 && (
        <div className="sermon-filter-dropdown" onClick={(e) => e.stopPropagation()}>
          {selected && (
            <div
              className="sermon-filter-dropdown-item"
              style={{ color: '#94a3b8', fontStyle: 'italic' }}
              onClick={() => onSelect(selected)}
            >
              Clear
            </div>
          )}
          {options.map(opt => (
            <div
              key={opt}
              className="sermon-filter-dropdown-item"
              style={opt === selected ? { color: '#0ea5e9', fontWeight: '600' } : {}}
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
  const color = getSeriesColor(sermon.series);
  return (
    <Link
      to={`/sermons/${sermon._id}?play=1`}
      className="sermon-card"
      style={{ ...cardStyles.card, animationDelay: `${index * 0.08}s`, textDecoration: 'none', color: 'inherit', display: 'block' }}
    >
      <div style={cardStyles.imgWrap}>
        <img
          className="sermon-card-img"
          src={sermon.thumbnailUrl || 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=260&fit=crop'}
          alt={sermon.title}
          style={cardStyles.img}
        />
        {sermon.duration && (
          <span style={cardStyles.duration}>{sermon.duration}</span>
        )}
        <div className="sermon-play-overlay" style={cardStyles.playOverlay}>
          <div style={cardStyles.playCircle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><polygon points="10,8 16,12 10,16"/></svg>
          </div>
        </div>
      </div>
      <div style={cardStyles.body}>
        <div style={cardStyles.tagRow}>
          <span style={{ ...cardStyles.seriesTag, color }}>{sermon.series}</span>
          {sermon.series && <span style={cardStyles.dot}>&bull;</span>}
          <span style={cardStyles.date}>{formatDate(sermon.date)}</span>
        </div>
        <h3 style={cardStyles.title}>{sermon.title}</h3>
        {sermon.description && (
          <p style={cardStyles.desc}>{sermon.description}</p>
        )}
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
    width: '100%',
    height: '380px',
    overflow: 'hidden',
  },
  imgWrap: {
    position: 'absolute',
    inset: 0,
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.15) 100%)',
  },
  content: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '0 4rem',
    zIndex: 2,
  },
  tag: {
    display: 'inline-block',
    background: '#f59e0b',
    color: '#fff',
    fontSize: '0.7rem',
    fontWeight: '700',
    padding: '4px 12px',
    borderRadius: '4px',
    letterSpacing: '0.06em',
    marginBottom: '16px',
    width: 'fit-content',
  },
  title: {
    color: '#fff',
    fontSize: '2.5rem',
    fontWeight: '800',
    lineHeight: 1.15,
    margin: '0 0 16px',
    maxWidth: '600px',
    textShadow: '0 2px 12px rgba(0,0,0,0.3)',
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
    color: '#e2e8f0',
    fontSize: '0.85rem',
  },
  metaDot: {
    color: '#94a3b8',
  },
  actions: {
    display: 'flex',
    gap: '12px',
  },
  watchBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#0ea5e9',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 24px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  shareBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#1e293b',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 24px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: 'inherit',
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
    color: '#0f172a',
    margin: 0,
  },
  searchWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '8px 14px',
    width: '300px',
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    fontSize: '0.88rem',
    color: '#374151',
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
    border: '1px solid #e2e8f0',
    borderRadius: '20px',
    background: '#fff',
    fontSize: '0.85rem',
    fontWeight: '500',
    color: '#374151',
    fontFamily: 'inherit',
  },
  clearBtn: {
    background: 'none',
    border: 'none',
    color: '#0ea5e9',
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
    gap: '1.5rem',
  },
  card: {
    background: '#fff',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid #f1f5f9',
    opacity: 0,
  },
  imgWrap: {
    position: 'relative',
    width: '100%',
    height: '180px',
    overflow: 'hidden',
    background: '#f1f5f9',
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  duration: {
    position: 'absolute',
    bottom: '10px',
    right: '10px',
    background: 'rgba(0,0,0,0.75)',
    color: '#fff',
    fontSize: '0.75rem',
    fontWeight: '600',
    padding: '3px 8px',
    borderRadius: '4px',
    zIndex: 2,
  },
  playOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0,0,0,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.25s ease',
  },
  playCircle: {
    width: 44,
    height: 44,
    borderRadius: '50%',
    background: 'rgba(14,165,233,0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    padding: '14px 16px 16px',
  },
  tagRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '8px',
  },
  seriesTag: {
    fontSize: '0.72rem',
    fontWeight: '700',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  dot: {
    color: '#cbd5e1',
    fontSize: '0.6rem',
  },
  date: {
    fontSize: '0.78rem',
    color: '#94a3b8',
  },
  title: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 6px',
    lineHeight: 1.3,
  },
  desc: {
    fontSize: '0.82rem',
    color: '#64748b',
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
    background: '#0ea5e9',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.72rem',
    fontWeight: '700',
  },
  speakerName: {
    fontSize: '0.82rem',
    color: '#374151',
    fontWeight: '500',
  },
  iconRow: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  iconBtn: {
    color: '#94a3b8',
    display: 'flex',
    alignItems: 'center',
  },
};

const loadMoreStyles = {
  btn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 28px',
    border: '1.5px solid #1e293b',
    borderRadius: '8px',
    background: '#fff',
    color: '#1e293b',
    fontSize: '0.9rem',
    fontWeight: '600',
    fontFamily: 'inherit',
  },
};

