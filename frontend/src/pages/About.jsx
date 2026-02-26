import { useState, useEffect, useRef } from 'react';
import Footer from '../components/Footer';

const journeyAnimCSS = `
/* ── Entry animations ── */
@keyframes journeyFadeSlideIn {
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes journeyDotPop {
  0% { transform: scale(0); opacity: 0; }
  60% { transform: scale(1.25); }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes journeyCardSlideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes journeyLineGrow {
  from { transform: scaleY(0); }
  to { transform: scaleY(1); }
}

/* ── Glowing dot ring ── */
@keyframes journeyDotGlow {
  0%, 100% {
    box-shadow: 0 0 6px 2px rgba(14,165,233,0.2),
                0 0 16px 4px rgba(14,165,233,0.1);
  }
  50% {
    box-shadow: 0 0 12px 6px rgba(14,165,233,0.35),
                0 0 28px 10px rgba(14,165,233,0.12);
  }
}

/* ── Glowing pulsing line ── */
@keyframes journeyLineGlow {
  0%, 100% {
    box-shadow: 0 0 4px 1px rgba(14,165,233,0.15);
    background: #bae6fd;
  }
  50% {
    box-shadow: 0 0 10px 3px rgba(14,165,233,0.35);
    background: #0ea5e9;
  }
}
@keyframes journeyEnergyFlow {
  0% { top: -30%; opacity: 0; }
  20% { opacity: 1; }
  80% { opacity: 1; }
  100% { top: 110%; opacity: 0; }
}

/* ── Shimmer & border sweep on cards ── */
@keyframes journeyShimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
@keyframes journeyBorderSweep {
  0% { background-position: 0% 0%; }
  100% { background-position: 300% 0%; }
}

/* ── Floating particles ── */
@keyframes journeyFloat {
  0% { transform: translateY(0) scale(1); opacity: 0; }
  10% { opacity: 0.7; }
  90% { opacity: 0.7; }
  100% { transform: translateY(-120px) scale(0.3); opacity: 0; }
}

/* ── Ambient card glow ── */
@keyframes journeyCardGlow {
  0%, 100% {
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    border-color: #f1f5f9;
  }
  50% {
    box-shadow: 0 4px 20px rgba(14,165,233,0.15),
                0 0 8px rgba(14,165,233,0.08);
    border-color: #bae6fd;
  }
}

/* ── Classes ── */
.journey-item { opacity: 0; }
.journey-item.visible { animation: journeyFadeSlideIn 0.6s ease forwards; }

.journey-item.visible .journey-dot {
  animation: journeyDotPop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards,
             journeyDotGlow 3s ease-in-out 0.6s infinite;
}
.journey-item.visible .journey-line-wrap {
  transform-origin: top;
  animation: journeyLineGrow 0.6s ease 0.3s forwards;
  transform: scaleY(0);
}
.journey-item.visible .journey-card {
  animation: journeyCardSlideUp 0.5s ease 0.15s forwards,
             journeyCardGlow 4s ease-in-out 0.8s infinite;
  opacity: 0;
}

/* ── Line glow ── */
.journey-line-wrap {
  position: relative;
  overflow: hidden;
}
.journey-line-inner {
  animation: journeyLineGlow 3s ease-in-out infinite;
}
.journey-energy-orb {
  position: absolute;
  left: 50%;
  width: 6px;
  height: 14px;
  margin-left: -3px;
  border-radius: 3px;
  background: radial-gradient(circle, rgba(14,165,233,0.9), transparent);
  animation: journeyEnergyFlow 2.5s ease-in-out infinite;
  pointer-events: none;
}

/* ── Card effects ── */
.journey-card {
  transition: box-shadow 0.3s ease, transform 0.3s ease, border-color 0.3s ease;
  position: relative;
  overflow: hidden;
}
.journey-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.5px;
  background: linear-gradient(90deg, transparent 20%, #0ea5e9 50%, transparent 80%);
  background-size: 300% 100%;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s ease;
}
.journey-card::after {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, #0ea5e9, #38bdf8, transparent);
  background-size: 200% 100%;
  opacity: 0;
  transition: opacity 0.3s ease;
}
.journey-card:hover {
  box-shadow: 0 8px 28px rgba(14,165,233,0.18),
              0 0 12px rgba(14,165,233,0.08);
  transform: translateY(-4px);
  border-color: transparent;
}
.journey-card:hover::before {
  opacity: 1;
  animation: journeyBorderSweep 2s linear infinite;
}
.journey-card:hover::after {
  opacity: 1;
  animation: journeyShimmer 1.5s linear infinite;
}

/* ── Year pill ── */
.journey-year-pill {
  transition: background 0.25s ease, color 0.25s ease, transform 0.25s ease,
              box-shadow 0.25s ease;
}
.journey-card:hover .journey-year-pill {
  background: #0ea5e9;
  color: #fff !important;
  border-color: #0ea5e9;
  transform: scale(1.08);
  box-shadow: 0 0 8px rgba(14,165,233,0.4);
}

/* ── Particles container ── */
.journey-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}
.journey-particle {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(14,165,233,0.5), transparent);
  animation: journeyFloat linear infinite;
}

/* ════════════════════════════════════════════════════════════
   LEADERS SECTION ANIMATIONS
   ════════════════════════════════════════════════════════════ */

@keyframes leaderCardIn {
  from { opacity: 0; transform: translateY(40px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes leaderPhotoIn {
  from { opacity: 0; transform: scale(0.6) rotate(-8deg); }
  60% { transform: scale(1.05) rotate(2deg); }
  to { opacity: 1; transform: scale(1) rotate(0); }
}
@keyframes leaderPhotoRing {
  0%, 100% {
    box-shadow: 0 0 0 3px transparent, 0 0 0 6px transparent;
  }
  50% {
    box-shadow: 0 0 0 3px rgba(14,165,233,0.25), 0 0 0 8px rgba(14,165,233,0.08);
  }
}
@keyframes leaderSocialPop {
  from { opacity: 0; transform: scale(0); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes leaderNameSlide {
  from { opacity: 0; transform: translateX(-10px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes leaderShine {
  0% { left: -60%; }
  100% { left: 120%; }
}
@keyframes leaderFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
@keyframes leaderCardBreathe {
  0%, 100% {
    box-shadow: 0 2px 12px rgba(0,0,0,0.06),
                0 0 0 1px rgba(14,165,233,0);
  }
  50% {
    box-shadow: 0 4px 20px rgba(14,165,233,0.12),
                0 0 0 1.5px rgba(14,165,233,0.2);
  }
}
@keyframes leaderBorderRotate {
  0% { --angle: 0deg; }
  100% { --angle: 360deg; }
}
@keyframes leaderAccentPulse {
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
}

.leader-card-wrap { opacity: 0; }
.leader-card-wrap.visible {
  animation: leaderCardIn 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards;
}
.leader-card-wrap.visible .leader-card {
  animation: leaderCardBreathe 4s ease-in-out 0.8s infinite;
}
.leader-card-wrap.visible .leader-accent-line {
  animation: leaderAccentPulse 3s ease-in-out 1s infinite;
}
.leader-card-wrap.visible .leader-photo {
  animation: leaderPhotoIn 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.15s forwards;
  opacity: 0;
}
.leader-card-wrap.visible .leader-photo-ring {
  animation: leaderPhotoRing 3s ease-in-out 1s infinite;
}
.leader-card-wrap.visible .leader-name {
  animation: leaderNameSlide 0.4s ease 0.35s forwards;
  opacity: 0;
}
.leader-card-wrap.visible .leader-role {
  animation: leaderNameSlide 0.4s ease 0.45s forwards;
  opacity: 0;
}
.leader-card-wrap.visible .leader-social {
  animation: leaderSocialPop 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards;
  opacity: 0;
}

.leader-card {
  position: relative;
  overflow: hidden;
  transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;
}
.leader-card::before {
  content: '';
  position: absolute;
  top: 0; left: -60%;
  width: 40%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(14,165,233,0.07), transparent);
  pointer-events: none;
}
.leader-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 32px rgba(14,165,233,0.18),
              0 0 16px rgba(14,165,233,0.06);
  border-color: #bae6fd;
}
.leader-card:hover::before {
  animation: leaderShine 0.8s ease forwards;
}
.leader-photo {
  transition: transform 0.35s ease, box-shadow 0.35s ease;
}
.leader-card:hover .leader-photo {
  transform: translateY(-6px);
  box-shadow: 0 0 0 4px #0ea5e9, 0 0 20px rgba(14,165,233,0.3);
}
.leader-card:hover .leader-social-btn {
  border-color: #0ea5e9;
  color: #0ea5e9;
  transform: scale(1.15);
}

/* ════════════════════════════════════════════════════════════
   MISSION & VISION ANIMATIONS
   ════════════════════════════════════════════════════════════ */

@keyframes mvHeadingIn {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes mvCardLeft {
  from { opacity: 0; transform: translateX(-50px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes mvCardRight {
  from { opacity: 0; transform: translateX(50px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes mvIconSpin {
  0% { opacity: 0; transform: scale(0) rotate(-180deg); }
  60% { transform: scale(1.15) rotate(10deg); }
  100% { opacity: 1; transform: scale(1) rotate(0deg); }
}
@keyframes mvBorderPulse {
  0%, 100% { border-left-color: #0ea5e9; box-shadow: -2px 0 8px rgba(14,165,233,0); }
  50% { border-left-color: #38bdf8; box-shadow: -2px 0 12px rgba(14,165,233,0.2); }
}
@keyframes mvCardGlow {
  0%, 100% { box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
  50% { box-shadow: 0 4px 20px rgba(14,165,233,0.1), 0 0 0 1px rgba(14,165,233,0.08); }
}

.mv-section {
  position: relative;
  background-image: radial-gradient(circle, #e2e8f0 1px, transparent 1px);
  background-size: 28px 28px;
}
.mv-heading { opacity: 0; }
.mv-subheading { opacity: 0; }
.mv-section.visible .mv-heading {
  animation: mvHeadingIn 0.6s ease forwards;
}
.mv-section.visible .mv-subheading {
  animation: mvHeadingIn 0.6s ease 0.15s forwards;
}
.mv-card { opacity: 0; position: relative; overflow: hidden; }
.mv-section.visible .mv-icon {
  animation: mvIconSpin 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.5s forwards;
  opacity: 0;
}
.mv-card {
  transition: transform 0.4s ease, box-shadow 0.4s ease;
}
.mv-card::after {
  content: '';
  position: absolute;
  top: 0; left: -80%;
  width: 50%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(14,165,233,0.04), transparent);
  pointer-events: none;
  transition: left 0.6s ease;
}
.mv-card:hover {
  transform: perspective(800px) rotateY(var(--tilt, 3deg)) translateY(-6px);
  box-shadow: 0 12px 32px rgba(14,165,233,0.15) !important;
}
.mv-card:hover::after { left: 120%; }
.mv-card-left { --tilt: 3deg; }
.mv-card-right { --tilt: -3deg; }

/* ── Ambient glow (untouched) ── */
@keyframes mvAmbientHalo {
  0%, 100% {
    box-shadow: 0 0 10px 4px rgba(14,165,233,0.35),
                0 0 24px 8px rgba(14,165,233,0.2);
  }
  50% {
    box-shadow: 0 0 20px 10px rgba(14,165,233,0.5),
                0 0 44px 16px rgba(14,165,233,0.2);
  }
}
@keyframes mvBorderShift {
  0% { border-image-source: linear-gradient(to bottom, #0ea5e9, #38bdf8); }
  50% { border-image-source: linear-gradient(to bottom, #38bdf8, #7dd3fc); }
  100% { border-image-source: linear-gradient(to bottom, #0ea5e9, #38bdf8); }
}
@keyframes mvIconFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}
.mv-section.visible .mv-card {
  animation:
    mvAmbientHalo 5s ease-in-out 1.2s infinite,
    mvBorderPulse 3s ease-in-out 1.2s infinite;
}
.mv-section.visible .mv-card-left {
  animation:
    mvCardLeft 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.25s forwards,
    mvAmbientHalo 5s ease-in-out 1.2s infinite,
    mvBorderPulse 3s ease-in-out 1.2s infinite;
}
.mv-section.visible .mv-card-right {
  animation:
    mvCardRight 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.4s forwards,
    mvAmbientHalo 5s ease-in-out 1.4s infinite,
    mvBorderPulse 3s ease-in-out 1.4s infinite;
}
.mv-section.visible .mv-icon svg {
  animation: mvIconFloat 3s ease-in-out 1.5s infinite;
}

/* ════════════════════════════════════════════════════════════
   CTA SECTION ANIMATIONS
   ════════════════════════════════════════════════════════════ */

@keyframes ctaGradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
@keyframes ctaTextFadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes ctaBtnPulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(14,165,233,0.5),
                0 4px 15px rgba(14,165,233,0.25);
  }
  50% {
    box-shadow: 0 0 0 12px rgba(14,165,233,0),
                0 4px 20px rgba(14,165,233,0.35);
  }
}
@keyframes ctaBtnShimmer {
  0% { left: -100%; }
  100% { left: 200%; }
}
@keyframes ctaSparkle {
  0% { transform: translateY(0) scale(1); opacity: 0; }
  15% { opacity: 1; }
  85% { opacity: 0.8; }
  100% { transform: translateY(-100px) scale(0); opacity: 0; }
}
@keyframes ctaFloatShape {
  0% { transform: translateY(0) rotate(0deg); opacity: 0; }
  15% { opacity: 0.12; }
  85% { opacity: 0.08; }
  100% { transform: translateY(-200px) rotate(25deg); opacity: 0; }
}
@keyframes ctaRays {
  0%, 100% { opacity: 0.04; transform: scale(1) rotate(0deg); }
  50% { opacity: 0.1; transform: scale(1.08) rotate(3deg); }
}

.cta-section {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #e0f2fe, #bae6fd, #e0f2fe, #cffafe);
  background-size: 300% 300%;
  animation: ctaGradientShift 10s ease infinite;
}
.cta-rays {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(ellipse at center, rgba(14,165,233,0.08) 0%, transparent 70%);
  animation: ctaRays 6s ease-in-out infinite;
}
.cta-shapes {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}
.cta-shape {
  position: absolute;
  bottom: -30px;
  color: #0ea5e9;
  font-size: 2rem;
  animation: ctaFloatShape linear infinite;
  pointer-events: none;
  user-select: none;
}
.cta-sparkles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}
.cta-sparkle {
  position: absolute;
  bottom: 0;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(14,165,233,0.7), transparent);
  animation: ctaSparkle linear infinite;
}
.cta-inner {
  position: relative;
  z-index: 1;
}
.cta-text-item { opacity: 0; }
.cta-section.visible .cta-text-item {
  animation: ctaTextFadeUp 0.6s ease forwards;
}
.cta-btn {
  position: relative;
  overflow: hidden;
  animation: ctaBtnPulse 2.5s ease-in-out infinite;
  transition: transform 0.25s ease, background 0.25s ease;
}
.cta-btn::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 60%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
  pointer-events: none;
  animation: ctaBtnShimmer 3s ease-in-out infinite;
}
.cta-btn:hover {
  transform: scale(1.06);
  background: #0284c7;
}
`;

function useScrollObserver(selector) {
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    const items = ref.current?.querySelectorAll(selector);
    items?.forEach((item, i) => {
      item.style.animationDelay = `${i * 0.15}s`;
      observer.observe(item);
    });
    return () => observer.disconnect();
  }, [selector]);
  return ref;
}

function useJourneyObserver() {
  const ref = useRef(null);
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = journeyAnimCSS;
    document.head.appendChild(style);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    const items = ref.current?.querySelectorAll('.journey-item');
    items?.forEach((item, i) => {
      item.style.animationDelay = `${i * 0.2}s`;
      observer.observe(item);
    });

    return () => {
      observer.disconnect();
      style.remove();
    };
  }, []);
  return ref;
}

const LeaderPhoto = ({ src, fallbackSrc, alt, style, className }) => {
  const [imgSrc, setImgSrc] = useState(src);
  return (
    <img
      src={imgSrc}
      alt={alt}
      style={style}
      className={className}
      onError={() => setImgSrc(fallbackSrc)}
    />
  );
};

// Replace /leaders/xxx.jpg with your own photos. Add images to frontend/public/leaders/
const leaders = [
  { name: 'Pastor Daniel Ababe', role: 'Senior Pastor', roleAm: 'ዋና ፓስተር', initials: 'DA', color: '#0ea5e9', image: '/leaders/pastor-daniel.jpg' },
  { name: 'Sorah Kebede', role: 'Worship Leader', roleAm: 'የአምልኮ መሪ', initials: 'SK', color: '#10b981', image: '/leaders/sorah-kebede.jpg' },
  { name: 'Markos Tesfaye', role: 'Youth Pastor', roleAm: 'የወጣቶች ፓስተር', initials: 'MT', color: '#f59e0b', image: '/leaders/markos-tesfaye.jpg' },
  { name: 'Hanna Alemayahu', role: "Women's Ministry", roleAm: 'የሴቶች አገልግሎት', initials: 'HA', color: '#8b5cf6', image: '/leaders/hanna-alemayahu.jpg' },
];

// Placeholder images (used until you add your own to public/leaders/)
const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=260&h=260&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=260&h=260&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=260&h=260&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=260&h=260&fit=crop&crop=face',
];

const ChurchIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="#0ea5e9">
    <path d="M18 12.22V9l-5-2.5V5h2V3h-2V1h-2v2H9v2h2v1.5L6 9v3.22L2 14v8h8v-3c0-1.1.9-2 2-2s2 .9 2 2v3h8v-8l-4-1.78zM12 13.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
  </svg>
);

const BuildingIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="#0ea5e9">
    <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
  </svg>
);

const CommunityIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="#0ea5e9">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
  </svg>
);

const VerifiedIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
    <path d="M23 12l-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 12l2.44 2.79-.34 3.7 3.61.82 1.89 3.2L12 21.04l3.4 1.46 1.89-3.2 3.61-.82-.34-3.69L23 12zm-12.91 4.72l-3.8-3.8 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.34z"/>
  </svg>
);

const milestones = [
  { icon: <ChurchIcon />, year: '1995', title: 'Church Planting', desc: 'Small beginnings with a dedicated prayer group.', descAm: 'በትንሽ የጸሎት ቡድን የተጀመረ።' },
  { icon: <BuildingIcon />, year: '2003', title: 'First Building Dedicated', desc: 'Our very own building was dedicated and opened.', descAm: 'የመጀመሪያው ሕንጻችን ተባረከና ተከፈተ።' },
  { icon: <CommunityIcon />, year: '2015', title: 'Community Expansion', desc: 'By growing faith our presence expanded across the city.', descAm: 'በእምነት ማደግ ከተማችንን ሁሉ ደረስን።' },
  { icon: <VerifiedIcon />, year: 'Now', title: 'Present Day', desc: 'Continuing the mission of the congregation.', descAm: 'የቤተ ክርስቲያንን ተልእኮ ቀጥለናል።' },
];

const HandsHeartIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="#0ea5e9">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
);

const GlobeIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="#0ea5e9">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  left: `${Math.random() * 100}%`,
  width: `${3 + Math.random() * 5}px`,
  delay: `${Math.random() * 8}s`,
  duration: `${5 + Math.random() * 6}s`,
  bottom: `${Math.random() * 20}%`,
}));

function JourneySection() {
  const timelineRef = useJourneyObserver();
  return (
    <section style={{ ...journeyStyles.section, position: 'relative', overflow: 'hidden' }}>
      <div className="journey-particles">
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className="journey-particle"
            style={{
              left: p.left,
              bottom: p.bottom,
              width: p.width,
              height: p.width,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          />
        ))}
      </div>
      <div style={{ ...journeyStyles.inner, position: 'relative', zIndex: 1 }}>
        <h2 style={journeyStyles.heading}>Our Journey / ጉዞአችን</h2>
        <p style={journeyStyles.subheading}>
          Tracing God&rsquo;s faithfulness through the years
        </p>
        <div style={journeyStyles.timeline} ref={timelineRef}>
          {milestones.map((m, i) => (
            <div key={i} className="journey-item" style={journeyStyles.item}>
              <div style={journeyStyles.dotCol}>
                <div
                  className="journey-dot"
                  style={i === milestones.length - 1 ? journeyStyles.dotFilled : journeyStyles.dot}
                >
                  {m.icon}
                </div>
                {i < milestones.length - 1 && (
                  <div className="journey-line-wrap" style={journeyStyles.line}>
                    <div className="journey-line-inner" style={journeyStyles.lineInner} />
                    <div className="journey-energy-orb" />
                    <div className="journey-energy-orb" style={{ animationDelay: '1.2s' }} />
                  </div>
                )}
              </div>
              <div className="journey-card" style={journeyStyles.itemCard}>
                <div style={journeyStyles.cardHeader}>
                  <span className="journey-year-pill" style={journeyStyles.yearPill}>{m.year}</span>
                  <h3 style={journeyStyles.itemTitle}>{m.title}</h3>
                </div>
                <p style={journeyStyles.itemDesc}>{m.desc}</p>
                <p style={journeyStyles.itemAmharic}>{m.descAm}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LeadersSection() {
  const gridRef = useScrollObserver('.leader-card-wrap');
  return (
    <section style={leaderStyles.section}>
      <div style={leaderStyles.inner}>
        <h2 style={leaderStyles.heading}>Meet Our Leaders / መሪዎቻችንን ይወቁ</h2>
        <p style={leaderStyles.subheading}>
          Dedicated servants committed to spreading the truth, love, and wisdom.
        </p>
        <div style={leaderStyles.grid} ref={gridRef}>
          {leaders.map((leader, i) => (
            <div key={i} className="leader-card-wrap">
              <div className="leader-card" style={leaderStyles.card}>
                <div className="leader-accent-line" style={leaderStyles.accentLine} />
                <div className="leader-photo-ring" style={leaderStyles.photoRing}>
                  <LeaderPhoto
                    src={leader.image}
                    fallbackSrc={PLACEHOLDER_IMAGES[i]}
                    alt={leader.name}
                    style={leaderStyles.photo}
                    className="leader-photo"
                  />
                </div>
                <h4 className="leader-name" style={leaderStyles.name}>{leader.name}</h4>
                <p className="leader-role" style={leaderStyles.role}>{leader.role}</p>
                <p className="leader-role" style={leaderStyles.roleAm}>{leader.roleAm}</p>
                <div style={leaderStyles.socials}>
                  {[
                    { Icon: FacebookIcon, label: 'Facebook' },
                    { Icon: TwitterIcon, label: 'Twitter' },
                    { Icon: LinkedInIcon, label: 'LinkedIn' },
                  ].map(({ Icon, label }, si) => (
                    <a
                      key={label}
                      href="#"
                      className="leader-social leader-social-btn"
                      style={{ ...leaderStyles.socialBtn, animationDelay: `${0.55 + si * 0.08}s` }}
                      aria-label={label}
                    >
                      <Icon />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const CTA_SHAPES = [
  { symbol: '✝', left: '8%', delay: '0s', duration: '9s' },
  { symbol: '🕊', left: '22%', delay: '2s', duration: '11s' },
  { symbol: '✝', left: '40%', delay: '4s', duration: '8s' },
  { symbol: '🕊', left: '58%', delay: '1s', duration: '10s' },
  { symbol: '✝', left: '75%', delay: '3s', duration: '9.5s' },
  { symbol: '🕊', left: '90%', delay: '5s', duration: '12s' },
];

const CTA_SPARKLES = Array.from({ length: 20 }, () => ({
  left: `${Math.random() * 100}%`,
  delay: `${Math.random() * 6}s`,
  duration: `${3 + Math.random() * 4}s`,
  size: `${2 + Math.random() * 3}px`,
}));

function MissionVisionSection() {
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="mv-section" style={mvStyles.section}>
      <div style={mvStyles.inner}>
        <h2 className="mv-heading" style={mvStyles.heading}>Our Mission &amp; Vision</h2>
        <p className="mv-subheading" style={mvStyles.subheading}>ዓላማ እና ራእይ</p>
        <div style={mvStyles.grid}>
          <div className="mv-card mv-card-left" style={mvStyles.card}>
            <div className="mv-icon" style={mvStyles.cardIcon}><HandsHeartIcon /></div>
            <h3 style={mvStyles.cardTitle}>Our Mission / ተልእኮ</h3>
            <p style={mvStyles.cardText}>
              To preach the full gospel of Jesus Christ and build a loving Christ-like community. We strive to make disciples for the Kingdom of God, impacting our local and global communities with the love and power of God.
            </p>
          </div>
          <div className="mv-card mv-card-right" style={mvStyles.card}>
            <div className="mv-icon" style={mvStyles.cardIcon}><GlobeIcon /></div>
            <h3 style={mvStyles.cardTitle}>Our Vision / ራእይ</h3>
            <p style={mvStyles.cardText}>
              To be a beacon of light and a hope for all nations, expanding God&rsquo;s Kingdom. We envision seeing lives transformed, communities uplifted, and the gospel reaching the unreached through our various ministries and outreach programs.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.25 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="cta-section" style={ctaStyles.section}>
      <div className="cta-rays" />
      <div className="cta-shapes">
        {CTA_SHAPES.map((s, i) => (
          <span
            key={i}
            className="cta-shape"
            style={{ left: s.left, animationDelay: s.delay, animationDuration: s.duration }}
          >
            {s.symbol}
          </span>
        ))}
      </div>
      <div className="cta-sparkles">
        {CTA_SPARKLES.map((s, i) => (
          <span
            key={i}
            className="cta-sparkle"
            style={{
              left: s.left,
              width: s.size,
              height: s.size,
              animationDelay: s.delay,
              animationDuration: s.duration,
            }}
          />
        ))}
      </div>
      <div className="cta-inner" style={ctaStyles.inner}>
        <h2 className="cta-text-item" style={{ ...ctaStyles.heading, animationDelay: '0s' }}>
          Join Our Family This Sunday
        </h2>
        <p className="cta-text-item" style={{ ...ctaStyles.amharic, animationDelay: '0.15s' }}>
          በዚህ እሁድ ቤተሰባችንን ይቀላቀሉ
        </p>
        <p className="cta-text-item" style={{ ...ctaStyles.times, animationDelay: '0.3s' }}>
          9:00 AM (English Service) &nbsp; 11:00 AM (Amharic Service)
        </p>
        <a
          href="https://maps.google.com/?q=Kerabu+Full+Gospel+Church+Addis+Ababa+Ethiopia"
          target="_blank"
          rel="noreferrer"
          className="cta-btn cta-text-item"
          style={{ ...ctaStyles.btn, animationDelay: '0.45s' }}
        >
          Get Directions / Watch
        </a>
      </div>
    </section>
  );
}

export default function About() {
  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", width: '100%', maxWidth: '100vw', minHeight: '100vh', overflowX: 'hidden', margin: 0, padding: 0 }}>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section style={heroStyles.section}>
        <div style={heroStyles.overlay} />
        <div style={heroStyles.content}>
          <p style={heroStyles.welcome}>WELCOME HOME</p>
          <h1 style={heroStyles.title}>Who We Are</h1>
          <p style={heroStyles.amharicTitle}>ስለእኛ</p>
          <p style={heroStyles.subtitle}>
            A community of believers dedicated to the full gospel and transforming lives with the love of Christ.
          </p>
          <p style={heroStyles.amharicSub}>
            የክርስት ትምህርትን ለተማሪዎች ለማስተማር እና ህይወትን ለመለወጥ የሰጠ የእምነት ማህበረሰብ።
          </p>
        </div>
      </section>

      {/* ── Mission & Vision ─────────────────────────────── */}
      <MissionVisionSection />

      {/* ── Scripture Quote ──────────────────────────────── */}
      <section style={quoteStyles.section}>
        <div style={quoteStyles.inner}>
          <div style={quoteStyles.quoteIcon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="#0ea5e9">
              <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
            </svg>
          </div>
          <blockquote style={quoteStyles.text}>
            &ldquo;For where two or three gather in my name, there am I with them.&rdquo;
          </blockquote>
          <p style={quoteStyles.reference}>MATTHEW 18:20</p>
        </div>
      </section>

      {/* ── Our Journey / Timeline ───────────────────────── */}
      <JourneySection />
    

      {/* ── Meet Our Leaders ─────────────────────────────── */}
      <LeadersSection />

      {/* ── CTA: Join Us ─────────────────────────────────── */}
      <CtaSection />

      <Footer />
    </div>
  );
}

/* ─── Style Objects ───────────────────────────────────────── */

const heroStyles = {
  section: {
    position: 'relative',
    minHeight: '440px',
    display: 'flex',
    alignItems: 'center',
    backgroundImage: "url('/hero.jpg')",
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
    maxWidth: '800px',
    margin: '0 auto',
    padding: '5rem 4rem',
    textAlign: 'center',
  },
  welcome: {
    fontSize: '0.78rem',
    fontWeight: '600',
    letterSpacing: '0.2em',
    color: 'rgba(255,255,255,0.6)',
    margin: '0 0 1rem',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 'clamp(2rem, 5vw, 3.2rem)',
    fontWeight: '800',
    lineHeight: 1.15,
    margin: '0 0 0.35rem',
    color: '#ffffff',
  },
  amharicTitle: {
    fontSize: 'clamp(1.5rem, 3.5vw, 2.4rem)',
    fontWeight: '700',
    margin: '0 0 1.5rem',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: '1.05rem',
    color: '#cbd5e1',
    margin: '0 0 0.35rem',
    lineHeight: 1.5,
  },
  amharicSub: {
    fontSize: '0.92rem',
    color: '#94a3b8',
    margin: 0,
    fontStyle: 'italic',
  },
};

const mvStyles = {
  section: {
    background: '#ffffff',
    padding: '5rem 4rem',
    width: '100%',
  },
  inner: {
    width: '100%',
    textAlign: 'center',
  },
  heading: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 0.35rem',
  },
  subheading: {
    color: '#0ea5e9',
    fontSize: '1rem',
    margin: '0 0 2.5rem',
    fontWeight: '500',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '2.5rem',
    textAlign: 'left',
  },
  card: {
    background: '#f8fafc',
    borderLeft: '4px solid #0ea5e9',
    borderRadius: '8px',
    padding: '2rem',
    transition: 'box-shadow 0.2s',
  },
  cardIcon: {
    marginBottom: '0.75rem',
    display: 'flex',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 0.75rem',
  },
  cardText: {
    fontSize: '0.92rem',
    color: '#475569',
    lineHeight: 1.65,
    margin: 0,
  },
};

const quoteStyles = {
  section: {
    background: '#e0f2fe',
    padding: '4.5rem 4rem',
    width: '100%',
  },
  inner: {
    maxWidth: '750px',
    margin: '0 auto',
    textAlign: 'center',
  },
  quoteIcon: {
    marginBottom: '1rem',
  },
  text: {
    fontSize: '1.35rem',
    fontWeight: '500',
    color: '#1e293b',
    lineHeight: 1.65,
    fontStyle: 'italic',
    fontFamily: 'Georgia, serif',
    margin: '0 0 1.25rem',
    padding: '0',
    border: 'none',
  },
  reference: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: '0.12em',
    margin: 0,
  },
};

const journeyStyles = {
  section: {
    background: '#f1f5f9',
    padding: '5rem 4rem',
    width: '100%',
  },
  inner: {
    maxWidth: '700px',
    margin: '0 auto',
  },
  heading: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 0.35rem',
    textAlign: 'center',
  },
  subheading: {
    color: '#64748b',
    fontSize: '0.95rem',
    margin: '0 0 3rem',
    textAlign: 'center',
  },
  timeline: {
    display: 'flex',
    flexDirection: 'column',
  },
  item: {
    display: 'flex',
    gap: '1.25rem',
    alignItems: 'stretch',
    minHeight: '120px',
  },
  dotCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flexShrink: 0,
    paddingTop: '1.25rem',
  },
  dot: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: '#e0f2fe',
    border: '2px solid #0ea5e9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  dotFilled: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: '#0ea5e9',
    border: '2px solid #0ea5e9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  line: {
    width: '6px',
    flex: 1,
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
  },
  lineInner: {
    width: '2px',
    height: '100%',
    background: '#bae6fd',
    borderRadius: '1px',
  },
  itemCard: {
    background: '#ffffff',
    borderRadius: '10px',
    padding: '1.25rem 1.5rem',
    marginBottom: '1rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    border: '1px solid #f1f5f9',
    flex: 1,
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    marginBottom: '0.4rem',
  },
  yearPill: {
    display: 'inline-block',
    fontSize: '0.7rem',
    fontWeight: '700',
    color: '#0ea5e9',
    border: '1.5px solid #0ea5e9',
    borderRadius: '4px',
    padding: '0.1rem 0.5rem',
    lineHeight: 1.4,
    flexShrink: 0,
  },
  itemTitle: {
    fontSize: '1.05rem',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0,
  },
  itemDesc: {
    fontSize: '0.88rem',
    color: '#64748b',
    lineHeight: 1.6,
    margin: '0 0 0.15rem',
  },
  itemAmharic: {
    fontSize: '0.82rem',
    color: '#94a3b8',
    margin: 0,
    lineHeight: 1.5,
  },
};

const leaderStyles = {
  section: {
    background: '#f8fafc',
    padding: '5rem 4rem',
    width: '100%',
  },
  inner: {
    width: '100%',
    textAlign: 'center',
  },
  heading: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 0.5rem',
  },
  subheading: {
    color: '#64748b',
    fontSize: '0.95rem',
    margin: '0 auto 3rem',
    maxWidth: '600px',
    lineHeight: 1.5,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '2rem',
  },
  card: {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '1.75rem 1.25rem',
    textAlign: 'center',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    border: '1px solid #f1f5f9',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  accentLine: {
    height: '3px',
    background: 'linear-gradient(90deg, transparent, #0ea5e9, #38bdf8, transparent)',
    borderRadius: '3px',
    marginBottom: '1.25rem',
    opacity: 0,
  },
  photoRing: {
    width: '130px',
    height: '130px',
    borderRadius: '50%',
    margin: '0 auto 1.1rem',
    display: 'block',
  },
  photo: {
    width: '130px',
    height: '130px',
    borderRadius: '50%',
    display: 'block',
    objectFit: 'cover',
  },
  initials: {
    fontSize: '2.75rem',
    fontWeight: '800',
    userSelect: 'none',
  },
  name: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 0.2rem',
  },
  role: {
    fontSize: '0.85rem',
    color: '#0ea5e9',
    margin: '0 0 0.12rem',
    fontWeight: '500',
  },
  roleAm: {
    fontSize: '0.78rem',
    color: '#94a3b8',
    margin: '0 0 0.85rem',
    fontStyle: 'italic',
  },
  socials: {
    display: 'flex',
    gap: '0.5rem',
    justifyContent: 'center',
  },
  socialBtn: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    border: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#94a3b8',
    textDecoration: 'none',
    background: '#fff',
    cursor: 'pointer',
    transition: 'color 0.15s, border-color 0.15s',
  },
};

const ctaStyles = {
  section: {
    padding: '4.5rem 4rem',
    textAlign: 'center',
    width: '100%',
  },
  inner: {
    maxWidth: '700px',
    margin: '0 auto',
  },
  heading: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#0f172a',
    margin: '0 0 0.5rem',
  },
  amharic: {
    fontSize: '1rem',
    color: '#64748b',
    margin: '0 0 1rem',
  },
  times: {
    fontSize: '0.95rem',
    color: '#1e293b',
    margin: '0 0 2rem',
    lineHeight: 1.6,
  },
  btn: {
    display: 'inline-block',
    background: '#0ea5e9',
    color: '#ffffff',
    textDecoration: 'none',
    padding: '0.8rem 2.25rem',
    borderRadius: '6px',
    fontWeight: '700',
    fontSize: '0.95rem',
    transition: 'background 0.15s',
  },
};
