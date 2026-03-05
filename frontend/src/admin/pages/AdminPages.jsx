import { useState, useEffect } from 'react';
import api from '../../api/axios';

const emptyForm = { slug: '', title: '', content: '' };

export default function AdminPages() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteSlug, setDeleteSlug] = useState(null);

  const fetchPages = async () => {
    try { const { data } = await api.get('/pages'); setPages(Array.isArray(data) ? data : []); }
    catch { setPages([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPages(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
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
    <div>
      <div style={st.header}>
        <div>
          <h1 style={st.title}>Pages</h1>
          <p style={st.subtitle}>Manage website content pages</p>
        </div>
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
                  <td style={st.td}>
                    <code style={st.slugCode}>/{pg.slug}</code>
                  </td>
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
            <p style={st.confirmText}>Are you sure you want to delete the page <strong>/{deleteSlug}</strong>? This action cannot be undone.</p>
            <div style={st.modalActions}>
              <button style={st.cancelBtn} onClick={() => setDeleteSlug(null)}>Cancel</button>
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
  card: { background: '#fff', borderRadius: 14, border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #f1f5f9', background: '#fafbfc' },
  tr: { borderBottom: '1px solid #f8fafc' },
  td: { padding: '12px 16px', fontSize: 14, color: '#334155', verticalAlign: 'middle' },
  slugCode: { padding: '2px 8px', borderRadius: 4, background: '#f1f5f9', fontSize: 13, color: '#64748b', fontFamily: 'monospace' },
  editBtn: { background: 'none', border: '1px solid #e2e8f0', borderRadius: 6, padding: '5px 12px', fontSize: 12, fontWeight: 600, color: '#334155', cursor: 'pointer', marginRight: 6 },
  deleteBtn: { background: 'none', border: '1px solid #fecaca', borderRadius: 6, padding: '5px 12px', fontSize: 12, fontWeight: 600, color: '#ef4444', cursor: 'pointer' },
  empty: { padding: 40, textAlign: 'center', color: '#94a3b8', fontSize: 14 },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 },
  modal: { background: '#fff', borderRadius: 14, padding: 28, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto' },
  modalTitle: { fontSize: 20, fontWeight: 700, color: '#0f172a', margin: '0 0 20px' },
  form: { display: 'flex', flexDirection: 'column', gap: 14 },
  field: { display: 'flex', flexDirection: 'column', gap: 5 },
  label: { fontSize: 13, fontWeight: 600, color: '#334155' },
  input: { padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, color: '#0f172a', outline: 'none', background: '#f8fafc' },
  hint: { fontSize: 12, color: '#94a3b8' },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 6 },
  cancelBtn: { padding: '9px 18px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', color: '#334155', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  saveBtn: { padding: '9px 18px', borderRadius: 8, border: 'none', background: '#0ea5e9', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  confirmBox: { background: '#fff', borderRadius: 14, padding: 28, width: '100%', maxWidth: 420 },
  confirmTitle: { fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 8px' },
  confirmText: { fontSize: 14, color: '#64748b', margin: '0 0 20px', lineHeight: 1.5 },
  deleteBtnFull: { padding: '9px 18px', borderRadius: 8, border: 'none', background: '#ef4444', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
};
