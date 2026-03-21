import { useState, useEffect, useRef, useCallback } from 'react';
import api from '../../api/axios';

/* ═══════════════════════════════════════════════════════════
   PAGES + LEADERS  —  combined admin view with section tabs
   ═══════════════════════════════════════════════════════════ */

const SECTION_META = {
  siteContent: { title: 'Site Content', subtitle: 'Edit contact information, service times, and social links shown across the website' },
  pages: { title: 'Content Pages', subtitle: 'Create and edit static pages for your website (About, Contact info blocks, etc.)' },
  leaders: { title: 'Meet Our Leaders', subtitle: 'Manage leader profiles, photos, and contact details shown on the site' },
  ministries: { title: 'Weekly Ministries', subtitle: 'Programs and ministries shown in the Weekly Ministries section on Services' },
  verses: { title: 'Verse of the Day', subtitle: 'Schedule daily scripture text and references for the homepage' },
};

const emptyPageForm = { slug: '', title: '', content: '' };
const emptyLeaderForm = {
  name: '', role: '', roleAm: '', bio: '', photoUrl: '',
  phone: '', email: '', address: '',
  facebook: '', twitter: '', linkedin: '',
  displayOrder: 0, isActive: true,
};

export default function AdminPages() {
  const [section, setSection] = useState('siteContent');
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  const showToast = useCallback((msg) => {
    setToast(msg);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToast(null), 3200);
  }, []);

  useEffect(() => () => {
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
  }, []);

  const meta = SECTION_META[section] || SECTION_META.pages;

  const tabs = [
    { key: 'siteContent', label: 'Site Content', Icon: SiteContentIcon },
    { key: 'pages', label: 'Content Pages', Icon: PagesIcon },
    { key: 'leaders', label: 'Meet Our Leaders', Icon: LeadersIcon },
    { key: 'ministries', label: 'Weekly Ministries', Icon: MinistriesIcon },
    { key: 'verses', label: 'Verse of the Day', Icon: VerseIcon },
  ];

  return (
    <div style={st.pageWrap}>
      {/* Toast */}
      {toast && (
        <div style={st.globalToast}>
          <span style={st.globalToastIcon}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
          </span>
          <span>{toast}</span>
          <button type="button" onClick={() => setToast(null)} style={st.globalToastClose} aria-label="Dismiss">&times;</button>
        </div>
      )}

      {/* Header */}
      <div style={st.header}>
        <div style={st.headerTextWrap}>
          <h1 style={st.title}>{meta.title}</h1>
          <p style={st.subtitle}>{meta.subtitle}</p>
        </div>
      </div>

      {/* Section Tabs */}
      <div style={st.sectionTabs}>
        {tabs.map(({ key, label, Icon }) => (
          <button
            key={key}
            style={section === key ? st.sectionTabActive : st.sectionTab}
            onClick={() => setSection(key)}
          >
            <Icon />
            {label}
            {section === key && <span style={st.tabUnderline} />}
          </button>
        ))}
      </div>

      {/* Active section */}
      <div style={st.sectionBody}>
        {section === 'siteContent' ? <SiteContentSection showToast={showToast} /> : section === 'pages' ? <PagesSection showToast={showToast} /> : section === 'leaders' ? <LeadersSection showToast={showToast} /> : section === 'ministries' ? <MinistriesSection showToast={showToast} /> : <VerseSection showToast={showToast} />}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   SITE CONTENT SECTION
   ────────────────────────────────────────────────────────── */

function SiteContentSection({ showToast }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    churchName: '', address: '', phone: '', email: '', mapQuery: '',
    serviceTimes: [], socialLinks: { youtube: '', twitter: '', facebook: '', instagram: '' },
  });

  const fetchContent = async () => {
    try {
      const { data: d } = await api.get('/site-content');
      setData(d);
      setForm({
        churchName: d.churchName || '',
        address: d.address || '',
        phone: d.phone || '',
        email: d.email || '',
        mapQuery: d.mapQuery || '',
        serviceTimes: d.serviceTimes || [],
        socialLinks: d.socialLinks || { youtube: '', twitter: '', facebook: '', instagram: '' },
      });
    } catch { /* defaults stay */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchContent(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/site-content', form);
      showToast?.('Site content updated successfully');
      fetchContent();
    } catch (err) { alert(err.response?.data?.message || 'Error saving'); }
    finally { setSaving(false); }
  };

  const updateServiceTime = (i, field, val) => {
    const next = [...form.serviceTimes];
    next[i] = { ...next[i], [field]: val };
    setForm({ ...form, serviceTimes: next });
  };

  const addServiceTime = () => {
    setForm({ ...form, serviceTimes: [...form.serviceTimes, { label: '', time: '', isHighlighted: false }] });
  };

  const removeServiceTime = (i) => {
    setForm({ ...form, serviceTimes: form.serviceTimes.filter((_, idx) => idx !== i) });
  };

  if (loading) {
    return (
      <div style={st.loadingWrap}>
        <div style={st.spinner} />
        <span style={st.loadingText}>Loading site content...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave}>
      {/* Contact Info */}
      <div style={{ ...st.card, padding: '24px 28px', marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: '0 0 16px' }}>Contact Information</h3>
        <div style={st.row2}>
          <div style={st.field}>
            <label style={st.label}>Church Name</label>
            <input style={st.input} value={form.churchName} onChange={e => setForm({ ...form, churchName: e.target.value })} placeholder="Kerabu Full Gospel Church" />
          </div>
          <div style={st.field}>
            <label style={st.label}>Phone Number</label>
            <input style={st.input} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+251 911 123 456" />
          </div>
        </div>
        <div style={{ ...st.row2, marginTop: 14 }}>
          <div style={st.field}>
            <label style={st.label}>Email Address</label>
            <input style={st.input} type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="info@kerabuchurch.org" />
          </div>
          <div style={st.field}>
            <label style={st.label}>Google Maps Query</label>
            <input style={st.input} value={form.mapQuery} onChange={e => setForm({ ...form, mapQuery: e.target.value })} placeholder="Kerabu+Full+Gospel+Church+Addis+Ababa" />
            <span style={st.hint}>Used in the embedded Google Map</span>
          </div>
        </div>
        <div style={{ ...st.field, marginTop: 14 }}>
          <label style={st.label}>Address</label>
          <textarea style={{ ...st.input, height: 70, resize: 'vertical' }} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Addis Ababa, Ethiopia&#10;Kerabu Full Gospel Church" />
        </div>
      </div>

      {/* Service Times — Timeline */}
      <div style={{ ...st.card, padding: '24px 28px', marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>Service Times</h3>
            <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>Schedule displayed on the Contact page</p>
          </div>
          <button type="button" style={{ ...st.addBtn, padding: '7px 14px', fontSize: 12 }} onClick={addServiceTime}>+ Add Service</button>
        </div>
        {form.serviceTimes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px 20px', background: '#fafbfc', borderRadius: 12, border: '2px dashed #e2e8f0' }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" style={{ marginBottom: 10 }}>
              <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
            </svg>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#334155', margin: '0 0 4px' }}>No service times yet</p>
            <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 14px' }}>Add your first service to display on the website.</p>
            <button type="button" style={{ ...st.addBtn, padding: '8px 18px', fontSize: 12 }} onClick={addServiceTime}>+ Add Service</button>
          </div>
        ) : (
          <div style={{ position: 'relative', paddingLeft: 32 }}>
            {/* Vertical timeline line */}
            <div style={{ position: 'absolute', left: 11, top: 6, bottom: 40, width: 2, background: '#e2e8f0', borderRadius: 1 }} />

            {form.serviceTimes.map((st2, i) => {
              const isMain = st2.isHighlighted;
              return (
                <div key={i} style={{ position: 'relative', marginBottom: i < form.serviceTimes.length - 1 ? 20 : 12 }}>
                  {/* Timeline node */}
                  <div style={{
                    position: 'absolute', left: -32, top: 16, width: 24, height: 24,
                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isMain ? '#f59e0b' : '#fff',
                    border: isMain ? '2px solid #f59e0b' : '2px solid #cbd5e1',
                    boxShadow: isMain ? '0 0 0 4px rgba(245,158,11,0.15)' : '0 0 0 4px #fff',
                    zIndex: 2,
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={isMain ? '#fff' : '#94a3b8'} strokeWidth="2.5" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                    </svg>
                  </div>

                  {/* Content card */}
                  <div style={{
                    padding: '14px 18px', borderRadius: 12,
                    background: isMain ? 'linear-gradient(135deg, #fffbeb 0%, #fef9c3 100%)' : '#fafbfc',
                    border: isMain ? '1.5px solid #fde68a' : '1px solid #f1f5f9',
                    boxShadow: isMain ? '0 2px 10px rgba(245,158,11,0.1)' : 'none',
                    borderLeft: isMain ? '3px solid #f59e0b' : '3px solid #e2e8f0',
                  }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <input
                          style={{ ...st.input, fontWeight: 600, fontSize: 14, padding: '8px 12px', background: '#fff', border: '1px solid #e2e8f0' }}
                          placeholder="e.g. Sunday Worship"
                          value={st2.label}
                          onChange={e => updateServiceTime(i, 'label', e.target.value)}
                        />
                        <input
                          style={{ ...st.input, fontSize: 13, padding: '7px 12px', background: '#fff', border: '1px solid #e2e8f0' }}
                          placeholder="e.g. 09:00 AM - 12:00 PM"
                          value={st2.time}
                          onChange={e => updateServiceTime(i, 'time', e.target.value)}
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
                        <button
                          type="button"
                          onClick={() => updateServiceTime(i, 'isHighlighted', !isMain)}
                          style={{
                            padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                            border: isMain ? '1px solid #f59e0b' : '1px solid #e2e8f0',
                            background: isMain ? '#f59e0b' : '#fff',
                            color: isMain ? '#fff' : '#94a3b8',
                          }}
                        >
                          {isMain ? '★ Main' : '☆ Main'}
                        </button>
                        <button
                          type="button"
                          onClick={() => removeServiceTime(i)}
                          style={{
                            padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                            background: '#fff', border: '1px solid #fecaca', color: '#ef4444', cursor: 'pointer',
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Add node at end of timeline */}
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', left: -32, top: 8, width: 24, height: 24,
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: '#fff', border: '2px dashed #cbd5e1', zIndex: 2,
                boxShadow: '0 0 0 4px #fff',
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </div>
              <button
                type="button"
                onClick={addServiceTime}
                style={{
                  padding: '10px 18px', borderRadius: 10, border: '1.5px dashed #cbd5e1',
                  background: 'transparent', color: '#94a3b8', fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', width: '100%', textAlign: 'left',
                }}
              >
                Add another service time...
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Social Links — Interactive Pill Rows */}
      <div style={{ ...st.card, padding: '24px 28px', marginBottom: 20 }}>
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>Social Media Links</h3>
          <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>Connect your church's social profiles — they appear in the website footer</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { key: 'youtube', name: 'YouTube', color: '#FF0000', placeholder: 'https://youtube.com/@yourchannel',
              icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/></svg> },
            { key: 'twitter', name: 'Twitter / X', color: '#000000', placeholder: 'https://x.com/yourchurch',
              icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="#fff"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
            { key: 'facebook', name: 'Facebook', color: '#1877F2', placeholder: 'https://facebook.com/yourchurch',
              icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
            { key: 'instagram', name: 'Instagram', color: '#E4405F', placeholder: 'https://instagram.com/yourchurch',
              icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" fill="none" stroke="#fff" strokeWidth="2"/><circle cx="12" cy="12" r="5" fill="none" stroke="#fff" strokeWidth="2"/><circle cx="17.5" cy="6.5" r="1.5" fill="#fff"/></svg> },
          ].map(platform => {
            const val = form.socialLinks[platform.key] || '';
            const linked = val.trim().length > 0;
            return (
              <div key={platform.key} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '10px 14px',
                borderRadius: 12,
                background: linked ? '#fff' : '#fafbfc',
                border: linked ? `1.5px solid ${platform.color}33` : '1.5px solid #f1f5f9',
                transition: 'all 0.2s ease',
              }}>
                {/* Brand circle */}
                <div style={{
                  width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: linked ? platform.color : '#cbd5e1',
                  boxShadow: linked ? `0 3px 10px ${platform.color}30` : 'none',
                  transition: 'all 0.2s ease',
                }}>
                  {platform.icon}
                </div>

                {/* Name + input */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 5 }}>{platform.name}</div>
                  <input
                    style={{
                      ...st.input, width: '100%', fontSize: 12, padding: '7px 11px',
                      background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8,
                      boxSizing: 'border-box',
                    }}
                    placeholder={platform.placeholder}
                    value={val}
                    onChange={e => setForm({ ...form, socialLinks: { ...form.socialLinks, [platform.key]: e.target.value } })}
                  />
                </div>

                {/* Status badge */}
                <div style={{
                  flexShrink: 0, padding: '4px 10px', borderRadius: 20,
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.02em',
                  display: 'flex', alignItems: 'center', gap: 5,
                  background: linked ? '#f0fdf4' : '#f8fafc',
                  color: linked ? '#16a34a' : '#94a3b8',
                  border: linked ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
                  transition: 'all 0.2s ease',
                }}>
                  <span style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: linked ? '#22c55e' : '#d1d5db',
                    boxShadow: linked ? '0 0 0 2px rgba(34,197,94,0.2)' : 'none',
                  }} />
                  {linked ? 'Connected' : 'Not linked'}
                </div>

                {/* Visit link */}
                {linked && (
                  <a href={val} target="_blank" rel="noopener noreferrer" style={{
                    flexShrink: 0, width: 30, height: 30, borderRadius: 8,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: '#f8fafc', border: '1px solid #e2e8f0',
                    color: '#64748b', textDecoration: 'none',
                    transition: 'all 0.15s ease',
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Save */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
        <button type="button" style={st.cancelBtn} onClick={fetchContent}>Reset</button>
        <button type="submit" style={st.saveBtn} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
      </div>
    </form>
  );
}

/* ──────────────────────────────────────────────────────────
   PAGES SECTION
   ────────────────────────────────────────────────────────── */

function previewText(htmlOrText, max = 60) {
  if (!htmlOrText) return '—';
  const plain = String(htmlOrText).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (plain.length <= max) return plain || '—';
  return plain.slice(0, max).trim() + '…';
}

function EmptyPagesIllustration() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </svg>
  );
}

function PagesSection({ showToast }) {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyPageForm);
  const [saving, setSaving] = useState(false);
  const [deleteSlug, setDeleteSlug] = useState(null);
  const [search, setSearch] = useState('');

  const fetchPages = async () => {
    try { const { data } = await api.get('/pages'); setPages(Array.isArray(data) ? data : []); }
    catch { setPages([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPages(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyPageForm); setShowModal(true); };
  const openEdit = (pg) => {
    setEditing(pg.slug);
    setForm({ slug: pg.slug, title: pg.title || '', content: pg.content || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const slug = editing || form.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
      await api.put(`/pages/${slug}`, { title: form.title, content: form.content });
      setShowModal(false);
      fetchPages();
      showToast?.(editing ? 'Page updated successfully' : 'Page created successfully');
    } catch (err) { alert(err.response?.data?.message || 'Error saving page'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/pages/${deleteSlug}`);
      setDeleteSlug(null);
      fetchPages();
      showToast?.('Page deleted');
    }
    catch { alert('Error deleting page'); }
  };

  const q = search.trim().toLowerCase();
  const filteredPages = q
    ? pages.filter(pg => (pg.title || '').toLowerCase().includes(q) || (pg.slug || '').toLowerCase().includes(q))
    : pages;

  return (
    <>
      <div style={st.sectionHeader}>
        <div style={st.sectionHeaderRow}>
          <span style={st.count}>{pages.length} page{pages.length !== 1 ? 's' : ''}</span>
          <input
            type="search"
            placeholder="Search by title or slug…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={st.searchInput}
          />
        </div>
        <button style={st.addBtn} onClick={openCreate}>+ Add New Page</button>
      </div>

      <div style={st.card}>
        {loading ? (
          <div style={st.loadingWrap}>
            <div style={st.spinner} />
            <span style={st.loadingText}>Loading pages...</span>
          </div>
        ) : pages.length === 0 ? (
          <div style={st.emptyState}>
            <div style={st.emptyStateIcon} aria-hidden><EmptyPagesIllustration /></div>
            <p style={st.emptyStateTitle}>No pages yet</p>
            <p style={st.emptyStateText}>Create your first content page to show on the site — like About Us, Contact, or a custom page.</p>
            <button type="button" style={st.addBtn} onClick={openCreate}>+ Add New Page</button>
          </div>
        ) : filteredPages.length === 0 ? (
          <div style={st.emptyState}>
            <SearchEmptyIcon />
            <p style={st.emptyStateTitle}>No results for "{search}"</p>
            <p style={st.emptyStateText}>Try a different title or slug.</p>
          </div>
        ) : (
          <div className="admin-table-wrap" style={st.tableWrap}>
            <table style={st.table}>
              <thead>
                <tr>
                  <th style={st.th}>Title</th>
                  <th style={st.th}>Slug</th>
                  <th style={st.th}>Preview</th>
                  <th style={st.th}>Last Updated</th>
                  <th style={{ ...st.th, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPages.map(pg => (
                  <tr key={pg._id || pg.slug} style={st.tr}>
                    <td style={st.td}>
                      <div style={st.titleCell}>
                        <span style={st.pageTitleDot} />
                        <span style={{ fontWeight: 600, color: '#0f172a' }}>{pg.title}</span>
                      </div>
                    </td>
                    <td style={st.td}><code style={st.slugCode}>/{pg.slug}</code></td>
                    <td style={{ ...st.td, maxWidth: 220, color: '#64748b', fontSize: 13 }} title={previewText(pg.content, 500)}>{previewText(pg.content)}</td>
                    <td style={st.td}>
                      <span style={st.dateText}>{pg.updatedAt ? new Date(pg.updatedAt).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</span>
                    </td>
                    <td style={{ ...st.td, textAlign: 'right' }}>
                      <div style={st.actionGroup}>
                        <button style={st.editBtn} onClick={() => openEdit(pg)} title="Edit page">
                          <EditIcon /> Edit
                        </button>
                        <button style={st.deleteBtn} onClick={() => setDeleteSlug(pg.slug)} title="Delete page">
                          <TrashIcon /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div style={st.overlay} onClick={() => setShowModal(false)}>
          <div style={st.modal} onClick={e => e.stopPropagation()}>
            <div style={st.modalHeader}>
              <h2 style={st.modalTitle}>{editing ? 'Edit Page' : 'Add New Page'}</h2>
              <button type="button" style={st.modalClose} onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} style={st.form}>
              <div style={st.field}>
                <label style={st.label}>Slug *</label>
                <input
                  style={{ ...st.input, ...(editing ? st.inputDisabled : {}) }} required value={form.slug} disabled={!!editing}
                  placeholder="e.g. about-us"
                  onChange={e => setForm({ ...form, slug: e.target.value })}
                />
                {!editing && <span style={st.hint}>URL path for this page (lowercase, hyphens only)</span>}
              </div>
              <div style={st.field}>
                <label style={st.label}>Title *</label>
                <input style={st.input} required value={form.title} placeholder="Page title" onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>
              <div style={st.field}>
                <label style={st.label}>Content *</label>
                <textarea style={{ ...st.input, height: 200, resize: 'vertical' }} required value={form.content} placeholder="Write the page content here..." onChange={e => setForm({ ...form, content: e.target.value })} />
                <span style={st.charCount}>{(form.content || '').length} characters</span>
              </div>
              <div style={st.modalActions}>
                <button type="button" style={st.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" style={st.saveBtn} disabled={saving}>{saving ? 'Saving...' : editing ? 'Update Page' : 'Create Page'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteSlug && (
        <div style={st.overlay} onClick={() => setDeleteSlug(null)}>
          <div style={st.confirmBox} onClick={e => e.stopPropagation()}>
            <div style={st.confirmIconWrap}>
              <TrashIcon size={24} color="#ef4444" />
            </div>
            <h3 style={st.confirmTitle}>Delete Page</h3>
            <p style={st.confirmText}>Are you sure you want to delete <strong>/{deleteSlug}</strong>? This action cannot be undone.</p>
            <div style={st.confirmActions}>
              <button style={st.cancelBtn} onClick={() => setDeleteSlug(null)}>Keep Page</button>
              <button style={st.deleteBtnFull} onClick={handleDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ──────────────────────────────────────────────────────────
   LEADERS SECTION  (embedded inside Pages dashboard)
   ────────────────────────────────────────────────────────── */

function LeadersSection({ showToast }) {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyLeaderForm);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [modalTab, setModalTab] = useState('basic');
  const fileRef = useRef(null);

  const fetchLeaders = async () => {
    try {
      const { data } = await api.get('/leaders?all=true');
      setLeaders(Array.isArray(data) ? data : []);
    } catch { setLeaders([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchLeaders(); }, []);

  const openCreate = () => {
    setEditing(null); setForm(emptyLeaderForm);
    setPhotoFile(null); setPhotoPreview(''); setModalTab('basic'); setShowModal(true);
  };

  const openEdit = (l) => {
    setEditing(l._id);
    setForm({
      name: l.name || '', role: l.role || '', roleAm: l.roleAm || '',
      bio: l.bio || '', photoUrl: l.photoUrl || '',
      phone: l.phone || '', email: l.email || '', address: l.address || '',
      facebook: l.facebook || '', twitter: l.twitter || '', linkedin: l.linkedin || '',
      displayOrder: l.displayOrder ?? 0, isActive: l.isActive !== false,
    });
    setPhotoFile(null); setPhotoPreview(l.photoUrl || ''); setModalTab('basic'); setShowModal(true);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k !== 'photoUrl' || !photoFile) fd.append(k, v);
      });
      if (photoFile) fd.append('photo', photoFile);

      if (editing) {
        await api.put(`/leaders/${editing}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/leaders', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      setShowModal(false);
      fetchLeaders();
      showToast?.(editing ? 'Leader updated successfully' : 'Leader added successfully');
    } catch (err) { alert(err.response?.data?.message || 'Error saving leader'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/leaders/${deleteId}`);
      setDeleteId(null);
      fetchLeaders();
      showToast?.('Leader deleted');
    }
    catch { alert('Error deleting leader'); }
  };

  const toggleActive = async (leader) => {
    try {
      const next = !leader.isActive;
      await api.put(`/leaders/${leader._id}`, { isActive: next });
      fetchLeaders();
      showToast?.(next ? 'Leader is now visible on the site' : 'Leader hidden from the site');
    } catch { alert('Error updating leader'); }
  };

  const filtered = leaders.filter(l =>
    l.name?.toLowerCase().includes(search.toLowerCase()) ||
    l.role?.toLowerCase().includes(search.toLowerCase())
  );

  const initials = (name) => name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <>
      <div style={st.sectionHeader}>
        <input
          type="text" placeholder="Search leaders..." value={search}
          onChange={e => setSearch(e.target.value)} style={st.searchInput}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={st.count}>{filtered.length} leader{filtered.length !== 1 ? 's' : ''}</span>
          <button style={st.addBtn} onClick={openCreate}>+ Add Leader</button>
        </div>
      </div>

      {/* Leaders Card Grid */}
      <div style={st.leaderGrid}>
        {loading ? (
          <div style={st.loadingWrap}>
            <div style={st.spinner} />
            <span style={st.loadingText}>Loading leaders...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div style={st.emptyState}>
            <LeadersIcon />
            <p style={st.emptyStateTitle}>No leaders found</p>
            <p style={st.emptyStateText}>Add your first leader to get started.</p>
            <button type="button" style={st.addBtn} onClick={openCreate}>+ Add Leader</button>
          </div>
        ) : filtered.map(l => (
          <div key={l._id} style={{ ...st.leaderCard, opacity: l.isActive ? 1 : 0.55 }}>
            {/* Status bar */}
            <div style={st.lcTop}>
              <span style={st.lcDot(l.isActive)} title={l.isActive ? 'Visible on site' : 'Hidden'} />
              <span style={st.lcOrder}>Order: {l.displayOrder}</span>
            </div>

            {/* Avatar */}
            <div style={st.lcAvatarWrap}>
              <LeaderAvatar src={l.photoUrl} name={l.name} initials={initials(l.name)} />
            </div>

            <h3 style={st.lcName}>{l.name}</h3>
            <p style={st.lcRole}>{l.role}</p>
            {l.roleAm && <p style={st.lcRoleAm}>{l.roleAm}</p>}

            {/* Contact chips */}
            <div style={st.lcChips}>
              {l.phone && <span style={st.lcChip} title={l.phone}>&#9742; {l.phone}</span>}
              {l.email && <span style={st.lcChip} title={l.email}>&#9993; {l.email}</span>}
              {l.address && <span style={st.lcChip} title={l.address}>&#9873; {l.address}</span>}
            </div>

            {/* Socials */}
            {(l.facebook || l.twitter || l.linkedin) && (
              <div style={st.lcSocials}>
                {l.facebook && <a href={l.facebook} target="_blank" rel="noreferrer" style={st.lcSocialLink} title="Facebook"><FBIcon /></a>}
                {l.twitter && <a href={l.twitter} target="_blank" rel="noreferrer" style={st.lcSocialLink} title="Twitter / X"><XIcon /></a>}
                {l.linkedin && <a href={l.linkedin} target="_blank" rel="noreferrer" style={st.lcSocialLink} title="LinkedIn"><LIIcon /></a>}
              </div>
            )}

            {/* Actions */}
            <div style={st.lcActions}>
              <button style={st.editBtn} onClick={() => openEdit(l)}>Edit</button>
              <button style={st.lcToggleBtn(l.isActive)} onClick={() => toggleActive(l)}>
                {l.isActive ? 'Hide' : 'Show'}
              </button>
              <button style={st.deleteBtn} onClick={() => setDeleteId(l._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Leader Create/Edit Modal ── */}
      {showModal && (
        <div style={st.overlay} onClick={() => setShowModal(false)}>
          <div style={st.leaderModal} onClick={e => e.stopPropagation()}>
            <div style={st.lmHeader}>
              <h2 style={st.modalTitle}>{editing ? 'Edit Leader' : 'Add New Leader'}</h2>
              <button style={st.lmClose} onClick={() => setShowModal(false)}>&times;</button>
            </div>

            {/* Modal Tabs */}
            <div style={st.lmTabs}>
              {[
                { key: 'basic', label: 'Basic Info' },
                { key: 'contact', label: 'Contact' },
                { key: 'social', label: 'Social & Settings' },
              ].map(t => (
                <button key={t.key} style={modalTab === t.key ? st.lmTabActive : st.lmTab} onClick={() => setModalTab(t.key)}>
                  {t.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '20px 24px 24px' }}>
              {/* Basic Info */}
              {modalTab === 'basic' && (
                <>
                  <div style={st.photoRow}>
                    <div style={st.photoUpload} onClick={() => fileRef.current?.click()}>
                      {photoPreview ? (
                        <img src={photoPreview} alt="Preview" style={st.photoImg} />
                      ) : (
                        <div style={st.photoPlaceholder}>
                          <CameraIcon />
                          <span style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>Upload</span>
                        </div>
                      )}
                    </div>
                    <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: '0 0 2px', fontSize: 13, fontWeight: 600, color: '#334155' }}>Leader Photo</p>
                      <p style={{ margin: 0, fontSize: 12, color: '#94a3b8' }}>Square image recommended (400x400). JPG, PNG, WebP.</p>
                      {photoPreview && (
                        <button type="button" style={st.removePhotoBtn} onClick={() => { setPhotoFile(null); setPhotoPreview(''); setForm({ ...form, photoUrl: '' }); }}>
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                  <div style={st.row2}>
                    <div style={st.field}>
                      <label style={st.label}>Full Name *</label>
                      <input style={st.input} required placeholder="Pastor Daniel Ababe" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div style={st.field}>
                      <label style={st.label}>Role / Title *</label>
                      <input style={st.input} required placeholder="Senior Pastor" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} />
                    </div>
                  </div>
                  <div style={st.field}>
                    <label style={st.label}>Role (Amharic)</label>
                    <input style={st.input} placeholder="ዋና ፓስተር" value={form.roleAm} onChange={e => setForm({ ...form, roleAm: e.target.value })} />
                  </div>
                  <div style={st.field}>
                    <label style={st.label}>Bio</label>
                    <textarea style={{ ...st.input, height: 90, resize: 'vertical' }} placeholder="A brief biography..." value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
                  </div>
                </>
              )}

              {/* Contact */}
              {modalTab === 'contact' && (
                <>
                  <div style={st.row2}>
                    <div style={st.field}>
                      <label style={st.label}>Phone</label>
                      <input style={st.input} placeholder="+251 911 123 456" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                    </div>
                    <div style={st.field}>
                      <label style={st.label}>Email</label>
                      <input style={st.input} type="email" placeholder="pastor@church.org" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                    </div>
                  </div>
                  <div style={st.field}>
                    <label style={st.label}>Address</label>
                    <textarea style={{ ...st.input, height: 70, resize: 'vertical' }} placeholder="Office or mailing address..." value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
                  </div>
                </>
              )}

              {/* Social & Settings */}
              {modalTab === 'social' && (
                <>
                  <div style={st.field}>
                    <label style={st.label}>Facebook URL</label>
                    <input style={st.input} placeholder="https://facebook.com/..." value={form.facebook} onChange={e => setForm({ ...form, facebook: e.target.value })} />
                  </div>
                  <div style={st.field}>
                    <label style={st.label}>Twitter / X URL</label>
                    <input style={st.input} placeholder="https://x.com/..." value={form.twitter} onChange={e => setForm({ ...form, twitter: e.target.value })} />
                  </div>
                  <div style={st.field}>
                    <label style={st.label}>LinkedIn URL</label>
                    <input style={st.input} placeholder="https://linkedin.com/in/..." value={form.linkedin} onChange={e => setForm({ ...form, linkedin: e.target.value })} />
                  </div>
                  <div style={st.row2}>
                    <div style={st.field}>
                      <label style={st.label}>Display Order</label>
                      <input style={st.input} type="number" min="0" value={form.displayOrder} onChange={e => setForm({ ...form, displayOrder: parseInt(e.target.value) || 0 })} />
                      <span style={st.hint}>Lower numbers appear first</span>
                    </div>
                    <div style={st.field}>
                      <label style={st.label}>Visibility</label>
                      <div style={st.visToggle}>
                        <button type="button" style={form.isActive ? st.visActive : st.visOpt} onClick={() => setForm({ ...form, isActive: true })}>Active</button>
                        <button type="button" style={!form.isActive ? st.visHidden : st.visOpt} onClick={() => setForm({ ...form, isActive: false })}>Hidden</button>
                      </div>
                      <span style={st.hint}>Hidden leaders won't appear on the website</span>
                    </div>
                  </div>
                </>
              )}

              <div style={st.modalActions}>
                <button type="button" style={st.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" style={st.saveBtn} disabled={saving}>
                  {saving ? 'Saving...' : editing ? 'Update Leader' : 'Add Leader'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div style={st.overlay} onClick={() => setDeleteId(null)}>
          <div style={st.confirmBox} onClick={e => e.stopPropagation()}>
            <div style={st.confirmIconWrap}>
              <TrashIcon size={24} color="#ef4444" />
            </div>
            <h3 style={st.confirmTitle}>Delete Leader</h3>
            <p style={st.confirmText}>This will permanently remove this leader and their photo. This cannot be undone.</p>
            <div style={st.confirmActions}>
              <button style={st.cancelBtn} onClick={() => setDeleteId(null)}>Keep Leader</button>
              <button style={st.deleteBtnFull} onClick={handleDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ──────────────────────────────────────────────────────────
   WEEKLY MINISTRIES SECTION
   ────────────────────────────────────────────────────────── */

const CATEGORY_OPTIONS = [
  { value: 'youth', label: 'Youth' },
  { value: 'prayer', label: 'Prayer' },
  { value: 'bible-study', label: 'Bible Study' },
  { value: 'children', label: 'Children' },
  { value: 'women', label: 'Women' },
  { value: 'choir', label: 'Choir' },
  { value: 'ministry', label: 'Ministry' },
  { value: 'other', label: 'Other' },
];

const ICON_OPTIONS = [
  { value: 'youth', label: 'Youth / Community' },
  { value: 'prayer', label: 'Prayer Hands' },
  { value: 'bible-study', label: 'Bible' },
  { value: 'children', label: 'Children' },
  { value: 'women', label: 'Women' },
  { value: 'choir', label: 'Choir / Music' },
];

const DAY_OPTIONS = ['Sundays', 'Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays'];

const DAY_DOT_COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#3b82f6', '#8b5cf6'];

const CATEGORY_VISUAL = {
  youth: { badgeBg: '#e0e7ff', badgeFg: '#3730a3' },
  prayer: { badgeBg: '#fce7f3', badgeFg: '#9d174d' },
  'bible-study': { badgeBg: '#fef3c7', badgeFg: '#b45309' },
  children: { badgeBg: '#dcfce7', badgeFg: '#166534' },
  women: { badgeBg: '#f3e8ff', badgeFg: '#6b21a8' },
  choir: { badgeBg: '#e0f2fe', badgeFg: '#0369a1' },
  ministry: { badgeBg: '#f1f5f9', badgeFg: '#334155' },
  other: { badgeBg: '#f5f5f4', badgeFg: '#44403c' },
};

function ministryDayDotColor(dayName) {
  const i = DAY_OPTIONS.indexOf(dayName);
  return DAY_DOT_COLORS[i >= 0 ? i : 0];
}

function ministryIconLetter(icon) {
  const opt = ICON_OPTIONS.find(o => o.value === icon);
  if (!opt) return '?';
  const word = opt.label.split(/[\s/]+/).find(w => /[A-Za-z]/.test(w));
  return word ? word.charAt(0).toUpperCase() : '?';
}

const emptyMinistryForm = { title: '', titleAmharic: '', description: '', descriptionAmharic: '', icon: 'youth', day: 'Sundays', time: '', location: '', category: 'ministry', order: 0, isActive: true };

function MinistriesSection({ showToast }) {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyMinistryForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchPrograms = async () => {
    try { const { data } = await api.get('/programs?admin=true'); setPrograms(Array.isArray(data) ? data : []); }
    catch { setPrograms([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPrograms(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyMinistryForm); setShowModal(true); };
  const openEdit = (p) => {
    setEditing(p._id);
    setForm({
      title: p.title || '', titleAmharic: p.titleAmharic || '',
      description: p.description || '', descriptionAmharic: p.descriptionAmharic || '',
      icon: p.icon || 'youth', day: p.day || 'Sundays', time: p.time || '',
      location: p.location || '', category: p.category || 'ministry',
      order: p.order ?? 0, isActive: p.isActive !== false,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) await api.put(`/programs/${editing}`, form);
      else await api.post('/programs', form);
      setShowModal(false);
      fetchPrograms();
      showToast?.(editing ? 'Ministry updated successfully' : 'Ministry created successfully');
    } catch (err) { alert(err.response?.data?.message || 'Error saving ministry'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/programs/${deleteId}`);
      setDeleteId(null);
      fetchPrograms();
      showToast?.('Ministry deleted');
    }
    catch { alert('Error deleting ministry'); }
  };

  const toggleActive = async (p) => {
    try {
      const next = !p.isActive;
      await api.put(`/programs/${p._id}`, { isActive: next });
      fetchPrograms();
      showToast?.(next ? 'Ministry is now active' : 'Ministry hidden');
    }
    catch { alert('Error updating ministry'); }
  };

  const filtered = programs.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.day?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div style={st.sectionHeader}>
        <input type="text" placeholder="Search ministries..." value={search} onChange={e => setSearch(e.target.value)} style={st.searchInput} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={st.count}>{filtered.length} ministr{filtered.length !== 1 ? 'ies' : 'y'}</span>
          <button style={st.addBtn} onClick={openCreate}>+ Add Ministry</button>
        </div>
      </div>

      <div style={st.card}>
        {loading ? (
          <div style={st.loadingWrap}>
            <div style={st.spinner} />
            <span style={st.loadingText}>Loading ministries...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div style={st.emptyState}>
            <MinistriesIcon />
            <p style={st.emptyStateTitle}>No ministries found</p>
            <p style={st.emptyStateText}>Add your first weekly ministry program!</p>
            <button type="button" style={st.addBtn} onClick={openCreate}>+ Add Ministry</button>
          </div>
        ) : (
          <div className="admin-table-wrap" style={st.tableWrap}>
          <table style={st.table}>
            <thead>
              <tr>
                <th style={st.th}>Icon</th>
                <th style={st.th}>Title</th>
                <th style={st.th}>Day & Time</th>
                <th style={st.th}>Location</th>
                <th style={st.th}>Category</th>
                <th style={st.th}>Status</th>
                <th style={{ ...st.th, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const cv = CATEGORY_VISUAL[p.category] || CATEGORY_VISUAL.other;
                const iconOpt = ICON_OPTIONS.find(i => i.value === p.icon);
                return (
                <tr key={p._id} style={{ ...st.tr, opacity: p.isActive ? 1 : 0.55 }}>
                  <td style={st.td}>
                    <span
                      style={{ ...st.ministryIconBadge, background: cv.badgeBg, color: cv.badgeFg }}
                      title={iconOpt ? `${iconOpt.label} · ${p.category || 'other'}` : p.category}
                    >
                      {ministryIconLetter(p.icon)}
                    </span>
                  </td>
                  <td style={st.td}>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{p.title}</div>
                    {p.titleAmharic && <div style={{ fontSize: 12, color: '#64748b', marginTop: 1 }}>{p.titleAmharic}</div>}
                    {p.descriptionAmharic && (
                      <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4, maxWidth: 280 }} title={previewText(p.descriptionAmharic, 200)}>
                        {previewText(p.descriptionAmharic, 48)}
                      </div>
                    )}
                  </td>
                  <td style={st.td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ ...st.ministryDayDot, background: ministryDayDotColor(p.day) }} title={p.day} />
                      <div>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{p.day}</div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>{p.time}</div>
                      </div>
                    </div>
                  </td>
                  <td style={st.td}>{p.location || '—'}</td>
                  <td style={st.td}>
                    <span style={{ ...st.ministryCatBadge, background: cv.badgeBg, color: cv.badgeFg }}>{(p.category || 'other').replace(/-/g, ' ')}</span>
                  </td>
                  <td style={st.td}>
                    <button
                      style={{ ...st.verseStatusBtn, background: p.isActive ? '#dcfce7' : '#f1f5f9', color: p.isActive ? '#16a34a' : '#64748b' }}
                      onClick={() => toggleActive(p)}
                    >
                      {p.isActive ? 'Active' : 'Hidden'}
                    </button>
                  </td>
                  <td style={{ ...st.td, textAlign: 'right' }}>
                    <div style={st.actionGroup}>
                      <button style={st.editBtn} onClick={() => openEdit(p)}><EditIcon /> Edit</button>
                      <button style={st.deleteBtn} onClick={() => setDeleteId(p._id)}><TrashIcon /> Delete</button>
                    </div>
                  </td>
                </tr>
              );})}
            </tbody>
          </table>
          </div>
        )}
      </div>

      {showModal && (
        <div style={st.overlay} onClick={() => setShowModal(false)}>
          <div style={{ ...st.modal, maxWidth: 600 }} onClick={e => e.stopPropagation()}>
            <div style={st.modalHeader}>
              <h2 style={st.modalTitle}>{editing ? 'Edit Ministry' : 'Add Weekly Ministry'}</h2>
              <button type="button" style={st.modalClose} onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} style={st.form}>
              <div style={st.row2}>
                <div style={st.field}>
                  <label style={st.label}>Title (English) *</label>
                  <input style={st.input} required placeholder="e.g. Youth Aflame Ministry" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                </div>
                <div style={st.field}>
                  <label style={st.label}>Title (Amharic)</label>
                  <input style={st.input} placeholder="e.g. ወጣት አገልግሎት" value={form.titleAmharic} onChange={e => setForm({ ...form, titleAmharic: e.target.value })} />
                </div>
              </div>
              <div style={st.field}>
                <label style={st.label}>Description (English) *</label>
                <textarea style={{ ...st.input, height: 80, resize: 'vertical' }} required placeholder="What this ministry is about..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <div style={st.field}>
                <label style={st.label}>Description (Amharic)</label>
                <textarea style={{ ...st.input, height: 80, resize: 'vertical' }} placeholder="የአማርኛ ማብራሪያ..." value={form.descriptionAmharic} onChange={e => setForm({ ...form, descriptionAmharic: e.target.value })} />
              </div>
              <div style={st.row2}>
                <div style={st.field}>
                  <label style={st.label}>Day *</label>
                  <select style={st.input} value={form.day} onChange={e => setForm({ ...form, day: e.target.value })}>
                    {DAY_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div style={st.field}>
                  <label style={st.label}>Time *</label>
                  <input style={st.input} required placeholder="e.g. 6:00 PM" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
                </div>
              </div>
              <div style={st.row2}>
                <div style={st.field}>
                  <label style={st.label}>Location</label>
                  <input style={st.input} placeholder="e.g. Youth Hall" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
                </div>
                <div style={st.field}>
                  <label style={st.label}>Category</label>
                  <select style={st.input} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {CATEGORY_OPTIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
              </div>
              <div style={st.row2}>
                <div style={st.field}>
                  <label style={st.label}>Icon</label>
                  <select style={st.input} value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })}>
                    {ICON_OPTIONS.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
                  </select>
                </div>
                <div style={st.field}>
                  <label style={st.label}>Display Order</label>
                  <input style={st.input} type="number" min="0" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })} />
                  <span style={st.hint}>Lower numbers appear first</span>
                </div>
              </div>
              <div style={st.verseActiveWrap}>
                <label style={{ ...st.label, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} style={{ width: 16, height: 16, accentColor: '#0ea5e9', cursor: 'pointer' }} />
                  Active (visible on the Services page)
                </label>
              </div>
              <div style={st.modalActions}>
                <button type="button" style={st.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" style={st.saveBtn} disabled={saving}>{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div style={st.overlay} onClick={() => setDeleteId(null)}>
          <div style={st.confirmBox} onClick={e => e.stopPropagation()}>
            <div style={st.confirmIconWrap}>
              <TrashIcon size={24} color="#ef4444" />
            </div>
            <h3 style={st.confirmTitle}>Delete Ministry</h3>
            <p style={st.confirmText}>Are you sure you want to delete this ministry? This cannot be undone.</p>
            <div style={st.confirmActions}>
              <button style={st.cancelBtn} onClick={() => setDeleteId(null)}>Keep Ministry</button>
              <button style={st.deleteBtnFull} onClick={handleDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ──────────────────────────────────────────────────────────
   VERSE OF THE DAY SECTION
   ────────────────────────────────────────────────────────── */

const emptyVerseForm = { textEnglish: '', textAmharic: '', referenceEnglish: '', referenceAmharic: '', date: '', isActive: true };

function verseStartOfDayMs(d) {
  const x = new Date(d);
  return new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
}

function verseRelativeLabel(d) {
  const t = verseStartOfDayMs(new Date());
  const v = verseStartOfDayMs(d);
  const diff = Math.round((v - t) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff === -1) return 'Yesterday';
  return '';
}

function verseRowStyle(d) {
  const t = verseStartOfDayMs(new Date());
  const v = verseStartOfDayMs(d);
  const diff = Math.round((v - t) / 86400000);
  if (diff === 0) return { borderLeft: '4px solid #38bdf8', background: 'linear-gradient(90deg, #eff6ff 0%, #fff 14%)' };
  if (diff < 0) return { opacity: 0.72 };
  return {};
}

function VerseSection({ showToast }) {
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verseSearch, setVerseSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyVerseForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchVerses = async () => {
    try { const { data } = await api.get('/verses'); setVerses(Array.isArray(data) ? data : []); }
    catch { setVerses([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchVerses(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyVerseForm, date: new Date().toISOString().split('T')[0] });
    setShowModal(true);
  };

  const openEdit = (v) => {
    setEditing(v._id);
    setForm({
      textEnglish: v.textEnglish || '', textAmharic: v.textAmharic || '',
      referenceEnglish: v.referenceEnglish || '', referenceAmharic: v.referenceAmharic || '',
      date: v.date ? new Date(v.date).toISOString().split('T')[0] : '',
      isActive: v.isActive !== false,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) await api.put(`/verses/${editing}`, form);
      else await api.post('/verses', form);
      setShowModal(false);
      fetchVerses();
      showToast?.(editing ? 'Verse updated successfully' : 'Verse scheduled successfully');
    } catch (err) { alert(err.response?.data?.message || 'Error saving verse'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/verses/${deleteId}`);
      setDeleteId(null);
      fetchVerses();
      showToast?.('Verse deleted');
    }
    catch { alert('Error deleting verse'); }
  };

  const toggleActive = async (v) => {
    try {
      const next = !v.isActive;
      await api.put(`/verses/${v._id}`, { isActive: next });
      fetchVerses();
      showToast?.(next ? 'Verse is active on the homepage' : 'Verse deactivated');
    }
    catch { alert('Error updating verse'); }
  };

  const vq = verseSearch.trim().toLowerCase();
  const filteredVerses = vq
    ? verses.filter(v =>
        (v.textEnglish || '').toLowerCase().includes(vq) ||
        (v.textAmharic || '').toLowerCase().includes(vq) ||
        (v.referenceEnglish || '').toLowerCase().includes(vq) ||
        (v.referenceAmharic || '').toLowerCase().includes(vq)
      )
    : verses;

  return (
    <>
      <div style={st.sectionHeader}>
        <div style={st.sectionHeaderRow}>
          <span style={st.count}>{verses.length} verse{verses.length !== 1 ? 's' : ''}</span>
          <input
            type="search"
            placeholder="Search verse text or reference…"
            value={verseSearch}
            onChange={e => setVerseSearch(e.target.value)}
            style={st.searchInput}
          />
        </div>
        <button style={st.addBtn} onClick={openCreate}>+ Add Verse</button>
      </div>

      <div style={st.card}>
        {loading ? (
          <div style={st.loadingWrap}>
            <div style={st.spinner} />
            <span style={st.loadingText}>Loading verses...</span>
          </div>
        ) : verses.length === 0 ? (
          <div style={st.emptyState}>
            <VerseIcon />
            <p style={st.emptyStateTitle}>No verses yet</p>
            <p style={st.emptyStateText}>Add your first verse of the day for the homepage!</p>
            <button type="button" style={st.addBtn} onClick={openCreate}>+ Add Verse</button>
          </div>
        ) : filteredVerses.length === 0 ? (
          <div style={st.emptyState}>
            <SearchEmptyIcon />
            <p style={st.emptyStateTitle}>No results for "{verseSearch}"</p>
            <p style={st.emptyStateText}>Try a different search term.</p>
          </div>
        ) : (
          <div className="admin-table-wrap" style={st.tableWrap}>
          <table style={st.table}>
            <thead>
              <tr>
                <th style={st.th}>Date</th>
                <th style={st.th}>Verse (English)</th>
                <th style={st.th}>Reference</th>
                <th style={st.th}>Status</th>
                <th style={{ ...st.th, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVerses.map(v => {
                const rel = verseRelativeLabel(v.date);
                return (
                <tr key={v._id} style={{ ...st.tr, ...verseRowStyle(v.date) }}>
                  <td style={st.td}>
                    <div style={{ fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap' }}>
                      {new Date(v.date).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    {rel ? <span style={st.verseRelativeBadge}>{rel}</span> : null}
                  </td>
                  <td style={{ ...st.td, maxWidth: 340 }}>
                    <div style={{ whiteSpace: 'normal', lineHeight: 1.5 }}>
                      <div style={{ color: '#0f172a', fontWeight: 500 }}>{v.textEnglish?.length > 100 ? v.textEnglish.slice(0, 100) + '...' : v.textEnglish}</div>
                      {v.textAmharic && <div style={{ color: '#64748b', fontSize: 12, marginTop: 2 }}>{v.textAmharic?.length > 80 ? v.textAmharic.slice(0, 80) + '...' : v.textAmharic}</div>}
                    </div>
                  </td>
                  <td style={st.td}>
                    <span style={st.verseRefBadge}>{v.referenceEnglish}</span>
                    {v.referenceAmharic && <div style={{ fontSize: 11, color: '#64748b', marginTop: 3 }}>{v.referenceAmharic}</div>}
                  </td>
                  <td style={st.td}>
                    <button
                      style={{ ...st.verseStatusBtn, background: v.isActive ? '#dcfce7' : '#f1f5f9', color: v.isActive ? '#16a34a' : '#64748b' }}
                      onClick={() => toggleActive(v)}
                    >
                      {v.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td style={{ ...st.td, textAlign: 'right' }}>
                    <div style={st.actionGroup}>
                      <button style={st.editBtn} onClick={() => openEdit(v)}><EditIcon /> Edit</button>
                      <button style={st.deleteBtn} onClick={() => setDeleteId(v._id)}><TrashIcon /> Delete</button>
                    </div>
                  </td>
                </tr>
              );})}
            </tbody>
          </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div style={st.overlay} onClick={() => setShowModal(false)}>
          <div style={st.modal} onClick={e => e.stopPropagation()}>
            <div style={st.modalHeader}>
              <h2 style={st.modalTitle}>{editing ? 'Edit Verse' : 'Add Verse of the Day'}</h2>
              <button type="button" style={st.modalClose} onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} style={st.form}>
              <div style={st.field}>
                <label style={st.label}>Date *</label>
                <input style={st.input} type="date" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
              </div>
              <div style={st.field}>
                <label style={st.label}>Verse Text (English) *</label>
                <textarea style={{ ...st.input, height: 90, resize: 'vertical' }} required placeholder='e.g. "For God so loved the world..."' value={form.textEnglish} onChange={e => setForm({ ...form, textEnglish: e.target.value })} />
              </div>
              <div style={st.field}>
                <label style={st.label}>Verse Text (Amharic)</label>
                <textarea style={{ ...st.input, height: 90, resize: 'vertical' }} placeholder="የአማርኛ ትርጉም..." value={form.textAmharic} onChange={e => setForm({ ...form, textAmharic: e.target.value })} />
              </div>
              <div style={st.row2}>
                <div style={st.field}>
                  <label style={st.label}>Reference (English) *</label>
                  <input style={st.input} required placeholder="e.g. John 3:16" value={form.referenceEnglish} onChange={e => setForm({ ...form, referenceEnglish: e.target.value })} />
                </div>
                <div style={st.field}>
                  <label style={st.label}>Reference (Amharic)</label>
                  <input style={st.input} placeholder="e.g. ዮሐንስ 3:16" value={form.referenceAmharic} onChange={e => setForm({ ...form, referenceAmharic: e.target.value })} />
                </div>
              </div>
              <div style={st.verseActiveWrap}>
                <label style={{ ...st.label, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} style={{ width: 16, height: 16, accentColor: '#0ea5e9', cursor: 'pointer' }} />
                  Active (visible on homepage)
                </label>
              </div>
              <div style={st.modalActions}>
                <button type="button" style={st.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" style={st.saveBtn} disabled={saving}>{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div style={st.overlay} onClick={() => setDeleteId(null)}>
          <div style={st.confirmBox} onClick={e => e.stopPropagation()}>
            <div style={st.confirmIconWrap}>
              <TrashIcon size={24} color="#ef4444" />
            </div>
            <h3 style={st.confirmTitle}>Delete Verse</h3>
            <p style={st.confirmText}>Are you sure you want to delete this verse? This cannot be undone.</p>
            <div style={st.confirmActions}>
              <button style={st.cancelBtn} onClick={() => setDeleteId(null)}>Keep Verse</button>
              <button style={st.deleteBtnFull} onClick={handleDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ── LeaderAvatar with image error fallback ── */

function LeaderAvatar({ src, name, initials }) {
  const [failed, setFailed] = useState(false);
  if (src && !failed) {
    return <img src={src} alt={name} style={st.lcAvatar} onError={() => setFailed(true)} />;
  }
  return <div style={st.lcAvatarFallback}>{initials}</div>;
}

/* ── Social media icons ── */

const FBIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#3b82f6">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#334155">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const LIIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#0077b5">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

/* ── Tiny inline icons ── */

const SiteContentIcon = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{ marginRight: 6 }}>
    <rect x="2" y="2" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <line x1="6" y1="7" x2="14" y2="7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <line x1="6" y1="10" x2="12" y2="10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <line x1="6" y1="13" x2="10" y2="13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

const PagesIcon = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{ marginRight: 6 }}>
    <path d="M4 3C4 2.45 4.45 2 5 2H12L16 6V17C16 17.55 15.55 18 15 18H5C4.45 18 4 17.55 4 17V3Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <path d="M12 2V6H16" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const LeadersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{ marginRight: 6 }}>
    <circle cx="10" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <path d="M3 17.5c0-3.59 3.13-6.5 7-6.5s7 2.91 7 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
  </svg>
);

const MinistriesIcon = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{ marginRight: 6 }}>
    <circle cx="10" cy="6" r="3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <circle cx="4.5" cy="8" r="2" stroke="currentColor" strokeWidth="1.3" fill="none"/>
    <circle cx="15.5" cy="8" r="2" stroke="currentColor" strokeWidth="1.3" fill="none"/>
  </svg>
);

const VerseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{ marginRight: 6 }}>
    <path d="M4 17.5A2.5 2.5 0 0 1 6.5 15H18" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <path d="M6.5 2H18v18H6.5A2.5 2.5 0 0 1 4 17.5v-13A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <line x1="8" y1="7" x2="14" y2="7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <line x1="8" y1="10" x2="12" y2="10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

const CameraIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round">
    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
);

const EditIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 4 }}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const TrashIcon = ({ size, color } = {}) => {
  const s = size || 13;
  const c = color || 'currentColor';
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: s > 13 ? 0 : 4 }}>
      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    </svg>
  );
};

const SearchEmptyIcon = () => (
  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      <line x1="8" y1="11" x2="14" y2="11"/>
    </svg>
  </div>
);

/* ── Styles ── */

const st = {
  pageWrap: { minHeight: '100%' },

  /* ── Header ── */
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8,
    padding: '4px 0 12px', borderBottom: '1px solid #f1f5f9',
  },
  headerTextWrap: { maxWidth: 640 },
  title: { fontSize: 28, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.01em' },
  subtitle: { fontSize: 14, color: '#64748b', margin: '6px 0 0', lineHeight: 1.5 },

  /* ── Toast ── */
  globalToast: {
    position: 'fixed', top: 24, right: 24, zIndex: 300, display: 'flex', alignItems: 'center', gap: 10,
    padding: '14px 18px', background: '#fff', borderRadius: 14,
    boxShadow: '0 16px 48px rgba(15,23,42,0.14), 0 2px 6px rgba(15,23,42,0.06)',
    border: '1px solid #bbf7d0', color: '#14532d', fontSize: 14, fontWeight: 600,
    maxWidth: 'min(380px, calc(100vw - 48px))',
    animation: 'slideInRight .3s ease',
  },
  globalToastIcon: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: 28, height: 28, borderRadius: 8, background: '#22c55e', flexShrink: 0,
  },
  globalToastClose: {
    marginLeft: 4, background: 'none', border: 'none', fontSize: 20, lineHeight: 1,
    color: '#166534', cursor: 'pointer', padding: '0 4px', opacity: 0.5,
  },

  /* ── Section Tabs ── */
  sectionTabs: {
    display: 'flex', flexWrap: 'wrap', gap: 0, margin: '16px 0 24px', background: '#fff',
    borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden',
    boxShadow: '0 1px 2px rgba(15,23,42,0.04)',
  },
  sectionTab: {
    position: 'relative', display: 'flex', alignItems: 'center', padding: '12px 22px',
    fontSize: 13, fontWeight: 600, color: '#64748b', background: '#fff', border: 'none',
    cursor: 'pointer', borderRight: '1px solid #f1f5f9', transition: 'color .15s, background .15s',
    gap: 2,
  },
  sectionTabActive: {
    position: 'relative', display: 'flex', alignItems: 'center', padding: '12px 22px',
    fontSize: 13, fontWeight: 700, color: '#0ea5e9', background: '#f0f9ff', border: 'none',
    cursor: 'pointer', borderRight: '1px solid #e0f2fe', transition: 'color .15s, background .15s',
    gap: 2,
  },
  tabUnderline: {
    position: 'absolute', bottom: 0, left: 12, right: 12, height: 3,
    borderRadius: '3px 3px 0 0', background: '#0ea5e9',
  },

  sectionBody: { animation: 'fadeIn .25s ease' },

  /* ── Section header ── */
  sectionHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18,
    flexWrap: 'wrap', gap: 12,
  },
  sectionHeaderRow: { display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' },
  searchInput: {
    padding: '10px 14px 10px 36px', borderRadius: 10, border: '1px solid #e2e8f0',
    fontSize: 14, minWidth: 200, flex: '1 1 200px', maxWidth: 320, outline: 'none',
    background: '#fff url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' fill=\'none\' stroke=\'%2394a3b8\' stroke-width=\'2\' stroke-linecap=\'round\'%3E%3Ccircle cx=\'7\' cy=\'7\' r=\'5\'/%3E%3Cline x1=\'12\' y1=\'12\' x2=\'15\' y2=\'15\'/%3E%3C/svg%3E") 12px center no-repeat',
    transition: 'border-color .2s, box-shadow .2s',
  },
  count: { fontSize: 13, color: '#94a3b8', fontWeight: 500 },
  addBtn: {
    padding: '10px 20px', borderRadius: 10, border: 'none',
    background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', color: '#fff',
    fontWeight: 700, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap',
    boxShadow: '0 2px 8px rgba(14,165,233,0.25)', transition: 'transform .1s, box-shadow .1s',
  },

  /* ── Card / Table wrapper ── */
  card: {
    background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0',
    boxShadow: '0 1px 4px rgba(15,23,42,0.05)', overflow: 'hidden',
  },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    textAlign: 'left', padding: '14px 18px', fontSize: 11, fontWeight: 700, color: '#94a3b8',
    textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #f1f5f9',
    background: '#fafbfc',
  },
  tr: { borderBottom: '1px solid #f1f5f9', transition: 'background .12s' },
  td: { padding: '14px 18px', fontSize: 14, color: '#334155', verticalAlign: 'middle' },
  titleCell: { display: 'flex', alignItems: 'center', gap: 10 },
  pageTitleDot: { width: 8, height: 8, borderRadius: '50%', background: '#0ea5e9', flexShrink: 0 },
  dateText: { fontSize: 13, color: '#94a3b8', whiteSpace: 'nowrap' },
  slugCode: {
    padding: '3px 10px', borderRadius: 6, background: '#f1f5f9', fontSize: 12, color: '#64748b',
    fontFamily: "'SF Mono', Menlo, Consolas, monospace", border: '1px solid #e2e8f0',
  },

  /* ── Action buttons ── */
  actionGroup: { display: 'flex', gap: 6, justifyContent: 'flex-end' },
  editBtn: {
    display: 'inline-flex', alignItems: 'center', background: '#fff', border: '1px solid #e2e8f0',
    borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 600, color: '#334155',
    cursor: 'pointer', transition: 'all .15s',
  },
  deleteBtn: {
    display: 'inline-flex', alignItems: 'center', background: '#fff', border: '1px solid #fecaca',
    borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 600, color: '#ef4444',
    cursor: 'pointer', transition: 'all .15s',
  },

  /* ── Loading ── */
  loadingWrap: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    padding: '56px 24px', gap: 12,
  },
  spinner: {
    width: 28, height: 28, borderRadius: '50%',
    border: '3px solid #e2e8f0', borderTopColor: '#0ea5e9',
    animation: 'spin 0.7s linear infinite',
  },
  loadingText: { fontSize: 14, color: '#94a3b8', fontWeight: 500 },

  /* ── Empty states ── */
  empty: {
    gridColumn: '1 / -1', padding: 56, textAlign: 'center', color: '#94a3b8', fontSize: 14,
    background: '#fff', borderRadius: 14, border: '1px solid #f1f5f9',
  },
  emptyState: { padding: '56px 24px', textAlign: 'center', background: '#fafbfc' },
  emptyStateIcon: { marginBottom: 16, display: 'flex', justifyContent: 'center', color: '#cbd5e1' },
  emptyStateTitle: { margin: '0 0 8px', fontSize: 17, fontWeight: 700, color: '#1e293b' },
  emptyStateText: {
    margin: '0 0 20px', fontSize: 14, color: '#94a3b8', lineHeight: 1.6, maxWidth: 380,
    marginLeft: 'auto', marginRight: 'auto',
  },
  charCount: { fontSize: 12, color: '#94a3b8', marginTop: 4, textAlign: 'right' },

  /* ── Leader grid ── */
  leaderGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 18 },
  leaderCard: {
    background: '#fff', borderRadius: 16, padding: '20px 18px 16px', border: '1px solid #e2e8f0',
    boxShadow: '0 1px 4px rgba(15,23,42,0.05)', display: 'flex', flexDirection: 'column',
    alignItems: 'center', transition: 'box-shadow .2s, transform .2s',
  },
  lcTop: { display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  lcDot: (on) => ({
    width: 9, height: 9, borderRadius: '50%', background: on ? '#22c55e' : '#cbd5e1',
    boxShadow: on ? '0 0 0 3px rgba(34,197,94,0.18)' : 'none',
  }),
  lcOrder: {
    fontSize: 11, color: '#94a3b8', fontWeight: 700, background: '#f8fafc', padding: '3px 8px',
    borderRadius: 6, border: '1px solid #f1f5f9',
  },

  lcAvatarWrap: { marginBottom: 12 },
  lcAvatar: {
    width: 84, height: 84, borderRadius: '50%', objectFit: 'cover',
    border: '3px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
  },
  lcAvatarFallback: {
    width: 84, height: 84, borderRadius: '50%',
    background: 'linear-gradient(135deg, #e0f2fe, #bae6fd)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 28, fontWeight: 800, color: '#0ea5e9', border: '3px solid #bae6fd',
  },

  lcName: { fontSize: 16, fontWeight: 700, color: '#0f172a', margin: '0 0 3px', textAlign: 'center' },
  lcRole: { fontSize: 13, color: '#0ea5e9', fontWeight: 600, margin: '0 0 2px', textAlign: 'center' },
  lcRoleAm: { fontSize: 11, color: '#94a3b8', fontStyle: 'italic', margin: '0 0 10px', textAlign: 'center' },

  lcChips: { display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10, width: '100%', alignItems: 'center' },
  lcChip: {
    fontSize: 11, color: '#64748b', background: '#f8fafc', padding: '3px 10px', borderRadius: 6,
    maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
    border: '1px solid #f1f5f9',
  },

  lcSocials: { display: 'flex', gap: 8, marginBottom: 12 },
  lcSocialLink: {
    width: 32, height: 32, borderRadius: '50%', border: '1px solid #e2e8f0', background: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    textDecoration: 'none', transition: 'all .15s',
  },

  lcActions: {
    display: 'flex', gap: 6, width: '100%', justifyContent: 'center',
    borderTop: '1px solid #f1f5f9', paddingTop: 12, marginTop: 4,
  },
  lcToggleBtn: (on) => ({
    background: 'none', border: `1px solid ${on ? '#fde68a' : '#bbf7d0'}`, borderRadius: 8,
    padding: '6px 14px', fontSize: 12, fontWeight: 600,
    color: on ? '#b45309' : '#16a34a', cursor: 'pointer',
  }),

  /* ── Modals ── */
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)',
    backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 200, animation: 'fadeIn .2s ease',
  },
  modal: {
    background: '#fff', borderRadius: 18, padding: '0 0 28px', width: '100%', maxWidth: 560,
    maxHeight: '90vh', overflowY: 'auto',
    boxShadow: '0 24px 64px rgba(15,23,42,0.18)',
  },
  modalHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 28px 0',
  },
  modalClose: {
    background: '#f1f5f9', border: 'none', width: 32, height: 32, borderRadius: 8,
    fontSize: 20, color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center',
    justifyContent: 'center', lineHeight: 1, transition: 'all .15s',
  },
  leaderModal: {
    background: '#fff', borderRadius: 18, width: '100%', maxWidth: 620, maxHeight: '92vh',
    overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
  },
  lmHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '22px 26px 0' },
  lmClose: {
    background: '#f1f5f9', border: 'none', width: 32, height: 32, borderRadius: 8,
    fontSize: 20, color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center',
    justifyContent: 'center', lineHeight: 1,
  },
  lmTabs: { display: 'flex', gap: 0, padding: '16px 26px 0', borderBottom: '1px solid #f1f5f9' },
  lmTab: {
    padding: '8px 16px', fontSize: 13, fontWeight: 600, color: '#94a3b8', background: 'none',
    border: 'none', borderBottom: '2px solid transparent', cursor: 'pointer', transition: 'all .15s',
  },
  lmTabActive: {
    padding: '8px 16px', fontSize: 13, fontWeight: 700, color: '#0ea5e9', background: 'none',
    border: 'none', borderBottom: '2.5px solid #0ea5e9', cursor: 'pointer',
  },

  modalTitle: { fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.01em' },
  form: { display: 'flex', flexDirection: 'column', gap: 16, padding: '20px 28px 0' },
  row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 13, fontWeight: 600, color: '#334155' },
  input: {
    padding: '10px 14px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 14,
    color: '#0f172a', outline: 'none', background: '#fafbfc', fontFamily: 'inherit',
    transition: 'border-color .2s, box-shadow .2s',
  },
  inputDisabled: { background: '#f1f5f9', color: '#94a3b8', cursor: 'not-allowed' },
  hint: { fontSize: 12, color: '#94a3b8' },

  photoRow: { display: 'flex', gap: 16, alignItems: 'center', padding: '8px 0' },
  photoUpload: {
    width: 84, height: 84, borderRadius: '50%', border: '2px dashed #cbd5e1', background: '#f8fafc',
    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
    overflow: 'hidden', flexShrink: 0, transition: 'border-color .2s',
  },
  photoImg: { width: '100%', height: '100%', objectFit: 'cover' },
  photoPlaceholder: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  removePhotoBtn: {
    marginTop: 8, padding: '4px 12px', borderRadius: 6, border: '1px solid #fecaca',
    background: '#fff', color: '#ef4444', fontSize: 11, fontWeight: 600, cursor: 'pointer',
  },

  visToggle: { display: 'flex', borderRadius: 10, overflow: 'hidden', border: '1px solid #e2e8f0' },
  visOpt: { flex: 1, padding: '8px 0', fontSize: 13, fontWeight: 600, background: '#f8fafc', color: '#94a3b8', border: 'none', cursor: 'pointer', transition: 'all .15s' },
  visActive: { flex: 1, padding: '8px 0', fontSize: 13, fontWeight: 700, background: '#dcfce7', color: '#16a34a', border: 'none', cursor: 'pointer' },
  visHidden: { flex: 1, padding: '8px 0', fontSize: 13, fontWeight: 700, background: '#fef9c3', color: '#b45309', border: 'none', cursor: 'pointer' },

  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8, padding: '0 28px 0' },
  cancelBtn: {
    padding: '10px 20px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff',
    color: '#334155', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all .15s',
  },
  saveBtn: {
    padding: '10px 20px', borderRadius: 10, border: 'none',
    background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', color: '#fff',
    fontSize: 14, fontWeight: 700, cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(14,165,233,0.25)', transition: 'all .15s',
  },

  /* ── Confirm delete ── */
  confirmBox: {
    background: '#fff', borderRadius: 18, padding: '32px 28px 28px', width: '100%', maxWidth: 420,
    textAlign: 'center', boxShadow: '0 24px 64px rgba(15,23,42,0.18)',
  },
  confirmIconWrap: {
    display: 'flex', justifyContent: 'center', marginBottom: 16,
  },
  confirmTitle: { fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 8px' },
  confirmText: { fontSize: 14, color: '#64748b', margin: '0 0 24px', lineHeight: 1.6 },
  confirmActions: { display: 'flex', justifyContent: 'center', gap: 12 },
  deleteBtnFull: {
    padding: '10px 24px', borderRadius: 10, border: 'none', background: '#ef4444', color: '#fff',
    fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 8px rgba(239,68,68,0.25)',
  },

  /* ── Ministry badges ── */
  ministryCatBadge: {
    display: 'inline-block', padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700,
    textTransform: 'capitalize', letterSpacing: '0.02em',
  },
  ministryIconBadge: {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36,
    borderRadius: 10, fontSize: 14, fontWeight: 800, border: '1px solid rgba(15,23,42,0.06)',
  },
  ministryDayDot: {
    width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
    boxShadow: '0 0 0 2px #fff, 0 0 0 3px rgba(0,0,0,0.06)',
  },

  /* ── Verse badges ── */
  verseTodayBadge: {
    display: 'inline-block', marginTop: 4, padding: '2px 10px', borderRadius: 6, fontSize: 10,
    fontWeight: 700, background: '#dbeafe', color: '#1d4ed8', letterSpacing: '0.04em',
  },
  verseRelativeBadge: {
    display: 'inline-block', marginTop: 4, padding: '2px 10px', borderRadius: 6, fontSize: 10,
    fontWeight: 700, background: '#e0f2fe', color: '#0369a1', letterSpacing: '0.04em',
  },
  verseRefBadge: {
    display: 'inline-block', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
    background: '#f0f9ff', color: '#0369a1', border: '1px solid #bae6fd',
  },
  verseStatusBtn: {
    padding: '5px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, border: 'none',
    cursor: 'pointer', letterSpacing: '0.02em', transition: 'all .15s',
  },
  verseActiveWrap: {
    background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 12, padding: '14px 16px',
  },
};
