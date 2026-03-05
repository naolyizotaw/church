import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../api/axios';

const donationChartData = [
  { month: 'JAN', amount: 4200 },
  { month: 'FEB', amount: 5800 },
  { month: 'MAR', amount: 8500 },
  { month: 'APR', amount: 9200 },
  { month: 'MAY', amount: 8800 },
  { month: 'JUN', amount: 9500 },
];

function formatTimeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'JUST NOW';
  if (diffMin < 60) return `${diffMin} MIN AGO`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} HOUR${diffHr > 1 ? 'S' : ''} AGO`;
  const diffDays = Math.floor(diffHr / 24);
  return `${diffDays} DAY${diffDays > 1 ? 'S' : ''} AGO`;
}

function formatSermonTime(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffHr = Math.floor(diffMs / 3600000);
  if (diffHr < 1) return 'Just now';
  if (diffHr < 24) return `Uploaded ${diffHr} hours ago`;
  const diffDays = Math.floor(diffHr / 24);
  if (diffDays === 1) return 'Uploaded Yesterday';
  return `Uploaded ${diffDays} days ago`;
}

function formatEventDate(dateStr) {
  const d = new Date(dateStr);
  const month = d.toLocaleString('en', { month: 'short' }).toUpperCase();
  const day = d.getDate();
  return { month, day };
}

function formatEventTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleString('en', { hour: '2-digit', minute: '2-digit', hour12: true }).replace(' ', ' ');
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [sermons, setSermons] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [stats, setStats] = useState({
    totalDonations: 'RM 12,450.00',
    donationChange: '+12.5%',
    activeMembers: '1,284',
    memberChange: '+3.2%',
    plannedEvents: 0,
    newContacts: 0,
    unreadContacts: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, sermonsRes, contactsRes] = await Promise.all([
          api.get('/events').catch(() => ({ data: [] })),
          api.get('/sermons?limit=2').catch(() => ({ data: { sermons: [] } })),
          api.get('/contacts').catch(() => ({ data: [] })),
        ]);

        const eventsData = Array.isArray(eventsRes.data) ? eventsRes.data : [];
        const sermonsData = sermonsRes.data?.sermons || (Array.isArray(sermonsRes.data) ? sermonsRes.data : []);
        const contactsData = Array.isArray(contactsRes.data) ? contactsRes.data : [];

        const upcomingEvents = eventsData.filter(e => new Date(e.date) >= new Date());
        setEvents(upcomingEvents.slice(0, 3));
        setSermons(sermonsData.slice(0, 2));
        setContacts(contactsData.slice(0, 2));

        const unread = contactsData.filter(c => !c.isRead).length;
        setStats(prev => ({
          ...prev,
          plannedEvents: upcomingEvents.length,
          newContacts: contactsData.length,
          unreadContacts: unread,
        }));
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="6" width="20" height="14" rx="2" stroke="#0ea5e9" strokeWidth="1.5" fill="none"/>
          <line x1="2" y1="10" x2="22" y2="10" stroke="#0ea5e9" strokeWidth="1.5"/>
          <circle cx="17" cy="15" r="2" stroke="#0ea5e9" strokeWidth="1"/>
        </svg>
      ),
      iconBg: '#eff6ff',
      label: 'TOTAL DONATIONS',
      value: stats.totalDonations,
      change: stats.donationChange,
      changeColor: '#22c55e',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="9" cy="8" r="3" stroke="#a855f7" strokeWidth="1.5" fill="none"/>
          <circle cx="16" cy="8" r="3" stroke="#a855f7" strokeWidth="1.5" fill="none"/>
          <path d="M3 19C3 16.2386 5.23858 14 8 14H10C12.7614 14 15 16.2386 15 19" stroke="#a855f7" strokeWidth="1.5" fill="none"/>
          <path d="M14 14H16C18.7614 14 21 16.2386 21 19" stroke="#a855f7" strokeWidth="1.5" fill="none"/>
        </svg>
      ),
      iconBg: '#faf5ff',
      label: 'ACTIVE MEMBERS',
      value: stats.activeMembers,
      change: stats.memberChange,
      changeColor: '#22c55e',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="4" y="5" width="16" height="16" rx="2" stroke="#f59e0b" strokeWidth="1.5" fill="none"/>
          <line x1="4" y1="10" x2="20" y2="10" stroke="#f59e0b" strokeWidth="1.5"/>
          <line x1="9" y1="3" x2="9" y2="6" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="15" y1="3" x2="15" y2="6" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      iconBg: '#fffbeb',
      label: 'PLANNED EVENTS',
      value: String(stats.plannedEvents),
      change: 'Upcoming',
      changeColor: '#94a3b8',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="5" width="18" height="14" rx="2" stroke="#f43f5e" strokeWidth="1.5" fill="none"/>
          <path d="M3 7L12 13L21 7" stroke="#f43f5e" strokeWidth="1.5" fill="none"/>
        </svg>
      ),
      iconBg: '#fff1f2',
      label: 'CONTACT MESSAGES',
      value: String(stats.newContacts),
      change: stats.unreadContacts > 0 ? `${stats.unreadContacts} New` : '0 New',
      changeColor: '#f43f5e',
    },
  ];

  const sermonColors = ['#3b82f6', '#8b5cf6'];

  return (
    <div>
      {/* Header */}
      <div style={s.header}>
        <h1 style={s.title}>Admin Dashboard Overview</h1>
        <p style={s.subtitle}>Welcome back, Administrator. Here&apos;s what&apos;s happening today at Kerabu FGBC.</p>
      </div>

      {/* Quick Action Buttons */}
      <div style={s.actions}>
        <button style={s.actionBtnTeal} onClick={() => navigate('/admin/sermons')}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="7.5" stroke="white" strokeWidth="1.6"/>
            <line x1="9" y1="5.5" x2="9" y2="12.5" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
            <line x1="5.5" y1="9" x2="12.5" y2="9" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
          Add New Sermon
        </button>
        <button style={s.actionBtnCyan} onClick={() => navigate('/admin/events')}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="2.5" y="3.5" width="13" height="12" rx="2" stroke="white" strokeWidth="1.5" fill="none"/>
            <line x1="2.5" y1="7.5" x2="15.5" y2="7.5" stroke="white" strokeWidth="1.5"/>
            <line x1="6" y1="1.5" x2="6" y2="4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="12" y1="1.5" x2="12" y2="4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Create Event
        </button>
        <button style={s.actionBtnDark}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 3H13C13.5523 3 14 3.44772 14 4V6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M3 7L2 8.5L5 11L9 13L13 11L16 8.5L15 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <path d="M5 5C5 4.44772 5.44772 4 6 4H10L12 6V10C12 10.5523 11.5523 11 11 11H6C5.44772 11 5 10.5523 5 10V5Z" stroke="white" strokeWidth="1.4" fill="none"/>
            <line x1="7" y1="6.5" x2="10" y2="6.5" stroke="white" strokeWidth="1.1"/>
            <line x1="7" y1="8.5" x2="10" y2="8.5" stroke="white" strokeWidth="1.1"/>
          </svg>
          Post Announcement
        </button>
      </div>

      {/* Stat Cards */}
      <div style={s.statsGrid}>
        {statCards.map((card, i) => (
          <div key={i} style={s.statCard}>
            <div style={s.statTop}>
              <div style={{ ...s.statIcon, background: card.iconBg }}>{card.icon}</div>
              <span style={{ ...s.statChange, color: card.changeColor }}>{card.change}</span>
            </div>
            <div style={s.statLabel}>{card.label}</div>
            <div style={s.statValue}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Charts + Events Row */}
      <div style={s.midRow}>
        {/* Donation Trends */}
        <div style={s.chartCard}>
          <div style={s.chartHeader}>
            <div>
              <h3 style={s.cardTitle}>Donation Trends</h3>
              <p style={s.cardSubtitle}>Total monthly contributions for 2024</p>
            </div>
            <select style={s.chartSelect}>
              <option>Last 6 Months</option>
              <option>Last 12 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <div style={{ width: '100%', height: 220 }}>
            <ResponsiveContainer>
              <AreaChart data={donationChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="donationGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0"/>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10}/>
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }}/>
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13 }}
                  labelStyle={{ color: '#94a3b8' }}
                  formatter={(val) => [`RM ${val.toLocaleString()}`, 'Donations']}
                />
                <Area type="monotone" dataKey="amount" stroke="#0ea5e9" strokeWidth={2.5} fill="url(#donationGradient)"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Upcoming Events */}
        <div style={s.eventsCard}>
          <div style={s.eventsHeader}>
            <h3 style={s.cardTitle}>Upcoming Events</h3>
            <button style={s.viewAllBtn} onClick={() => navigate('/admin/events')}>View All</button>
          </div>
          <div style={s.eventsList}>
            {events.length > 0 ? events.map((event, i) => {
              const { month, day } = formatEventDate(event.date);
              return (
                <div key={event._id || i} style={s.eventItem}>
                  <div style={s.eventDate}>
                    <span style={s.eventMonth}>{month}</span>
                    <span style={s.eventDay}>{day}</span>
                  </div>
                  <div style={s.eventInfo}>
                    <div style={s.eventTitle}>{event.title}</div>
                    <div style={s.eventMeta}>
                      {formatEventTime(event.date)} - {event.location || 'TBA'}
                    </div>
                  </div>
                </div>
              );
            }) : (
              <>
                <div style={s.eventItem}>
                  <div style={s.eventDate}>
                    <span style={s.eventMonth}>NOV</span>
                    <span style={s.eventDay}>12</span>
                  </div>
                  <div style={s.eventInfo}>
                    <div style={s.eventTitle}>Mid-Week Prayer Meeting</div>
                    <div style={s.eventMeta}>07:30 PM - Hall A</div>
                  </div>
                </div>
                <div style={s.eventItem}>
                  <div style={s.eventDate}>
                    <span style={s.eventMonth}>NOV</span>
                    <span style={s.eventDay}>15</span>
                  </div>
                  <div style={s.eventInfo}>
                    <div style={s.eventTitle}>Youth Revival Night</div>
                    <div style={s.eventMeta}>08:00 PM - Main Sanctuary</div>
                  </div>
                </div>
                <div style={s.eventItem}>
                  <div style={s.eventDate}>
                    <span style={s.eventMonth}>NOV</span>
                    <span style={s.eventDay}>17</span>
                  </div>
                  <div style={s.eventInfo}>
                    <div style={s.eventTitle}>Sunday Celebration Service</div>
                    <div style={s.eventMeta}>10:00 AM - All Campus</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row: Sermons + Contact Messages */}
      <div style={s.bottomRow}>
        {/* Recent Sermon Uploads */}
        <div style={s.sermonsCard}>
          <div style={s.sermonsHeader}>
            <h3 style={s.cardTitle}>Recent Sermon Uploads</h3>
            <button style={s.viewAllBtn} onClick={() => navigate('/admin/sermons')}>Manage Sermons</button>
          </div>
          <div style={s.sermonsList}>
            {sermons.length > 0 ? sermons.map((sermon, i) => (
              <div key={sermon._id || i} style={s.sermonItem}>
                <div style={{ ...s.sermonThumb, background: sermonColors[i % 2] }}>
                  {sermon.thumbnailUrl ? (
                    <img src={sermon.thumbnailUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}/>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <polygon points="10,8 16,12 10,16" fill="white"/>
                    </svg>
                  )}
                </div>
                <div style={s.sermonInfo}>
                  <div style={s.sermonTitle}>{sermon.title}</div>
                  <div style={s.sermonMeta}>
                    {formatSermonTime(sermon.createdAt)} {'\u2022'} {sermon.speaker}
                  </div>
                </div>
                <span style={{
                  ...s.sermonBadge,
                  background: sermon.isFeatured ? '#dcfce7' : '#f1f5f9',
                  color: sermon.isFeatured ? '#16a34a' : '#64748b',
                }}>
                  {sermon.isFeatured ? 'LIVE' : 'DRAFT'}
                </span>
              </div>
            )) : (
              <>
                <div style={s.sermonItem}>
                  <div style={{ ...s.sermonThumb, background: '#3b82f6' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <polygon points="10,8 16,12 10,16" fill="white"/>
                    </svg>
                  </div>
                  <div style={s.sermonInfo}>
                    <div style={s.sermonTitle}>Walking in Faith - Episode 4</div>
                    <div style={s.sermonMeta}>Uploaded 2 hours ago {'\u2022'} Pastor Samuel</div>
                  </div>
                  <span style={{ ...s.sermonBadge, background: '#dcfce7', color: '#16a34a' }}>LIVE</span>
                </div>
                <div style={s.sermonItem}>
                  <div style={{ ...s.sermonThumb, background: '#8b5cf6' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <polygon points="10,8 16,12 10,16" fill="white"/>
                    </svg>
                  </div>
                  <div style={s.sermonInfo}>
                    <div style={s.sermonTitle}>The Power of Forgiveness</div>
                    <div style={s.sermonMeta}>Uploaded Yesterday {'\u2022'} Rev. David Lim</div>
                  </div>
                  <span style={{ ...s.sermonBadge, background: '#f1f5f9', color: '#64748b' }}>DRAFT</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* New Contact Messages */}
        <div style={s.contactsCard}>
          <div style={s.contactsHeader}>
            <h3 style={s.cardTitle}>New Contact Messages</h3>
            {stats.unreadContacts > 0 && (
              <span style={s.newBadge}>{stats.unreadContacts} New</span>
            )}
            {stats.unreadContacts === 0 && contacts.length === 0 && (
              <span style={s.newBadge}>12 New</span>
            )}
          </div>
          <div style={s.contactsList}>
            {contacts.length > 0 ? contacts.map((contact, i) => (
              <div key={contact._id || i} style={s.contactItem}>
                <div style={{ ...s.contactAvatar, background: i === 0 ? '#fde68a' : '#e2e8f0' }}>
                  {contact.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div style={s.contactInfo}>
                  <div style={s.contactHeader2}>
                    <span style={s.contactName}>{contact.name}</span>
                    <span style={s.contactTime}>{formatTimeAgo(contact.createdAt)}</span>
                  </div>
                  <div style={s.contactMsg}>
                    {contact.message?.length > 55 ? contact.message.slice(0, 55) + '...' : contact.message}
                  </div>
                </div>
              </div>
            )) : (
              <>
                <div style={s.contactItem}>
                  <div style={{ ...s.contactAvatar, background: '#fde68a' }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="7" r="3" stroke="#b45309" strokeWidth="1.5" fill="none"/>
                      <path d="M4 17C4 14 6.5 12 10 12C13.5 12 16 14 16 17" stroke="#b45309" strokeWidth="1.5" fill="none"/>
                    </svg>
                  </div>
                  <div style={s.contactInfo}>
                    <div style={s.contactHeader2}>
                      <span style={s.contactName}>Sarah Tan</span>
                      <span style={s.contactTime}>10 MIN AGO</span>
                    </div>
                    <div style={s.contactMsg}>I would like to inquire about the baptism classes starting...</div>
                  </div>
                </div>
                <div style={s.contactItem}>
                  <div style={{ ...s.contactAvatar, background: '#e2e8f0' }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="7" r="3" stroke="#64748b" strokeWidth="1.5" fill="none"/>
                      <path d="M4 17C4 14 6.5 12 10 12C13.5 12 16 14 16 17" stroke="#64748b" strokeWidth="1.5" fill="none"/>
                    </svg>
                  </div>
                  <div style={s.contactInfo}>
                    <div style={s.contactHeader2}>
                      <span style={s.contactName}>John Doe</span>
                      <span style={s.contactTime}>2 HOURS AGO</span>
                    </div>
                    <div style={s.contactMsg}>Request for venue booking for small group meeting on...</div>
                  </div>
                </div>
              </>
            )}
          </div>
          <button style={s.viewMessagesBtn} onClick={() => navigate('/admin/contacts')}>View All Messages</button>
        </div>
      </div>

      {/* Footer */}
      <div style={s.footer}>
        &copy; 2024 Kerabu Full Gospel Believers Church. Managed via Central Admin Portal.
      </div>
    </div>
  );
}

const s = {
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: '#0f172a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    margin: 0,
  },
  actions: {
    display: 'flex',
    gap: 12,
    marginBottom: 24,
    flexWrap: 'wrap',
  },
  actionBtnTeal: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '11px 22px',
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 14,
    color: '#fff',
    background: '#38bdf8',
  },
  actionBtnCyan: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '11px 22px',
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 14,
    color: '#fff',
    background: '#e2b93b',
  },
  actionBtnDark: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '11px 22px',
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 14,
    color: '#fff',
    background: '#0f1d2f',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    background: '#fff',
    borderRadius: 12,
    padding: '18px 20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    border: '1px solid #f1f5f9',
  },
  statTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statChange: {
    fontSize: 12,
    fontWeight: 600,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: '#94a3b8',
    letterSpacing: '0.04em',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 700,
    color: '#0f172a',
  },
  midRow: {
    display: 'grid',
    gridTemplateColumns: '1.8fr 1fr',
    gap: 20,
    marginBottom: 24,
  },
  chartCard: {
    background: '#fff',
    borderRadius: 14,
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    border: '1px solid #f1f5f9',
  },
  chartHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: 700,
    color: '#0f172a',
    margin: 0,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#94a3b8',
    margin: '2px 0 0',
  },
  chartSelect: {
    padding: '7px 28px 7px 12px',
    borderRadius: 8,
    border: '1px solid #e2e8f0',
    fontSize: 13,
    color: '#334155',
    background: '#fff',
    cursor: 'pointer',
    appearance: 'auto',
  },
  eventsCard: {
    background: '#fff',
    borderRadius: 14,
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    border: '1px solid #f1f5f9',
  },
  eventsHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  viewAllBtn: {
    background: 'none',
    border: 'none',
    color: '#0ea5e9',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    padding: 0,
  },
  eventsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  eventItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '10px 12px',
    background: '#f0f9ff',
    borderRadius: 10,
    border: '1px solid #e0f2fe',
  },
  eventDate: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: 44,
  },
  eventMonth: {
    fontSize: 10,
    fontWeight: 700,
    color: '#f43f5e',
    letterSpacing: '0.05em',
  },
  eventDay: {
    fontSize: 20,
    fontWeight: 700,
    color: '#0f172a',
    lineHeight: 1.1,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#0f172a',
    marginBottom: 2,
  },
  eventMeta: {
    fontSize: 12,
    color: '#64748b',
  },
  bottomRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 20,
    marginBottom: 24,
  },
  sermonsCard: {
    background: '#fff',
    borderRadius: 14,
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    border: '1px solid #f1f5f9',
  },
  sermonsHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sermonsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  sermonItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
  },
  sermonThumb: {
    width: 52,
    height: 52,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  sermonInfo: {
    flex: 1,
    minWidth: 0,
  },
  sermonTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#0f172a',
    marginBottom: 2,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  sermonMeta: {
    fontSize: 12,
    color: '#94a3b8',
  },
  sermonBadge: {
    padding: '4px 10px',
    borderRadius: 6,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.04em',
    flexShrink: 0,
  },
  contactsCard: {
    background: '#fff',
    borderRadius: 14,
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    border: '1px solid #f1f5f9',
  },
  contactsHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  newBadge: {
    padding: '4px 10px',
    borderRadius: 12,
    fontSize: 11,
    fontWeight: 700,
    background: '#fef2f2',
    color: '#ef4444',
  },
  contactsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  contactItem: {
    display: 'flex',
    gap: 12,
    alignItems: 'flex-start',
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    fontWeight: 600,
    fontSize: 15,
    color: '#64748b',
  },
  contactInfo: {
    flex: 1,
    minWidth: 0,
  },
  contactHeader2: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  contactName: {
    fontSize: 14,
    fontWeight: 600,
    color: '#0f172a',
  },
  contactTime: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: 500,
  },
  contactMsg: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 1.4,
  },
  viewMessagesBtn: {
    width: '100%',
    marginTop: 20,
    padding: '10px 0',
    borderRadius: 8,
    border: '1px solid #e2e8f0',
    background: '#fff',
    color: '#334155',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },
  footer: {
    textAlign: 'center',
    padding: '24px 0 8px',
    fontSize: 13,
    color: '#94a3b8',
  },
};
