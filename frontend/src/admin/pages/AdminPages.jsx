import { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';

/* ═══════════════════════════════════════════════════════════
   PAGES + LEADERS  —  combined admin view with section tabs
   ═══════════════════════════════════════════════════════════ */

const emptyPageForm = { slug: '', title: '', content: '' };
const emptyLeaderForm = {
  name: '', role: '', roleAm: '', bio: '', photoUrl: '',
  phone: '', email: '', address: '',
  facebook: '', twitter: '', linkedin: '',
  displayOrder: 0, isActive: true,
};

export default function AdminPages() {
  const [section, setSection] = useState('pages');

  return (
    <div>
      <div style={st.header}>
        <div>
          <h1 style={st.title}>Pages</h1>
          <p style={st.subtitle}>Manage website content pages and sections</p>
        </div>
      </div>

      {/* Section Tabs */}
      <div style={st.sectionTabs}>
        <button
          style={section === 'pages' ? st.sectionTabActive : st.sectionTab}
          onClick={() => setSection('pages')}
        >
          <PagesIcon />
          Content Pages
        </button>
        <button
          style={section === 'leaders' ? st.sectionTabActive : st.sectionTab}
          onClick={() => setSection('leaders')}
        >
          <LeadersIcon />
          Meet Our Leaders
        </button>
      </div>

      {section === 'pages' ? <PagesSection /> : <LeadersSection />}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   PAGES SECTION
   ────────────────────────────────────────────────────────── */

function PagesSection() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyPageForm);
  const [saving, setSaving] = useState(false);
  const [deleteSlug, setDeleteSlug] = useState(null);

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
    } catch (err) { alert(err.response?.data?.message || 'Error saving page'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try { await api.delete(`/pages/${deleteSlug}`); setDeleteSlug(null); fetchPages(); }
    catch { alert('Error deleting page'); }
  };

  return (
    <>
      <div style={st.sectionHeader}>
        <span style={st.count}>{pages.length} page{pages.length !== 1 ? 's' : ''}</span>
        <button style={st.addBtn} onClick={openCreate}>+ Add New Page</button>
      </div>

      <div style={st.card}>
        {loading ? <p style={st.empty}>Loading...</p> : pages.length === 0 ? (
          <p style={st.empty}>No pages found</p>
        ) : (
          <table style={st.table}>
            <thead>
              <tr>
                <th style={st.th}>Title</th>
                <th style={st.th}>Slug</th>
                <th style={st.th}>Last Updated</th>
                <th style={{ ...st.th, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.map(pg => (
                <tr key={pg._id || pg.slug} style={st.tr}>
                  <td style={st.td}><span style={{ fontWeight: 600, color: '#0f172a' }}>{pg.title}</span></td>
                  <td style={st.td}><code style={st.slugCode}>/{pg.slug}</code></td>
                  <td style={st.td}>{pg.updatedAt ? new Date(pg.updatedAt).toLocaleDateString() : '—'}</td>
                  <td style={{ ...st.td, textAlign: 'right' }}>
                    <button style={st.editBtn} onClick={() => openEdit(pg)}>Edit</button>
                    <button style={st.deleteBtn} onClick={() => setDeleteSlug(pg.slug)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div style={st.overlay} onClick={() => setShowModal(false)}>
          <div style={st.modal} onClick={e => e.stopPropagation()}>
            <h2 style={st.modalTitle}>{editing ? 'Edit Page' : 'Add New Page'}</h2>
            <form onSubmit={handleSubmit} style={st.form}>
              <div style={st.field}>
                <label style={st.label}>Slug *</label>
                <input
                  style={st.input} required value={form.slug} disabled={!!editing}
                  placeholder="e.g. about-us"
                  onChange={e => setForm({ ...form, slug: e.target.value })}
                />
                {!editing && <span style={st.hint}>URL path for this page (lowercase, hyphens only)</span>}
              </div>
              <div style={st.field}>
                <label style={st.label}>Title *</label>
                <input style={st.input} required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>
              <div style={st.field}>
                <label style={st.label}>Content *</label>
                <textarea style={{ ...st.input, height: 200, resize: 'vertical' }} required value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
              </div>
              <div style={st.modalActions}>
                <button type="button" style={st.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" style={st.saveBtn} disabled={saving}>{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteSlug && (
        <div style={st.overlay} onClick={() => setDeleteSlug(null)}>
          <div style={st.confirmBox} onClick={e => e.stopPropagation()}>
            <h3 style={st.confirmTitle}>Delete Page</h3>
            <p style={st.confirmText}>Are you sure you want to delete <strong>/{deleteSlug}</strong>? This action cannot be undone.</p>
            <div style={st.modalActions}>
              <button style={st.cancelBtn} onClick={() => setDeleteSlug(null)}>Cancel</button>
              <button style={st.deleteBtnFull} onClick={handleDelete}>Delete</button>
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

function LeadersSection() {
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
    } catch (err) { alert(err.response?.data?.message || 'Error saving leader'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try { await api.delete(`/leaders/${deleteId}`); setDeleteId(null); fetchLeaders(); }
    catch { alert('Error deleting leader'); }
  };

  const toggleActive = async (leader) => {
    try {
      await api.put(`/leaders/${leader._id}`, { isActive: !leader.isActive });
      fetchLeaders();
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
        {loading ? <p style={st.empty}>Loading...</p> : filtered.length === 0 ? (
          <p style={st.empty}>No leaders found. Add your first leader to get started.</p>
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
            <h3 style={st.confirmTitle}>Delete Leader</h3>
            <p style={st.confirmText}>Are you sure? This will permanently remove this leader and their photo.</p>
            <div style={st.modalActions}>
              <button style={st.cancelBtn} onClick={() => setDeleteId(null)}>Cancel</button>
              <button style={st.deleteBtnFull} onClick={handleDelete}>Delete</button>
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

const CameraIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round">
    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
);

/* ── Styles ── */

const st = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  title: { fontSize: 26, fontWeight: 700, color: '#0f172a', margin: 0 },
  subtitle: { fontSize: 14, color: '#64748b', margin: '4px 0 0' },

  sectionTabs: {
    display: 'flex', gap: 0, marginBottom: 20, background: '#fff', borderRadius: 10,
    border: '1px solid #e2e8f0', overflow: 'hidden', width: 'fit-content',
  },
  sectionTab: {
    display: 'flex', alignItems: 'center', padding: '10px 20px', fontSize: 14, fontWeight: 600,
    color: '#64748b', background: '#fff', border: 'none', cursor: 'pointer',
    borderRight: '1px solid #e2e8f0', transition: 'all 0.15s',
  },
  sectionTabActive: {
    display: 'flex', alignItems: 'center', padding: '10px 20px', fontSize: 14, fontWeight: 600,
    color: '#fff', background: '#0ea5e9', border: 'none', cursor: 'pointer',
    borderRight: '1px solid #0ea5e9', transition: 'all 0.15s',
  },

  sectionHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  searchInput: { padding: '9px 14px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, width: 260, outline: 'none', background: '#fff' },
  count: { fontSize: 13, color: '#94a3b8' },
  addBtn: { padding: '9px 18px', borderRadius: 8, border: 'none', background: '#0ea5e9', color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' },

  card: { background: '#fff', borderRadius: 14, border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #f1f5f9', background: '#fafbfc' },
  tr: { borderBottom: '1px solid #f8fafc' },
  td: { padding: '12px 16px', fontSize: 14, color: '#334155', verticalAlign: 'middle' },
  slugCode: { padding: '2px 8px', borderRadius: 4, background: '#f1f5f9', fontSize: 13, color: '#64748b', fontFamily: 'monospace' },

  editBtn: { background: 'none', border: '1px solid #e2e8f0', borderRadius: 6, padding: '5px 12px', fontSize: 12, fontWeight: 600, color: '#334155', cursor: 'pointer', marginRight: 6 },
  deleteBtn: { background: 'none', border: '1px solid #fecaca', borderRadius: 6, padding: '5px 12px', fontSize: 12, fontWeight: 600, color: '#ef4444', cursor: 'pointer' },
  empty: { gridColumn: '1 / -1', padding: 50, textAlign: 'center', color: '#94a3b8', fontSize: 14, background: '#fff', borderRadius: 14, border: '1px solid #f1f5f9' },

  /* leader grid */
  leaderGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 16 },
  leaderCard: {
    background: '#fff', borderRadius: 12, padding: '18px 16px 14px', border: '1px solid #f1f5f9',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', alignItems: 'center',
    transition: 'box-shadow 0.2s',
  },
  lcTop: { display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  lcDot: (on) => ({
    width: 8, height: 8, borderRadius: '50%', background: on ? '#22c55e' : '#cbd5e1',
    boxShadow: on ? '0 0 0 3px rgba(34,197,94,0.15)' : 'none',
  }),
  lcOrder: { fontSize: 11, color: '#94a3b8', fontWeight: 600, background: '#f8fafc', padding: '2px 7px', borderRadius: 4 },

  lcAvatarWrap: { marginBottom: 10 },
  lcAvatar: { width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid #e2e8f0' },
  lcAvatarFallback: {
    width: 80, height: 80, borderRadius: '50%', background: '#e0f2fe',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 26, fontWeight: 800, color: '#0ea5e9', border: '3px solid #bae6fd',
  },

  lcName: { fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 2px', textAlign: 'center' },
  lcRole: { fontSize: 13, color: '#0ea5e9', fontWeight: 600, margin: '0 0 1px', textAlign: 'center' },
  lcRoleAm: { fontSize: 11, color: '#94a3b8', fontStyle: 'italic', margin: '0 0 8px', textAlign: 'center' },

  lcChips: { display: 'flex', flexDirection: 'column', gap: 3, marginBottom: 8, width: '100%', alignItems: 'center' },
  lcChip: { fontSize: 11, color: '#64748b', background: '#f8fafc', padding: '2px 8px', borderRadius: 4, maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },

  lcSocials: { display: 'flex', gap: 6, marginBottom: 10 },
  lcSocialLink: {
    width: 30, height: 30, borderRadius: '50%', border: '1px solid #e2e8f0', background: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    textDecoration: 'none', transition: 'border-color 0.15s, background 0.15s',
  },

  lcActions: { display: 'flex', gap: 6, width: '100%', justifyContent: 'center', borderTop: '1px solid #f1f5f9', paddingTop: 10 },
  lcToggleBtn: (on) => ({
    background: 'none', border: `1px solid ${on ? '#fde68a' : '#bbf7d0'}`, borderRadius: 6,
    padding: '5px 12px', fontSize: 12, fontWeight: 600,
    color: on ? '#b45309' : '#16a34a', cursor: 'pointer',
  }),

  /* modals */
  overlay: { position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 },
  modal: { background: '#fff', borderRadius: 14, padding: 28, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto' },
  leaderModal: { background: '#fff', borderRadius: 16, width: '100%', maxWidth: 600, maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' },
  lmHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px 0' },
  lmClose: { background: 'none', border: 'none', fontSize: 24, color: '#94a3b8', cursor: 'pointer', padding: '0 4px', lineHeight: 1 },
  lmTabs: { display: 'flex', gap: 0, padding: '14px 24px 0', borderBottom: '1px solid #f1f5f9' },
  lmTab: {
    padding: '7px 14px', fontSize: 13, fontWeight: 600, color: '#94a3b8', background: 'none',
    border: 'none', borderBottom: '2px solid transparent', cursor: 'pointer',
  },
  lmTabActive: {
    padding: '7px 14px', fontSize: 13, fontWeight: 600, color: '#0ea5e9', background: 'none',
    border: 'none', borderBottom: '2px solid #0ea5e9', cursor: 'pointer',
  },

  modalTitle: { fontSize: 20, fontWeight: 700, color: '#0f172a', margin: '0 0 20px' },
  form: { display: 'flex', flexDirection: 'column', gap: 14 },
  row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 },
  field: { display: 'flex', flexDirection: 'column', gap: 5 },
  label: { fontSize: 13, fontWeight: 600, color: '#334155' },
  input: { padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, color: '#0f172a', outline: 'none', background: '#f8fafc', fontFamily: 'inherit' },
  hint: { fontSize: 12, color: '#94a3b8' },

  photoRow: { display: 'flex', gap: 14, alignItems: 'center', padding: '8px 0' },
  photoUpload: {
    width: 80, height: 80, borderRadius: '50%', border: '2px dashed #cbd5e1', background: '#f8fafc',
    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
    overflow: 'hidden', flexShrink: 0,
  },
  photoImg: { width: '100%', height: '100%', objectFit: 'cover' },
  photoPlaceholder: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  removePhotoBtn: { marginTop: 6, padding: '3px 10px', borderRadius: 5, border: '1px solid #fecaca', background: '#fff', color: '#ef4444', fontSize: 11, fontWeight: 600, cursor: 'pointer' },

  visToggle: { display: 'flex', borderRadius: 8, overflow: 'hidden', border: '1px solid #e2e8f0' },
  visOpt: { flex: 1, padding: '7px 0', fontSize: 13, fontWeight: 600, background: '#f8fafc', color: '#94a3b8', border: 'none', cursor: 'pointer' },
  visActive: { flex: 1, padding: '7px 0', fontSize: 13, fontWeight: 600, background: '#dcfce7', color: '#16a34a', border: 'none', cursor: 'pointer' },
  visHidden: { flex: 1, padding: '7px 0', fontSize: 13, fontWeight: 600, background: '#fef9c3', color: '#b45309', border: 'none', cursor: 'pointer' },

  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 6 },
  cancelBtn: { padding: '9px 18px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', color: '#334155', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  saveBtn: { padding: '9px 18px', borderRadius: 8, border: 'none', background: '#0ea5e9', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  confirmBox: { background: '#fff', borderRadius: 14, padding: 28, width: '100%', maxWidth: 420 },
  confirmTitle: { fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 8px' },
  confirmText: { fontSize: 14, color: '#64748b', margin: '0 0 20px', lineHeight: 1.5 },
  deleteBtnFull: { padding: '9px 18px', borderRadius: 8, border: 'none', background: '#ef4444', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
};
