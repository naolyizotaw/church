import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import Footer from '../components/Footer';

const pageCSS = `
@keyframes sdFadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.sd-page { animation: sdFadeIn 0.4s ease forwards; }

.sd-action-btn {
  transition: background 0.15s ease;
  cursor: pointer;
}
.sd-action-btn:hover { background: #e6dfd4 !important; }

.sd-desc-box {
  transition: background 0.15s ease;
}
.sd-desc-box:hover { background: #ede6da !important; }

.sd-desc-toggle {
  cursor: pointer;
  background: none;
  border: none;
  font-family: inherit;
  transition: color 0.15s ease;
}
.sd-desc-toggle:hover { color: #b8860b !important; }

.sd-up-next-item {
  display: flex;
  gap: 10px;
  padding: 8px;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: background 0.15s ease;
}
.sd-up-next-item:hover { background: #f5f0e8; }
.sd-up-next-item:hover .sd-up-next-img { transform: scale(1.03); }

@media (max-width: 1000px) {
  .sd-below-grid { flex-direction: column !important; }
  .sd-sidebar { width: 100% !important; min-width: 0 !important; }
}
`;

function extractVideoId(url) {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/watch\?.*v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([\w-]{11})/);
  return m ? m[1] : null;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months === 1) return '1 month ago';
  if (months < 12) return `${months} months ago`;
  const years = Math.floor(months / 12);
  return years === 1 ? '1 year ago' : `${years} years ago`;
}

export default function SermonDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const autoplay = searchParams.get('play') === '1';
  const [sermon, setSermon] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const styleRef = useRef(null);

  useEffect(() => {
    const el = document.createElement('style');
    el.textContent = pageCSS;
    document.head.appendChild(el);
    styleRef.current = el;
    return () => el.remove();
  }, []);

  useEffect(() => {
    setLoading(true);
    setDescExpanded(false);
    window.scrollTo(0, 0);
    api.get(`/sermons/${id}`)
      .then(res => {
        setSermon(res.data);
        return res.data;
      })
      .then(s => {
        const params = { limit: 12 };
        if (s.series) params.series = s.series;
        return api.get('/sermons', { params });
      })
      .then(res => {
        const others = (res.data.sermons || []).filter(s => s._id !== id);
        setRelated(others.slice(0, 10));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#faf8f5', gap: 14 }}>
        <div style={{ width: 32, height: 32, border: '3px solid #e6dfd4', borderTopColor: '#d4a017', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ color: '#6b6b7b', fontSize: '0.9rem', margin: 0 }}>Loading...</p>
      </div>
    );
  }

  if (!sermon) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#faf8f5', gap: 12 }}>
        <p style={{ color: '#1a1a2e', fontSize: '1.05rem', fontWeight: 600, margin: 0 }}>Sermon not found</p>
        <Link to="/sermons" style={{ color: '#b8860b', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}>Back to Sermons</Link>
      </div>
    );
  }

  const videoId = sermon.youtubeVideoId || extractVideoId(sermon.videoUrl);
  const descLong = sermon.description && sermon.description.length > 200;

  return (
    <div className="sd-page" style={{ fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif", background: '#faf8f5', minHeight: '100vh' }}>

      <div style={{ maxWidth: 1150, margin: '0 auto', padding: '16px 24px 48px' }}>

        {/* ── Video Player ── */}
        <div style={{ marginBottom: 20 }}>
          {videoId ? (
            <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', borderRadius: 12, overflow: 'hidden', background: '#0a0a14', boxShadow: '0 4px 24px rgba(26,26,46,0.12)' }}>
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1${autoplay ? '&autoplay=1' : ''}`}
                title={sermon.title}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none', display: 'block' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '5rem 2rem', background: '#f0ece4', borderRadius: 12 }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#6b6b7b" strokeWidth="1.5"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
              <span style={{ color: '#6b6b7b', fontSize: '0.9rem' }}>No video available</span>
            </div>
          )}
        </div>

        {/* ── Two columns: Info (left) + Up Next (right) ── */}
        <div className="sd-below-grid" style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>

          {/* ── Left column ── */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* Series / Topic tags */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
              {sermon.series && (
                <span style={{ background: '#fdf6e3', color: '#b8860b', fontSize: '0.7rem', fontWeight: 700, padding: '4px 10px', borderRadius: 4, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  {sermon.series}
                </span>
              )}
              {sermon.topic && (
                <span style={{ background: '#e8edf5', color: '#1e3a5f', fontSize: '0.7rem', fontWeight: 700, padding: '4px 10px', borderRadius: 4, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  {sermon.topic}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1a1a2e', lineHeight: 1.35, margin: '0 0 12px' }}>
              {sermon.title}
            </h1>

            {/* Speaker row + action pills */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#1e3a5f', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.95rem', fontWeight: 700, flexShrink: 0 }}>
                  {sermon.speaker?.charAt(0)?.toUpperCase() || 'P'}
                </div>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1a1a2e', lineHeight: 1.2 }}>{sermon.speaker}</div>
                  <div style={{ fontSize: '0.78rem', color: '#6b6b7b' }}>{formatDate(sermon.date)}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button className="sd-action-btn" onClick={handleShare} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f0ece4', border: 'none', borderRadius: 18, padding: '8px 16px', fontSize: '0.82rem', fontWeight: 600, color: '#1a1a2e', fontFamily: 'inherit' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
                  </svg>
                  {copied ? 'Copied!' : 'Share'}
                </button>
                {videoId && (
                  <a href={`https://www.youtube.com/watch?v=${videoId}`} target="_blank" rel="noopener noreferrer" className="sd-action-btn" style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f0ece4', border: 'none', borderRadius: 18, padding: '8px 16px', fontSize: '0.82rem', fontWeight: 600, color: '#1a1a2e', textDecoration: 'none', fontFamily: 'inherit' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#cc0000"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                    YouTube
                  </a>
                )}
                <Link to="/sermons" className="sd-action-btn" style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f0ece4', border: 'none', borderRadius: 18, padding: '8px 16px', fontSize: '0.82rem', fontWeight: 600, color: '#1a1a2e', textDecoration: 'none', fontFamily: 'inherit' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                  All Sermons
                </Link>
              </div>
            </div>

            {/* Description box */}
            <div
              className="sd-desc-box"
              onClick={() => descLong && setDescExpanded(!descExpanded)}
              style={{ background: '#f5f0e8', borderRadius: 12, padding: '14px 16px', marginBottom: 20, cursor: descLong ? 'pointer' : 'default', borderTop: '2px solid #d4a017' }}
            >
              <div style={{ display: 'flex', gap: 12, fontSize: '0.82rem', fontWeight: 600, color: '#1a1a2e', marginBottom: 8 }}>
                <span>{formatDate(sermon.date)}</span>
                {sermon.duration && <span>{sermon.duration}</span>}
                {sermon.series && <span style={{ color: '#b8860b' }}>#{sermon.series.replace(/\s+/g, '')}</span>}
                {sermon.topic && <span style={{ color: '#1e3a5f' }}>#{sermon.topic.replace(/\s+/g, '')}</span>}
              </div>
              {sermon.description ? (
                <>
                  <p style={{ fontSize: '0.88rem', color: '#2a2a3a', lineHeight: 1.65, margin: 0, whiteSpace: 'pre-line', ...(descLong && !descExpanded ? { display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' } : {}) }}>
                    {sermon.description}
                  </p>
                  {descLong && (
                    <button className="sd-desc-toggle" onClick={e => { e.stopPropagation(); setDescExpanded(!descExpanded); }} style={{ padding: '6px 0 0', fontSize: '0.82rem', fontWeight: 600, color: '#6b6b7b' }}>
                      {descExpanded ? 'Show less' : '...more'}
                    </button>
                  )}
                </>
              ) : (
                <p style={{ fontSize: '0.88rem', color: '#6b6b7b', margin: 0, fontStyle: 'italic' }}>No description available.</p>
              )}
            </div>
          </div>

          {/* ── Right sidebar: Up next ── */}
          {related.length > 0 && (
            <div className="sd-sidebar" style={{ width: 380, minWidth: 320, flexShrink: 0 }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1a1a2e', marginBottom: 12 }}>
                {sermon.series ? `More from "${sermon.series}"` : 'Up next'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {related.map(r => {
                  const rVid = r.youtubeVideoId || extractVideoId(r.videoUrl);
                  const thumb = r.thumbnailUrl || (rVid ? `https://img.youtube.com/vi/${rVid}/hqdefault.jpg` : null);
                  return (
                    <Link key={r._id} to={`/sermons/${r._id}?play=1`} className="sd-up-next-item">
                      <div style={{ position: 'relative', width: 168, minWidth: 168, height: 94, borderRadius: 8, overflow: 'hidden', background: '#f0ece4', flexShrink: 0 }}>
                        {thumb ? (
                          <img className="sd-up-next-img" src={thumb} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.25s ease' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0ece4' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b6b7b" strokeWidth="1.5"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                          </div>
                        )}
                        {r.duration && (
                          <span style={{ position: 'absolute', bottom: 4, right: 4, background: 'rgba(26,26,46,0.85)', color: '#fff', fontSize: '0.68rem', fontWeight: 600, padding: '1px 4px', borderRadius: 3 }}>
                            {r.duration}
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', paddingTop: 2, minWidth: 0 }}>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a1a2e', margin: '0 0 4px', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {r.title}
                        </h4>
                        <span style={{ fontSize: '0.75rem', color: '#6b6b7b', lineHeight: 1.3 }}>{r.speaker}</span>
                        <span style={{ fontSize: '0.73rem', color: '#9a9aaa' }}>{timeAgo(r.date)}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
