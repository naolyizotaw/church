import { useState, useEffect } from 'react';
import api from '../../api/axios';

function DonationDetailModal({ donation, onClose }) {
  if (!donation) return null;
  const dateStr = new Date(donation.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  const timeStr = new Date(donation.createdAt).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit',
  });

  const rows = [
    ['Donor Name', `${donation.firstName} ${donation.lastName}`],
    ['Email', donation.email],
    ['Phone', donation.phone || '—'],
    ['Amount', `ETB ${donation.amount.toLocaleString()}`],
    ['Type', donation.donationType],
    ['Status', donation.status],
    ['Payment Method', donation.paymentMethod || '—'],
    ['Transaction Ref', donation.txRef],
    ['Chapa Ref', donation.chapaRef || '—'],
    ['Date', `${dateStr} at ${timeStr}`],
  ];

  return (
    <div style={modal.overlay} onClick={onClose}>
      <div style={modal.box} onClick={(e) => e.stopPropagation()}>
        <div style={modal.header}>
          <h3 style={modal.title}>Donation Details</h3>
          <button style={modal.closeBtn} onClick={onClose}>&times;</button>
        </div>
        <div style={modal.body}>
          {rows.map(([label, value], i) => (
            <div key={i} style={modal.row}>
              <span style={modal.label}>{label}</span>
              <span style={{
                ...modal.value,
                ...(label === 'Status' ? {
                  textTransform: 'capitalize',
                  color: value === 'success' ? '#16a34a' : value === 'failed' ? '#dc2626' : '#d97706',
                  fontWeight: 800,
                } : {}),
                ...(label === 'Amount' ? { fontSize: 16, color: '#0369a1' } : {}),
              }}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminDonations() {
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDonation, setSelectedDonation] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [donRes, statsRes] = await Promise.all([
        api.get('/donations'),
        api.get('/donations/stats'),
      ]);
      setDonations(donRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Failed to load donations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this donation record?')) return;
    setDeleting(id);
    try {
      await api.delete(`/donations/${id}`);
      setDonations((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setDeleting(null);
    }
  };

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Amount', 'Type', 'Status', 'Payment Method', 'Ref', 'Date'];
    const rows = filtered.map(d => [
      `${d.firstName} ${d.lastName}`,
      d.email,
      d.phone || '',
      d.amount,
      d.donationType,
      d.status,
      d.paymentMethod || '',
      d.txRef,
      new Date(d.createdAt).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `donations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = donations.filter(d => {
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
    const q = search.toLowerCase();
    const matchesSearch = !q
      || `${d.firstName} ${d.lastName}`.toLowerCase().includes(q)
      || d.email.toLowerCase().includes(q)
      || d.txRef.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const statusColor = {
    success: { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
    pending: { bg: '#fffbeb', color: '#d97706', border: '#fde68a' },
    failed: { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
  };

  const statusCounts = {
    all: donations.length,
    success: donations.filter(d => d.status === 'success').length,
    pending: donations.filter(d => d.status === 'pending').length,
    failed: donations.filter(d => d.status === 'failed').length,
  };

  if (loading) {
    return (
      <div>
        <div style={st.header}>
          <h1 style={st.title}>Donations</h1>
          <p style={st.subtitle}>Manage and track church donations</p>
        </div>
        <div style={{ ...st.card, padding: 60, textAlign: 'center', color: '#64748b' }}>
          Loading donations...
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={st.headerRow}>
        <div>
          <h1 style={st.title}>Donations</h1>
          <p style={st.subtitle}>Manage and track church donations</p>
        </div>
        {donations.length > 0 && (
          <button style={st.exportBtn} onClick={exportCSV}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export CSV
          </button>
        )}
      </div>

      {stats && (
        <div style={st.statsGrid}>
          <div style={st.statCard}>
            <div style={st.statIconWrap}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
            </div>
            <div>
              <p style={st.statLabel}>Total Received</p>
              <p style={st.statValue}>ETB {stats.totalAmount.toLocaleString()}</p>
            </div>
          </div>
          <div style={st.statCard}>
            <div style={{ ...st.statIconWrap, background: '#faf5ff' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <div>
              <p style={st.statLabel}>This Month</p>
              <p style={st.statValue}>ETB {stats.monthlyTotal.toLocaleString()}</p>
            </div>
          </div>
          <div style={st.statCard}>
            <div style={{ ...st.statIconWrap, background: '#f0fdf4' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <div>
              <p style={st.statLabel}>Successful</p>
              <p style={st.statValue}>{stats.totalDonations}</p>
            </div>
          </div>
          <div style={st.statCard}>
            <div style={{ ...st.statIconWrap, background: '#fffbeb' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <div>
              <p style={st.statLabel}>Pending</p>
              <p style={st.statValue}>{statusCounts.pending}</p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={st.filtersRow}>
        <div style={st.tabsWrap}>
          {['all', 'success', 'pending', 'failed'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              style={{
                ...st.tab,
                ...(statusFilter === s ? st.tabActive : {}),
              }}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
              <span style={{
                ...st.tabCount,
                ...(statusFilter === s ? st.tabCountActive : {}),
              }}>
                {statusCounts[s]}
              </span>
            </button>
          ))}
        </div>
        <div style={st.searchWrap}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" style={{ flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search by name, email, or ref..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={st.searchInput}
          />
        </div>
      </div>

      <div style={st.card}>
        {filtered.length === 0 ? (
          <div style={st.empty}>
            <p style={{ fontSize: 16, fontWeight: 600, color: '#334155', margin: '0 0 6px' }}>
              {donations.length === 0 ? 'No donations yet' : 'No matching donations'}
            </p>
            <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>
              {donations.length === 0
                ? 'Donations will appear here once members start giving through Chapa.'
                : 'Try adjusting your search or filter.'}
            </p>
          </div>
        ) : (
          <div style={st.tableWrap}>
            <table style={st.table}>
              <thead>
                <tr>
                  <th style={st.th}>Donor</th>
                  <th style={st.th}>Amount</th>
                  <th style={st.th}>Type</th>
                  <th style={st.th}>Status</th>
                  <th style={st.th}>Date</th>
                  <th style={{ ...st.th, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => {
                  const sc = statusColor[d.status] || statusColor.pending;
                  return (
                    <tr key={d._id} style={st.tr}>
                      <td style={st.td}>
                        <div style={{ fontWeight: 600, color: '#0f172a', fontSize: 14 }}>
                          {d.firstName} {d.lastName}
                        </div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>{d.email}</div>
                      </td>
                      <td style={{ ...st.td, fontWeight: 700, color: '#0f172a' }}>
                        ETB {d.amount.toLocaleString()}
                      </td>
                      <td style={st.td}>
                        <span style={{ fontSize: 13, color: '#475569', textTransform: 'capitalize' }}>
                          {d.donationType}
                        </span>
                      </td>
                      <td style={st.td}>
                        <span style={{
                          display: 'inline-block',
                          padding: '3px 10px',
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 700,
                          background: sc.bg,
                          color: sc.color,
                          border: `1px solid ${sc.border}`,
                          textTransform: 'capitalize',
                        }}>
                          {d.status}
                        </span>
                      </td>
                      <td style={{ ...st.td, fontSize: 13, color: '#64748b' }}>
                        {new Date(d.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric',
                        })}
                      </td>
                      <td style={{ ...st.td, textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => setSelectedDonation(d)}
                            style={st.viewBtn}
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDelete(d._id)}
                            disabled={deleting === d._id}
                            style={st.deleteBtn}
                          >
                            {deleting === d._id ? '...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedDonation && (
        <DonationDetailModal
          donation={selectedDonation}
          onClose={() => setSelectedDonation(null)}
        />
      )}
    </div>
  );
}

const modal = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 16,
  },
  box: {
    background: '#fff', borderRadius: 16, maxWidth: 500, width: '100%',
    boxShadow: '0 20px 60px rgba(0,0,0,0.18)', overflow: 'hidden',
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '18px 24px', borderBottom: '1px solid #f1f5f9',
  },
  title: { fontSize: 17, fontWeight: 700, color: '#0f172a', margin: 0 },
  closeBtn: {
    background: 'none', border: 'none', fontSize: 22, color: '#94a3b8',
    cursor: 'pointer', lineHeight: 1,
  },
  body: { padding: '16px 24px 24px' },
  row: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '10px 0', borderBottom: '1px solid #f8fafc',
  },
  label: { fontSize: 13, color: '#64748b', fontWeight: 500 },
  value: { fontSize: 13, color: '#0f172a', fontWeight: 700, textAlign: 'right', maxWidth: '60%', wordBreak: 'break-all' },
};

const st = {
  headerRow: {
    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20,
  },
  title: { fontSize: 26, fontWeight: 700, color: '#0f172a', margin: 0 },
  subtitle: { fontSize: 14, color: '#64748b', margin: '4px 0 0' },
  exportBtn: {
    display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px',
    background: '#f0f9ff', color: '#0ea5e9', border: '1.5px solid #bae6fd',
    borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
  },
  statsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20,
  },
  statCard: {
    background: '#fff', borderRadius: 14, padding: '18px 20px',
    border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    display: 'flex', alignItems: 'center', gap: 14,
  },
  statIconWrap: {
    width: 42, height: 42, borderRadius: 10, background: '#eff6ff',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  statLabel: { fontSize: 12, color: '#64748b', margin: '0 0 4px', fontWeight: 500 },
  statValue: { fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0 },
  filtersRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    gap: 16, marginBottom: 16, flexWrap: 'wrap',
  },
  tabsWrap: {
    display: 'flex', gap: 4, background: '#f1f5f9', borderRadius: 10, padding: 4,
  },
  tab: {
    display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px',
    border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600,
    cursor: 'pointer', background: 'transparent', color: '#64748b', fontFamily: 'inherit',
  },
  tabActive: {
    background: '#fff', color: '#0ea5e9', boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  },
  tabCount: {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    minWidth: 20, height: 20, borderRadius: 10, fontSize: 11, fontWeight: 700,
    background: '#e2e8f0', color: '#64748b', padding: '0 6px',
  },
  tabCountActive: {
    background: '#dbeafe', color: '#0ea5e9',
  },
  searchWrap: {
    display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px',
    border: '1.5px solid #e2e8f0', borderRadius: 10, background: '#fff', minWidth: 260,
  },
  searchInput: {
    border: 'none', outline: 'none', fontSize: 13, color: '#334155',
    fontFamily: 'inherit', flex: 1, background: 'transparent',
  },
  card: {
    background: '#fff', borderRadius: 14,
    border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden',
  },
  empty: { padding: '60px 40px', textAlign: 'center' },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    padding: '12px 20px', fontSize: 12, fontWeight: 700, color: '#64748b',
    textAlign: 'left', borderBottom: '1px solid #f1f5f9',
    textTransform: 'uppercase', letterSpacing: '0.04em', background: '#f8fafc',
  },
  tr: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '14px 20px', verticalAlign: 'middle' },
  viewBtn: {
    padding: '5px 14px', fontSize: 13, fontWeight: 600, color: '#0ea5e9',
    background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 8,
    cursor: 'pointer', fontFamily: 'inherit',
  },
  deleteBtn: {
    padding: '5px 14px', fontSize: 13, fontWeight: 600, color: '#ef4444',
    background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8,
    cursor: 'pointer', fontFamily: 'inherit',
  },
};
