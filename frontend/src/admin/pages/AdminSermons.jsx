import { useState, useEffect } from 'react';
import api from '../../api/axios';

const emptyForm = {
  title: '', speaker: '', date: '', series: '', topic: '',
  description: '', thumbnailUrl: '', videoUrl: '', duration: '',
  isFeatured: false, fileType: 'video',
};

function isYoutubeUrl(url) {
  return /(?:youtube\.com|youtu\.be)/.test(url || '');
}

export default function AdminSermons() {
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState('');

  const fetchSermons = async () => {
    try {
      const { data } = await api.get('/sermons?limit=100');
      setSermons(data.sermons || (Array.isArray(data) ? data : []));
    } catch { setSermons([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSermons(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setFile(null); setFetchError(''); setShowModal(true); };
  const openEdit = (s) => {
    setEditing(s._id);
    setForm({
      title: s.title || '', speaker: s.speaker || '', date: s.date?.slice(0, 10) || '',
      series: s.series || '', topic: s.topic || '', description: s.description || '',
      thumbnailUrl: s.thumbnailUrl || '', videoUrl: s.videoUrl || '',
      duration: s.duration || '', isFeatured: s.isFeatured || false, fileType: s.fileType || 'video',
    });
    setFile(null);
    setFetchError('');
    setShowModal(true);
  };

  const fetchYoutubeInfo = async (url) => {
    if (!isYoutubeUrl(url)) return;
    setFetching(true);
    setFetchError('');
    try {
      const { data } = await api.get('/youtube/info', { params: { url } });
      setForm(prev => ({
        ...prev,
        title: prev.title || data.title || '',
        thumbnailUrl: data.thumbnailUrl || prev.thumbnailUrl,
        speaker: prev.speaker || data.authorName || '',
      }));
    } catch {
      setFetchError('Could not fetch video info. Check the URL.');
    } finally {
      setFetching(false);
    }
  };

  const handleVideoUrlBlur = () => {
    if (form.videoUrl && isYoutubeUrl(form.videoUrl)) {
      fetchYoutubeInfo(form.videoUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/sermons/${editing}`, form);
      } else {
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        if (file) fd.append('file', file);
        await api.post('/sermons', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      setShowModal(false);
      fetchSermons();
    } catch (err) { alert(err.response?.data?.message || 'Error saving sermon'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try { await api.delete(`/sermons/${deleteId}`); setDeleteId(null); fetchSermons(); }
    catch { alert('Error deleting sermon'); }
  };

  const filtered = sermons.filter(s =>
    s.title?.toLowerCase().includes(search.toLowerCase()) ||
    s.speaker?.toLowerCase().includes(search.toLowerCase()) ||
    s.series?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={st.header}>
        <div>
          <h1 style={st.title}>Sermons</h1>
          <p style={st.subtitle}>Manage all sermon uploads and recordings</p>
        </div>
        <button style={st.addBtn} onClick={openCreate}>+ Add New Sermon</button>
      </div>

      <div style={st.toolbar}>
        <input
          type="text" placeholder="Search sermons..." value={search}
          onChange={e => setSearch(e.target.value)} style={st.searchInput}
        />
        <span style={st.count}>{filtered.length} sermon{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      <div style={st.card}>
        {loading ? <p style={st.empty}>Loading...</p> : filtered.length === 0 ? (
          <p style={st.empty}>No sermons found</p>
        ) : (
          <div className="admin-table-wrap">
          <table style={st.table}>
            <thead>
              <tr>
                <th style={st.th}>Title</th>
                <th style={st.th}>Speaker</th>
                <th style={st.th}>Date</th>
                <th style={st.th}>Series</th>
                <th style={st.th}>Status</th>
                <th style={{ ...st.th, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s._id} style={st.tr}>
                  <td style={st.td}>
                    <div style={st.titleCell}>
                      <div style={{ ...st.thumb, background: s.isFeatured ? '#3b82f6' : '#8b5cf6' }}>
                        {s.thumbnailUrl ? <img src={s.thumbnailUrl} alt="" style={st.thumbImg}/> : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><polygon points="10,8 16,12 10,16" fill="white"/></svg>
                        )}
                      </div>
                      <span style={st.titleText}>{s.title}</span>
                    </div>
                  </td>
                  <td style={st.td}>{s.speaker}</td>
                  <td style={st.td}>{new Date(s.date).toLocaleDateString()}</td>
                  <td style={st.td}>{s.series || '\u2014'}</td>
                  <td style={st.td}>
                    <span style={{ ...st.badge, background: s.isFeatured ? '#dcfce7' : '#f1f5f9', color: s.isFeatured ? '#16a34a' : '#64748b' }}>
                      {s.isFeatured ? 'FEATURED' : 'DRAFT'}
                    </span>
                  </td>
                  <td style={{ ...st.td, textAlign: 'right' }}>
                    <button style={st.editBtn} onClick={() => openEdit(s)}>Edit</button>
                    <button style={st.deleteBtn} onClick={() => setDeleteId(s._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div style={st.overlay} onClick={() => setShowModal(false)}>
          <div style={st.modal} onClick={e => e.stopPropagation()}>
            <h2 style={st.modalTitle}>{editing ? 'Edit Sermon' : 'Add New Sermon'}</h2>
            <form onSubmit={handleSubmit} style={st.form}>

              {/* YouTube URL — top of form for best workflow */}
              <div style={st.field}>
                <label style={st.label}>YouTube URL</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    style={{ ...st.input, flex: 1 }}
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={form.videoUrl}
                    onChange={e => setForm({ ...form, videoUrl: e.target.value })}
                    onBlur={handleVideoUrlBlur}
                  />
                  <button
                    type="button"
                    style={st.fetchBtn}
                    disabled={fetching || !form.videoUrl}
                    onClick={() => fetchYoutubeInfo(form.videoUrl)}
                  >
                    {fetching ? 'Fetching...' : 'Fetch Info'}
                  </button>
                </div>
                {fetchError && <span style={st.fetchError}>{fetchError}</span>}
                {fetching && <span style={st.fetchHint}>Fetching video details from YouTube...</span>}
              </div>

              {/* Thumbnail preview */}
              {form.thumbnailUrl && isYoutubeUrl(form.videoUrl) && (
                <div style={st.previewRow}>
                  <img src={form.thumbnailUrl} alt="Thumbnail preview" style={st.previewImg} />
                  <div style={st.previewInfo}>
                    <span style={st.previewLabel}>YouTube Thumbnail</span>
                    <span style={st.previewHint}>Title and thumbnail were auto-filled. You can edit them below.</span>
                  </div>
                </div>
              )}

              <div style={st.row2}>
                <div style={st.field}>
                  <label style={st.label}>Title *</label>
                  <input style={st.input} required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                </div>
                <div style={st.field}>
                  <label style={st.label}>Speaker *</label>
                  <input style={st.input} required value={form.speaker} onChange={e => setForm({ ...form, speaker: e.target.value })} />
                </div>
              </div>
              <div style={st.row2}>
                <div style={st.field}>
                  <label style={st.label}>Date *</label>
                  <input style={st.input} type="date" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                </div>
                <div style={st.field}>
                  <label style={st.label}>Series</label>
                  <input style={st.input} value={form.series} onChange={e => setForm({ ...form, series: e.target.value })} />
                </div>
              </div>
              <div style={st.row2}>
                <div style={st.field}>
                  <label style={st.label}>Topic</label>
                  <input style={st.input} value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })} />
                </div>
                <div style={st.field}>
                  <label style={st.label}>Duration</label>
                  <input style={st.input} value={form.duration} placeholder="e.g. 45:00" onChange={e => setForm({ ...form, duration: e.target.value })} />
                </div>
              </div>
              <div style={st.field}>
                <label style={st.label}>Description</label>
                <textarea style={{ ...st.input, height: 80, resize: 'vertical' }} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <div style={st.field}>
                <label style={st.label}>Thumbnail URL</label>
                <input style={st.input} value={form.thumbnailUrl} onChange={e => setForm({ ...form, thumbnailUrl: e.target.value })} />
              </div>
              {!editing && (
                <div style={st.row2}>
                  <div style={st.field}>
                    <label style={st.label}>Upload File (optional)</label>
                    <input type="file" accept="audio/*,video/*" onChange={e => setFile(e.target.files[0])} style={st.input} />
                  </div>
                  <div style={st.field}>
                    <label style={st.label}>File Type</label>
                    <select style={st.input} value={form.fileType} onChange={e => setForm({ ...form, fileType: e.target.value })}>
                      <option value="video">Video</option>
                      <option value="audio">Audio</option>
                    </select>
                  </div>
                </div>
              )}
              <label style={st.checkLabel}>
                <input type="checkbox" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} />
                <span style={{ marginLeft: 8 }}>Mark as Featured</span>
              </label>
              <div style={st.modalActions}>
                <button type="button" style={st.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" style={st.saveBtn} disabled={saving}>{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div style={st.overlay} onClick={() => setDeleteId(null)}>
          <div style={st.confirmBox} onClick={e => e.stopPropagation()}>
            <h3 style={st.confirmTitle}>Delete Sermon</h3>
            <p style={st.confirmText}>Are you sure you want to delete this sermon? This action cannot be undone.</p>
            <div style={st.modalActions}>
              <button style={st.cancelBtn} onClick={() => setDeleteId(null)}>Cancel</button>
              <button style={st.deleteBtnFull} onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const st = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  title: { fontSize: 26, fontWeight: 700, color: '#0f172a', margin: 0 },
  subtitle: { fontSize: 14, color: '#64748b', margin: '4px 0 0' },
  addBtn: { padding: '10px 20px', borderRadius: 8, border: 'none', background: '#0ea5e9', color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer' },
  toolbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  searchInput: { padding: '9px 14px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, width: 280, outline: 'none', background: '#fff' },
  count: { fontSize: 13, color: '#94a3b8' },
  card: { background: '#fff', borderRadius: 14, border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #f1f5f9', background: '#fafbfc' },
  tr: { borderBottom: '1px solid #f8fafc' },
  td: { padding: '12px 16px', fontSize: 14, color: '#334155', verticalAlign: 'middle' },
  titleCell: { display: 'flex', alignItems: 'center', gap: 10 },
  thumb: { width: 36, height: 36, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  thumbImg: { width: '100%', height: '100%', objectFit: 'cover', borderRadius: 6 },
  titleText: { fontWeight: 600, color: '#0f172a' },
  badge: { padding: '3px 8px', borderRadius: 5, fontSize: 11, fontWeight: 700, letterSpacing: '0.03em' },
  editBtn: { background: 'none', border: '1px solid #e2e8f0', borderRadius: 6, padding: '5px 12px', fontSize: 12, fontWeight: 600, color: '#334155', cursor: 'pointer', marginRight: 6 },
  deleteBtn: { background: 'none', border: '1px solid #fecaca', borderRadius: 6, padding: '5px 12px', fontSize: 12, fontWeight: 600, color: '#ef4444', cursor: 'pointer' },
  empty: { padding: 40, textAlign: 'center', color: '#94a3b8', fontSize: 14 },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 },
  modal: { background: '#fff', borderRadius: 14, padding: 28, width: '100%', maxWidth: 620, maxHeight: '90vh', overflowY: 'auto' },
  modalTitle: { fontSize: 20, fontWeight: 700, color: '#0f172a', margin: '0 0 20px' },
  form: { display: 'flex', flexDirection: 'column', gap: 14 },
  row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 },
  field: { display: 'flex', flexDirection: 'column', gap: 5 },
  label: { fontSize: 13, fontWeight: 600, color: '#334155' },
  input: { padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, color: '#0f172a', outline: 'none', background: '#f8fafc' },
  checkLabel: { display: 'flex', alignItems: 'center', fontSize: 14, color: '#334155', fontWeight: 500, cursor: 'pointer' },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 6 },
  cancelBtn: { padding: '9px 18px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', color: '#334155', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  saveBtn: { padding: '9px 18px', borderRadius: 8, border: 'none', background: '#0ea5e9', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  confirmBox: { background: '#fff', borderRadius: 14, padding: 28, width: '100%', maxWidth: 420 },
  confirmTitle: { fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 8px' },
  confirmText: { fontSize: 14, color: '#64748b', margin: '0 0 20px', lineHeight: 1.5 },
  deleteBtnFull: { padding: '9px 18px', borderRadius: 8, border: 'none', background: '#ef4444', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  fetchBtn: { padding: '9px 16px', borderRadius: 8, border: 'none', background: '#ef4444', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' },
  fetchError: { fontSize: 12, color: '#ef4444', marginTop: 2 },
  fetchHint: { fontSize: 12, color: '#0ea5e9', marginTop: 2 },
  previewRow: { display: 'flex', gap: 14, alignItems: 'center', padding: 12, background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' },
  previewImg: { width: 120, height: 68, objectFit: 'cover', borderRadius: 6, flexShrink: 0 },
  previewInfo: { display: 'flex', flexDirection: 'column', gap: 4 },
  previewLabel: { fontSize: 13, fontWeight: 600, color: '#0f172a' },
  previewHint: { fontSize: 12, color: '#64748b', lineHeight: 1.4 },
};
