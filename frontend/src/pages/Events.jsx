import { useEffect, useState, useRef } from 'react';
import api from '../api/axios';
import Footer from '../components/Footer';

const MONTH_ABBR = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
const MONTH_FULL = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_ABBR = ['S','M','T','W','T','F','S'];

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'worship', label: 'Worship / አምልኮ' },
  { key: 'youth', label: 'Youth / ወጣቶች' },
  { key: 'outreach', label: 'Outreach / ተደራሽ' },
  { key: 'prayer', label: 'Prayer / ጸሎት' },
  { key: 'conference', label: 'Conference' },
  { key: 'charity', label: 'Charity' },
];

const CATEGORY_COLORS = {
  worship: '#0ea5e9',
  youth: '#8b5cf6',
  outreach: '#10b981',
  prayer: '#f59e0b',
  conference: '#6366f1',
  charity: '#ec4899',
};

const WEEKLY_GATHERINGS = [
  { name: 'Sunday Service', time: '9:00 AM' },
  { name: 'Bible Study (Wed)', time: '6:00 PM' },
  { name: 'Youth Program (Fri)', time: '5:00 PM' },
];

const FALLBACK_EVENTS = [
  {
    _id: 'f1',
    title: 'Sunday Worship Service / ጠባበት',
    titleAm: 'ጠባበት',
    description: 'Join us for a time of powerful worship and sermon. Let\'s come together to praise His name.',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 15, 9, 0).toISOString(),
    endTime: '11:30 AM',
    location: 'Main Sanctuary, Addis Ababa',
    category: 'worship',
    image: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=600&h=400&fit=crop',
    ctaLabel: 'Register / ተመዝገቡ',
  },
  {
    _id: 'f2',
    title: 'Youth Night: Faith & Future / ወጣቶች ፕሮግራም',
    titleAm: 'ወጣቶች ፕሮግራም',
    description: 'An evening of fellowship, music, and discussion about navigating life with faith.',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 20, 17, 0).toISOString(),
    endTime: '07:30 PM',
    location: 'Youth Hall, Building B',
    category: 'youth',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop',
    ctaLabel: 'Register / ተመዝገቡ',
  },
  {
    _id: 'f3',
    title: 'Community Outreach / የማህበረሰብ አገልግሎት',
    titleAm: 'አገልግሎት',
    description: 'We are visiting the local shelter to provide food and clothes. Volunteers needed.',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 28, 8, 0).toISOString(),
    endTime: '01:00 PM',
    location: 'Meeting Point: Church Parking',
    category: 'outreach',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&h=400&fit=crop',
    ctaLabel: 'Volunteer / በፈቃደኝነት',
  },
  {
    _id: 'f4',
    title: 'All Night Prayer / የሌሊት ጸሎት',
    titleAm: 'የሌሊት ጸሎት',
    description: 'Dedicated time for intercession and spiritual breakthrough.',
    date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1, 22, 0).toISOString(),
    endTime: '04:00 AM',
    location: 'Prayer Hall / የጸሎት ቤት',
    category: 'prayer',
    image: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=600&h=400&fit=crop',
    ctaLabel: 'Join Us / ይቀላቀሉን',
  },
];

const eventsPageCSS = `
/* ═══ ENTRY ANIMATIONS ═══ */
@keyframes eventsHeroFadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes eventsCardSlideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes eventsCalendarFade {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes eventsBorderSweep {
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}

/* ═══ FLOATING CROSSES + ORBS (main section background) ═══ */
@keyframes eventsFloatCross {
  0% { transform: translateY(0) rotate(0deg) scale(1); opacity: 0; }
  8% { opacity: 1; }
  75% { opacity: 0.7; }
  100% { transform: translateY(-600px) rotate(25deg) scale(0.4); opacity: 0; }
}
@keyframes eventsFloatOrb {
  0% { transform: translateY(0) scale(1); opacity: 0; }
  12% { opacity: 0.5; }
  80% { opacity: 0.35; }
  100% { transform: translateY(-550px) scale(0.15); opacity: 0; }
}
@keyframes eventsDoveFloat {
  0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
  10% { opacity: 0.5; }
  50% { transform: translateY(-300px) translateX(40px) scale(0.85); opacity: 0.4; }
  100% { transform: translateY(-600px) translateX(-20px) scale(0.3); opacity: 0; }
}
.events-bg-elements {
  position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0;
}
.events-float-cross {
  position: absolute; bottom: -40px;
  color: #0ea5e9;
  font-size: 1.4rem;
  animation: eventsFloatCross linear infinite;
  user-select: none;
  opacity: 0;
  text-shadow: 0 0 8px rgba(14,165,233,0.25);
}
.events-float-orb {
  position: absolute; bottom: -20px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(14,165,233,0.35), rgba(56,189,248,0.1), transparent);
  animation: eventsFloatOrb linear infinite;
  opacity: 0;
}
.events-float-dove {
  position: absolute; bottom: -30px;
  font-size: 1.1rem;
  animation: eventsDoveFloat linear infinite;
  user-select: none;
  opacity: 0;
  filter: grayscale(0.3);
}

/* ═══ HERO PARTICLES ═══ */
@keyframes eventsHeroParticle {
  0% { transform: translateY(0) scale(1); opacity: 0; }
  10% { opacity: 0.6; }
  90% { opacity: 0.4; }
  100% { transform: translateY(-180px) scale(0.2); opacity: 0; }
}
.events-hero-particles {
  position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0;
}
.events-hero-particle {
  position: absolute; bottom: 0; border-radius: 50%;
  background: radial-gradient(circle, rgba(14,165,233,0.5), transparent);
  animation: eventsHeroParticle linear infinite;
}

.events-hero-content {
  animation: eventsHeroFadeIn 0.8s ease forwards;
}

/* ═══ CARD ENTRY ═══ */
@keyframes eventsCardEntry {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.events-card-anim {
  opacity: 0;
  animation: eventsCardEntry 0.6s ease forwards;
}
.events-card-anim:nth-child(1) { animation-delay: 0.1s; }
.events-card-anim:nth-child(2) { animation-delay: 0.2s; }
.events-card-anim:nth-child(3) { animation-delay: 0.3s; }
.events-card-anim:nth-child(4) { animation-delay: 0.4s; }

.events-calendar-anim {
  animation: eventsCalendarFade 0.6s ease forwards;
}

/* ═══ CARD AMBIENT GLOW (always-on, subtle breathing) ═══ */
@keyframes eventsCardBreathe {
  0%, 100% {
    box-shadow: 0 4px 20px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04);
    border-color: #e8ecf1;
  }
  50% {
    box-shadow: 0 6px 28px rgba(14,165,233,0.1), 0 0 8px rgba(14,165,233,0.06);
    border-color: #bae6fd;
  }
}
.events-card-inner {
  position: relative;
  transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.4s ease, border-color 0.4s ease;
  animation: eventsCardBreathe 5s ease-in-out infinite;
}

/* ═══ CARD HOVER: FULL GLOW ═══ */
.events-card-wrap:hover .events-card-inner {
  transform: translateY(-8px);
  box-shadow:
    0 20px 50px rgba(14,165,233,0.18),
    0 8px 20px rgba(0,0,0,0.06),
    0 0 20px rgba(14,165,233,0.08);
  border-color: #7dd3fc;
  animation: none;
}

/* ═══ IMAGE ZOOM + CINEMATIC OVERLAY ═══ */
.events-card-img {
  transition: transform 0.5s ease, filter 0.5s ease;
}
.events-card-wrap:hover .events-card-img {
  transform: scale(1.06);
  filter: brightness(1.05);
}
.events-card-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 55%);
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}
.events-card-wrap:hover .events-card-overlay {
  opacity: 1;
}

/* ═══ BADGE + CATEGORY PILL ═══ */
.events-badge-wrap {
  transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease;
}
.events-card-wrap:hover .events-badge-wrap {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0,0,0,0.18);
}
.events-cat-pill {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.events-card-wrap:hover .events-cat-pill {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.25);
}

/* ═══ TOP ACCENT SWEEP ═══ */
.events-card-top-accent {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, #0ea5e9, #38bdf8, #7dd3fc, #0ea5e9, transparent);
  background-size: 200% 100%;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 2;
}
.events-card-wrap:hover .events-card-top-accent {
  opacity: 1;
  animation: eventsBorderSweep 1.8s linear infinite;
}

/* ═══ BORDER GLOW RING (hover only) ═══ */
.events-card-inner::before {
  content: '';
  position: absolute; inset: -1px;
  border-radius: 17px;
  padding: 1.5px;
  background: linear-gradient(135deg, transparent 30%, #0ea5e9 50%, #38bdf8 60%, transparent 80%);
  background-size: 300% 300%;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
  z-index: 3;
}
.events-card-wrap:hover .events-card-inner::before {
  opacity: 1;
  animation: eventsBorderSweep 2.5s linear infinite;
}

/* ═══ CTA BUTTON GLOW + SHIMMER ═══ */
@keyframes eventsCtaPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(14,165,233,0.4); }
  50% { box-shadow: 0 0 0 8px rgba(14,165,233,0); }
}
.events-cta-btn {
  position: relative; overflow: hidden;
  transition: background 0.25s ease, transform 0.2s ease, box-shadow 0.25s ease;
}
.events-cta-btn::after {
  content: '';
  position: absolute;
  top: 0; left: -100%;
  width: 60%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
  pointer-events: none;
}
.events-card-wrap:hover .events-cta-btn {
  animation: eventsCtaPulse 2s ease-in-out infinite;
}
.events-cta-btn:hover {
  background: #0284c7 !important;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(14,165,233,0.4);
  animation: none !important;
}
.events-cta-btn:hover::after {
  left: 120%;
  transition: left 0.6s ease;
}

/* ═══ ACTION ICON BUTTONS (Calendar & Share) ═══ */
@keyframes eventsIconBreathe {
  0%, 100% { box-shadow: 0 2px 8px rgba(0,0,0,0.04), 0 0 0 0 rgba(14,165,233,0); border-color: #e2e8f0; }
  50% { box-shadow: 0 2px 12px rgba(14,165,233,0.1), 0 0 0 3px rgba(14,165,233,0.06); border-color: #bae6fd; }
}
@keyframes eventsIconShimmer {
  0% { left: -120%; }
  100% { left: 120%; }
}
@keyframes eventsIconRipple {
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(14,165,233,0.35); }
  50% { box-shadow: 0 0 0 10px rgba(14,165,233,0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(14,165,233,0); }
}

.events-action-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  border: 1.5px solid #e2e8f0;
  background: #f8fafc;
  color: #475569;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  outline: none;
  position: relative;
  overflow: hidden;
  transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1);
  animation: eventsIconBreathe 4s ease-in-out infinite;
}

.events-action-icon::before {
  content: '';
  position: absolute;
  top: 0; left: -120%;
  width: 70%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(14,165,233,0.15), transparent);
  pointer-events: none;
  transition: none;
}

.events-card-wrap:hover .events-action-icon {
  animation: none;
  border-color: #7dd3fc;
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  box-shadow: 0 4px 16px rgba(14,165,233,0.12), 0 0 8px rgba(14,165,233,0.06);
  color: #0284c7;
}

.events-card-wrap:hover .events-action-icon::before {
  animation: eventsIconShimmer 1.8s ease-in-out infinite;
}

.events-action-icon:hover {
  transform: translateY(-3px) scale(1.12) !important;
  animation: eventsIconRipple 0.6s ease !important;
  border-color: #0ea5e9 !important;
  box-shadow: 0 8px 25px rgba(14,165,233,0.3), 0 0 15px rgba(14,165,233,0.15) !important;
}

.events-cal-icon:hover {
  background: linear-gradient(135deg, #0ea5e9, #0284c7) !important;
  color: #fff !important;
}
.events-cal-icon:hover svg { stroke: #fff; }

.events-share-icon:hover {
  background: linear-gradient(135deg, #f59e0b, #d97706) !important;
  color: #fff !important;
}
.events-share-icon:hover svg { stroke: #fff; }

.events-action-icon:active {
  transform: translateY(-1px) scale(0.95) !important;
  box-shadow: 0 2px 8px rgba(14,165,233,0.2) !important;
}

.events-card-wrap:hover .events-cal-icon {
  transition-delay: 0.05s;
}
.events-card-wrap:hover .events-share-icon {
  transition-delay: 0.1s;
}

/* ═══ MODAL ACTION BUTTONS (Calendar & Share in detail modal) ═══ */
@keyframes eventsModalBtnGlow {
  0%, 100% { box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
  50% { box-shadow: 0 4px 18px rgba(14,165,233,0.12); }
}
.events-modal-action {
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
  animation: eventsModalBtnGlow 3s ease-in-out infinite;
}
.events-modal-action::after {
  content: '';
  position: absolute;
  top: 0; left: -120%;
  width: 60%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);
  pointer-events: none;
}
.events-modal-action:hover {
  transform: translateY(-3px);
  animation: none;
}
.events-modal-action:hover::after {
  left: 150%;
  transition: left 0.6s ease;
}
.events-modal-cal:hover {
  background: linear-gradient(135deg, #0ea5e9, #0284c7) !important;
  color: #fff !important;
  border-color: #0ea5e9 !important;
  box-shadow: 0 8px 25px rgba(14,165,233,0.35), 0 0 12px rgba(14,165,233,0.1) !important;
}
.events-modal-cal:hover svg { stroke: #fff; }
.events-modal-share:hover {
  background: linear-gradient(135deg, #f59e0b, #d97706) !important;
  color: #fff !important;
  border-color: #f59e0b !important;
  box-shadow: 0 8px 25px rgba(245,158,11,0.35), 0 0 12px rgba(245,158,11,0.1) !important;
}
.events-modal-share:hover svg { stroke: #fff; }
.events-modal-action:active {
  transform: translateY(-1px) scale(0.97) !important;
}

/* ═══ DETAIL MODAL ═══ */
.events-detail-modal {
  animation: eventsCardEntry 0.3s ease forwards;
}

/* ═══ META ICON GLOW ═══ */
.events-meta-icon {
  transition: transform 0.25s ease, filter 0.25s ease;
  display: flex;
}
.events-card-wrap:hover .events-meta-icon {
  transform: scale(1.15);
  filter: drop-shadow(0 0 4px rgba(14,165,233,0.4));
}

/* ═══ FILTER PILLS ═══ */
.events-filter-btn {
  transition: all 0.25s ease;
  cursor: pointer;
}
.events-filter-btn:hover {
  border-color: #0ea5e9 !important;
  color: #0ea5e9 !important;
  box-shadow: 0 0 10px rgba(14,165,233,0.15);
}

/* ═══ TABS ═══ */
.events-tab-btn {
  transition: all 0.2s ease;
  cursor: pointer;
}
.events-tab-btn:hover {
  color: #0f172a !important;
}

/* ═══ CALENDAR ═══ */
@keyframes eventsTodayPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(14,165,233,0.35); }
  50% { box-shadow: 0 0 0 6px rgba(14,165,233,0); }
}
.events-cal-today {
  animation: eventsTodayPulse 2.5s ease-in-out infinite;
}
@keyframes eventsCalGlow {
  0%, 100% {
    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    border-color: #f1f5f9;
  }
  50% {
    box-shadow: 0 4px 20px rgba(14,165,233,0.08), 0 0 6px rgba(14,165,233,0.04);
    border-color: #e0f2fe;
  }
}
.events-calendar-wrap {
  animation: eventsCalGlow 6s ease-in-out infinite;
  transition: box-shadow 0.3s ease;
}
.events-calendar-wrap:hover {
  box-shadow: 0 6px 24px rgba(14,165,233,0.12);
  animation: none;
}

.events-nav-arrow {
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
  cursor: pointer;
}
.events-nav-arrow:hover {
  background: #0ea5e9 !important;
  color: #fff !important;
  transform: scale(1.1);
}

.events-cal-day {
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
  cursor: pointer;
}
.events-cal-day:hover {
  background: #e0f2fe;
  border-radius: 50%;
  transform: scale(1.12);
}

/* ═══ WEEKLY GATHERINGS GLOW ═══ */
@keyframes eventsGatherGlow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(14,165,233,0); border-color: #d1eef5; }
  50% { box-shadow: 0 0 16px 2px rgba(14,165,233,0.1); border-color: #7dd3fc; }
}
.events-gather-wrap {
  animation: eventsGatherGlow 5s ease-in-out 1s infinite;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}
.events-gather-wrap:hover {
  box-shadow: 0 6px 24px rgba(14,165,233,0.15);
  transform: translateY(-3px);
  animation: none;
}

/* ═══ NEWSLETTER INPUT GLOW ═══ */
.events-email-input {
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}
.events-email-input:focus {
  border-color: #0ea5e9 !important;
  box-shadow: 0 0 0 3px rgba(14,165,233,0.15);
}

/* ═══ STAY CONNECTED CTA ═══ */
@keyframes eventsStayFloat {
  0% { transform: translateY(0) rotate(0deg); opacity: 0; }
  15% { opacity: 0.12; }
  85% { opacity: 0.08; }
  100% { transform: translateY(-160px) rotate(20deg); opacity: 0; }
}
@keyframes eventsStaySparkle {
  0% { transform: translateY(0) scale(1); opacity: 0; }
  15% { opacity: 0.7; }
  85% { opacity: 0.5; }
  100% { transform: translateY(-80px) scale(0); opacity: 0; }
}
@keyframes eventsStayRays {
  0%, 100% { opacity: 0.04; transform: scale(1) rotate(0deg); }
  50% { opacity: 0.1; transform: scale(1.06) rotate(2deg); }
}
.events-stay-shapes {
  position: absolute; inset: 0; pointer-events: none; overflow: hidden;
}
.events-stay-shape {
  position: absolute; bottom: -20px;
  color: #0ea5e9; font-size: 1.5rem;
  animation: eventsStayFloat linear infinite;
  pointer-events: none; user-select: none;
}
.events-stay-sparkles {
  position: absolute; inset: 0; pointer-events: none; overflow: hidden;
}
.events-stay-sparkle {
  position: absolute; bottom: 0; border-radius: 50%;
  background: radial-gradient(circle, rgba(14,165,233,0.55), transparent);
  animation: eventsStaySparkle linear infinite;
}
.events-stay-rays {
  position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(ellipse at center, rgba(14,165,233,0.07) 0%, transparent 70%);
  animation: eventsStayRays 6s ease-in-out infinite;
}

/* ═══ SUBSCRIBE BUTTON ═══ */
@keyframes eventsSubPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(14,165,233,0.45), 0 0 20px rgba(14,165,233,0.15); }
  50% { box-shadow: 0 0 0 8px rgba(14,165,233,0), 0 0 30px rgba(14,165,233,0.25); }
}
@keyframes eventsSubShimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
@keyframes eventsSubGlow {
  0%, 100% { opacity: 0.5; filter: blur(12px); }
  50% { opacity: 1; filter: blur(18px); }
}
.events-sub-btn {
  position: relative;
  transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
  animation: eventsSubPulse 2.8s ease-in-out infinite;
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%) !important;
  background-size: 200% auto;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  overflow: hidden;
  z-index: 1;
}
.events-sub-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%);
  background-size: 200% 100%;
  animation: eventsSubShimmer 3.5s ease-in-out infinite;
  border-radius: inherit;
  z-index: -1;
  pointer-events: none;
}
.events-sub-btn::after {
  content: '';
  position: absolute;
  inset: -4px;
  background: linear-gradient(135deg, #38bdf8, #0ea5e9, #0284c7);
  border-radius: inherit;
  z-index: -2;
  opacity: 0;
  filter: blur(14px);
  transition: opacity 0.35s ease;
  animation: eventsSubGlow 3s ease-in-out infinite;
}
.events-sub-btn:hover {
  background: linear-gradient(135deg, #38bdf8 0%, #0ea5e9 50%, #0284c7 100%) !important;
  background-size: 200% auto;
  transform: translateY(-3px) scale(1.03);
  box-shadow: 0 8px 25px rgba(14,165,233,0.4), 0 0 40px rgba(14,165,233,0.15);
  animation: none;
}
.events-sub-btn:hover::after {
  opacity: 0.7;
}
.events-sub-btn:active {
  transform: translateY(-1px) scale(0.98);
  box-shadow: 0 4px 12px rgba(14,165,233,0.3);
}
`;

function getCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);
  return days;
}

function CalendarWidget({ currentDate, eventDays = [15] }) {
  const [calMonth, setCalMonth] = useState(currentDate.getMonth());
  const [calYear, setCalYear] = useState(currentDate.getFullYear());
  const today = new Date();
  const days = getCalendarDays(calYear, calMonth);

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); }
    else setCalMonth(calMonth - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); }
    else setCalMonth(calMonth + 1);
  };

  const isToday = (day) =>
    day === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear();

  const isEventDay = (day) => eventDays.includes(day);

  return (
    <div className="events-calendar-wrap" style={calStyles.wrapper}>
      <div style={calStyles.header}>
        <button className="events-nav-arrow" onClick={prevMonth} style={calStyles.arrow}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
        </button>
        <span style={calStyles.monthLabel}>{MONTH_FULL[calMonth]} {calYear}</span>
        <button className="events-nav-arrow" onClick={nextMonth} style={calStyles.arrow}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
        </button>
      </div>
      <div style={calStyles.dayNames}>
        {DAY_ABBR.map((d, i) => (
          <span key={i} style={calStyles.dayName}>{d}</span>
        ))}
      </div>
      <div style={calStyles.grid}>
        {days.map((day, i) => {
          const today_ = isToday(day);
          const event_ = isEventDay(day) && !today_;
          return (
            <span
              key={i}
              className={`${day ? 'events-cal-day' : ''} ${today_ ? 'events-cal-today' : ''}`}
              style={{
                ...calStyles.day,
                ...(day === null ? { visibility: 'hidden' } : {}),
                ...(today_ ? calStyles.today : {}),
                ...(event_ ? calStyles.eventDay : {}),
              }}
            >
              {day}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function WeeklyGatherings() {
  return (
    <div className="events-gather-wrap" style={gatherStyles.wrapper}>
      <h4 style={gatherStyles.heading}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
          <rect x="3" y="4" width="18" height="18" rx="2" stroke="#0ea5e9" strokeWidth="2" fill="none"/>
          <path d="M3 10h18" stroke="#0ea5e9" strokeWidth="2"/>
          <path d="M8 2v4M16 2v4" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="8" cy="15" r="1.5" fill="#0ea5e9"/>
          <circle cx="12" cy="15" r="1.5" fill="#0ea5e9"/>
          <circle cx="16" cy="15" r="1.5" fill="#0ea5e9"/>
        </svg>
        Weekly Gatherings
      </h4>
      {WEEKLY_GATHERINGS.map((g, i) => (
        <div key={i} style={{
          ...gatherStyles.row,
          ...(i === WEEKLY_GATHERINGS.length - 1 ? { borderBottom: 'none' } : {}),
        }}>
          <span style={gatherStyles.name}>{g.name}</span>
          <span style={gatherStyles.time}>{g.time}</span>
        </div>
      ))}
    </div>
  );
}

const HERO_PARTICLES = Array.from({ length: 14 }, () => ({
  left: `${Math.random() * 100}%`,
  width: `${3 + Math.random() * 5}px`,
  delay: `${Math.random() * 7}s`,
  duration: `${5 + Math.random() * 6}s`,
  bottom: `${Math.random() * 15}%`,
}));

const BG_CROSSES = [
  { left: '5%',  delay: '0s',   duration: '14s' },
  { left: '15%', delay: '3s',   duration: '16s' },
  { left: '28%', delay: '7s',   duration: '13s' },
  { left: '42%', delay: '2s',   duration: '17s' },
  { left: '55%', delay: '9s',   duration: '15s' },
  { left: '68%', delay: '4s',   duration: '14s' },
  { left: '80%', delay: '11s',  duration: '16s' },
  { left: '92%', delay: '6s',   duration: '13s' },
  { left: '35%', delay: '13s',  duration: '18s' },
  { left: '72%', delay: '1s',   duration: '15s' },
];

const BG_ORBS = Array.from({ length: 12 }, () => ({
  left: `${Math.random() * 100}%`,
  width: `${4 + Math.random() * 8}px`,
  delay: `${Math.random() * 12}s`,
  duration: `${10 + Math.random() * 8}s`,
}));

const BG_DOVES = [
  { left: '20%', delay: '5s',  duration: '20s' },
  { left: '60%', delay: '12s', duration: '22s' },
  { left: '85%', delay: '0s',  duration: '18s' },
];

const STAY_SHAPES = [
  { symbol: '✝', left: '8%',  delay: '0s',  duration: '9s' },
  { symbol: '🕊', left: '22%', delay: '2s',  duration: '11s' },
  { symbol: '✝', left: '42%', delay: '4s',  duration: '8s' },
  { symbol: '🕊', left: '60%', delay: '1s',  duration: '10s' },
  { symbol: '✝', left: '78%', delay: '3s',  duration: '9.5s' },
  { symbol: '🕊', left: '92%', delay: '5s',  duration: '12s' },
];

const STAY_SPARKLES = Array.from({ length: 14 }, () => ({
  left: `${Math.random() * 100}%`,
  delay: `${Math.random() * 6}s`,
  duration: `${3 + Math.random() * 4}s`,
  size: `${2 + Math.random() * 3}px`,
}));

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#0ea5e9" style={{ flexShrink: 0 }}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
  </svg>
);

const LocationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#0ea5e9" style={{ flexShrink: 0 }}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
);

function generateICS(event) {
  const d = new Date(event.date);
  const pad = (n) => String(n).padStart(2, '0');
  const toICS = (dt) => `${dt.getUTCFullYear()}${pad(dt.getUTCMonth()+1)}${pad(dt.getUTCDate())}T${pad(dt.getUTCHours())}${pad(dt.getUTCMinutes())}00Z`;
  const endDate = event.endDate ? new Date(event.endDate) : new Date(d.getTime() + 2 * 60 * 60 * 1000);
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Church//Events//EN',
    'BEGIN:VEVENT',
    `DTSTART:${toICS(d)}`,
    `DTEND:${toICS(endDate)}`,
    `SUMMARY:${(event.title || '').replace(/,/g, '\\,')}`,
    `DESCRIPTION:${(event.description || '').replace(/\n/g, '\\n').replace(/,/g, '\\,')}`,
    `LOCATION:${(event.location || '').replace(/,/g, '\\,')}`,
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n');
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(event.title || 'event').replace(/[^a-zA-Z0-9]/g, '_')}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

function handleShare(event) {
  const text = `${event.title}\n${new Date(event.date).toLocaleDateString()}${event.location ? `\n${event.location}` : ''}`;
  if (navigator.share) {
    navigator.share({ title: event.title, text, url: window.location.href }).catch(() => {});
  } else {
    navigator.clipboard.writeText(`${event.title} - ${new Date(event.date).toLocaleDateString()}${event.location ? ` @ ${event.location}` : ''}\n${window.location.href}`);
    alert('Event link copied to clipboard!');
  }
}

function EventDetailModal({ event, onClose }) {
  const [regForm, setRegForm] = useState({ name: '', email: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);
  const [regStatus, setRegStatus] = useState(null);

  if (!event) return null;

  const d = new Date(event.date);
  const timeStr = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const dateStr = d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const endRaw = event.endDate ? new Date(event.endDate) : null;
  const isMultiDay = endRaw && endRaw.toDateString() !== d.toDateString();
  const sameDay = endRaw && !isMultiDay;
  const modalEndTimeStr = sameDay ? endRaw.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '';
  const endDateStr = isMultiDay ? endRaw.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '';
  const category = event.category || 'worship';
  const catColor = CATEGORY_COLORS[category] || '#0ea5e9';
  const rawImg = event.posterUrl || event.image;
  const imgSrc = rawImg || 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=600&h=400&fit=crop';

  const handleRegSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/registrations', { eventId: event._id, name: regForm.name, email: regForm.email, phone: regForm.phone });
      setRegStatus('success');
    } catch (err) {
      setRegStatus(err.response?.data?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div style={modalStyles.modal} onClick={e => e.stopPropagation()}>
        <button style={modalStyles.closeBtn} onClick={onClose}>&times;</button>
        <img src={imgSrc} alt={event.title} style={modalStyles.poster} />
        <div style={modalStyles.body}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <span style={{ ...modalStyles.catPill, background: catColor }}>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
            {event.requiresRegistration && <span style={modalStyles.regPill}>Registration Required</span>}
          </div>
          <h2 style={modalStyles.title}>{event.title}</h2>
          <p style={modalStyles.desc}>{event.description}</p>
          <div style={modalStyles.metaSection}>
            <div style={modalStyles.metaItem}>
              <ClockIcon />
              <span>{isMultiDay ? `${dateStr} – ${endDateStr}` : `${dateStr} at ${timeStr}${modalEndTimeStr ? ` – ${modalEndTimeStr}` : ''}`}</span>
            </div>
            {event.location && (
              <div style={modalStyles.metaItem}>
                <LocationIcon />
                <span>{event.location}</span>
              </div>
            )}
          </div>
          <div style={modalStyles.actionRow}>
            <button className="events-modal-action events-modal-cal" style={modalStyles.calBtn} onClick={() => generateICS(event)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
              Add to Calendar
            </button>
            <button className="events-modal-action events-modal-share" style={modalStyles.shareBtn} onClick={() => handleShare(event)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/></svg>
              Share
            </button>
          </div>

          {event.requiresRegistration && (
            <div style={modalStyles.regSection}>
              <h3 style={modalStyles.regTitle}>Register for this Event</h3>
              {regStatus === 'success' ? (
                <div style={modalStyles.successMsg}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  <span>You have been registered successfully!</span>
                </div>
              ) : (
                <form onSubmit={handleRegSubmit} style={modalStyles.regForm}>
                  {typeof regStatus === 'string' && regStatus !== 'success' && (
                    <div style={modalStyles.errorMsg}>{regStatus}</div>
                  )}
                  <input style={modalStyles.regInput} placeholder="Full Name *" required value={regForm.name} onChange={e => setRegForm({ ...regForm, name: e.target.value })} />
                  <input style={modalStyles.regInput} type="tel" placeholder="Phone Number *" required value={regForm.phone} onChange={e => setRegForm({ ...regForm, phone: e.target.value })} />
                  <input style={modalStyles.regInput} type="email" placeholder="Email Address (optional)" value={regForm.email} onChange={e => setRegForm({ ...regForm, email: e.target.value })} />
                  <button type="submit" style={modalStyles.regSubmitBtn} disabled={submitting}>
                    {submitting ? 'Registering...' : 'Register Now'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EventCard({ event, index, onViewDetails }) {
  const d = new Date(event.date);
  const month = MONTH_ABBR[d.getMonth()];
  const day = d.getDate();
  const timeStr = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const endRaw = event.endDate ? new Date(event.endDate) : null;
  const isMultiDay = endRaw && endRaw.toDateString() !== d.toDateString();
  const sameDay = endRaw && !isMultiDay;
  const endTimeStr = sameDay ? endRaw.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '';
  const category = event.category || 'worship';
  const catColor = CATEGORY_COLORS[category] || '#0ea5e9';
  const catLabel = category.charAt(0).toUpperCase() + category.slice(1);
  const rawImg = event.posterUrl || event.image;
  const imgSrc = rawImg
    ? (rawImg.startsWith('http') ? rawImg : rawImg)
    : `https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=600&h=400&fit=crop`;

  const handleCardClick = (e) => {
    if (e.target.closest('button')) return;
    onViewDetails(event);
  };

  return (
    <div className="events-card-anim events-card-wrap">
      <div className="events-card-inner" style={{ ...cardStyles.card, cursor: 'pointer' }} onClick={handleCardClick}>
        <div className="events-card-top-accent" />
        <div style={cardStyles.imageWrap}>
          <img className="events-card-img" src={imgSrc} alt={event.title} style={cardStyles.image} />
          <div className="events-card-overlay" />
          <div className="events-badge-wrap" style={cardStyles.dateBadge}>
            <span style={cardStyles.badgeMonth}>{month}</span>
            <span style={cardStyles.badgeDay}>{isMultiDay ? `${day}–${endRaw.getDate()}` : day}</span>
            {isMultiDay && MONTH_ABBR[endRaw.getMonth()] !== month && (
              <span style={{ ...cardStyles.badgeMonth, fontSize: 9, marginTop: -2 }}>{MONTH_ABBR[endRaw.getMonth()]}</span>
            )}
          </div>
          <span className="events-cat-pill" style={{ ...cardStyles.categoryTag, background: catColor }}>
            {catLabel}
          </span>
        </div>
        <div style={cardStyles.body}>
          <h3 style={cardStyles.title}>{event.title}</h3>
          <p style={cardStyles.desc}>{event.description}</p>
          <div style={cardStyles.metaRow}>
            <span className="events-meta-icon"><ClockIcon /></span>
            <span style={cardStyles.metaText}>
              {isMultiDay
                ? `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${endRaw.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                : `${timeStr}${endTimeStr ? ` – ${endTimeStr}` : ''}`}
            </span>
          </div>
          {event.location && (
            <div style={cardStyles.metaRow}>
              <span className="events-meta-icon"><LocationIcon /></span>
              <span style={cardStyles.metaText}>{event.location}</span>
            </div>
          )}
          <div style={cardStyles.btnRow}>
            {event.requiresRegistration && (
              <button className="events-cta-btn" style={cardStyles.registerBtn} onClick={() => onViewDetails(event)}>
                Register
              </button>
            )}
            <button className="events-action-icon events-cal-icon" onClick={(e) => { e.stopPropagation(); generateICS(event); }} title="Add to Calendar">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
            </button>
            <button className="events-action-icon events-share-icon" onClick={(e) => { e.stopPropagation(); handleShare(event); }} title="Share Event">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [activeFilter, setActiveFilter] = useState('all');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [detailEvent, setDetailEvent] = useState(null);
  const styleRef = useRef(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = eventsPageCSS;
    document.head.appendChild(style);
    styleRef.current = style;

    api.get('/events')
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setEvents(res.data.map((e, i) => ({
            ...e,
            category: e.category || 'worship',
            ctaLabel: e.ctaLabel || FALLBACK_EVENTS[i % FALLBACK_EVENTS.length]?.ctaLabel,
            endTime: e.endTime || FALLBACK_EVENTS[i % FALLBACK_EVENTS.length]?.endTime,
          })));
        } else {
          setEvents(FALLBACK_EVENTS);
        }
      })
      .catch(() => setEvents(FALLBACK_EVENTS))
      .finally(() => setLoading(false));

    return () => { style.remove(); };
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) setSubscribed(true);
  };

  const now = new Date();
  const filteredEvents = events.filter((e) => {
    const isPast = new Date(e.date) < now;
    if (activeTab === 'upcoming' && isPast) return false;
    if (activeTab === 'past' && !isPast) return false;
    if (activeFilter !== 'all' && e.category !== activeFilter) return false;
    return true;
  });

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section style={heroStyles.section}>
        <div style={heroStyles.overlay} />
        <div className="events-hero-particles">
          {HERO_PARTICLES.map((p, i) => (
            <div
              key={i}
              className="events-hero-particle"
              style={{
                left: p.left, bottom: p.bottom,
                width: p.width, height: p.width,
                animationDelay: p.delay, animationDuration: p.duration,
              }}
            />
          ))}
        </div>
        <div className="events-hero-content" style={heroStyles.content}>
          <h1 style={heroStyles.title}>
            Church Events / የቤተክርስቲያን<br />ፕሮግራሞች
          </h1>
          <p style={heroStyles.scripture}>
            &ldquo;Not neglecting to meet together...&rdquo; - Hebrews 10:25
          </p>
        </div>
      </section>

      {/* ── Tabs & Filters ──────────────────────────────── */}
      <section style={filterStyles.section}>
        <div style={filterStyles.inner}>
          <div style={filterStyles.tabGroup}>
            <div style={filterStyles.tabPill}>
              <button
                className="events-tab-btn"
                onClick={() => setActiveTab('upcoming')}
                style={{
                  ...filterStyles.tab,
                  ...(activeTab === 'upcoming' ? filterStyles.tabActive : {}),
                }}
              >
                Upcoming Events
              </button>
              <button
                className="events-tab-btn"
                onClick={() => setActiveTab('past')}
                style={{
                  ...filterStyles.tab,
                  ...(activeTab === 'past' ? filterStyles.tabActive : {}),
                }}
              >
                Past Events
              </button>
            </div>
          </div>
          <div style={filterStyles.filterGroup}>
            <span style={filterStyles.filterLabel}>Filter by:</span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                className="events-filter-btn"
                onClick={() => setActiveFilter(cat.key)}
                style={{
                  ...filterStyles.filterBtn,
                  ...(activeFilter === cat.key ? filterStyles.filterActive : {}),
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main Content: Calendar + Events Grid ────────── */}
      <section style={mainStyles.section}>
        <div className="events-bg-elements">
          {BG_CROSSES.map((c, i) => (
            <span
              key={`cross-${i}`}
              className="events-float-cross"
              style={{ left: c.left, animationDelay: c.delay, animationDuration: c.duration }}
            >
              ✝
            </span>
          ))}
          {BG_ORBS.map((o, i) => (
            <div
              key={`orb-${i}`}
              className="events-float-orb"
              style={{
                left: o.left, width: o.width, height: o.width,
                animationDelay: o.delay, animationDuration: o.duration,
              }}
            />
          ))}
          {BG_DOVES.map((d, i) => (
            <span
              key={`dove-${i}`}
              className="events-float-dove"
              style={{ left: d.left, animationDelay: d.delay, animationDuration: d.duration }}
            >
              🕊
            </span>
          ))}
        </div>
        <div style={mainStyles.inner}>

          {/* Left Sidebar: Calendar + Weekly Gatherings */}
          <aside className="events-calendar-anim" style={mainStyles.sidebar}>
            <CalendarWidget currentDate={now} />
            <WeeklyGatherings />
          </aside>

          {/* Right: Events Grid */}
          <div style={mainStyles.eventsArea}>
            {loading ? (
              <p style={{ color: '#6b7280', textAlign: 'center', padding: '3rem' }}>
                Loading events...
              </p>
            ) : filteredEvents.length === 0 ? (
              <p style={{ color: '#6b7280', textAlign: 'center', padding: '3rem' }}>
                No {activeTab} events{activeFilter !== 'all' ? ` in ${activeFilter}` : ''} at this time.
              </p>
            ) : (
              <div style={mainStyles.eventsGrid}>
                {filteredEvents.map((event, i) => (
                  <EventCard key={event._id} event={event} index={i} onViewDetails={setDetailEvent} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Stay Connected ───────────────────────────────── */}
      <section style={newsletterStyles.section}>
        <div style={newsletterStyles.wrapper}>
          <div className="events-stay-rays" />
          <div className="events-stay-shapes">
            {STAY_SHAPES.map((s, i) => (
              <span
                key={i}
                className="events-stay-shape"
                style={{ left: s.left, animationDelay: s.delay, animationDuration: s.duration }}
              >
                {s.symbol}
              </span>
            ))}
          </div>
          <div className="events-stay-sparkles">
            {STAY_SPARKLES.map((s, i) => (
              <span
                key={i}
                className="events-stay-sparkle"
                style={{
                  left: s.left, width: s.size, height: s.size,
                  animationDelay: s.delay, animationDuration: s.duration,
                }}
              />
            ))}
          </div>
          <div style={newsletterStyles.inner}>
            <div style={newsletterStyles.textCol}>
              <h2 style={newsletterStyles.heading}>Stay Connected</h2>
              <p style={newsletterStyles.sub}>
                Get the latest updates on events and church news.
              </p>
              <p style={newsletterStyles.subAm}>
                ስለ ዝግጅቶች እና የቤተክርስቲያን ዜናዎች ያግኙ።
              </p>
            </div>
            <div style={newsletterStyles.formCol}>
              {subscribed ? (
                <p style={newsletterStyles.thanks}>Thank you for subscribing!</p>
              ) : (
                <form onSubmit={handleSubscribe} style={newsletterStyles.form}>
                  <input
                    type="email"
                    className="events-email-input"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={newsletterStyles.input}
                  />
                  <button type="submit" className="events-sub-btn" style={newsletterStyles.btn}>Subscribe</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {detailEvent && <EventDetailModal event={detailEvent} onClose={() => setDetailEvent(null)} />}

      <Footer />
    </div>
  );
}

/* ─── Hero Styles ──────────────────────────────────────────── */
const heroStyles = {
  section: {
    position: 'relative',
    minHeight: '340px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: "url('/hero.jpg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center top',
    color: '#fff',
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to bottom, rgba(10,20,50,0.75) 0%, rgba(10,20,50,0.68) 100%)',
  },
  content: {
    position: 'relative',
    zIndex: 1,
    textAlign: 'center',
    padding: '4.5rem 2rem',
    maxWidth: '700px',
  },
  title: {
    fontSize: 'clamp(1.75rem, 4vw, 2.6rem)',
    fontWeight: '800',
    lineHeight: 1.2,
    margin: '0 0 1.25rem',
    color: '#ffffff',
  },
  scripture: {
    fontSize: '1rem',
    color: '#94a3b8',
    margin: 0,
    fontStyle: 'italic',
    lineHeight: 1.5,
  },
};

/* ─── Filter/Tabs Styles ──────────────────────────────────── */
const filterStyles = {
  section: {
    background: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    padding: '1.5rem 2rem',
  },
  inner: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  tabGroup: {
    display: 'flex',
  },
  tabPill: {
    display: 'flex',
    background: '#f1f5f9',
    borderRadius: '8px',
    padding: '4px',
    gap: '0',
  },
  tab: {
    padding: '0.5rem 1.35rem',
    border: 'none',
    background: 'transparent',
    color: '#94a3b8',
    fontSize: '0.88rem',
    fontWeight: '500',
    cursor: 'pointer',
    outline: 'none',
    borderRadius: '6px',
    transition: 'all 0.2s ease',
  },
  tabActive: {
    background: '#ffffff',
    color: '#0f172a',
    fontWeight: '600',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  filterGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  filterLabel: {
    fontSize: '0.85rem',
    color: '#64748b',
    fontWeight: '500',
    marginRight: '0.25rem',
  },
  filterBtn: {
    padding: '0.4rem 1rem',
    border: '1px solid #e2e8f0',
    borderRadius: '20px',
    background: '#ffffff',
    color: '#64748b',
    fontSize: '0.82rem',
    fontWeight: '500',
    cursor: 'pointer',
    outline: 'none',
  },
  filterActive: {
    background: '#0ea5e9',
    color: '#ffffff',
    borderColor: '#0ea5e9',
    fontWeight: '600',
  },
};

/* ─── Main Layout Styles ──────────────────────────────────── */
const mainStyles = {
  section: {
    position: 'relative',
    background: '#f8f8f8',
    backgroundImage: 'radial-gradient(circle, #e2e8f0 0.8px, transparent 0.8px)',
    backgroundSize: '24px 24px',
    padding: '2.5rem 2rem 4rem',
    overflow: 'hidden',
  },
  inner: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    gap: '2rem',
    alignItems: 'flex-start',
  },
  sidebar: {
    width: '280px',
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  eventsArea: {
    flex: 1,
    minWidth: 0,
  },
  eventsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1.5rem',
  },
};

/* ─── Calendar Styles ──────────────────────────────────────── */
const calStyles = {
  wrapper: {
    background: '#ffffff',
    borderRadius: '14px',
    padding: '1.5rem',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    border: '1px solid #f1f5f9',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    padding: '0 0.25rem',
  },
  arrow: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    border: 'none',
    background: 'transparent',
    color: '#64748b',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    outline: 'none',
    fontWeight: '600',
    lineHeight: 1,
    padding: 0,
  },
  monthLabel: {
    fontSize: '1.05rem',
    fontWeight: '700',
    color: '#0f172a',
  },
  dayNames: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    marginBottom: '0.75rem',
  },
  dayName: {
    textAlign: 'center',
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#94a3b8',
    padding: '0.25rem 0',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    rowGap: '8px',
  },
  day: {
    textAlign: 'center',
    fontSize: '0.82rem',
    color: '#374151',
    borderRadius: '50%',
    width: '34px',
    height: '34px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    fontWeight: '500',
  },
  today: {
    background: '#0ea5e9',
    color: '#ffffff',
    fontWeight: '700',
    borderRadius: '50%',
  },
  eventDay: {
    border: '2px solid #0ea5e9',
    color: '#0f172a',
    fontWeight: '600',
    borderRadius: '50%',
  },
};

/* ─── Weekly Gatherings Styles ─────────────────────────────── */
const gatherStyles = {
  wrapper: {
    background: '#e8f7fa',
    borderRadius: '14px',
    padding: '1.35rem 1.5rem',
    border: '1px solid #d1eef5',
  },
  heading: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.6rem 0',
    borderBottom: '1px solid rgba(14,165,233,0.12)',
  },
  name: {
    fontSize: '0.88rem',
    color: '#374151',
    fontWeight: '500',
  },
  time: {
    fontSize: '0.88rem',
    color: '#0f172a',
    fontWeight: '700',
  },
};

/* ─── Event Card Styles ────────────────────────────────────── */
const cardStyles = {
  card: {
    position: 'relative',
    background: '#ffffff',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
    border: '1px solid #e8ecf1',
  },
  imageWrap: {
    position: 'relative',
    height: '210px',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  dateBadge: {
    position: 'absolute',
    top: '14px',
    left: '14px',
    background: '#ffffff',
    borderRadius: '10px',
    padding: '7px 12px',
    textAlign: 'center',
    boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
    minWidth: '48px',
    zIndex: 2,
  },
  badgeMonth: {
    display: 'block',
    fontSize: '0.6rem',
    fontWeight: '800',
    color: '#ef4444',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    lineHeight: 1.3,
  },
  badgeDay: {
    display: 'block',
    fontSize: '1.5rem',
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: 1.1,
  },
  categoryTag: {
    position: 'absolute',
    top: '14px',
    right: '14px',
    color: '#ffffff',
    fontSize: '0.68rem',
    fontWeight: '700',
    padding: '4px 12px',
    borderRadius: '14px',
    letterSpacing: '0.04em',
    textTransform: 'capitalize',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    zIndex: 2,
  },
  body: {
    padding: '1.35rem 1.4rem 1.25rem',
  },
  title: {
    fontSize: '1.08rem',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 0.55rem',
    lineHeight: 1.35,
  },
  desc: {
    fontSize: '0.86rem',
    color: '#64748b',
    margin: '0 0 1rem',
    lineHeight: 1.6,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.55rem',
    marginBottom: '0.45rem',
  },
  metaText: {
    fontSize: '0.84rem',
    color: '#475569',
    fontWeight: '500',
  },
  btnRow: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '0.85rem',
    alignItems: 'center',
  },
  registerBtn: {
    flex: 1,
    padding: '0.65rem 1rem',
    background: '#0ea5e9',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
    outline: 'none',
    textAlign: 'center',
    letterSpacing: '0.02em',
  },
};

/* ─── Event Detail Modal Styles ────────────────────────────── */
const modalStyles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15,23,42,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 300,
    padding: '1rem',
  },
  modal: {
    position: 'relative',
    background: '#ffffff',
    borderRadius: '18px',
    width: '100%',
    maxWidth: '560px',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 25px 60px rgba(0,0,0,0.2)',
  },
  closeBtn: {
    position: 'absolute',
    top: '14px',
    right: '14px',
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    border: 'none',
    background: 'rgba(0,0,0,0.5)',
    color: '#fff',
    fontSize: '1.3rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    lineHeight: 1,
  },
  poster: {
    width: '100%',
    height: '260px',
    objectFit: 'cover',
    display: 'block',
    borderRadius: '18px 18px 0 0',
  },
  body: {
    padding: '1.5rem 1.75rem 1.75rem',
  },
  catPill: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '14px',
    color: '#fff',
    fontSize: '0.72rem',
    fontWeight: '700',
    textTransform: 'capitalize',
    letterSpacing: '0.03em',
  },
  regPill: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '14px',
    background: '#fef3c7',
    color: '#92400e',
    fontSize: '0.72rem',
    fontWeight: '700',
    letterSpacing: '0.03em',
  },
  title: {
    fontSize: '1.35rem',
    fontWeight: '800',
    color: '#0f172a',
    margin: '0 0 0.75rem',
    lineHeight: 1.3,
  },
  desc: {
    fontSize: '0.92rem',
    color: '#475569',
    margin: '0 0 1.25rem',
    lineHeight: 1.7,
  },
  metaSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginBottom: '1.25rem',
    padding: '0.85rem 1rem',
    background: '#f8fafc',
    borderRadius: '10px',
    border: '1px solid #f1f5f9',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    fontSize: '0.88rem',
    color: '#334155',
    fontWeight: '500',
  },
  actionRow: {
    display: 'flex',
    gap: '0.6rem',
    marginBottom: '1rem',
  },
  calBtn: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.7rem 1rem',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    background: '#f8fafc',
    color: '#334155',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
    outline: 'none',
  },
  shareBtn: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.7rem 1rem',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    background: '#f8fafc',
    color: '#334155',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
    outline: 'none',
  },
  regSection: {
    borderTop: '1px solid #f1f5f9',
    paddingTop: '1.25rem',
  },
  regTitle: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 0.85rem',
  },
  regForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.65rem',
  },
  regInput: {
    padding: '0.7rem 1rem',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    fontSize: '0.9rem',
    color: '#0f172a',
    outline: 'none',
    background: '#f8fafc',
  },
  regSubmitBtn: {
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    border: 'none',
    background: '#0ea5e9',
    color: '#fff',
    fontSize: '0.92rem',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '0.25rem',
  },
  successMsg: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    padding: '1rem 1.25rem',
    background: '#f0fdf4',
    borderRadius: '10px',
    border: '1px solid #bbf7d0',
    color: '#15803d',
    fontSize: '0.92rem',
    fontWeight: '600',
  },
  errorMsg: {
    padding: '0.6rem 1rem',
    background: '#fef2f2',
    borderRadius: '8px',
    border: '1px solid #fecaca',
    color: '#dc2626',
    fontSize: '0.85rem',
    fontWeight: '500',
  },
};

/* ─── Newsletter / Stay Connected Styles ───────────────────── */
const newsletterStyles = {
  section: {
    padding: '3.5rem 1.5rem 4rem',
    width: '100%',
    background: '#ffffff',
  },
  wrapper: {
    position: 'relative',
    width: '100%',
    maxWidth: '1600px',
    margin: '0 auto',
    padding: '3rem 2.5rem',
    background: 'linear-gradient(135deg, #bae6fd 0%, #e0f2fe 40%, #f0f9ff 100%)',
    borderRadius: '16px',
    overflow: 'hidden',
  },
  inner: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '2rem',
    flexWrap: 'wrap',
  },
  textCol: {
    flex: 1,
    minWidth: '240px',
  },
  heading: {
    fontSize: '1.55rem',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 0.45rem',
  },
  sub: {
    fontSize: '0.95rem',
    color: '#475569',
    margin: '0 0 0.2rem',
    lineHeight: 1.5,
  },
  subAm: {
    fontSize: '0.88rem',
    color: '#64748b',
    margin: 0,
    fontStyle: 'italic',
    lineHeight: 1.5,
  },
  formCol: {
    display: 'flex',
    alignItems: 'center',
  },
  form: {
    display: 'flex',
    gap: '0.5rem',
  },
  input: {
    padding: '0.78rem 1.2rem',
    border: '1.5px solid #cbd5e1',
    borderRadius: '10px',
    fontSize: '0.9rem',
    background: '#ffffff',
    color: '#0f172a',
    outline: 'none',
    width: '280px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
  },
  btn: {
    background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)',
    color: '#fff',
    border: 'none',
    padding: '0.78rem 2rem',
    borderRadius: '10px',
    fontWeight: '700',
    fontSize: '0.88rem',
    cursor: 'pointer',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    boxShadow: '0 4px 15px rgba(14,165,233,0.3), inset 0 1px 0 rgba(255,255,255,0.15)',
  },
  thanks: {
    color: '#0ea5e9',
    fontWeight: '700',
    fontSize: '1.05rem',
    margin: 0,
    background: '#ffffff',
    padding: '0.6rem 1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
};
