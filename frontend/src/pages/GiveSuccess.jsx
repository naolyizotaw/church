import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios';
import Footer from '../components/Footer';

function ReceiptPrint({ donation, siteContent, onClose }) {
  const receiptRef = useRef(null);
  const church = siteContent?.churchName || 'Kerabu Full Gospel Church';
  const address = (siteContent?.address || 'Addis Ababa, Ethiopia').replace(/\n/g, ', ');
  const phone = siteContent?.phone || '+251 911 123 456';
  const email = siteContent?.email || 'info@kerabu.org';
  const dateStr = new Date(donation.createdAt || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  const timeStr = new Date(donation.createdAt || Date.now()).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit',
  });

  const handleDownload = () => {
    const content = receiptRef.current;
    if (!content) return;

    const printWindow = window.open('', '_blank', 'width=800,height=900');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Donation Receipt - ${church}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #fff; color: #1e293b; }
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .no-print { display: none !important; }
          }
        </style>
      </head>
      <body>
        ${content.innerHTML}
        <script>
          window.onload = function() { window.print(); window.onafterprint = function() { window.close(); }; };
        <\/script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div style={rcpt.overlay} onClick={onClose}>
      <div style={rcpt.modal} onClick={(e) => e.stopPropagation()}>
        <button style={rcpt.closeBtn} onClick={onClose}>&times;</button>

        <div ref={receiptRef}>
          <div style={rcpt.receipt}>
            {/* Header with border */}
            <div style={rcpt.headerBorder} />

            {/* Church Logo & Name */}
            <div style={rcpt.headerSection}>
              <img src="/logo.png" alt="Church Logo" style={rcpt.logo} crossOrigin="anonymous" />
              <div style={rcpt.headerText}>
                <h1 style={rcpt.churchName}>{church}</h1>
                <p style={rcpt.churchInfo}>{address}</p>
                <p style={rcpt.churchInfo}>Tel: {phone} &nbsp;|&nbsp; Email: {email}</p>
              </div>
            </div>

            {/* Divider */}
            <div style={rcpt.divider} />

            {/* Receipt Title */}
            <div style={rcpt.titleSection}>
              <h2 style={rcpt.receiptTitle}>DONATION RECEIPT</h2>
              <p style={rcpt.receiptTitleAm}>የልገሳ ደረሰኝ</p>
            </div>

            {/* Receipt Details Table */}
            <div style={rcpt.tableWrap}>
              <table style={rcpt.table}>
                <tbody>
                  <tr>
                    <td style={rcpt.tdLabel}>Receipt No.</td>
                    <td style={rcpt.tdValue}>{donation.txRef}</td>
                  </tr>
                  <tr>
                    <td style={rcpt.tdLabel}>Date</td>
                    <td style={rcpt.tdValue}>{dateStr} at {timeStr}</td>
                  </tr>
                  <tr>
                    <td style={rcpt.tdLabel}>Donor Name</td>
                    <td style={rcpt.tdValue}>{donation.firstName} {donation.lastName}</td>
                  </tr>
                  <tr>
                    <td style={rcpt.tdLabel}>Email</td>
                    <td style={rcpt.tdValue}>{donation.email}</td>
                  </tr>
                  {donation.phone && (
                    <tr>
                      <td style={rcpt.tdLabel}>Phone</td>
                      <td style={rcpt.tdValue}>{donation.phone}</td>
                    </tr>
                  )}
                  <tr>
                    <td style={rcpt.tdLabel}>Donation Type</td>
                    <td style={{ ...rcpt.tdValue, textTransform: 'capitalize' }}>{donation.donationType}</td>
                  </tr>
                  <tr>
                    <td style={rcpt.tdLabel}>Payment Method</td>
                    <td style={{ ...rcpt.tdValue, textTransform: 'capitalize' }}>{donation.paymentMethod || 'Chapa'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Amount Box */}
            <div style={rcpt.amountBox}>
              <span style={rcpt.amountLabel}>Amount Paid</span>
              <span style={rcpt.amountValue}>ETB {donation.amount?.toLocaleString()}</span>
            </div>

            {/* Status */}
            <div style={rcpt.statusRow}>
              <span style={rcpt.statusBadge}>PAID</span>
              <span style={rcpt.statusText}>Payment confirmed via Chapa</span>
            </div>

            {/* Divider */}
            <div style={{ ...rcpt.divider, margin: '20px 0' }} />

            {/* Thank you message */}
            <div style={rcpt.thankYou}>
              <p style={rcpt.thankYouText}>
                "Each of you should give what you have decided in your heart to give,
                not reluctantly or under compulsion, for God loves a cheerful giver."
              </p>
              <p style={rcpt.thankYouRef}>— 2 Corinthians 9:7</p>
            </div>

            <p style={rcpt.footerNote}>
              Thank you for your generous donation to {church}.
              May God bless you abundantly.
            </p>
            <p style={rcpt.footerNoteAm}>
              ለ{church} ለሰጡት ልገሳ እናመሰግናለን። እግዚአብሔር ይባርክዎ።
            </p>

            {/* Footer border */}
            <div style={rcpt.footerBorder} />
          </div>
        </div>

        {/* Download Button */}
        <div style={rcpt.actionRow}>
          <button style={rcpt.downloadBtn} onClick={handleDownload}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8 }}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download / Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
}

export default function GiveSuccess() {
  const [searchParams] = useSearchParams();
  const txRef = searchParams.get('tx_ref');
  const [status, setStatus] = useState('verifying');
  const [donation, setDonation] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [siteContent, setSiteContent] = useState(null);

  useEffect(() => {
    api.get('/site-content').then(res => setSiteContent(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!txRef) {
      setStatus('error');
      return;
    }

    let attempts = 0;
    const maxAttempts = 5;

    const verify = async () => {
      try {
        const { data } = await api.get(`/donations/verify/${txRef}`);
        if (data.status === 'success') {
          setStatus('success');
          setDonation(data.donation);
        } else if (data.status === 'failed') {
          setStatus('failed');
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(verify, 3000);
        } else {
          setStatus('pending');
          setDonation(data.donation);
        }
      } catch {
        setStatus('error');
      }
    };

    verify();
  }, [txRef]);

  const content = {
    verifying: {
      icon: (
        <div style={st.spinner}>
          <div style={st.spinnerInner} />
        </div>
      ),
      title: 'Verifying Payment...',
      titleAm: 'ክፍያ በማረጋገጥ ላይ...',
      desc: 'Please wait while we confirm your donation.',
      color: '#0ea5e9',
    },
    success: {
      icon: (
        <svg width="64" height="64" viewBox="0 0 24 24" fill="#10b981">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      ),
      title: 'Thank You for Your Donation!',
      titleAm: 'ለልገሳዎ እናመሰግናለን!',
      desc: donation
        ? `Your donation of ETB ${donation.amount?.toLocaleString()} has been received successfully.`
        : 'Your donation has been received successfully.',
      color: '#10b981',
    },
    failed: {
      icon: (
        <svg width="64" height="64" viewBox="0 0 24 24" fill="#ef4444">
          <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/>
        </svg>
      ),
      title: 'Payment Failed',
      titleAm: 'ክፍያ አልተሳካም',
      desc: 'Your payment could not be processed. Please try again.',
      color: '#ef4444',
    },
    pending: {
      icon: (
        <svg width="64" height="64" viewBox="0 0 24 24" fill="#f59e0b">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
      ),
      title: 'Payment Pending',
      titleAm: 'ክፍያ በመጠባበቅ ላይ',
      desc: 'Your payment is still being processed. It may take a few minutes.',
      color: '#f59e0b',
    },
    error: {
      icon: (
        <svg width="64" height="64" viewBox="0 0 24 24" fill="#ef4444">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
      ),
      title: 'Something Went Wrong',
      titleAm: 'ስህተት ተፈጥሯል',
      desc: 'We could not verify your payment. Please contact the church office.',
      color: '#ef4444',
    },
  };

  const c = content[status];

  return (
    <div>
      <section style={st.hero}>
        <div style={st.heroOverlay} />
        <div style={st.heroContent}>
          <h1 style={st.heroTitle}>GIVING | መስጠት</h1>
        </div>
      </section>

      <section style={st.section}>
        <div style={st.card}>
          <div style={{ marginBottom: '1.5rem' }}>{c.icon}</div>
          <h2 style={{ ...st.title, color: c.color }}>{c.title}</h2>
          <p style={st.titleAm}>{c.titleAm}</p>
          <p style={st.desc}>{c.desc}</p>

          {donation && status === 'success' && (
            <>
              <div style={st.details}>
                <div style={st.detailRow}>
                  <span style={st.detailLabel}>Name</span>
                  <span style={st.detailValue}>{donation.firstName} {donation.lastName}</span>
                </div>
                <div style={st.detailRow}>
                  <span style={st.detailLabel}>Amount</span>
                  <span style={st.detailValue}>ETB {donation.amount?.toLocaleString()}</span>
                </div>
                <div style={st.detailRow}>
                  <span style={st.detailLabel}>Type</span>
                  <span style={{ ...st.detailValue, textTransform: 'capitalize' }}>{donation.donationType}</span>
                </div>
                <div style={st.detailRow}>
                  <span style={st.detailLabel}>Reference</span>
                  <span style={{ ...st.detailValue, fontSize: '0.8rem' }}>{donation.txRef}</span>
                </div>
              </div>

              <button style={st.receiptBtn} onClick={() => setShowReceipt(true)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8 }}>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download Receipt / ደረሰኝ ያውርዱ
              </button>
            </>
          )}

          <div style={st.actions}>
            <Link to="/give" style={st.primaryBtn}>
              {status === 'failed' ? 'Try Again' : 'Make Another Donation'}
            </Link>
            <Link to="/" style={st.secondaryBtn}>
              Return Home
            </Link>
          </div>
        </div>
      </section>

      {showReceipt && donation && (
        <ReceiptPrint
          donation={donation}
          siteContent={siteContent}
          onClose={() => setShowReceipt(false)}
        />
      )}

      <Footer />
    </div>
  );
}

/* ─── Page Styles ─── */
const st = {
  hero: {
    position: 'relative',
    minHeight: '220px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: `url('/hero.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center top',
    color: '#fff',
  },
  heroOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to bottom, rgba(10,20,50,0.72) 0%, rgba(10,20,50,0.65) 100%)',
  },
  heroContent: {
    position: 'relative',
    zIndex: 1,
    textAlign: 'center',
    padding: '3rem 2rem',
  },
  heroTitle: {
    fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
    fontWeight: '800',
    letterSpacing: '0.04em',
    color: '#fbbf24',
    margin: 0,
    textShadow: '0 2px 12px rgba(0,0,0,0.3)',
  },
  section: {
    background: '#f1f5f9',
    padding: '3rem 2rem 5rem',
    display: 'flex',
    justifyContent: 'center',
  },
  card: {
    background: '#fff',
    borderRadius: '20px',
    padding: '3rem',
    maxWidth: '520px',
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
  },
  title: {
    fontSize: '1.4rem',
    fontWeight: '800',
    margin: '0 0 0.25rem',
  },
  titleAm: {
    fontSize: '0.95rem',
    color: '#64748b',
    margin: '0 0 0.75rem',
    fontWeight: '500',
  },
  desc: {
    fontSize: '0.95rem',
    color: '#475569',
    lineHeight: 1.6,
    margin: '0 0 1.5rem',
  },
  details: {
    background: '#f8fafc',
    borderRadius: '12px',
    padding: '1rem 1.25rem',
    marginBottom: '1rem',
    textAlign: 'left',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.45rem 0',
    borderBottom: '1px solid #e2e8f0',
  },
  detailLabel: {
    fontSize: '0.85rem',
    color: '#64748b',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: '0.85rem',
    color: '#0f172a',
    fontWeight: '700',
  },
  receiptBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: '0.75rem 1.5rem',
    background: '#f0f9ff',
    color: '#0ea5e9',
    border: '2px solid #bae6fd',
    borderRadius: '12px',
    fontSize: '0.92rem',
    fontWeight: '700',
    cursor: 'pointer',
    fontFamily: 'inherit',
    marginBottom: '1rem',
    transition: 'all 0.2s',
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  primaryBtn: {
    display: 'block',
    padding: '0.85rem 1.5rem',
    background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
    color: '#fff',
    borderRadius: '12px',
    fontSize: '0.95rem',
    fontWeight: '700',
    textDecoration: 'none',
    textAlign: 'center',
  },
  secondaryBtn: {
    display: 'block',
    padding: '0.85rem 1.5rem',
    background: '#f1f5f9',
    color: '#334155',
    borderRadius: '12px',
    fontSize: '0.95rem',
    fontWeight: '600',
    textDecoration: 'none',
    textAlign: 'center',
  },
  spinner: {
    width: 64,
    height: 64,
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #0ea5e9',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto',
  },
  spinnerInner: {},
};

/* ─── Receipt Modal & Print Styles ─── */
const rcpt = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '1rem',
  },
  modal: {
    background: '#fff',
    borderRadius: '16px',
    maxWidth: '600px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative',
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
  },
  closeBtn: {
    position: 'absolute',
    top: 12,
    right: 16,
    background: 'none',
    border: 'none',
    fontSize: '1.8rem',
    color: '#94a3b8',
    cursor: 'pointer',
    lineHeight: 1,
    zIndex: 10,
  },
  receipt: {
    padding: '40px 40px 30px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  headerBorder: {
    height: '4px',
    background: 'linear-gradient(90deg, #0ea5e9, #06b6d4, #0ea5e9)',
    borderRadius: '2px',
    marginBottom: '24px',
  },
  headerSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '16px',
  },
  logo: {
    width: '64px',
    height: '64px',
    objectFit: 'contain',
    flexShrink: 0,
  },
  headerText: {
    flex: 1,
    textAlign: 'center',
  },
  churchName: {
    fontSize: '1.3rem',
    fontWeight: '800',
    color: '#0f172a',
    margin: '0 0 4px',
    letterSpacing: '0.02em',
  },
  churchInfo: {
    fontSize: '0.78rem',
    color: '#64748b',
    margin: '2px 0',
    lineHeight: 1.5,
  },
  divider: {
    height: '1px',
    background: '#e2e8f0',
    margin: '16px 0',
  },
  titleSection: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  receiptTitle: {
    fontSize: '1.1rem',
    fontWeight: '800',
    color: '#0ea5e9',
    letterSpacing: '0.12em',
    margin: '0 0 2px',
  },
  receiptTitleAm: {
    fontSize: '0.85rem',
    color: '#64748b',
    fontWeight: '600',
    margin: 0,
  },
  tableWrap: {
    marginBottom: '20px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tdLabel: {
    padding: '10px 12px',
    fontSize: '0.82rem',
    fontWeight: '600',
    color: '#64748b',
    borderBottom: '1px solid #f1f5f9',
    width: '40%',
    verticalAlign: 'top',
  },
  tdValue: {
    padding: '10px 12px',
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#0f172a',
    borderBottom: '1px solid #f1f5f9',
    verticalAlign: 'top',
  },
  amountBox: {
    background: '#f0f9ff',
    border: '2px solid #bae6fd',
    borderRadius: '12px',
    padding: '16px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  amountLabel: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: '#0369a1',
  },
  amountValue: {
    fontSize: '1.4rem',
    fontWeight: '900',
    color: '#0369a1',
    letterSpacing: '0.02em',
  },
  statusRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '4px',
  },
  statusBadge: {
    display: 'inline-block',
    padding: '3px 12px',
    background: '#f0fdf4',
    color: '#16a34a',
    border: '1px solid #bbf7d0',
    borderRadius: '6px',
    fontSize: '0.72rem',
    fontWeight: '800',
    letterSpacing: '0.06em',
  },
  statusText: {
    fontSize: '0.8rem',
    color: '#64748b',
  },
  thankYou: {
    background: '#fefce8',
    border: '1px solid #fef08a',
    borderRadius: '10px',
    padding: '16px 20px',
    textAlign: 'center',
    marginBottom: '16px',
  },
  thankYouText: {
    fontSize: '0.82rem',
    fontStyle: 'italic',
    color: '#713f12',
    lineHeight: 1.65,
    margin: '0 0 6px',
    fontFamily: 'Georgia, serif',
  },
  thankYouRef: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#a16207',
    margin: 0,
  },
  footerNote: {
    fontSize: '0.8rem',
    color: '#475569',
    textAlign: 'center',
    lineHeight: 1.6,
    margin: '0 0 4px',
  },
  footerNoteAm: {
    fontSize: '0.78rem',
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 1.6,
    margin: '0 0 16px',
  },
  footerBorder: {
    height: '4px',
    background: 'linear-gradient(90deg, #0ea5e9, #06b6d4, #0ea5e9)',
    borderRadius: '2px',
  },
  actionRow: {
    padding: '0 40px 24px',
    display: 'flex',
    justifyContent: 'center',
  },
  downloadBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.75rem 2rem',
    background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '0.92rem',
    fontWeight: '700',
    cursor: 'pointer',
    fontFamily: 'inherit',
    width: '100%',
    boxShadow: '0 4px 14px rgba(14,165,233,0.3)',
  },
};
