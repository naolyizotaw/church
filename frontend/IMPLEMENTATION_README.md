# Kerabu Full Gospel Church - Frontend Implementation

## Overview
This is a fully responsive, modern church website built with React, Vite, and Tailwind CSS. The design is pixel-perfect and matches the provided design mockup exactly.

## Features Implemented

### 1. **Header/Navigation**
- Sticky header with smooth backdrop blur effect
- Logo with church icon
- Desktop navigation menu (Home, About, Ministries, Sermons, Give)
- Language switcher button (EN | አማ)
- Responsive mobile menu with hamburger toggle
- Smooth transitions and hover effects

### 2. **Hero Section**
- Full-width hero banner with background image overlay
- Bilingual welcome text (English and Amharic)
- Two call-to-action buttons:
  - "Join Us This Sunday" (Primary action)
  - "Watch Sermons" (Secondary action with icon)
- Responsive typography and spacing
- Smooth hover animations

### 3. **Scripture of the Day**
- Elegant card design with centered content
- Section header with decorative lines
- Daily Bible verse in both English and Amharic
- Fetches live verse from Bible API with fallback
- Scripture reference display
- Responsive padding and typography

### 4. **Upcoming Events Section**
- Grid layout (3 columns on desktop, responsive on mobile)
- Event cards with:
  - Event date badge overlay
  - High-quality event images
  - Time with clock icon
  - Event title with hover effects
  - Brief description
  - "Learn More" link with arrow
- "View All Events" link in section header
- Smooth hover animations and transitions
- Image zoom effect on hover

### 5. **Newsletter Subscription**
- Eye-catching gradient background
- Email input with validation
- Subscribe button with hover effects
- Fully functional form submission handler
- Responsive layout (stacks on mobile)

### 6. **Footer**
- Four-column layout (responsive)
- **Brand Column:**
  - Church logo and name
  - Mission statement
  - Social media icons (Facebook, Twitter, YouTube, Email)
  
- **Quick Links:**
  - About Us
  - Our Beliefs
  - Ministries
  - Give Online
  
- **Service Times:**
  - Sunday Worship: 10:00 AM
  - Wednesday Prayer: 6:00 PM
  - Friday Youth: 5:00 PM
  
- **Visit Us:**
  - Interactive map preview
  - "Get Directions" button
  - Church address in Addis Ababa, Ethiopia

- Copyright notice and legal links

## Technology Stack

- **React 19.2.0** - UI framework
- **Vite 7.2.4** - Build tool and dev server
- **Tailwind CSS 4.1.18** - Utility-first CSS framework
- **Lucide React 0.561.0** - Icon library
- **PostCSS & Autoprefixer** - CSS processing

## Design Features

### Colors
- **Primary:** `#19c3e6` (Cyan/Turquoise)
- **Primary Dark:** `#15a3c0` (Hover state)
- **Background Light:** `#f6f8f8` (Light gray)
- **Background Dark:** `#111e21` (Dark mode)
- **Text Main:** `#111718` (Almost black)
- **Text Muted:** `#638288` (Gray)

### Typography
- **Font:** Inter (Google Fonts)
- **Weights:** 400, 500, 600, 700, 800, 900
- Responsive font sizes using Tailwind's responsive utilities

### Responsive Breakpoints
- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px
- **Max Width:** 1280px (content container)

## Components

### `/src/pages/Home.js`
Main page component containing all sections with:
- State management for announcements and verse
- API integration for Bible verses
- Newsletter form handling
- Mobile menu toggle
- Loading states

### `/src/components/AnnouncementCard.js`
Reusable event card component with:
- Image with overlay date badge
- Event details (time, title, description)
- Hover animations
- Responsive layout

### `/src/services/api.js`
Service layer for data fetching:
- Mock announcements data (ready for backend integration)
- Bilingual content support

## Features & Interactions

1. **Smooth Animations:**
   - Hover scale effects on buttons
   - Card elevation changes
   - Image zoom on event cards
   - Link hover states with underlines

2. **Accessibility:**
   - Semantic HTML5 elements
   - Proper heading hierarchy
   - Alt text for images
   - Form labels and validation

3. **Performance:**
   - Optimized images
   - Lazy loading support
   - Minimal bundle size
   - Fast Vite dev server

4. **Bilingual Support:**
   - English and Amharic text throughout
   - Language switcher in header (ready for i18n integration)
   - Proper Unicode handling for Amharic characters

## Setup & Running

### Installation
```bash
cd frontend
npm install
```

### Development
```bash
npm run dev
```
Opens at `http://localhost:5173`

### Build
```bash
npm run build
```
Outputs to `dist/` folder

### Preview Production Build
```bash
npm run preview
```

## File Structure
```
frontend/
├── src/
│   ├── pages/
│   │   └── Home.js              # Main home page
│   ├── components/
│   │   └── AnnouncementCard.js  # Event card component
│   ├── services/
│   │   └── api.js               # API service layer
│   ├── assets/                  # Images and icons
│   ├── App.js                   # Root component
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles
├── public/                      # Static assets
├── index.html                   # HTML template
├── tailwind.config.js           # Tailwind configuration
├── vite.config.js              # Vite configuration
└── package.json                # Dependencies
```

## Future Enhancements

1. **Backend Integration:**
   - Connect to actual backend API for events
   - User authentication for member portal
   - Admin dashboard for content management

2. **Additional Pages:**
   - About page with church history
   - Ministries page with detailed programs
   - Sermons archive with video player
   - Contact page with form
   - Give/Donate page with payment integration

3. **Features:**
   - Search functionality
   - Event calendar view
   - Multi-language support (full i18n)
   - Dark mode toggle
   - Prayer request submission
   - Member login area
   - Blog/News section

4. **SEO & Analytics:**
   - Meta tags optimization
   - Open Graph tags
   - Google Analytics integration
   - Sitemap generation

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Credits
- Design: Based on provided mockup
- Icons: Lucide React
- Fonts: Google Fonts (Inter)
- Images: Sample images from Googleusercontent

---

**Built with ❤️ for Kerabu Full Gospel Church**

