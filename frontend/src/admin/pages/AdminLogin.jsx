import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const SAVED_EMAIL_KEY = 'adminRememberEmail';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem(SAVED_EMAIL_KEY);
    if (saved) {
      setEmail(saved);
      setRememberMe(true);
    }
    setTimeout(() => setMounted(true), 50);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (rememberMe) {
      localStorage.setItem(SAVED_EMAIL_KEY, email);
    } else {
      localStorage.removeItem(SAVED_EMAIL_KEY);
    }

    try {
      const data = await login(email, password);
      if (data.user?.role !== 'admin') {
        setError('Access denied. Admin privileges required.');
        setLoading(false);
        return;
      }
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{cssText}</style>
      <div className="al-page">
        {/* Floating orbs */}
        <div className="al-orb al-orb1" />
        <div className="al-orb al-orb2" />
        <div className="al-orb al-orb3" />
        <div className="al-orb al-orb4" />

        {/* Faint crosses */}
        <div className="al-cross al-cross1">&#10013;</div>
        <div className="al-cross al-cross2">&#10013;</div>

        {/* Glassmorphism card */}
        <div className={`al-card${mounted ? ' al-card-in' : ''}`}>
          {/* Logo */}
          <div className="al-logo-area">
            <div className="al-logo-ring">
              <img src="/logo.png" alt="Kerabu FGBC" className="al-logo-img" />
            </div>
            <h1 className="al-title">Kerabu FGBC</h1>
            <p className="al-subtitle">
              <svg className="al-lock" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Admin Portal
            </p>
            <p className="al-amharic">እንኳን ደህና መጡ</p>
          </div>

          {/* Verse */}
          <div className="al-divider" />
          <p className="al-verse">
            &ldquo;For where two or three gather in my name, there am I with them.&rdquo;
            <span className="al-verse-ref">&mdash; Matthew 18:20</span>
          </p>
          <div className="al-divider" />

          {/* Form */}
          <form onSubmit={handleSubmit} className="al-form">
            {error && <div className="al-error">{error}</div>}

            <div className="al-field">
              <label className="al-label">Email</label>
              <div className="al-input-wrap">
                <span className="al-input-icon">&#9993;</span>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@fgbc.org"
                  required
                  className="al-input"
                />
              </div>
            </div>

            <div className="al-field">
              <label className="al-label">Password</label>
              <div className="al-input-wrap">
                <svg className="al-input-icon al-input-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="al-input al-input-pw"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="al-eye-btn"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '\u{1F441}' : '\u{1F441}\u{200D}\u{1F5E8}'}
                </button>
              </div>
            </div>

            <label className="al-remember">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="al-checkbox"
              />
              <span className="al-remember-text">Remember me</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className={`al-btn${loading ? ' al-btn-loading' : ''}`}
            >
              {loading ? <span className="al-spinner" /> : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

const cssText = `
/* ========== PAGE ========== */
.al-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, #070d1a 0%, #0f172a 35%, #152a4a 65%, #1e3a5f 100%);
  padding: 24px;
  position: relative;
  overflow: hidden;
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
}

/* ========== FLOATING ORBS ========== */
.al-orb {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(70px);
}
.al-orb1 {
  width: 340px; height: 340px;
  background: radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 70%);
  top: 5%; left: 2%;
  animation: alFloat1 14s ease-in-out infinite;
}
.al-orb2 {
  width: 280px; height: 280px;
  background: radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%);
  bottom: 6%; right: 4%;
  animation: alFloat2 17s ease-in-out infinite;
}
.al-orb3 {
  width: 200px; height: 200px;
  background: radial-gradient(circle, rgba(251,191,36,0.08) 0%, transparent 70%);
  top: 50%; left: 55%;
  animation: alFloat3 11s ease-in-out infinite;
}
.al-orb4 {
  width: 220px; height: 220px;
  background: radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 70%);
  top: 8%; right: 15%;
  animation: alFloat4 13s ease-in-out infinite;
}

/* ========== CROSSES ========== */
.al-cross {
  position: absolute;
  pointer-events: none;
  user-select: none;
}
.al-cross1 {
  font-size: 130px;
  color: rgba(255,255,255,0.035);
  top: 9%; right: 11%;
  animation: alCrossFloat1 9s ease-in-out infinite;
}
.al-cross2 {
  font-size: 100px;
  color: rgba(255,255,255,0.025);
  bottom: 13%; left: 6%;
  animation: alCrossFloat2 11s ease-in-out infinite;
}

/* ========== GLASSMORPHISM CARD ========== */
.al-card {
  position: relative;
  z-index: 2;
  background: rgba(255,255,255,0.06);
  backdrop-filter: blur(28px);
  -webkit-backdrop-filter: blur(28px);
  border-radius: 22px;
  padding: 44px 40px 40px;
  width: 100%;
  max-width: 430px;
  border: 1px solid rgba(255,255,255,0.1);
  opacity: 0;
  transform: translateY(32px) scale(0.97);
  transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  animation: alBorderGlow 4s ease-in-out infinite;
  animation-play-state: paused;
}
.al-card-in {
  opacity: 1;
  transform: translateY(0) scale(1);
  animation-play-state: running;
}

/* ========== LOGO ========== */
.al-logo-area {
  text-align: center;
  margin-bottom: 20px;
}
.al-logo-ring {
  display: inline-block;
  border-radius: 50%;
  padding: 6px;
  animation: alLogoPulse 3s ease-in-out infinite;
  margin-bottom: 14px;
}
.al-logo-img {
  width: 82px;
  height: 82px;
  border-radius: 50%;
  object-fit: contain;
  display: block;
  background: rgba(255,255,255,0.08);
  padding: 5px;
}

.al-title {
  font-size: 27px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  letter-spacing: 0.4px;
}
.al-subtitle {
  font-size: 14px;
  color: rgba(148,163,184,0.75);
  margin: 4px 0 0;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}
.al-lock {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}
.al-amharic {
  font-size: 13.5px;
  color: #fbbf24;
  margin: 10px 0 0;
  font-weight: 500;
  letter-spacing: 1px;
}

/* ========== VERSE ========== */
.al-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(14,165,233,0.28), transparent);
  margin: 16px 0;
}
.al-verse {
  text-align: center;
  font-size: 12.5px;
  color: rgba(203,213,225,0.6);
  font-style: italic;
  font-family: Georgia, serif;
  line-height: 1.7;
  margin: 0;
  padding: 0 10px;
}
.al-verse-ref {
  display: block;
  font-size: 11px;
  color: rgba(148,163,184,0.4);
  font-style: normal;
  margin-top: 3px;
}

/* ========== FORM ========== */
.al-form {
  display: flex;
  flex-direction: column;
  gap: 17px;
  margin-top: 22px;
}

/* ========== ERROR ========== */
.al-error {
  padding: 11px 14px;
  border-radius: 10px;
  background: rgba(220,38,38,0.12);
  color: #fca5a5;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid rgba(220,38,38,0.22);
  animation: alShake 0.45s ease;
}

/* ========== FIELDS ========== */
.al-field {
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.al-label {
  font-size: 13px;
  font-weight: 600;
  color: rgba(203,213,225,0.75);
  letter-spacing: 0.3px;
}
.al-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.al-input-icon {
  position: absolute;
  left: 14px;
  font-size: 15px;
  color: rgba(148,163,184,0.45);
  pointer-events: none;
  z-index: 1;
}
.al-input-icon-svg {
  width: 16px;
  height: 16px;
  font-size: unset;
}
.al-input {
  width: 100%;
  padding: 12px 14px 12px 42px;
  border-radius: 10px;
  border: 1.5px solid rgba(255,255,255,0.08);
  font-size: 14px;
  color: #e2e8f0;
  outline: none;
  background: rgba(255,255,255,0.04);
  transition: border-color 0.3s, box-shadow 0.3s, background 0.3s;
  box-sizing: border-box;
  font-family: inherit;
}
.al-input::placeholder {
  color: rgba(148,163,184,0.4);
}
.al-input:focus {
  border-color: rgba(14,165,233,0.5);
  background: rgba(255,255,255,0.07);
  box-shadow: 0 0 0 3px rgba(14,165,233,0.12), 0 0 24px rgba(14,165,233,0.08);
}
.al-input-pw {
  padding-right: 46px;
}

/* ========== EYE TOGGLE ========== */
.al-eye-btn {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 4px;
  color: rgba(148,163,184,0.5);
  display: flex;
  align-items: center;
  transition: color 0.2s;
}
.al-eye-btn:hover {
  color: rgba(203,213,225,0.8);
}

/* ========== REMEMBER ME ========== */
.al-remember {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}
.al-checkbox {
  width: 16px;
  height: 16px;
  accent-color: #0ea5e9;
  cursor: pointer;
}
.al-remember-text {
  font-size: 13px;
  color: rgba(148,163,184,0.65);
  font-weight: 500;
}

/* ========== BUTTON ========== */
.al-btn {
  padding: 13px 0;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%);
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 6px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  letter-spacing: 0.3px;
  font-family: inherit;
  position: relative;
  overflow: hidden;
}
.al-btn::after {
  content: '';
  position: absolute;
  top: 0; left: -100%;
  width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent);
  transition: left 0.6s ease;
}
.al-btn:hover:not(:disabled)::after {
  left: 100%;
}
.al-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(14,165,233,0.4);
}
.al-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 4px 14px rgba(14,165,233,0.3);
}
.al-btn-loading {
  opacity: 0.7;
  cursor: not-allowed !important;
}

/* ========== SPINNER ========== */
.al-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2.5px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: alSpin 0.7s linear infinite;
}

/* ========== KEYFRAMES ========== */
@keyframes alFloat1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -40px) scale(1.04); }
  66% { transform: translate(-20px, 25px) scale(0.96); }
}
@keyframes alFloat2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(-35px, 30px) scale(1.06); }
  66% { transform: translate(22px, -22px) scale(0.94); }
}
@keyframes alFloat3 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(20px, -28px) scale(1.1); }
}
@keyframes alFloat4 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  40% { transform: translate(-18px, -22px) scale(1.05); }
  75% { transform: translate(12px, 16px) scale(0.95); }
}
@keyframes alCrossFloat1 {
  0%, 100% { transform: rotate(12deg) translateY(0); opacity: 0.035; }
  50% { transform: rotate(12deg) translateY(-20px); opacity: 0.065; }
}
@keyframes alCrossFloat2 {
  0%, 100% { transform: rotate(-8deg) translateY(0); opacity: 0.025; }
  50% { transform: rotate(-8deg) translateY(16px); opacity: 0.055; }
}
@keyframes alBorderGlow {
  0%, 100% {
    box-shadow:
      0 0 20px rgba(14,165,233,0.06),
      0 0 60px rgba(14,165,233,0.03),
      0 8px 32px rgba(0,0,0,0.3);
  }
  50% {
    box-shadow:
      0 0 30px rgba(14,165,233,0.15),
      0 0 80px rgba(14,165,233,0.06),
      0 8px 32px rgba(0,0,0,0.3);
  }
}
@keyframes alLogoPulse {
  0%, 100% { box-shadow: 0 0 18px rgba(14,165,233,0.18), 0 0 36px rgba(14,165,233,0.08); }
  50% { box-shadow: 0 0 28px rgba(14,165,233,0.32), 0 0 56px rgba(14,165,233,0.12); }
}
@keyframes alSpin {
  to { transform: rotate(360deg); }
}
@keyframes alShake {
  0%, 100% { transform: translateX(0); }
  15% { transform: translateX(-8px); }
  30% { transform: translateX(8px); }
  50% { transform: translateX(-5px); }
  70% { transform: translateX(5px); }
  85% { transform: translateX(-2px); }
}

/* ========== RESPONSIVE ========== */
@media (max-width: 520px) {
  .al-page {
    padding: 16px;
  }
  .al-card {
    padding: 32px 24px 28px;
    border-radius: 18px;
  }
  .al-logo-img {
    width: 66px;
    height: 66px;
  }
  .al-title {
    font-size: 22px;
  }
  .al-verse {
    font-size: 11.5px;
    padding: 0 4px;
  }
  .al-cross {
    display: none;
  }
}
`;
