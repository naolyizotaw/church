import { useState, useEffect } from 'react';
import api from '../../api/axios';

function timeAgo(dateStr) {
  const now = new Date();
  const d = new Date(dateStr);
  const diffMin = Math.floor((now - d) / 60000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDays = Math.floor(diffHr / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString();
}

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [viewContact, setViewContact] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const fetchContacts = async () => {
    try { const { data } = await api.get('/contacts'); setContacts(Array.isArray(data) ? data : []); }
    catch { setContacts([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchContacts(); }, []);

  const toggleRead = async (id) => {
    try { await api.patch(`/contacts/${id}/read`); fetchContacts(); }
    catch { alert('Error updating status'); }
  };

  const handleDelete = async () => {
    try { await api.delete(`/contacts/${deleteId}`); setDeleteId(null); if (viewContact?._id === deleteId) setViewContact(null); fetchContacts(); }
    catch { alert('Error deleting contact'); }
  };

  const filtered = contacts.filter(c => {
    if (filter === 'unread') return !c.isRead;
    if (filter === 'read') return c.isRead;
    return true;
  });

  const unreadCount = contacts.filter(c => !c.isRead).length;

  return (
    <div>
      <div style={st.header}>
        <div>
          <h1 style={st.title}>Contact Messages</h1>
          <p style={st.subtitle}>{contacts.length} total messages, {unreadCount} unread</p>
        </div>
      </div>

      <div style={st.toolbar}>
        <div style={st.tabs}>
          {[['all', 'All'], ['unread', 'Unread'], ['read', 'Read']].map(([val, label]) => (
            <button key={val} style={filter === val ? st.tabActive : st.tab} onClick={() => setFilter(val)}>
              {label}
              {val === 'unread' && unreadCount > 0 && <span style={st.tabBadge}>{unreadCount}</span>}
            </button>
          ))}
        </div>
        <span style={st.count}>{filtered.length} message{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      <div style={st.card}>
        {loading ? <p style={st.empty}>Loading...</p> : filtered.length === 0 ? (
          <p style={st.empty}>No messages found</p>
        ) : (
          <div className="admin-table-wrap">
          <table style={st.table}>
            <thead>
              <tr>
                <th style={st.th}>Sender</th>
                <th style={st.th}>Subject</th>
                <th style={st.th}>Message</th>
                <th style={st.th}>Received</th>
                <th style={st.th}>Status</th>
                <th style={{ ...st.th, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c._id} style={{ ...st.tr, background: c.isRead ? '#fff' : '#f0f9ff' }}>
                  <td style={st.td}>
                    <div style={{ fontWeight: c.isRead ? 500 : 700, color: '#0f172a' }}>{c.name}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8' }}>{c.email}</div>
                  </td>
                  <td style={st.td}>{c.subject || '—'}</td>
                  <td style={{ ...st.td, maxWidth: 220, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {c.message}
                  </td>
                  <td style={st.td}>{timeAgo(c.createdAt)}</td>
                  <td style={st.td}>
                    <span style={{ ...st.badge, background: c.isRead ? '#f1f5f9' : '#dbeafe', color: c.isRead ? '#64748b' : '#2563eb' }}>
                      {c.isRead ? 'READ' : 'NEW'}
                    </span>
                  </td>
                  <td style={{ ...st.td, textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <button style={st.editBtn} onClick={() => setViewContact(c)}>View</button>
                    <button style={st.editBtn} onClick={() => toggleRead(c._id)}>{c.isRead ? 'Mark Unread' : 'Mark Read'}</button>
                    <button style={st.deleteBtn} onClick={() => setDeleteId(c._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>

      {/* View Detail Modal */}
      {viewContact && (
        <div style={st.overlay} onClick={() => setViewContact(null)}>
          <div style={st.modal} onClick={e => e.stopPropagation()}>
            <h2 style={st.modalTitle}>Message from {viewContact.name}</h2>
            <div style={st.detailGrid}>
              <div style={st.detailItem}>
                <span style={st.detailLabel}>Email</span>
                <span style={st.detailValue}>{viewContact.email}</span>
              </div>
              {viewContact.phone && (
                <div style={st.detailItem}>
                  <span style={st.detailLabel}>Phone</span>
                  <span style={st.detailValue}>{viewContact.phone}</span>
                </div>
              )}
              {viewContact.subject && (
                <div style={st.detailItem}>
                  <span style={st.detailLabel}>Subject</span>
                  <span style={st.detailValue}>{viewContact.subject}</span>
                </div>
              )}
              <div style={st.detailItem}>
                <span style={st.detailLabel}>Received</span>
                <span style={st.detailValue}>{new Date(viewContact.createdAt).toLocaleString()}</span>
              </div>
            </div>
            <div style={st.msgBox}>
              <span style={st.detailLabel}>Message</span>
              <p style={st.msgText}>{viewContact.message}</p>
            </div>
            <div style={st.modalActions}>
              <button style={st.editBtn} onClick={() => { toggleRead(viewContact._id); setViewContact(null); }}>
                {viewContact.isRead ? 'Mark Unread' : 'Mark as Read'}
              </button>
              <button style={st.deleteBtn} onClick={() => { setDeleteId(viewContact._id); }}>Delete</button>
              <button style={st.cancelBtn} onClick={() => setViewContact(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div style={st.overlay} onClick={() => setDeleteId(null)}>
          <div style={st.confirmBox} onClick={e => e.stopPropagation()}>
            <h3 style={st.confirmTitle}>Delete Message</h3>
            <p style={st.confirmText}>Are you sure you want to delete this contact message? This action cannot be undone.</p>
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
  toolbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  tabs: { display: 'flex', gap: 4, background: '#f1f5f9', borderRadius: 8, padding: 3 },
  tab: { padding: '7px 16px', borderRadius: 6, border: 'none', background: 'transparent', color: '#64748b', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 },
  tabActive: { padding: '7px 16px', borderRadius: 6, border: 'none', background: '#fff', color: '#0f172a', fontSize: 13, fontWeight: 600, cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 6 },
  tabBadge: { background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 10 },
  count: { fontSize: 13, color: '#94a3b8' },
  card: { background: '#fff', borderRadius: 14, border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #f1f5f9', background: '#fafbfc' },
  tr: { borderBottom: '1px solid #f8fafc' },
  td: { padding: '12px 16px', fontSize: 14, color: '#334155', verticalAlign: 'middle' },
  badge: { padding: '3px 8px', borderRadius: 5, fontSize: 11, fontWeight: 700, letterSpacing: '0.03em' },
  editBtn: { background: 'none', border: '1px solid #e2e8f0', borderRadius: 6, padding: '5px 12px', fontSize: 12, fontWeight: 600, color: '#334155', cursor: 'pointer', marginRight: 6 },
  deleteBtn: { background: 'none', border: '1px solid #fecaca', borderRadius: 6, padding: '5px 12px', fontSize: 12, fontWeight: 600, color: '#ef4444', cursor: 'pointer' },
  empty: { padding: 40, textAlign: 'center', color: '#94a3b8', fontSize: 14 },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 },
  modal: { background: '#fff', borderRadius: 14, padding: 28, width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto' },
  modalTitle: { fontSize: 20, fontWeight: 700, color: '#0f172a', margin: '0 0 20px' },
  detailGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 },
  detailItem: { display: 'flex', flexDirection: 'column', gap: 3 },
  detailLabel: { fontSize: 12, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.03em' },
  detailValue: { fontSize: 14, color: '#0f172a', fontWeight: 500 },
  msgBox: { marginBottom: 20 },
  msgText: { fontSize: 14, color: '#334155', lineHeight: 1.6, margin: '6px 0 0', padding: 14, background: '#f8fafc', borderRadius: 8, border: '1px solid #f1f5f9' },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 6 },
  cancelBtn: { padding: '9px 18px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', color: '#334155', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  confirmBox: { background: '#fff', borderRadius: 14, padding: 28, width: '100%', maxWidth: 420 },
  confirmTitle: { fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 8px' },
  confirmText: { fontSize: 14, color: '#64748b', margin: '0 0 20px', lineHeight: 1.5 },
  deleteBtnFull: { padding: '9px 18px', borderRadius: 8, border: 'none', background: '#ef4444', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
};
