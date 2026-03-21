import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios';
import Footer from '../components/Footer';

export default function GiveSuccess() {
  const [searchParams] = useSearchParams();
  const txRef = searchParams.get('tx_ref');
  const [status, setStatus] = useState('verifying');
  const [donation, setDonation] = useState(null);

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
        ? `Your donation of ETB ${donation.amount} has been received successfully.`
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
            <div style={st.details}>
              <div style={st.detailRow}>
                <span style={st.detailLabel}>Name</span>
                <span style={st.detailValue}>{donation.firstName} {donation.lastName}</span>
              </div>
              <div style={st.detailRow}>
                <span style={st.detailLabel}>Amount</span>
                <span style={st.detailValue}>ETB {donation.amount}</span>
              </div>
              <div style={st.detailRow}>
                <span style={st.detailLabel}>Type</span>
                <span style={st.detailValue}>{donation.donationType}</span>
              </div>
              <div style={st.detailRow}>
                <span style={st.detailLabel}>Reference</span>
                <span style={{ ...st.detailValue, fontSize: '0.8rem' }}>{donation.txRef}</span>
              </div>
            </div>
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

      <Footer />
    </div>
  );
}

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
    marginBottom: '1.5rem',
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
