import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
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

function useScrollObserver(selector, deps = []) {
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
  }, [selector, ...deps]);
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

const LeaderPhoto = ({ src, fallbackSrc, alt, className }) => {
  const [imgSrc, setImgSrc] = useState(src);
  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => setImgSrc(fallbackSrc)}
    />
  );
};

const FALLBACK_LEADERS = [
  { name: 'Pastor Daniel Ababe', role: 'Senior Pastor', roleAm: 'ዋና ፓስተር', photoUrl: '/leaders/pastor-daniel.jpg', facebook: '', twitter: '', linkedin: '' },
  { name: 'Sorah Kebede', role: 'Worship Leader', roleAm: 'የአምልኮ መሪ', photoUrl: '/leaders/sorah-kebede.jpg', facebook: '', twitter: '', linkedin: '' },
  { name: 'Markos Tesfaye', role: 'Youth Pastor', roleAm: 'የወጣቶች ፓስተር', photoUrl: '/leaders/markos-tesfaye.jpg', facebook: '', twitter: '', linkedin: '' },
  { name: 'Hanna Alemayahu', role: "Women's Ministry", roleAm: 'የሴቶች አገልግሎት', photoUrl: '/leaders/hanna-alemayahu.jpg', facebook: '', twitter: '', linkedin: '' },
];

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
    <section className="relative overflow-hidden bg-slate-100 px-4 py-16 sm:px-6 sm:py-20 lg:px-16">
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
      <div className="relative z-10 mx-auto max-w-[700px]">
        <h2 className="mb-1 text-center text-2xl font-bold text-slate-900 md:text-3xl lg:text-[2rem]">
          Our Journey / ጉዞአችን
        </h2>
        <p className="mb-10 text-center text-sm text-slate-500 sm:text-base md:mb-12">
          Tracing God&rsquo;s faithfulness through the years
        </p>
        <div className="flex flex-col" ref={timelineRef}>
          {milestones.map((m, i) => (
            <div key={i} className="journey-item flex min-h-[120px] items-stretch gap-4 sm:gap-5">
              <div className="flex shrink-0 flex-col items-center pt-5">
                <div
                  className={`journey-dot flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-sky-500 sm:h-12 sm:w-12 ${
                    i === milestones.length - 1 ? 'bg-sky-500' : 'bg-sky-100'
                  }`}
                >
                  {m.icon}
                </div>
                {i < milestones.length - 1 && (
                  <div className="journey-line-wrap relative flex flex-1 justify-center" style={{ width: '6px' }}>
                    <div className="journey-line-inner h-full w-0.5 rounded-sm bg-sky-200" />
                    <div className="journey-energy-orb" />
                    <div className="journey-energy-orb" style={{ animationDelay: '1.2s' }} />
                  </div>
                )}
              </div>
              <div className="journey-card mb-4 flex-1 rounded-[10px] border border-slate-100 bg-white p-4 shadow-sm sm:p-5 sm:px-6">
                <div className="mb-1 flex items-center gap-2 sm:gap-3">
                  <span className="journey-year-pill inline-block shrink-0 rounded border-[1.5px] border-sky-500 px-2 py-0.5 text-[0.7rem] font-bold leading-snug text-sky-500">
                    {m.year}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 sm:text-lg">{m.title}</h3>
                </div>
                <p className="mb-0.5 text-sm leading-relaxed text-slate-500">{m.desc}</p>
                <p className="text-xs leading-normal text-slate-400 sm:text-sm">{m.descAm}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LeadersSection() {
  const [leaders, setLeaders] = useState(FALLBACK_LEADERS);
  const gridRef = useScrollObserver('.leader-card-wrap', [leaders]);

  useEffect(() => {
    axios.get('/api/leaders')
      .then(({ data }) => {
        if (Array.isArray(data) && data.length > 0) setLeaders(data);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="w-full bg-slate-50 px-4 py-16 sm:px-6 sm:py-20 lg:px-16">
      <div className="w-full text-center">
        <h2 className="mb-2 text-2xl font-bold text-slate-900 md:text-3xl lg:text-[2rem]">
          Meet Our Leaders / መሪዎቻችንን ይወቁ
        </h2>
        <p className="mx-auto mb-10 max-w-[600px] text-sm leading-relaxed text-slate-500 sm:text-base md:mb-12">
          Dedicated servants committed to spreading the truth, love, and wisdom.
        </p>
        <div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8"
          style={{
            gridTemplateColumns:
              leaders.length <= 3
                ? `repeat(${leaders.length}, 1fr)`
                : undefined,
          }}
          ref={gridRef}
        >
          {leaders.map((leader, i) => {
            const socials = [
              { url: leader.facebook, Icon: FacebookIcon, label: 'Facebook' },
              { url: leader.twitter, Icon: TwitterIcon, label: 'Twitter' },
              { url: leader.linkedin, Icon: LinkedInIcon, label: 'LinkedIn' },
            ].filter(s => s.url);

            return (
              <div key={leader._id || i} className="leader-card-wrap">
                <div className="leader-card rounded-xl border border-slate-100 bg-white px-5 py-7 text-center shadow-sm">
                  <div
                    className="leader-accent-line mb-5 h-[3px] rounded-sm opacity-0"
                    style={{ background: 'linear-gradient(90deg, transparent, #0ea5e9, #38bdf8, transparent)' }}
                  />
                  <div className="leader-photo-ring mx-auto mb-4 block h-[130px] w-[130px] rounded-full">
                    <LeaderPhoto
                      src={leader.photoUrl || ''}
                      fallbackSrc={PLACEHOLDER_IMAGES[i % PLACEHOLDER_IMAGES.length]}
                      alt={leader.name}
                      className="leader-photo block h-[130px] w-[130px] rounded-full object-cover"
                    />
                  </div>
                  <h4 className="leader-name mb-1 text-base font-bold text-slate-900">{leader.name}</h4>
                  <p className="leader-role mb-0.5 text-sm font-medium text-sky-500">{leader.role}</p>
                  {leader.roleAm && (
                    <p className="leader-role mb-3 text-xs italic text-slate-400">{leader.roleAm}</p>
                  )}
                  <div className="flex items-center justify-center gap-2">
                    {(socials.length > 0 ? socials : [
                      { url: '#', Icon: FacebookIcon, label: 'Facebook' },
                      { url: '#', Icon: TwitterIcon, label: 'Twitter' },
                      { url: '#', Icon: LinkedInIcon, label: 'LinkedIn' },
                    ]).map(({ url, Icon, label }, si) => (
                      <a
                        key={label}
                        href={url || '#'}
                        target={url && url !== '#' ? '_blank' : undefined}
                        rel={url && url !== '#' ? 'noreferrer' : undefined}
                        className="leader-social leader-social-btn flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 no-underline transition-colors duration-150"
                        style={{ animationDelay: `${0.55 + si * 0.08}s` }}
                        aria-label={label}
                      >
                        <Icon />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
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
    <section ref={ref} className="mv-section w-full bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-16">
      <div className="w-full text-center">
        <h2 className="mv-heading mb-1 text-2xl font-bold text-slate-900 md:text-3xl lg:text-[2rem]">
          Our Mission &amp; Vision
        </h2>
        <p className="mv-subheading mb-8 text-sm font-medium text-sky-500 sm:text-base md:mb-10">
          ዓላማ እና ራእይ
        </p>
        <div className="grid grid-cols-1 gap-6 text-left md:grid-cols-2 md:gap-10">
          <div className="mv-card mv-card-left rounded-lg border-l-4 border-sky-500 bg-slate-50 p-5 sm:p-8">
            <div className="mv-icon mb-3 flex items-center">
              <HandsHeartIcon />
            </div>
            <h3 className="mb-3 text-base font-bold text-slate-900 sm:text-lg">Our Mission / ተልእኮ</h3>
            <p className="text-sm leading-relaxed text-slate-600 sm:text-[0.92rem]">
              To preach the full gospel of Jesus Christ and build a loving Christ-like community. We strive to make disciples for the Kingdom of God, impacting our local and global communities with the love and power of God.
            </p>
          </div>
          <div className="mv-card mv-card-right rounded-lg border-l-4 border-sky-500 bg-slate-50 p-5 sm:p-8">
            <div className="mv-icon mb-3 flex items-center">
              <GlobeIcon />
            </div>
            <h3 className="mb-3 text-base font-bold text-slate-900 sm:text-lg">Our Vision / ራእይ</h3>
            <p className="text-sm leading-relaxed text-slate-600 sm:text-[0.92rem]">
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
    <section ref={ref} className="cta-section w-full px-4 py-16 text-center sm:px-6 sm:py-18 lg:px-16">
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
      <div className="cta-inner mx-auto max-w-[700px]">
        <h2
          className="cta-text-item mb-2 text-2xl font-extrabold text-slate-900 md:text-3xl lg:text-[2rem]"
          style={{ animationDelay: '0s' }}
        >
          Join Our Family This Sunday
        </h2>
        <p
          className="cta-text-item mb-4 text-sm text-slate-500 sm:text-base"
          style={{ animationDelay: '0.15s' }}
        >
          በዚህ እሁድ ቤተሰባችንን ይቀላቀሉ
        </p>
        <p
          className="cta-text-item mb-8 text-sm leading-relaxed text-slate-800 sm:text-base"
          style={{ animationDelay: '0.3s' }}
        >
          9:00 AM (English Service) &nbsp; 11:00 AM (Amharic Service)
        </p>
        <a
          href="https://maps.google.com/?q=Kerabu+Full+Gospel+Church+Addis+Ababa+Ethiopia"
          target="_blank"
          rel="noreferrer"
          className="cta-btn cta-text-item inline-block rounded-md bg-sky-500 px-8 py-3 text-sm font-bold text-white no-underline transition-colors sm:px-9 sm:text-base"
          style={{ animationDelay: '0.45s' }}
        >
          Get Directions / Watch
        </a>
      </div>
    </section>
  );
}

export default function About() {
  return (
    <div className="m-0 w-full max-w-[100vw] min-h-screen overflow-x-hidden p-0 font-['Segoe_UI',system-ui,sans-serif]">

      {/* ── Hero ─────────────────────────────────────────── */}
      <section
        className="relative flex min-h-[320px] items-center bg-cover bg-top text-white sm:min-h-[380px] md:min-h-[440px]"
        style={{ backgroundImage: "url('/hero.jpg')" }}
      >
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(10,20,50,0.72) 0%, rgba(10,20,50,0.65) 100%)' }}
        />
        <div className="relative z-10 mx-auto max-w-[800px] px-4 py-16 text-center sm:px-8 sm:py-20 md:px-16">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/60 sm:text-sm">
            WELCOME HOME
          </p>
          <h1 className="mb-1 text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-5xl">
            Who We Are
          </h1>
          <p className="mb-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
            ስለእኛ
          </p>
          <p className="mb-1 text-sm leading-relaxed text-slate-300 sm:text-base md:text-lg">
            A community of believers dedicated to the full gospel and transforming lives with the love of Christ.
          </p>
          <p className="text-xs italic text-slate-400 sm:text-sm md:text-base">
            የክርስት ትምህርትን ለተማሪዎች ለማስተማር እና ህይወትን ለመለወጥ የሰጠ የእምነት ማህበረሰብ።
          </p>
        </div>
      </section>

      {/* ── Mission & Vision ─────────────────────────────── */}
      <MissionVisionSection />

      {/* ── Scripture Quote ──────────────────────────────── */}
      <section className="w-full bg-sky-100 px-4 py-14 sm:px-6 sm:py-18 lg:px-16">
        <div className="mx-auto max-w-[750px] text-center">
          <div className="mb-4">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="#0ea5e9">
              <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
            </svg>
          </div>
          <blockquote className="mb-5 border-none p-0 font-serif text-lg font-medium italic leading-relaxed text-slate-800 sm:text-xl md:text-[1.35rem]">
            &ldquo;For where two or three gather in my name, there am I with them.&rdquo;
          </blockquote>
          <p className="text-xs font-bold tracking-[0.12em] text-slate-400 sm:text-sm">
            MATTHEW 18:20
          </p>
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
