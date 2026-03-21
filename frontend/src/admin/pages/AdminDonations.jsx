import { useState, useEffect } from 'react';
import api from '../../api/axios';

export default function AdminDonations() {
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

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

  const statusColor = {
    success: { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
    pending: { bg: '#fffbeb', color: '#d97706', border: '#fde68a' },
    failed: { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
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
      <div style={st.header}>
        <h1 style={st.title}>Donations</h1>
        <p style={st.subtitle}>Manage and track church donations</p>
      </div>

      {stats && (
        <div style={st.statsGrid}>
          <div style={st.statCard}>
            <p style={st.statLabel}>Total Received</p>
            <p style={st.statValue}>ETB {stats.totalAmount.toLocaleString()}</p>
          </div>
          <div style={st.statCard}>
            <p style={st.statLabel}>This Month</p>
            <p style={st.statValue}>ETB {stats.monthlyTotal.toLocaleString()}</p>
          </div>
          <div style={st.statCard}>
            <p style={st.statLabel}>Successful Donations</p>
            <p style={st.statValue}>{stats.totalDonations}</p>
          </div>
        </div>
      )}

      <div style={st.card}>
        {donations.length === 0 ? (
          <div style={st.empty}>
            <p style={{ fontSize: 16, fontWeight: 600, color: '#334155', margin: '0 0 6px' }}>
              No donations yet
            </p>
            <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>
              Donations will appear here once members start giving through Chapa.
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
                  <th style={{ ...st.th, textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((d) => {
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
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '3px 10px',
                            borderRadius: 6,
                            fontSize: 12,
                            fontWeight: 700,
                            background: sc.bg,
                            color: sc.color,
                            border: `1px solid ${sc.border}`,
                            textTransform: 'capitalize',
                          }}
                        >
                          {d.status}
                        </span>
                      </td>
                      <td style={{ ...st.td, fontSize: 13, color: '#64748b' }}>
                        {new Date(d.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td style={{ ...st.td, textAlign: 'right' }}>
                        <button
                          onClick={() => handleDelete(d._id)}
                          disabled={deleting === d._id}
                          style={st.deleteBtn}
                        >
                          {deleting === d._id ? '...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const st = {
  header: { marginBottom: 20 },
  title: { fontSize: 26, fontWeight: 700, color: '#0f172a', margin: 0 },
  subtitle: { fontSize: 14, color: '#64748b', margin: '4px 0 0' },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 16,
    marginBottom: 20,
  },
  statCard: {
    background: '#fff',
    borderRadius: 14,
    padding: '20px 24px',
    border: '1px solid #f1f5f9',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  },
  statLabel: { fontSize: 13, color: '#64748b', margin: '0 0 6px', fontWeight: 500 },
  statValue: { fontSize: 22, fontWeight: 800, color: '#0f172a', margin: 0 },
  card: {
    background: '#fff',
    borderRadius: 14,
    border: '1px solid #f1f5f9',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    overflow: 'hidden',
  },
  empty: { padding: '60px 40px', textAlign: 'center' },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    padding: '12px 20px',
    fontSize: 12,
    fontWeight: 700,
    color: '#64748b',
    textAlign: 'left',
    borderBottom: '1px solid #f1f5f9',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    background: '#f8fafc',
  },
  tr: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '14px 20px', verticalAlign: 'middle' },
  deleteBtn: {
    padding: '5px 14px',
    fontSize: 13,
    fontWeight: 600,
    color: '#ef4444',
    background: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: 8,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
};
