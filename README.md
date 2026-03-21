<p align="center">
  <img src="frontend/public/logo.png" alt="KFGC Logo" width="120" />
</p>

<h1 align="center">Kerabu Full Gospel Believers Church</h1>

<p align="center">
  <strong>እንኳን ወደ ከራቡ ሙሉ ወንጌል አማኞች ቤተክርስቲያን በደህና መጡ</strong>
</p>

<p align="center">
  A modern, full-stack church website for <strong>Kerabu Full Gospel Believers Church (KFGC)</strong> in Addis Ababa, Ethiopia — built with React, Express, and MongoDB.
</p>

<p align="center">
  <a href="#features"><img src="https://img.shields.io/badge/✦_Features-blue?style=for-the-badge" alt="Features" /></a>
  <a href="#tech-stack"><img src="https://img.shields.io/badge/✦_Tech_Stack-0ea5e9?style=for-the-badge" alt="Tech Stack" /></a>
  <a href="#getting-started"><img src="https://img.shields.io/badge/✦_Get_Started-10b981?style=for-the-badge" alt="Get Started" /></a>
  <a href="#api-reference"><img src="https://img.shields.io/badge/✦_API_Docs-f59e0b?style=for-the-badge" alt="API Docs" /></a>
</p>

<br />

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite 7" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/Express-4-000000?style=flat-square&logo=express&logoColor=white" alt="Express 4" />
  <img src="https://img.shields.io/badge/MongoDB-8-47A248?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Cloudinary-Media-3448C5?style=flat-square&logo=cloudinary&logoColor=white" alt="Cloudinary" />
  <img src="https://img.shields.io/badge/Chapa-Payments-FF6B35?style=flat-square" alt="Chapa Payments" />
</p>

---

## Overview

**KFGC** is a bilingual (English / Amharic) church management platform that serves as both a public-facing website and an administrative CMS. Members and visitors can explore services, watch sermons, register for events, give online, and stay connected — while church admins manage all content through a dedicated dashboard.

<p align="center">
  <img src="frontend/public/hero.jpg" alt="Church Hero Banner" width="700" style="border-radius: 12px;" />
</p>

---

## Features

### Public Website

| Feature | Description |
|:--------|:------------|
| **Home** | Hero section, Scripture of the Day (EN/AM), upcoming events, newsletter signup |
| **About** | Church history, mission, vision, and leadership profiles |
| **Services** | Weekly service times, locations, and descriptions in English & Amharic |
| **Ministries** | Programs and ministry groups with schedules |
| **Events** | Upcoming events with posters, multi-day support, and online registration |
| **Sermons** | Browse, search, and watch sermons (YouTube + file uploads), featured sermons |
| **Announcements** | Church announcements with member-only visibility option |
| **Online Giving** | Chapa integration (Telebirr, CBE Birr, M-Pesa, bank transfer) |
| **Contact** | Contact form with email, phone, and subject fields |
| **Bilingual UI** | English / Amharic toggle throughout the site |

### Admin Dashboard

| Feature | Description |
|:--------|:------------|
| **Dashboard** | Overview stats with charts (Recharts) |
| **Sermon Manager** | Upload sermons via file (Cloudinary) or YouTube link, manage featured |
| **Event Manager** | Create, edit, and delete events with poster images |
| **Page Editor** | Slug-based CMS for custom pages |
| **Contact Inbox** | View and manage contact form submissions |
| **Donation Tracker** | Track all online donations, status, and payment methods |
| **Reports** | Donation reports and site-wide analytics |
| **Media Library** | Upload, manage, and bulk-upload media files to Cloudinary |
| **Site Settings** | Church name, address, phone, social links, service times |
| **Notifications** | Real-time notification system for new donations, contacts, etc. |

---

## Tech Stack

### Frontend

| Technology | Purpose |
|:-----------|:--------|
| **React 19** | UI framework |
| **React Router 7** | Client-side routing |
| **Vite 7** | Build tool & dev server |
| **Tailwind CSS 4** | Utility-first styling |
| **Axios** | HTTP client with JWT interceptor |
| **Recharts** | Admin dashboard charts |

### Backend

| Technology | Purpose |
|:-----------|:--------|
| **Node.js + Express 4** | REST API server |
| **MongoDB + Mongoose 8** | Database & ODM |
| **JWT (jsonwebtoken)** | Authentication |
| **bcryptjs** | Password hashing |
| **Cloudinary** | Cloud media storage (sermons, images, media) |
| **Multer** | File upload middleware |
| **Chapa** | Ethiopian payment gateway |
| **CORS + cookie-parser** | Security & session handling |

---

## Project Structure

```
church/
├── package.json                  # Root scripts (install-all, build, start)
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── dbConnect.js      # MongoDB Atlas connection
│   │   │   ├── cloudinary.js     # Cloudinary configuration
│   │   │   ├── multerConfig.js   # Multer + Cloudinary for sermons (500MB)
│   │   │   └── imageUpload.js    # Image upload config
│   │   ├── controllers/          # 15+ route controllers
│   │   ├── middleware/
│   │   │   ├── auth.js           # JWT protect & optionalAuth
│   │   │   └── admin.js          # Admin role verification
│   │   ├── models/               # 15 Mongoose schemas
│   │   ├── routes/               # Express route modules
│   │   ├── seedEvents.js         # Event seed script
│   │   └── server.js             # Entry point
│   ├── scripts/
│   │   └── seedLeaders.js        # Leadership seed script
│   ├── uploads/                  # Local leader photo uploads
│   └── package.json
│
└── frontend/
    ├── public/
    │   ├── logo.png              # Church logo
    │   └── hero.jpg              # Homepage hero image
    ├── src/
    │   ├── admin/
    │   │   ├── components/       # AdminLayout, AdminRoute
    │   │   └── pages/            # 10 admin pages
    │   ├── api/
    │   │   └── axios.js          # Axios instance with JWT
    │   ├── components/
    │   │   ├── Navbar.jsx        # Sticky nav with mobile drawer
    │   │   └── Footer.jsx        # Animated footer with map
    │   ├── context/
    │   │   └── AuthContext.jsx    # Auth state management
    │   ├── pages/                # 11 public pages
    │   ├── App.jsx               # Route definitions
    │   ├── main.jsx              # App entry with AuthProvider
    │   ├── index.css             # Global styles
    │   └── responsive.css        # Responsive overrides
    ├── vite.config.js            # Dev server on :3000, proxy to :6001
    └── package.json
```

---

## Data Models

The backend defines **15 Mongoose models**:

| Model | Key Fields |
|:------|:-----------|
| **User** | name, email, password (bcrypt), role (`user` / `admin`) |
| **Sermon** | title, speaker, series, topic, videoUrl, youtubeVideoId, fileUrl, thumbnailUrl, isFeatured |
| **Event** | title, date, endDate, location, category, posterUrl, isRecurring, requiresRegistration |
| **Registration** | event (ref), name, email, phone — unique per event+phone |
| **Announcement** | title, content, isMemberOnly, createdBy |
| **Service** | title, titleAmharic, day, time, endTime, location, type (`main`/`weekly`), isActive |
| **Program** | title, description, day, time, location, category, icon, isActive |
| **Leader** | name, role, roleAm, bio, photoUrl, phone, email, social links, displayOrder |
| **Donation** | firstName, lastName, amount, currency, donationType, txRef, chapaRef, status, paymentMethod |
| **Contact** | name, email, phone, subject, message, isRead |
| **Page** | slug, title, content, lastUpdatedBy |
| **Verse** | textEnglish, textAmharic, referenceEnglish, referenceAmharic, date, isActive |
| **SiteContent** | churchName, address, phone, email, mapQuery, serviceTimes, socialLinks |
| **Notification** | type, title, message, relatedId, relatedModel, isRead |
| **Media** | filename, url, category (`image`/`video`/`audio`/`document`), usedBy, uploadedBy |

---

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **Cloudinary** account ([cloudinary.com](https://cloudinary.com))
- **Chapa** merchant account ([chapa.co](https://chapa.co)) — for online giving

### 1. Clone the Repository

```bash
git clone https://github.com/naolyizotaw/church.git
cd church
```

### 2. Install Dependencies

```bash
npm run install-all
```

This installs both backend and frontend dependencies in one command.

### 3. Configure Environment Variables

Create `backend/.env` with the following:

```env
PORT=6001
NODE_ENV=development

CONNECTION_STRING=mongodb://localhost:27017/church
# Or use MongoDB Atlas:
# CONNECTION_STRING=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/church

JWT_SECRET=your_super_secret_jwt_key

CLIENT_URL=http://localhost:3000

CHAPA_SECRET_KEY=your_chapa_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Seed Sample Data (Optional)

```bash
# Seed sample events (requires an admin user in the database)
cd backend && node src/seedEvents.js

# Seed church leadership profiles
cd backend && node scripts/seedLeaders.js
```

### 5. Run the Development Servers

From the **root** directory:

```bash
# Terminal 1 — Backend (port 6001)
cd backend
npm run dev

# Terminal 2 — Frontend (port 3000)
cd frontend
npm run dev
```

The frontend Vite dev server proxies `/api` and `/uploads` requests to `http://localhost:6001`.

### 6. Open in Browser

```
http://localhost:3000          # Public website
http://localhost:3000/admin    # Admin dashboard
```

---

## API Reference

The backend exposes a RESTful API under `/api`. Below is a summary of all endpoints:

### Authentication

| Method | Endpoint | Access | Description |
|:-------|:---------|:-------|:------------|
| `POST` | `/api/auth/register` | Public | Register a new user |
| `POST` | `/api/auth/login` | Public | Login and receive JWT |
| `GET` | `/api/auth/me` | Private | Get current user profile |
| `PUT` | `/api/auth/profile` | Private | Update profile |
| `PUT` | `/api/auth/password` | Private | Change password |

### Content Management

| Method | Endpoint | Access | Description |
|:-------|:---------|:-------|:------------|
| `GET` | `/api/sermons` | Public | List all sermons |
| `GET` | `/api/sermons/featured` | Public | Get featured sermons |
| `POST` | `/api/sermons` | Admin | Create sermon (file upload or YouTube) |
| `GET` | `/api/events` | Public | List all events |
| `POST` | `/api/events` | Admin | Create event |
| `GET` | `/api/announcements` | Public | List announcements |
| `GET` | `/api/services` | Public | List service times |
| `GET` | `/api/programs` | Public | List ministry programs |
| `GET` | `/api/leaders` | Public | List church leaders |
| `GET` | `/api/verses/today` | Public | Get daily Scripture verse |
| `GET` | `/api/pages/:slug` | Public | Get CMS page by slug |
| `GET` | `/api/site-content` | Public | Get site settings |

### Donations (Chapa)

| Method | Endpoint | Access | Description |
|:-------|:---------|:-------|:------------|
| `POST` | `/api/donations/initialize` | Public | Start a donation payment |
| `GET` | `/api/donations/verify/:txRef` | Public | Verify payment status |
| `POST` | `/api/donations/callback` | Webhook | Chapa payment callback |
| `GET` | `/api/donations` | Admin | List all donations |
| `GET` | `/api/donations/stats` | Admin | Donation statistics |

### Additional Admin Endpoints

| Method | Endpoint | Access | Description |
|:-------|:---------|:-------|:------------|
| `GET` | `/api/contacts` | Admin | View contact submissions |
| `GET` | `/api/registrations/:eventId` | Admin | View event registrations |
| `GET` | `/api/notifications` | Admin | List notifications |
| `GET` | `/api/reports/donations` | Admin | Donation reports |
| `GET` | `/api/reports/overview` | Admin | Site overview report |
| `POST` | `/api/media/upload` | Admin | Upload media to Cloudinary |
| `POST` | `/api/media/upload-bulk` | Admin | Bulk upload (up to 20 files) |

> For complete API documentation with request/response examples, see [`backend/API_DOCUMENTATION.md`](backend/API_DOCUMENTATION.md).

---

## Scripts

| Command | Location | Description |
|:--------|:---------|:------------|
| `npm run install-all` | Root | Install all backend + frontend dependencies |
| `npm run build` | Root | Production build (install deps + build frontend) |
| `npm start` | Root | Start production server |
| `npm run dev` | `backend/` | Start backend with nodemon (hot reload) |
| `npm run dev` | `frontend/` | Start Vite dev server on port 3000 |
| `npm run build` | `frontend/` | Build frontend for production |
| `npm run lint` | `frontend/` | Run ESLint |

---

## Deployment

### Production Build

```bash
# From root
npm run build    # Installs deps + builds frontend
npm start        # Starts Express in production mode
```

In production, Express serves the built frontend static files and handles API routes.

### Environment Variables for Production

```env
PORT=6001
NODE_ENV=production
CONNECTION_STRING=mongodb+srv://...
JWT_SECRET=a_strong_random_secret
CLIENT_URL=https://your-domain.com
CHAPA_SECRET_KEY=your_live_chapa_key
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### Hosting Recommendations

- **Backend**: [Render](https://render.com), [Railway](https://railway.app), or any Node.js host
- **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier available)
- **Media**: [Cloudinary](https://cloudinary.com) (free tier: 25GB storage)

---

## Authentication

- **JWT-based** authentication with 30-day token expiry
- Tokens stored in `localStorage` and sent via Authorization header
- Two roles: `user` and `admin`
- Protected routes use `protect` middleware; admin routes add `admin` middleware
- Axios interceptor auto-clears token and redirects on 401 responses
- Admin dashboard is guarded by `AdminRoute` component

---

## Payment Integration

Online giving is powered by **Chapa**, Ethiopia's leading payment gateway:

- **Supported methods**: Telebirr, CBE Birr, M-Pesa, bank transfer
- **Flow**: Initialize payment -> Redirect to Chapa -> Callback/Webhook -> Verify
- **Donation types**: One-time and monthly recurring
- **Currency**: Ethiopian Birr (ETB)
- Admin dashboard tracks all donations with status, amounts, and payment methods

---

## Bilingual Support

The site supports **English** and **Amharic** (አማርኛ):

- Service titles and descriptions in both languages
- Scripture of the Day displayed in EN and AM
- Leader roles in English and Amharic
- Language toggle button in the navigation bar
- Amharic fields in Service, Program, Leader, and Verse models

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the **ISC License**.

---

<p align="center">
  <img src="frontend/public/logo.png" alt="KFGC" width="50" />
</p>

<p align="center">
  <strong>Kerabu Full Gospel Believers Church</strong><br />
  <em>A place of faith, hope, and community where everyone is welcome.</em><br /><br />
  Addis Ababa, Ethiopia
</p>

<p align="center">
  <sub>Built with prayer and code.</sub>
</p>
