import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import Footer from '../components/Footer';

const MapPinIcon = ({ size = 20, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
);

const PhoneIcon = ({ size = 20, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
  </svg>
);

const EmailIcon = ({ size = 20, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
  </svg>
);

const ClockIcon = ({ size = 22, color = '#f59e0b' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
  </svg>
);

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: 8 }}>
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
  </svg>
);

const ExternalLinkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: 4 }}>
    <path d="M19 19H5V5h7V3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
  </svg>
);

const QuoteIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="#0284c7" opacity="0.5">
    <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
  </svg>
);

const contactCSS = `
/* ── Form Card ── */
.contact-form-card {
  position: relative;
  overflow: hidden;
  transition: box-shadow 0.4s ease, transform 0.3s ease;
}
.contact-form-card:hover {
  box-shadow: 0 8px 32px rgba(14, 165, 233, 0.12), 0 1px 8px rgba(0,0,0,0.05) !important;
  transform: translateY(-2px);
}
.contact-form-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, #0ea5e9, #38bdf8, #67e8f9, #38bdf8, #0ea5e9);
  background-size: 200% 100%;
  animation: formTopGlow 3s linear infinite;
}
@keyframes formTopGlow {
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}

/* ── Header icon ── */
@keyframes formIconFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}
.contact-form-icon {
  animation: formIconFloat 2.5s ease-in-out infinite;
}
@keyframes formIconGlow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(14,165,233,0); }
  50% { box-shadow: 0 0 12px 3px rgba(14,165,233,0.2); }
}
.contact-form-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
  animation: formIconGlow 3s ease-in-out infinite;
}

/* ── Inputs ── */
.contact-input {
  transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.15s ease;
}
.contact-input:focus {
  border-color: #0ea5e9 !important;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1), 0 2px 8px rgba(14,165,233,0.08);
  transform: translateY(-1px);
}
.contact-input:hover:not(:focus) {
  border-color: #93c5fd !important;
}

/* ── Labels ── */
.contact-label {
  transition: color 0.2s ease;
}
.contact-field-group:focus-within .contact-label {
  color: #0ea5e9 !important;
}

/* ── Submit Button ── */
.contact-btn {
  position: relative;
  overflow: hidden;
  transition: background 0.25s ease, transform 0.2s ease, box-shadow 0.25s ease;
}
.contact-btn::before {
  content: '';
  position: absolute;
  top: 0; left: -100%;
  width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s ease;
}
.contact-btn:hover::before {
  left: 100%;
}
.contact-btn:hover {
  background: #0284c7 !important;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(14, 165, 233, 0.4), 0 0 10px rgba(14,165,233,0.15);
}
.contact-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.3);
}
@keyframes btnPulse {
  0%, 100% { box-shadow: 0 2px 10px rgba(14,165,233,0.15); }
  50% { box-shadow: 0 2px 18px rgba(14,165,233,0.3); }
}
.contact-btn:not(:hover) {
  animation: btnPulse 3s ease-in-out infinite;
}

/* ── Success message ── */
@keyframes successSlide {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}
.contact-success {
  animation: successSlide 0.4s ease forwards;
}
@keyframes successCheckPop {
  0% { transform: scale(0); }
  60% { transform: scale(1.3); }
  100% { transform: scale(1); }
}
.contact-success-check {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px; height: 22px;
  border-radius: 50%;
  background: #16a34a;
  color: #fff;
  font-size: 12px;
  margin-right: 10px;
  animation: successCheckPop 0.5s ease 0.15s both;
}

/* ── Error message ── */
@keyframes errorShake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
}
.contact-error {
  animation: errorShake 0.5s ease;
}

/* ── Contact Info Card ── */
.info-card {
  position: relative;
  overflow: hidden;
  transition: box-shadow 0.4s ease, transform 0.3s ease;
}
.info-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 28px rgba(14,165,233,0.14), 0 1px 6px rgba(0,0,0,0.04) !important;
}

/* shimmer */
.info-card-shimmer {
  position: absolute;
  top: 0; left: -100%;
  width: 50%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
  animation: infoShimmer 6s ease-in-out 1s infinite;
  pointer-events: none;
}
@keyframes infoShimmer {
  0% { left: -50%; }
  35%, 100% { left: 110%; }
}

/* title underline */
.info-title {
  position: relative;
  display: inline-block;
  padding-bottom: 6px;
}
.info-title::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0;
  height: 2.5px;
  width: 0;
  background: linear-gradient(90deg, #0ea5e9, #38bdf8);
  border-radius: 2px;
  animation: infoTitleLine 0.8s ease 0.3s forwards;
}
@keyframes infoTitleLine {
  to { width: 45px; }
}

/* staggered item entrance */
@keyframes infoItemIn {
  from { opacity: 0; transform: translateX(-12px); }
  to { opacity: 1; transform: translateX(0); }
}
.info-item {
  animation: infoItemIn 0.5s ease both;
  border-radius: 10px;
  padding: 0.6rem 0.65rem;
  margin: 0 -0.65rem;
  transition: background 0.25s ease;
}
.info-item:hover {
  background: rgba(14,165,233,0.06);
}

/* icon glow + bounce */
@keyframes infoIconGlow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(14,165,233,0); }
  50% { box-shadow: 0 0 10px 3px rgba(14,165,233,0.18); }
}
.contact-info-icon {
  transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
  animation: infoIconGlow 3.5s ease-in-out infinite;
}
.info-item:hover .contact-info-icon {
  transform: scale(1.12) rotate(-5deg);
  background: #0ea5e9 !important;
}
.info-item:hover .contact-info-icon svg {
  fill: #fff !important;
  transition: fill 0.25s ease;
}

/* email link */
.info-email-link {
  position: relative;
  display: inline-block;
  transition: color 0.2s ease;
}
.info-email-link::after {
  content: '';
  position: absolute;
  bottom: -1px; left: 0;
  width: 0; height: 1.5px;
  background: #0ea5e9;
  transition: width 0.3s ease;
}
.info-email-link:hover {
  color: #0284c7 !important;
}
.info-email-link:hover::after {
  width: 100%;
}

/* map link */
.contact-map-link {
  transition: color 0.2s ease;
}
.contact-map-link:hover {
  color: #0284c7 !important;
}

/* Service Times Card */
.service-times-card {
  position: relative;
  overflow: hidden;
  transition: box-shadow 0.3s ease, transform 0.25s ease;
}
.service-times-card:hover {
  box-shadow: 0 4px 24px rgba(245, 158, 11, 0.15), 0 1px 8px rgba(0,0,0,0.06) !important;
  transform: translateY(-2px);
}
.service-times-accent {
  position: absolute;
  top: -30px;
  right: -30px;
  width: 90px;
  height: 90px;
  background: radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}
@keyframes clockPulse {
  0%, 100% { filter: drop-shadow(0 0 0 transparent); }
  50% { filter: drop-shadow(0 0 6px rgba(245,158,11,0.4)); }
}
.service-clock-icon {
  display: flex;
  align-items: center;
  animation: clockPulse 2.5s ease-in-out infinite;
}
.service-time-row {
  transition: background 0.2s ease, padding-left 0.2s ease;
  border-radius: 6px;
  margin: 0 -0.5rem;
  padding-left: 0.5rem !important;
  padding-right: 0.5rem !important;
}
.service-time-row:hover {
  background: #fffbeb;
  padding-left: 0.75rem !important;
}

/* ── Scripture Quote Card ── */
.quote-card {
  position: relative;
  overflow: hidden;
  transition: box-shadow 0.4s ease, transform 0.3s ease;
}
.quote-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(14, 165, 233, 0.18), 0 2px 8px rgba(0,0,0,0.04) !important;
}

/* shimmer sweep */
.quote-shimmer {
  position: absolute;
  top: 0; left: -100%;
  width: 50%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent);
  animation: quoteShimmer 5s ease-in-out infinite;
  pointer-events: none;
}
@keyframes quoteShimmer {
  0% { left: -50%; }
  40%, 100% { left: 110%; }
}

/* quote icon float + glow */
@keyframes quoteIconFloat {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-3px) scale(1.05); }
}
@keyframes quoteIconGlow {
  0%, 100% { filter: drop-shadow(0 0 0 transparent); }
  50% { filter: drop-shadow(0 0 8px rgba(2, 132, 199, 0.35)); }
}
.quote-icon-wrap {
  animation: quoteIconFloat 3s ease-in-out infinite, quoteIconGlow 3s ease-in-out infinite;
}

/* text fade-in on load */
@keyframes quoteTextIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
.quote-text {
  animation: quoteTextIn 0.8s ease 0.2s both;
}

/* decorative divider between quote and reference */
.quote-divider {
  width: 40px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #0284c7, transparent);
  margin: 0 auto 0.75rem;
  border-radius: 2px;
  animation: quoteDividerPulse 2.5s ease-in-out infinite;
}
@keyframes quoteDividerPulse {
  0%, 100% { opacity: 0.4; width: 40px; }
  50% { opacity: 0.8; width: 60px; }
}

/* reference fade in */
@keyframes quoteRefIn {
  from { opacity: 0; letter-spacing: 0.3em; }
  to { opacity: 1; letter-spacing: 0.1em; }
}
.quote-ref {
  animation: quoteRefIn 0.7s ease 0.5s both;
}

@media (max-width: 900px) {
  .contact-main-grid {
    grid-template-columns: 1fr !important;
  }
}
@media (max-width: 600px) {
  .contact-form-row {
    grid-template-columns: 1fr !important;
  }
}
`;

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [siteContent, setSiteContent] = useState(null);
  const styleRef = useRef(null);

  useEffect(() => {
    api.get('/site-content').then(res => setSiteContent(res.data)).catch(() => {});
  }, []);

  const sc = siteContent || {};
  const addressLines = (sc.address || 'Kerabu Full Gospel Church\nAddis Ababa, Ethiopia').split('\n');
  const phoneNum = sc.phone || '+251 91 123 4567';
  const emailAddr = sc.email || 'info@kerabuchurch.org';
  const mapQ = sc.mapQuery || 'Kerabu+Full+Gospel+Church+Addis+Ababa+Ethiopia';
  const times = sc.serviceTimes && sc.serviceTimes.length > 0 ? sc.serviceTimes : [
    { label: 'Sunday Worship', time: '09:00 AM - 12:00 PM', isHighlighted: true },
    { label: 'Wednesday Bible Study', time: '05:30 PM - 07:00 PM', isHighlighted: false },
    { label: 'Friday Prayer', time: '05:00 PM - 08:00 PM', isHighlighted: false },
  ];

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = contactCSS;
    document.head.appendChild(style);
    styleRef.current = style;
    return () => style.remove();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    try {
      await api.post('/contacts', form);
      setStatus('success');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* Header */}
      <section style={s.headerSection}>
        <div style={s.headerInner}>
          <h1 style={s.title}>
            Get in Touch / <span style={s.titleAmharic}>አግኙን</span>
          </h1>
          <p style={s.subtitle}>
            We would love to hear from you. Reach out with prayer requests, questions, or
            just to say hello. We are here to serve you.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section style={s.mainSection}>
        <div className="contact-main-grid" style={s.mainGrid}>

          {/* Left: Contact Form */}
          <div className="contact-form-card" style={s.formCard}>
            <div style={s.formHeader}>
              <div className="contact-form-icon-wrap">
                <span className="contact-form-icon">
                  <EmailIcon size={20} color="#0ea5e9" />
                </span>
              </div>
              <h2 style={s.formTitle}>Send us a Message</h2>
            </div>

            {status === 'success' && (
              <div className="contact-success" style={s.successMsg}>
                <span className="contact-success-check">&#10003;</span>
                Message sent! We will get back to you soon.
              </div>
            )}
            {status === 'error' && (
              <div className="contact-error" style={s.errorMsg}>
                Something went wrong. Please try again.
              </div>
            )}

            <form onSubmit={handleSubmit} style={s.form}>
              <div className="contact-form-row" style={s.formRow}>
                <div className="contact-field-group" style={s.fieldGroup}>
                  <label className="contact-label" style={s.label}>Full Name / <span style={s.labelAmharic}>ሙሉ ስም</span></label>
                  <input
                    className="contact-input"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    style={s.input}
                    placeholder="Enter your name"
                  />
                </div>
                <div className="contact-field-group" style={s.fieldGroup}>
                  <label className="contact-label" style={s.label}>Email Address / <span style={s.labelAmharic}>ኢሜይል</span></label>
                  <input
                    className="contact-input"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    style={s.input}
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div className="contact-field-group" style={s.fieldGroup}>
                <label className="contact-label" style={s.label}>Phone Number (Optional) / <span style={s.labelAmharic}>ስልክ ቁጥር</span></label>
                <input
                  className="contact-input"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  style={s.input}
                  placeholder="+251 ..."
                />
              </div>

              <div className="contact-field-group" style={s.fieldGroup}>
                <label className="contact-label" style={s.label}>Message / <span style={s.labelAmharic}>መልእክት</span></label>
                <textarea
                  className="contact-input"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  style={{ ...s.input, resize: 'vertical', minHeight: '120px' }}
                  placeholder="How can we help you?"
                />
              </div>

              <button
                className="contact-btn"
                type="submit"
                disabled={loading}
                style={s.submitBtn}
              >
                {loading ? 'Sending…' : (
                  <>
                    Send Message &nbsp;|&nbsp; መልእክት ላክ
                    <SendIcon />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right: Contact Info Sidebar */}
          <div style={s.sidebar}>

            {/* Contact Info Card */}
            <div className="info-card" style={s.infoCard}>
              <div className="info-card-shimmer" />
              <h3 className="info-title" style={s.infoTitle}>Contact Info</h3>

              <div className="info-item" style={{ ...s.infoItem, animationDelay: '0s' }}>
                <div className="contact-info-icon" style={s.infoIcon}>
                  <MapPinIcon size={18} color="#0ea5e9" />
                </div>
                <div>
                  <div style={s.infoItemLabel}>Visit Us</div>
                  {addressLines.map((line, i) => <div key={i} style={s.infoItemText}>{line}</div>)}
                </div>
              </div>

              <div className="info-item" style={{ ...s.infoItem, animationDelay: '0.12s' }}>
                <div className="contact-info-icon" style={s.infoIcon}>
                  <PhoneIcon size={18} color="#0ea5e9" />
                </div>
                <div>
                  <div style={s.infoItemLabel}>Call Us</div>
                  <div style={s.infoItemText}>{phoneNum}</div>
                  <div style={s.infoItemSub}>Mon - Fri, 9am - 5pm</div>
                </div>
              </div>

              <div className="info-item" style={{ ...s.infoItem, animationDelay: '0.24s' }}>
                <div className="contact-info-icon" style={s.infoIcon}>
                  <EmailIcon size={18} color="#0ea5e9" />
                </div>
                <div>
                  <div style={s.infoItemLabel}>Email Us</div>
                  <a href={`mailto:${emailAddr}`} className="info-email-link" style={s.infoLink}>{emailAddr}</a>
                </div>
              </div>
            </div>

            {/* Service Times Card */}
            <div className="service-times-card" style={s.timesCard}>
              <div className="service-times-accent" />
              <div style={s.timesHeader}>
                <span className="service-clock-icon">
                  <ClockIcon size={22} color="#f59e0b" />
                </span>
                <h3 style={s.timesTitle}>Service Times</h3>
              </div>

              {times.map((t, i) => (
                <div key={i} className="service-time-row" style={s.timeRow}>
                  <span style={s.timeLabel}>{t.label}</span>
                  <span style={t.isHighlighted ? s.timeValueHighlight : s.timeValueDark}>{t.time}</span>
                </div>
              ))}
            </div>

            {/* Map Card */}
            <div style={s.mapCard}>
              <div style={s.mapContainer}>
                <iframe
                  title="Church Location"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQ)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  width="100%"
                  height="180"
                  style={{ border: 0, display: 'block' }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <a
                className="contact-map-link"
                href="https://maps.google.com/?q=Kerabu+Full+Gospel+Church+Addis+Ababa+Ethiopia"
                target="_blank"
                rel="noreferrer"
                style={s.mapLink}
              >
                Open in Maps
                <ExternalLinkIcon />
              </a>
            </div>

            {/* Scripture Quote Card */}
            <div className="quote-card" style={s.quoteCard}>
              <div className="quote-shimmer" />
              <div className="quote-icon-wrap" style={s.quoteIconWrap}>
                <QuoteIcon />
              </div>
              <p className="quote-text" style={s.quoteText}>
                &ldquo;Come to me, all you who are weary and burdened,
                and I will give you rest.&rdquo;
              </p>
              <div className="quote-divider" />
              <p className="quote-ref" style={s.quoteRef}>MATTHEW 11:28</p>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

const s = {
  headerSection: {
    background: '#fff',
    padding: '3rem 2rem 2rem',
  },
  headerInner: {
    maxWidth: '1100px',
    margin: '0 auto',
  },
  title: {
    fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
    fontWeight: '800',
    color: '#0f172a',
    margin: '0 0 0.75rem',
    lineHeight: 1.2,
  },
  titleAmharic: {
    color: '#0ea5e9',
    fontWeight: '700',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#64748b',
    margin: 0,
    maxWidth: '520px',
    lineHeight: 1.6,
  },

  mainSection: {
    background: '#f8f8f8',
    padding: '2.5rem 2rem 3.5rem',
  },
  mainGrid: {
    maxWidth: '1100px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1.15fr 0.85fr',
    gap: '2rem',
    alignItems: 'start',
  },

  formCard: {
    background: '#ffffff',
    borderRadius: '14px',
    padding: '2.25rem 2rem 2.5rem',
    boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
  },
  formHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1.75rem',
  },
  formTitle: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: '#0f172a',
    margin: 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.25rem',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  label: {
    fontSize: '0.88rem',
    fontWeight: '600',
    color: '#374151',
  },
  labelAmharic: {
    fontWeight: '500',
    color: '#6b7280',
  },
  input: {
    padding: '0.7rem 0.9rem',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontFamily: 'inherit',
    outline: 'none',
    color: '#1e293b',
    background: '#fff',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  submitBtn: {
    background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
    color: '#ffffff',
    border: 'none',
    padding: '0.9rem 2rem',
    borderRadius: '10px',
    fontWeight: '700',
    fontSize: '0.95rem',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginTop: '0.75rem',
    letterSpacing: '0.01em',
  },
  successMsg: {
    color: '#15803d',
    background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
    border: '1px solid #bbf7d0',
    padding: '0.85rem 1.15rem',
    borderRadius: '10px',
    fontSize: '0.9rem',
    fontWeight: '600',
    marginBottom: '0.75rem',
    display: 'flex',
    alignItems: 'center',
  },
  errorMsg: {
    color: '#dc2626',
    background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
    border: '1px solid #fecaca',
    padding: '0.85rem 1.15rem',
    borderRadius: '10px',
    fontSize: '0.9rem',
    fontWeight: '600',
    marginBottom: '0.75rem',
  },

  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },

  infoCard: {
    background: '#f0f9ff',
    borderRadius: '14px',
    padding: '2rem 1.75rem',
    boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  infoTitle: {
    fontSize: '1.15rem',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0,
  },
  infoItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.85rem',
  },
  infoIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    background: '#e0f2fe',
  },
  infoItemLabel: {
    fontSize: '0.92rem',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '2px',
  },
  infoItemText: {
    fontSize: '0.85rem',
    color: '#64748b',
    lineHeight: 1.5,
  },
  infoItemSub: {
    fontSize: '0.8rem',
    color: '#94a3b8',
    marginTop: '2px',
  },
  infoLink: {
    fontSize: '0.85rem',
    color: '#0ea5e9',
    textDecoration: 'none',
  },

  timesCard: {
    background: '#ffffff',
    borderRadius: '14px',
    padding: '1.5rem 1.75rem 1.25rem',
    boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
  },
  timesHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    marginBottom: '1rem',
  },
  timesTitle: {
    fontSize: '1.1rem',
    fontWeight: '800',
    color: '#0f172a',
    margin: 0,
  },
  timeRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.65rem 0',
  },
  timeLabel: {
    fontSize: '0.88rem',
    color: '#374151',
    fontWeight: '500',
  },
  timeValueHighlight: {
    fontSize: '0.85rem',
    color: '#0ea5e9',
    fontWeight: '700',
  },
  timeValueDark: {
    fontSize: '0.85rem',
    color: '#374151',
    fontWeight: '600',
  },

  mapCard: {
    background: '#ffffff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
  },
  mapContainer: {
    width: '100%',
    overflow: 'hidden',
  },
  mapLink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0.6rem 1rem',
    fontSize: '0.82rem',
    fontWeight: '600',
    color: '#64748b',
    textDecoration: 'none',
    background: '#ffffff',
    borderTop: '1px solid #f1f5f9',
  },

  quoteCard: {
    background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 50%, #e0f2fe 100%)',
    borderRadius: '14px',
    padding: '2.25rem 2rem',
    textAlign: 'center',
    boxShadow: '0 1px 8px rgba(14,165,233,0.08)',
  },
  quoteIconWrap: {
    marginBottom: '0.85rem',
  },
  quoteText: {
    fontSize: '1.05rem',
    color: '#0c4a6e',
    fontStyle: 'italic',
    fontWeight: '500',
    lineHeight: 1.65,
    margin: '0 0 1rem',
    fontFamily: 'Georgia, serif',
  },
  quoteRef: {
    fontSize: '0.82rem',
    color: '#0369a1',
    fontWeight: '700',
    letterSpacing: '0.1em',
    margin: 0,
  },
};
