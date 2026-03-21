import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import Footer from '../components/Footer';

const giveCSS = `
/* ── Ambient outer glow on the left card ── */
@keyframes giveCardGlow {
  0%, 100% {
    box-shadow:
      0 0 15px rgba(14,165,233,0.15),
      0 0 40px rgba(14,165,233,0.08),
      0 0 80px rgba(14,165,233,0.04),
      0 4px 20px rgba(0,0,0,0.06);
  }
  50% {
    box-shadow:
      0 0 20px rgba(14,165,233,0.25),
      0 0 55px rgba(14,165,233,0.14),
      0 0 100px rgba(14,165,233,0.07),
      0 4px 24px rgba(0,0,0,0.08);
  }
}
.give-left-card {
  animation: giveCardGlow 3.5s ease-in-out infinite;
  border: 1px solid rgba(14,165,233,0.18) !important;
}

/* ── Donation icon heartbeat ── */
@keyframes giveHeartbeat {
  0%, 100% { transform: scale(1); }
  15% { transform: scale(1.18); }
  30% { transform: scale(1); }
  45% { transform: scale(1.12); }
  60% { transform: scale(1); }
}
.give-icon-box {
  animation: giveHeartbeat 3s ease-in-out infinite;
}

/* ── Toggle buttons ── */
.give-toggle-btn {
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}
.give-toggle-btn::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(14,165,233,0.12) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s;
}
.give-toggle-btn:hover::after { opacity: 1; }
.give-toggle-btn.active {
  box-shadow: 0 2px 12px rgba(14,165,233,0.18), inset 0 0 0 1px rgba(14,165,233,0.1) !important;
}

/* ── Amount buttons ── */
@keyframes giveAmountRing {
  0%, 100% { box-shadow: 0 0 0 0 rgba(14,165,233,0); }
  50% { box-shadow: 0 0 0 4px rgba(14,165,233,0.12); }
}
.give-amount-btn {
  position: relative;
  overflow: hidden;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
}
.give-amount-btn:hover {
  transform: translateY(-2px);
  border-color: #0ea5e9 !important;
  box-shadow: 0 6px 20px rgba(14,165,233,0.15);
}
.give-amount-btn.active {
  animation: giveAmountRing 2s ease-in-out infinite;
  transform: translateY(-1px);
}
.give-amount-btn::before {
  content: '';
  position: absolute;
  top: 50%; left: 50%;
  width: 0; height: 0;
  background: rgba(14,165,233,0.08);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.5s, height 0.5s;
}
.give-amount-btn:hover::before {
  width: 200px; height: 200px;
}

/* ── Custom input focus glow ── */
.give-custom-wrap {
  transition: all 0.3s ease !important;
}
.give-custom-wrap:focus-within {
  border-color: #0ea5e9 !important;
  box-shadow: 0 0 0 3px rgba(14,165,233,0.1), 0 4px 12px rgba(14,165,233,0.08);
}

/* ── Payment method cards ── */
@keyframes givePayGlow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(14,165,233,0); }
  50% { box-shadow: 0 0 16px 2px rgba(14,165,233,0.12); }
}
.give-pay-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  animation: givePayGlow 3s ease-in-out infinite;
}
.give-pay-card:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 8px 28px rgba(14,165,233,0.22) !important;
  border-color: #0ea5e9 !important;
  background: linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%) !important;
}

/* ── Badge shimmer ── */
@keyframes giveBadgeShimmer {
  0% { background-position: -100% 0; }
  100% { background-position: 200% 0; }
}
.give-badge {
  background: linear-gradient(90deg, #0ea5e9 0%, #38bdf8 40%, #0ea5e9 80%) !important;
  background-size: 200% 100%;
  animation: giveBadgeShimmer 3s ease-in-out infinite;
}

/* ── Other method items ── */
.give-other-item {
  transition: all 0.3s ease !important;
}
.give-other-item:hover {
  transform: translateY(-3px);
  border-color: #0ea5e9 !important;
  box-shadow: 0 6px 18px rgba(14,165,233,0.12);
  background: #f0f9ff !important;
}
.give-other-item:hover svg {
  fill: #0ea5e9;
}

/* ── Submit button ── */
@keyframes giveSubmitPulse {
  0%, 100% { box-shadow: 0 4px 14px rgba(14,165,233,0.3); }
  50% { box-shadow: 0 6px 28px rgba(14,165,233,0.45), 0 0 40px rgba(14,165,233,0.1); }
}
@keyframes giveSubmitShimmer {
  0% { left: -100%; }
  100% { left: 200%; }
}
.give-submit-btn {
  position: relative;
  overflow: hidden;
  animation: giveSubmitPulse 3s ease-in-out infinite;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}
.give-submit-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 60%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  animation: giveSubmitShimmer 4s ease-in-out infinite;
}
.give-submit-btn:hover {
  transform: translateY(-2px) scale(1.01);
  box-shadow: 0 8px 32px rgba(14,165,233,0.5), 0 0 60px rgba(14,165,233,0.15) !important;
}
.give-submit-btn:active {
  transform: translateY(0) scale(0.98);
}

/* ── Copy button ── */
.give-copy-btn {
  transition: all 0.2s ease;
  border-radius: 4px;
  padding: 2px;
}
.give-copy-btn:hover {
  background: #f0f9ff;
}
.give-copy-btn:hover svg {
  stroke: #0ea5e9;
}

/* ── Page entrance animations ── */
@keyframes givePopIn {
  0% { opacity: 0; transform: translateY(40px) scale(0.92); }
  60% { opacity: 1; transform: translateY(-6px) scale(1.02); }
  80% { transform: translateY(3px) scale(0.995); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes giveHeroReveal {
  0% { opacity: 0; transform: translateY(-20px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes giveHeroTitlePop {
  0% { opacity: 0; transform: scale(0.6); letter-spacing: 0.2em; }
  50% { opacity: 1; transform: scale(1.06); }
  100% { opacity: 1; transform: scale(1); letter-spacing: 0.04em; }
}
@keyframes giveQuoteEntrance {
  0% { opacity: 0; transform: translateY(50px) scale(0.9); }
  70% { opacity: 1; transform: translateY(-4px) scale(1.015); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}

.give-hero-section {
  animation: giveHeroReveal 0.8s ease-out forwards;
}
.give-hero-title {
  opacity: 0;
  animation: giveHeroTitlePop 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s forwards;
}
.give-quote-entrance {
  opacity: 0;
  animation: giveQuoteEntrance 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.6s forwards;
}
.give-quote-entrance .give-quote-card {
  animation: giveQuoteFloat 5s ease-in-out 1.4s infinite, giveQuoteGlow 4s ease-in-out 1.4s infinite;
}
.give-pop-in {
  opacity: 0;
  animation: givePopIn 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
.give-pop-d1 { animation-delay: 0.8s; }
.give-pop-d2 { animation-delay: 1.0s; }
.give-pop-d3 { animation-delay: 1.15s; }
.give-pop-d4 { animation-delay: 1.3s; }

/* ── Quote card ── */
@keyframes giveQuoteFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
@keyframes giveQuoteGlow {
  0%, 100% {
    box-shadow:
      0 4px 24px rgba(14,165,233,0.08),
      0 0 0 1px rgba(14,165,233,0.04);
  }
  50% {
    box-shadow:
      0 8px 40px rgba(14,165,233,0.18),
      0 0 60px rgba(14,165,233,0.06),
      0 0 0 1px rgba(14,165,233,0.1);
  }
}
@keyframes giveQuoteBorderGlow {
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}
@keyframes giveQuoteShimmer {
  0% { left: -120%; }
  50% { left: 120%; }
  100% { left: 120%; }
}
@keyframes giveQuoteIconPulse {
  0%, 100% { transform: scale(1); filter: drop-shadow(0 0 0 transparent); }
  50% { transform: scale(1.15); filter: drop-shadow(0 0 8px rgba(14,165,233,0.4)); }
}
@keyframes giveQuoteTextFade {
  0%, 100% { opacity: 0.85; }
  50% { opacity: 1; }
}
.give-quote-card {
  position: relative;
  overflow: hidden;
  border: 1px solid transparent;
  background-clip: padding-box;
}
.give-quote-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, #0ea5e9, #38bdf8, #06b6d4, #0ea5e9, transparent);
  background-size: 200% 100%;
  animation: giveQuoteBorderGlow 4s linear infinite;
}
.give-quote-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: -120%;
  width: 80%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(14,165,233,0.04), rgba(14,165,233,0.07), rgba(14,165,233,0.04), transparent);
  animation: giveQuoteShimmer 6s ease-in-out infinite;
  pointer-events: none;
}
.give-quote-icon {
  animation: giveQuoteIconPulse 3s ease-in-out infinite;
  display: inline-block;
}
.give-quote-text {
  animation: giveQuoteTextFade 4s ease-in-out infinite;
}
.give-quote-ref {
  position: relative;
  display: inline-block;
}
.give-quote-ref::after {
  content: '';
  position: absolute;
  bottom: -3px; left: 50%;
  width: 0; height: 2px;
  background: linear-gradient(90deg, transparent, #0ea5e9, transparent);
  transform: translateX(-50%);
  border-radius: 1px;
  animation: giveRefLine 3s ease-in-out infinite;
}
@keyframes giveRefLine {
  0%, 100% { width: 0; }
  50% { width: 100%; }
}

/* ── Right column card hover ── */
.give-info-card {
  transition: all 0.3s ease !important;
}
.give-info-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1) !important;
}

/* ── Secure badge pulse ── */
@keyframes giveSecurePulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0); }
  50% { box-shadow: 0 0 12px 2px rgba(16,185,129,0.12); }
}
.give-secure-card {
  animation: giveSecurePulse 3s ease-in-out infinite;
  transition: all 0.3s ease !important;
}
`;

const QuoteIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="#0ea5e9">
    <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
  </svg>
);

const DonationIcon = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
    <path d="M16 6.5c-1.1-1.3-2.8-2-4.5-2C8.4 4.5 6 6.9 6 10c0 4.2 4.5 7.6 10 13 5.5-5.4 10-8.8 10-13 0-3.1-2.4-5.5-5.5-5.5-1.7 0-3.4.7-4.5 2z" fill="#0ea5e9"/>
    <path d="M4 22c0 0 1-1 3-1 1.5 0 2.5 1 4 1s2.5-1 4-1 2.5 1 4 1 2.5-1 4-1c2 0 3 1 3 1v4c0 1-1 2-2 2H6c-1 0-2-1-2-2v-4z" fill="#0ea5e9" opacity="0.55"/>
  </svg>
);

const BankIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="#0ea5e9">
    <path d="M4 10h3v7H4zm6.5 0h3v7h-3zM2 19h20v3H2zm15-9h3v7h-3zm-5-9L2 6v2h20V6z"/>
  </svg>
);

const CopyIcon = ({ onClick }) => (
  <span className="give-copy-btn" onClick={onClick} style={{ cursor: 'pointer', display: 'inline-flex', flexShrink: 0 }}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  </span>
);

const ShieldCheckIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="#10b981">
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
  </svg>
);

const CardIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="#64748b">
    <path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
  </svg>
);

const BankTransferIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="#64748b">
    <path d="M4 10h3v7H4zm6.5 0h3v7h-3zM2 19h20v3H2zm15-9h3v7h-3zm-5-9L2 6v2h20V6z"/>
  </svg>
);

const PaypalIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="#64748b">
    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 2.27A.782.782 0 0 1 5.72 1.6h5.6c3.737 0 5.294 2.212 4.87 4.993-.542 3.569-3.218 5.403-6.588 5.403H7.88l-1.26 9.341h.456zm10.702-15.4c-.242 3.655-3.006 5.895-6.535 5.895H9.382L7.876 21.34H5.7l.28-2.071h.927l1.2-8.894h2.193c3.875 0 6.525-2.212 7.03-5.438.285-1.825-.147-3-.35-3.4zm-1.4-.127c.342 2.87-1.37 5.53-5.282 5.53H9.36l1.4-10.38h1.888c2.87 0 4.13 1.88 3.73 4.85z"/>
  </svg>
);

export default function Give() {
  const [donationType, setDonationType] = useState('one-time');
  const [selectedAmount, setSelectedAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState('');
  const [copiedField, setCopiedField] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const styleRef = useRef(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = giveCSS;
    document.head.appendChild(style);
    styleRef.current = style;
    return () => style.remove();
  }, []);

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getFinalAmount = () => {
    if (customAmount && Number(customAmount) > 0) return Number(customAmount);
    return selectedAmount || 0;
  };

  const handlePayment = async () => {
    setError('');
    const amount = getFinalAmount();
    if (!firstName.trim() || !lastName.trim()) {
      setError('Please enter your first and last name.');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (amount < 1) {
      setError('Please select or enter a valid amount.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/donations/initialize', {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        amount,
        donationType,
      });
      window.location.href = data.checkoutUrl;
    } catch (err) {
      setError(err.response?.data?.message || 'Payment initialization failed. Please try again.');
      setLoading(false);
    }
  };

  const amounts = [250, 500, 1000];

  return (
    <div>
      {/* Hero Banner */}
      <section className="give-hero-section" style={heroStyles.section}>
        <div style={heroStyles.overlay} />
        <div style={heroStyles.content}>
          <h1 className="give-hero-title" style={heroStyles.title}>GIVING | መስጠት</h1>
        </div>
      </section>

      {/* Scripture Quote */}
      <section style={quoteStyles.section}>
        <div className="give-quote-entrance">
          <div className="give-quote-card" style={quoteStyles.card}>
            <div className="give-quote-icon" style={quoteStyles.iconWrap}>
              <QuoteIcon />
            </div>
            <blockquote className="give-quote-text" style={quoteStyles.text}>
              "Each of you should give what you have decided in your heart to give... for God loves a cheerful giver."
            </blockquote>
            <p className="give-quote-ref" style={quoteStyles.reference}>
              — 2 CORINTHIANS 9:7 | 2 ቆሮንቶስ 9:7
            </p>
          </div>
        </div>
      </section>

      {/* Main Content - Two Column */}
      <section style={mainStyles.section}>
        <div style={mainStyles.grid}>

          {/* Left Column - Donation Form */}
          <div className="give-left-card give-pop-in give-pop-d1" style={mainStyles.leftCard}>
            <div style={formStyles.header}>
              <div className="give-icon-box" style={formStyles.headerIcon}>
                <DonationIcon />
              </div>
              <div>
                <h2 style={formStyles.headerTitle}>Make a Donation | መባ ይስጡ</h2>
                <p style={formStyles.headerSub}>Your generosity impacts lives.</p>
              </div>
            </div>

            <div style={formStyles.toggleWrap}>
              <button
                className={`give-toggle-btn${donationType === 'one-time' ? ' active' : ''}`}
                style={{
                  ...formStyles.toggleBtn,
                  ...(donationType === 'one-time' ? formStyles.toggleActive : {}),
                }}
                onClick={() => setDonationType('one-time')}
              >
                One-time
              </button>
              <button
                className={`give-toggle-btn${donationType === 'monthly' ? ' active' : ''}`}
                style={{
                  ...formStyles.toggleBtn,
                  ...(donationType === 'monthly' ? formStyles.toggleActive : {}),
                }}
                onClick={() => setDonationType('monthly')}
              >
                Monthly Recurring
              </button>
            </div>

            <div style={formStyles.nameRow}>
              <div style={formStyles.inputWrap}>
                <input
                  type="text"
                  placeholder="First Name *"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  style={formStyles.textInput}
                />
              </div>
              <div style={formStyles.inputWrap}>
                <input
                  type="text"
                  placeholder="Last Name *"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  style={formStyles.textInput}
                />
              </div>
            </div>
            <div style={formStyles.nameRow}>
              <div style={formStyles.inputWrap}>
                <input
                  type="email"
                  placeholder="Email *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={formStyles.textInput}
                />
              </div>
              <div style={formStyles.inputWrap}>
                <input
                  type="tel"
                  placeholder="Phone (optional)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={formStyles.textInput}
                />
              </div>
            </div>

            <p style={formStyles.amountLabel}>Select Amount / መጠን ይምረጡ</p>
            <div style={formStyles.amountGrid}>
              {amounts.map((amt) => {
                const isActive = selectedAmount === amt && !customAmount;
                return (
                  <button
                    key={amt}
                    className={`give-amount-btn${isActive ? ' active' : ''}`}
                    style={{
                      ...formStyles.amountBtn,
                      ...(isActive ? formStyles.amountActive : {}),
                    }}
                    onClick={() => { setSelectedAmount(amt); setCustomAmount(''); }}
                  >
                    ETB {amt}
                  </button>
                );
              })}
            </div>

            <div className="give-custom-wrap" style={formStyles.customWrap}>
              <span style={formStyles.customPrefix}>ETB</span>
              <input
                type="number"
                placeholder="Other Amount"
                value={customAmount}
                onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null); }}
                style={formStyles.customInput}
              />
            </div>

            <p style={formStyles.paymentLabel}>Pay Securely via Chapa</p>
            <div style={{ ...formStyles.paymentGrid, gridTemplateColumns: '1fr' }}>
              <div className="give-pay-card" style={formStyles.paymentCard}>
                <div className="give-badge" style={formStyles.badge}>SECURE</div>
                <span style={formStyles.chapaText}>CHAPA</span>
                <span style={formStyles.paymentSub}>Telebirr, CBE Birr, M-Pesa, Bank Transfer & more</span>
              </div>
            </div>

            {error && (
              <div style={formStyles.errorBox}>
                {error}
              </div>
            )}

            <button
              className="give-submit-btn"
              style={{
                ...formStyles.submitBtn,
                opacity: loading ? 0.7 : 1,
                pointerEvents: loading ? 'none' : 'auto',
              }}
              onClick={handlePayment}
              disabled={loading}
            >
              {loading ? 'Processing...' : `Donate ETB ${getFinalAmount()} | አሁን ይክፈሉ`}
            </button>
          </div>

          {/* Right Column - Info */}
          <div style={mainStyles.rightCol}>

            <div className="give-info-card give-pop-in give-pop-d2" style={infoStyles.titheCard}>
              <div style={infoStyles.titheHeader}>
                <span style={infoStyles.titheStarIcon}>⭐</span>
                <div>
                  <h3 style={infoStyles.titheTitle}>Tithe & Offering</h3>
                  <p style={infoStyles.titheAmharic}>አስራት እና መባ</p>
                </div>
              </div>
              <p style={infoStyles.titheDesc}>
                Your contributions support our ministries, community outreach, and the maintenance of our spiritual home.
              </p>
              <p style={infoStyles.titheAmharicDesc}>
                አስራትዎና መባዎ ለአገልግሎት ለማኅበረሰብ ተልዕኮ ለንዋያት እና ለመንፈሳዊው ቤት አስተዳደር ይውላሉ፡፡
              </p>
            </div>

            <div className="give-info-card give-pop-in give-pop-d3" style={infoStyles.bankCard}>
              <div style={infoStyles.bankHeader}>
                <BankIcon />
                <h3 style={infoStyles.bankTitle}>Direct Bank Transfer</h3>
              </div>

              <div>
                <p style={infoStyles.bankLabel}>COMMERCIAL BANK OF ETHIOPIA</p>
                <div style={infoStyles.accountRow}>
                  <span style={infoStyles.accountNum}>1000293847561</span>
                  <CopyIcon onClick={() => handleCopy('1000293847561', 'cbe')} />
                  {copiedField === 'cbe' && <span style={infoStyles.copied}>Copied!</span>}
                </div>
              </div>

              <div style={infoStyles.divider} />

              <div>
                <p style={infoStyles.bankLabel}>AWASH BANK</p>
                <div style={infoStyles.accountRow}>
                  <span style={infoStyles.accountNum}>01326485769209</span>
                  <CopyIcon onClick={() => handleCopy('01326485769209', 'awash')} />
                  {copiedField === 'awash' && <span style={infoStyles.copied}>Copied!</span>}
                </div>
              </div>
            </div>

            <div className="give-secure-card give-pop-in give-pop-d4" style={infoStyles.secureCard}>
              <ShieldCheckIcon />
              <div>
                <p style={infoStyles.secureTitle}>SECURE TRANSACTION</p>
                <p style={infoStyles.secureSub}>SSL Encrypted via Chapa & SantimPay</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* ─── Hero Styles ──────────────────────────────────── */
const heroStyles = {
  section: {
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
  overlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to bottom, rgba(10,20,50,0.72) 0%, rgba(10,20,50,0.65) 100%)',
  },
  content: {
    position: 'relative',
    zIndex: 1,
    textAlign: 'center',
    padding: '3rem 2rem',
  },
  title: {
    fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
    fontWeight: '800',
    letterSpacing: '0.04em',
    color: '#fbbf24',
    margin: 0,
    textShadow: '0 2px 12px rgba(0,0,0,0.3)',
  },
};

/* ─── Quote Styles ─────────────────────────────────── */
const quoteStyles = {
  section: {
    background: '#f1f5f9',
    padding: '0 2rem',
    position: 'relative',
  },
  card: {
    background: '#ffffff',
    maxWidth: '900px',
    margin: '0 auto',
    borderRadius: '16px',
    padding: '3rem 3.5rem 2.5rem',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    textAlign: 'center',
    position: 'relative',
    top: '-40px',
    marginBottom: '-20px',
  },
  iconWrap: {
    marginBottom: '1rem',
  },
  text: {
    fontSize: 'clamp(1rem, 2vw, 1.25rem)',
    fontWeight: '500',
    color: '#1e293b',
    lineHeight: 1.7,
    margin: '0 0 1rem',
    fontStyle: 'italic',
    fontFamily: 'Georgia, serif',
    maxWidth: '600px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  reference: {
    fontSize: '0.85rem',
    color: '#0ea5e9',
    fontWeight: '600',
    margin: 0,
    letterSpacing: '0.02em',
  },
};

/* ─── Main Section ─────────────────────────────────── */
const mainStyles = {
  section: {
    background: '#f1f5f9',
    padding: '2rem 2rem 4rem',
  },
  grid: {
    maxWidth: '1000px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1.15fr 0.85fr',
    gap: '1.5rem',
    alignItems: 'start',
  },
  leftCard: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '2rem 2rem 2.5rem',
    border: '1px solid rgba(14,165,233,0.08)',
  },
  rightCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
};

/* ─── Form Styles ──────────────────────────────────── */
const formStyles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1.5rem',
  },
  headerIcon: {
    width: '44px',
    height: '44px',
    borderRadius: '10px',
    background: '#f0f9ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  headerTitle: {
    fontSize: '1.05rem',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0,
  },
  headerSub: {
    fontSize: '0.82rem',
    color: '#94a3b8',
    margin: '2px 0 0',
  },
  toggleWrap: {
    display: 'flex',
    background: '#f1f5f9',
    borderRadius: '10px',
    padding: '4px',
    marginBottom: '1.5rem',
  },
  toggleBtn: {
    flex: 1,
    padding: '0.6rem 1rem',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.88rem',
    fontWeight: '600',
    cursor: 'pointer',
    background: 'transparent',
    color: '#64748b',
    fontFamily: 'inherit',
  },
  toggleActive: {
    background: '#ffffff',
    color: '#0ea5e9',
  },
  nameRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.75rem',
    marginBottom: '0.75rem',
  },
  inputWrap: {
    display: 'flex',
  },
  textInput: {
    width: '100%',
    padding: '0.65rem 0.85rem',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '0.88rem',
    color: '#334155',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  errorBox: {
    background: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#dc2626',
    borderRadius: '10px',
    padding: '0.65rem 1rem',
    fontSize: '0.85rem',
    marginBottom: '1rem',
  },
  amountLabel: {
    fontSize: '0.82rem',
    fontWeight: '600',
    color: '#475569',
    margin: '0 0 0.75rem',
  },
  amountGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '0.75rem',
    marginBottom: '1rem',
  },
  amountBtn: {
    padding: '0.7rem',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    background: '#ffffff',
    fontSize: '0.92rem',
    fontWeight: '700',
    color: '#334155',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  amountActive: {
    borderColor: '#0ea5e9',
    color: '#0ea5e9',
    background: '#f0f9ff',
  },
  customWrap: {
    display: 'flex',
    alignItems: 'center',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    overflow: 'hidden',
    marginBottom: '1.75rem',
  },
  customPrefix: {
    padding: '0.7rem 0.85rem',
    fontSize: '0.88rem',
    fontWeight: '700',
    color: '#94a3b8',
    background: '#f8fafc',
    borderRight: '2px solid #e2e8f0',
  },
  customInput: {
    flex: 1,
    padding: '0.7rem 0.85rem',
    border: 'none',
    outline: 'none',
    fontSize: '0.88rem',
    color: '#334155',
    fontFamily: 'inherit',
  },
  paymentLabel: {
    fontSize: '0.82rem',
    fontWeight: '600',
    color: '#475569',
    margin: '0 0 0.75rem',
  },
  paymentGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.75rem',
    marginBottom: '1.5rem',
  },
  paymentCard: {
    border: '2px solid #0ea5e9',
    borderRadius: '12px',
    padding: '1.25rem 1rem 1rem',
    textAlign: 'center',
    position: 'relative',
    background: '#ffffff',
    cursor: 'pointer',
  },
  badge: {
    position: 'absolute',
    top: '-10px',
    left: '50%',
    transform: 'translateX(-50%)',
    color: '#ffffff',
    fontSize: '0.6rem',
    fontWeight: '800',
    padding: '2px 8px',
    borderRadius: '4px',
    letterSpacing: '0.05em',
    whiteSpace: 'nowrap',
  },
  badgeRecommended: {},
  chapaText: {
    display: 'block',
    fontSize: '1.15rem',
    fontWeight: '900',
    color: '#0ea5e9',
    marginBottom: '2px',
    letterSpacing: '0.05em',
  },
  santimText: {
    display: 'block',
    fontSize: '1.05rem',
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: '2px',
  },
  paymentSub: {
    display: 'block',
    fontSize: '0.7rem',
    color: '#94a3b8',
    fontWeight: '600',
    letterSpacing: '0.03em',
  },
  otherLabel: {
    fontSize: '0.82rem',
    fontWeight: '600',
    color: '#475569',
    margin: '0 0 0.75rem',
  },
  otherGrid: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
  },
  otherItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    padding: '0.85rem 1.25rem',
    border: '1.5px solid #e2e8f0',
    borderRadius: '10px',
    cursor: 'pointer',
    background: '#ffffff',
  },
  otherText: {
    fontSize: '0.65rem',
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: '0.04em',
  },
  submitBtn: {
    width: '100%',
    padding: '0.9rem 1.5rem',
    background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '0.95rem',
    fontWeight: '700',
    cursor: 'pointer',
    fontFamily: 'inherit',
    letterSpacing: '0.02em',
  },
};

/* ─── Right Column Info Styles ─────────────────────── */
const infoStyles = {
  titheCard: {
    background: '#f0fdfa',
    border: '1.5px solid #99f6e4',
    borderRadius: '14px',
    padding: '1.5rem',
  },
  titheHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '0.85rem',
  },
  titheTitle: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0,
  },
  titheStarIcon: {
    fontSize: '1.5rem',
    lineHeight: 1,
    flexShrink: 0,
  },
  titheAmharic: {
    fontSize: '0.8rem',
    color: '#0e7490',
    margin: '2px 0 0',
    fontWeight: '600',
  },
  titheDesc: {
    fontSize: '0.85rem',
    color: '#475569',
    lineHeight: 1.65,
    margin: '0 0 0.75rem',
  },
  titheAmharicDesc: {
    fontSize: '0.8rem',
    color: '#0e7490',
    lineHeight: 1.7,
    margin: 0,
  },
  bankCard: {
    background: '#ffffff',
    borderRadius: '14px',
    padding: '1.5rem',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    border: '1px solid #e2e8f0',
  },
  bankHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    marginBottom: '1.25rem',
  },
  bankTitle: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0,
  },
  bankLabel: {
    fontSize: '0.68rem',
    fontWeight: '700',
    color: '#0ea5e9',
    letterSpacing: '0.05em',
    margin: '0 0 0.4rem',
  },
  accountRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    background: '#f8fafc',
    padding: '0.6rem 0.85rem',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  },
  accountNum: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#1e293b',
    letterSpacing: '0.03em',
    flex: 1,
  },
  copied: {
    fontSize: '0.72rem',
    color: '#10b981',
    fontWeight: '600',
  },
  divider: {
    height: '1px',
    background: '#e2e8f0',
    margin: '1rem 0',
  },
  secureCard: {
    background: '#f0fdf4',
    border: '1.5px solid #bbf7d0',
    borderRadius: '14px',
    padding: '1rem 1.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  secureTitle: {
    fontSize: '0.78rem',
    fontWeight: '800',
    color: '#166534',
    margin: 0,
    letterSpacing: '0.04em',
  },
  secureSub: {
    fontSize: '0.72rem',
    color: '#16a34a',
    margin: '2px 0 0',
    fontWeight: '500',
  },
};
