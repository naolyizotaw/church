import { useState, useEffect } from 'react';
import api from '../../api/axios';

const emptyForm = { title: '', description: '', date: '', time: '', endDate: '', endTime: '', location: '', category: 'worship', isRecurring: false, recurrencePattern: 'weekly', recurrenceEnd: '', requiresRegistration: false };

const CATEGORY_OPTIONS = [
  { value: 'worship', label: 'Worship / አምልኮ' },
  { value: 'youth', label: 'Youth / ወጣቶች' },
  { value: 'outreach', label: 'Outreach / ተደራሽ' },
  { value: 'prayer', label: 'Prayer / ጸሎት' },
  { value: 'conference', label: 'Conference' },
  { value: 'charity', label: 'Charity' },
];

const CATEGORY_COLORS = {
  worship: '#0ea5e9',
  youth: '#8b5cf6',
  outreach: '#10b981',
  prayer: '#f59e0b',
  conference: '#6366f1',
  charity: '#ec4899',
};

const RECURRENCE_OPTIONS = [
  { value: 'weekly', label: 'Every Week' },
  { value: 'biweekly', label: 'Every 2 Weeks' },
  { value: 'monthly', label: 'Every Month' },
];

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [poster, setPoster] = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState(null);
  const [regEvent, setRegEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loadingRegs, setLoadingRegs] = useState(false);

  const fetchEvents = async () => {
    try { const { data } = await api.get('/events?admin=true'); setEvents(Array.isArray(data) ? data : []); }
    catch { setEvents([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchEvents(); }, []);

  const openCreate = () => {
    setEditing(null); setForm(emptyForm); setPoster(null); setPosterPreview(null); setShowModal(true);
  };
  const openEdit = (ev) => {
    setEditing(ev._id);
    const parseDT = (iso) => {
      if (!iso) return { d: '', t: '' };
      const dt = new Date(iso);
      const y = dt.getFullYear(), m = String(dt.getMonth()+1).padStart(2,'0'), dd = String(dt.getDate()).padStart(2,'0');
      const hh = String(dt.getHours()).padStart(2,'0'), mm = String(dt.getMinutes()).padStart(2,'0');
      return { d: `${y}-${m}-${dd}`, t: `${hh}:${mm}` };
    };
    const start = parseDT(ev.date);
    const end = parseDT(ev.endDate);
    const recEnd = ev.recurrenceEnd ? parseDT(ev.recurrenceEnd).d : '';
    setForm({ title: ev.title || '', description: ev.description || '', date: start.d, time: start.t, endDate: end.d, endTime: end.t, location: ev.location || '', category: ev.category || 'worship', isRecurring: !!ev.isRecurring, recurrencePattern: ev.recurrencePattern || 'weekly', recurrenceEnd: recEnd, requiresRegistration: !!ev.requiresRegistration });
    setPoster(null);
    setPosterPreview(ev.posterUrl || null);
    setShowModal(true);
  };

  const handlePosterChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPoster(file);
      setPosterPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', form.description);
      const toISO = (d, t) => {
        if (!d) return '';
        const dt = t ? new Date(`${d}T${t}`) : new Date(`${d}T00:00`);
        return dt.toISOString();
      };
      fd.append('date', toISO(form.date, form.time));
      if (form.endDate || form.endTime) {
        fd.append('endDate', toISO(form.endDate || form.date, form.endTime));
      } else {
        fd.append('endDate', '');
      }
      fd.append('location', form.location);
      fd.append('category', form.category);
      fd.append('requiresRegistration', form.requiresRegistration);
      fd.append('isRecurring', form.isRecurring);
      if (form.isRecurring) {
        fd.append('recurrencePattern', form.recurrencePattern);
        if (form.recurrenceEnd) fd.append('recurrenceEnd', form.recurrenceEnd);
      }
      if (poster) fd.append('poster', poster);

      if (editing) {
        await api.put(`/events/${editing}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        showToast('Event updated successfully!');
      } else {
        await api.post('/events', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        showToast('Event created successfully!');
      }
      setShowModal(false);
      fetchEvents();
    } catch (err) { alert(err.response?.data?.message || 'Error saving event'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try { await api.delete(`/events/${deleteId}`); setDeleteId(null); fetchEvents(); showToast('Event deleted successfully!'); }
    catch { alert('Error deleting event'); }
  };

  const openRegistrations = async (ev) => {
    setRegEvent(ev);
    setLoadingRegs(true);
    try {
      const { data } = await api.get(`/registrations/${ev._id}`);
      setRegistrations(Array.isArray(data) ? data : []);
    } catch { setRegistrations([]); }
    finally { setLoadingRegs(false); }
  };

  const deleteRegistration = async (id) => {
    try {
      await api.delete(`/registrations/${id}`);
      setRegistrations(prev => prev.filter(r => r._id !== id));
    } catch { alert('Error deleting registration'); }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = events.filter(ev =>
    ev.title?.toLowerCase().includes(search.toLowerCase()) ||
    ev.location?.toLowerCase().includes(search.toLowerCase())
  );

  const isPast = (d) => new Date(d) < new Date();

  return (
    <div>
      {toast && (
        <div style={st.toast}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
          <span>{toast}</span>
          <button onClick={() => setToast(null)} style={st.toastClose}>&times;</button>
        </div>
      )}
      <div style={st.header}>
        <div>
          <h1 style={st.title}>Events</h1>
          <p style={st.subtitle}>Manage church events and gatherings</p>
        </div>
        <button style={st.addBtn} onClick={openCreate}>+ Create Event</button>
      </div>

      <div style={st.toolbar}>
        <input type="text" placeholder="Search events..." value={search} onChange={e => setSearch(e.target.value)} style={st.searchInput} />
        <span style={st.count}>{filtered.length} event{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      <div style={st.card}>
        {loading ? <p style={st.empty}>Loading...</p> : filtered.length === 0 ? (
          <p style={st.empty}>No events found</p>
        ) : (
          <div className="admin-table-wrap">
          <table style={st.table}>
            <thead>
              <tr>
                <th style={st.th}>Poster</th>
                <th style={st.th}>Title</th>
                <th style={st.th}>Date</th>
                <th style={st.th}>Location</th>
                <th style={st.th}>Category</th>
                <th style={st.th}>Status</th>
                <th style={{ ...st.th, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(ev => (
                <tr key={ev._id} style={st.tr}>
                  <td style={st.td}>
                    {ev.posterUrl ? (
                      <img src={ev.posterUrl} alt="" style={st.posterThumb} />
                    ) : (
                      <div style={st.noPoster}>
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <rect x="2" y="2" width="14" height="14" rx="2" stroke="#cbd5e1" strokeWidth="1.3" fill="none"/>
                          <circle cx="6.5" cy="6.5" r="1.5" stroke="#cbd5e1" strokeWidth="1.2" fill="none"/>
                          <path d="M2 13L6 9L10 12L13 9L16 13" stroke="#cbd5e1" strokeWidth="1.2" fill="none"/>
                        </svg>
                      </div>
                    )}
                  </td>
                  <td style={st.td}><span style={{ fontWeight: 600, color: '#0f172a' }}>{ev.title}</span></td>
                  <td style={st.td}>
                    <div>{new Date(ev.date).toLocaleDateString('en', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}{ev.endDate ? ` – ${new Date(ev.endDate).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })}` : ''}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{new Date(ev.date).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}{ev.endDate ? ` – ${new Date(ev.endDate).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}` : ''}</div>
                  </td>
                  <td style={st.td}>{ev.location || '—'}</td>
                  <td style={st.td}>
                    <span style={{ ...st.catBadge, background: CATEGORY_COLORS[ev.category] || '#94a3b8' }}>
                      {(ev.category || 'worship').charAt(0).toUpperCase() + (ev.category || 'worship').slice(1)}
                    </span>
                  </td>
                  <td style={st.td}>
                    <span style={{ ...st.badge, background: isPast(ev.date) ? '#f1f5f9' : '#dcfce7', color: isPast(ev.date) ? '#64748b' : '#16a34a' }}>
                      {isPast(ev.date) ? 'PAST' : 'UPCOMING'}
                    </span>
                    {ev.isRecurring && (
                      <span style={st.recurBadge}>
                        ↻ {ev.recurrencePattern}
                      </span>
                    )}
                    {ev.requiresRegistration && (
                      <span style={st.regBadge}>REG</span>
                    )}
                  </td>
                  <td style={{ ...st.td, textAlign: 'right' }}>
                    {ev.requiresRegistration && (
                      <button style={st.regsBtn} onClick={() => openRegistrations(ev)}>Registrations</button>
                    )}
                    <button style={st.editBtn} onClick={() => openEdit(ev)}>Edit</button>
                    <button style={st.deleteBtn} onClick={() => setDeleteId(ev._id)}>Delete</button>
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
            <h2 style={st.modalTitle}>{editing ? 'Edit Event' : 'Create Event'}</h2>
            <form onSubmit={handleSubmit} style={st.form}>
              <div style={st.field}>
                <label style={st.label}>Title *</label>
                <input style={st.input} required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>
              <div style={st.field}>
                <label style={st.label}>Description *</label>
                <textarea style={{ ...st.input, height: 100, resize: 'vertical' }} required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <div style={st.row2}>
                <div style={st.field}>
                  <label style={st.label}>Start Date *</label>
                  <input style={st.input} type="date" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                </div>
                <div style={st.field}>
                  <label style={st.label}>Start Time</label>
                  <input style={st.input} type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
                </div>
              </div>
              <div style={st.row2}>
                <div style={st.field}>
                  <label style={st.label}>End Date</label>
                  <input style={st.input} type="date" value={form.endDate} min={form.date} onChange={e => setForm({ ...form, endDate: e.target.value })} />
                </div>
                <div style={st.field}>
                  <label style={st.label}>End Time</label>
                  <input style={st.input} type="time" value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} />
                </div>
              </div>
              <div style={st.row2}>
                <div style={st.field}>
                  <label style={st.label}>Location</label>
                  <input style={st.input} value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
                </div>
                <div style={st.field}>
                  <label style={st.label}>Category</label>
                  <select style={st.input} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {CATEGORY_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Recurrence */}
              <div style={st.recurrenceWrap}>
                <label style={{ ...st.label, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={form.isRecurring}
                    onChange={e => setForm({ ...form, isRecurring: e.target.checked })}
                    style={st.checkbox}
                  />
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                  </svg>
                  Recurring Event
                </label>
                {form.isRecurring && (
                  <div style={st.recurrenceOptions}>
                    <div style={st.field}>
                      <label style={st.label}>Repeats</label>
                      <select
                        style={st.input}
                        value={form.recurrencePattern}
                        onChange={e => setForm({ ...form, recurrencePattern: e.target.value })}
                      >
                        {RECURRENCE_OPTIONS.map(o => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    </div>
                    <div style={st.field}>
                      <label style={st.label}>Repeat Until (optional)</label>
                      <input
                        style={st.input}
                        type="date"
                        value={form.recurrenceEnd}
                        onChange={e => setForm({ ...form, recurrenceEnd: e.target.value })}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Registration */}
              <div style={st.recurrenceWrap}>
                <label style={{ ...st.label, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={form.requiresRegistration}
                    onChange={e => setForm({ ...form, requiresRegistration: e.target.checked })}
                    style={st.checkbox}
                  />
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><path d="M20 8v6M23 11h-6" />
                  </svg>
                  Requires Registration
                </label>
              </div>

              {/* Poster Upload */}
              <div style={st.field}>
                <label style={st.label}>Event Poster</label>
                {posterPreview && (
                  <div style={st.previewWrap}>
                    <img src={posterPreview} alt="Poster preview" style={st.previewImg} />
                    <button type="button" style={st.removePreview} onClick={() => { setPoster(null); setPosterPreview(null); }}>
                      Remove
                    </button>
                  </div>
                )}
                <div style={st.uploadArea}>
                  <input type="file" accept="image/*" onChange={handlePosterChange} style={st.fileInput} id="poster-upload" />
                  <label htmlFor="poster-upload" style={st.uploadLabel}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <rect x="2" y="2" width="16" height="16" rx="3" stroke="#94a3b8" strokeWidth="1.5" fill="none"/>
                      <circle cx="7" cy="7" r="2" stroke="#94a3b8" strokeWidth="1.3" fill="none"/>
                      <path d="M2 15L6 11L9 13L13 9L18 14" stroke="#94a3b8" strokeWidth="1.3" fill="none"/>
                    </svg>
                    <span>{posterPreview ? 'Change poster image' : 'Click to upload poster image'}</span>
                    <span style={st.uploadHint}>JPG, PNG, GIF or WebP (max 10MB)</span>
                  </label>
                </div>
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
            <h3 style={st.confirmTitle}>Delete Event</h3>
            <p style={st.confirmText}>Are you sure you want to delete this event? This action cannot be undone.</p>
            <div style={st.modalActions}>
              <button style={st.cancelBtn} onClick={() => setDeleteId(null)}>Cancel</button>
              <button style={st.deleteBtnFull} onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {regEvent && (
        <div style={st.overlay} onClick={() => setRegEvent(null)}>
          <div style={st.regModal} onClick={e => e.stopPropagation()}>
            <h2 style={st.modalTitle}>Registrations — {regEvent.title}</h2>
            {loadingRegs ? <p style={st.empty}>Loading...</p> : registrations.length === 0 ? (
              <p style={st.empty}>No registrations yet</p>
            ) : (
              <>
                <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 12px' }}>{registrations.length} registration{registrations.length !== 1 ? 's' : ''}</p>
                <table style={st.table}>
                  <thead>
                    <tr>
                      <th style={st.th}>Name</th>
                      <th style={st.th}>Email</th>
                      <th style={st.th}>Phone</th>
                      <th style={st.th}>Date</th>
                      <th style={{ ...st.th, textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map(r => (
                      <tr key={r._id} style={st.tr}>
                        <td style={st.td}><span style={{ fontWeight: 600, color: '#0f172a' }}>{r.name}</span></td>
                        <td style={st.td}>{r.email}</td>
                        <td style={st.td}>{r.phone || '—'}</td>
                        <td style={st.td}>{new Date(r.createdAt).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                        <td style={{ ...st.td, textAlign: 'right' }}>
                          <button style={st.deleteBtn} onClick={() => deleteRegistration(r._id)}>Remove</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
            <div style={{ ...st.modalActions, marginTop: 16 }}>
              <button style={st.cancelBtn} onClick={() => setRegEvent(null)}>Close</button>
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
  card: { background: '#fff', borderRadius: 14, border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: 780 },
  th: { textAlign: 'left', padding: '12px 14px', fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #f1f5f9', background: '#fafbfc', whiteSpace: 'nowrap' },
  tr: { borderBottom: '1px solid #f8fafc' },
  td: { padding: '12px 14px', fontSize: 14, color: '#334155', verticalAlign: 'middle', whiteSpace: 'nowrap' },
  posterThumb: { width: 48, height: 48, borderRadius: 6, objectFit: 'cover', display: 'block' },
  noPoster: { width: 48, height: 48, borderRadius: 6, background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  badge: { padding: '3px 8px', borderRadius: 5, fontSize: 11, fontWeight: 700, letterSpacing: '0.03em' },
  catBadge: { display: 'inline-block', padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: '0.03em' },
  editBtn: { background: 'none', border: '1px solid #e2e8f0', borderRadius: 6, padding: '5px 12px', fontSize: 12, fontWeight: 600, color: '#334155', cursor: 'pointer', marginRight: 6 },
  deleteBtn: { background: 'none', border: '1px solid #fecaca', borderRadius: 6, padding: '5px 12px', fontSize: 12, fontWeight: 600, color: '#ef4444', cursor: 'pointer' },
  empty: { padding: 40, textAlign: 'center', color: '#94a3b8', fontSize: 14 },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 },
  modal: { background: '#fff', borderRadius: 14, padding: 28, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto' },
  modalTitle: { fontSize: 20, fontWeight: 700, color: '#0f172a', margin: '0 0 20px' },
  form: { display: 'flex', flexDirection: 'column', gap: 14 },
  row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 },
  row3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 },
  field: { display: 'flex', flexDirection: 'column', gap: 5 },
  label: { fontSize: 13, fontWeight: 600, color: '#334155' },
  input: { padding: '9px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, color: '#0f172a', outline: 'none', background: '#f8fafc' },
  previewWrap: { display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 6 },
  previewImg: { width: 120, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid #e2e8f0' },
  removePreview: { background: 'none', border: '1px solid #fecaca', borderRadius: 6, padding: '4px 10px', fontSize: 12, fontWeight: 600, color: '#ef4444', cursor: 'pointer' },
  uploadArea: { position: 'relative' },
  fileInput: { position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 2 },
  uploadLabel: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '16px 20px', borderRadius: 8, border: '2px dashed #e2e8f0', background: '#fafbfc', cursor: 'pointer', textAlign: 'center', fontSize: 13, color: '#64748b', fontWeight: 500 },
  uploadHint: { fontSize: 11, color: '#94a3b8', fontWeight: 400 },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 6 },
  cancelBtn: { padding: '9px 18px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', color: '#334155', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  saveBtn: { padding: '9px 18px', borderRadius: 8, border: 'none', background: '#0ea5e9', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  confirmBox: { background: '#fff', borderRadius: 14, padding: 28, width: '100%', maxWidth: 420 },
  confirmTitle: { fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 8px' },
  confirmText: { fontSize: 14, color: '#64748b', margin: '0 0 20px', lineHeight: 1.5 },
  deleteBtnFull: { padding: '9px 18px', borderRadius: 8, border: 'none', background: '#ef4444', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  recurrenceWrap: { background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 10, padding: '12px 14px' },
  recurrenceOptions: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 10 },
  checkbox: { width: 16, height: 16, accentColor: '#0ea5e9', cursor: 'pointer' },
  recurBadge: { display: 'inline-block', marginLeft: 6, padding: '2px 7px', borderRadius: 5, fontSize: 10, fontWeight: 700, background: '#e0f2fe', color: '#0284c7', letterSpacing: '0.03em', textTransform: 'capitalize' },
  regBadge: { display: 'inline-block', marginLeft: 6, padding: '2px 7px', borderRadius: 5, fontSize: 10, fontWeight: 700, background: '#fef3c7', color: '#92400e', letterSpacing: '0.03em' },
  regsBtn: { background: 'none', border: '1px solid #fde68a', borderRadius: 6, padding: '5px 12px', fontSize: 12, fontWeight: 600, color: '#92400e', cursor: 'pointer', marginRight: 6 },
  regModal: { background: '#fff', borderRadius: 14, padding: 28, width: '100%', maxWidth: 680, maxHeight: '90vh', overflowY: 'auto' },
  toast: { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px', marginBottom: 16, borderRadius: 10, background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', fontSize: 14, fontWeight: 600, animation: 'fadeInDown 0.3s ease' },
  toastClose: { marginLeft: 'auto', background: 'none', border: 'none', fontSize: 18, color: '#15803d', cursor: 'pointer', padding: '0 4px', lineHeight: 1 },
};
