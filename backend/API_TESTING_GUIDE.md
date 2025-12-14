# API Testing Guide - Church Website Backend

Quick reference for testing all API endpoints with example requests.

---

## 🔑 Prerequisites

1. **Server running**: `npm run dev` (Port: 6001)
2. **MongoDB running**: Make sure your MongoDB is connected
3. **Environment variables**: Ensure `.env` file is configured
4. **Tool**: Use Postman, Thunder Client (VS Code), or curl

---

## 📝 Step-by-Step Testing Workflow

### Step 1: Register an Admin User

```http
POST http://localhost:6001/api/auth/register
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@church.com",
  "password": "admin123",
  "role": "admin"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "name": "Admin User",
    "email": "admin@church.com",
    "role": "admin"
  }
}
```

**➡️ Save the `token` for protected routes!**

---

### Step 2: Register a Regular User

```http
POST http://localhost:6001/api/auth/register
Content-Type: application/json

{
  "name": "John Member",
  "email": "member@church.com",
  "password": "member123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "name": "John Member",
    "email": "member@church.com",
    "role": "user"
  }
}
```

---

### Step 3: Login

```http
POST http://localhost:6001/api/auth/login
Content-Type: application/json

{
  "email": "admin@church.com",
  "password": "admin123"
}
```

---

## 📢 Announcements API

### Get All Announcements (Public - No Token)

```http
GET http://localhost:6001/api/announcements
```

**What you'll see**: Only announcements with `isMemberOnly: false`

---

### Get All Announcements (Logged In User)

```http
GET http://localhost:6001/api/announcements
Authorization: Bearer YOUR_USER_TOKEN
```

**What you'll see**: All announcements (including member-only)

---

### Create Announcement (Admin Only)

```http
POST http://localhost:6001/api/announcements
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json

{
  "title": "Christmas Service 2024",
  "content": "Join us for our special Christmas service on December 25th at 10 AM. Bring your family and friends!",
  "isMemberOnly": false
}
```

**Response:**
```json
{
  "_id": "...",
  "title": "Christmas Service 2024",
  "content": "Join us for our special Christmas service...",
  "isMemberOnly": false,
  "createdBy": {
    "_id": "...",
    "name": "Admin User",
    "email": "admin@church.com"
  },
  "createdAt": "2024-12-14T...",
  "updatedAt": "2024-12-14T..."
}
```

---

### Create Member-Only Announcement

```http
POST http://localhost:6001/api/announcements
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json

{
  "title": "Members Meeting",
  "content": "Important members-only meeting this Saturday at 7 PM.",
  "isMemberOnly": true
}
```

---

### Update Announcement

```http
PUT http://localhost:6001/api/announcements/ANNOUNCEMENT_ID
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json

{
  "title": "Updated: Christmas Service 2024",
  "content": "Updated content here...",
  "isMemberOnly": false
}
```

---

### Delete Announcement

```http
DELETE http://localhost:6001/api/announcements/ANNOUNCEMENT_ID
Authorization: Bearer YOUR_ADMIN_TOKEN
```

---

## 📄 Pages API (Slug-based)

### Get All Pages (Public)

```http
GET http://localhost:6001/api/pages
```

---

### Get Page by Slug (Public)

```http
GET http://localhost:6001/api/pages/about-us
```

---

### Create/Update Page (Admin - Upsert)

```http
PUT http://localhost:6001/api/pages/about-us
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json

{
  "title": "About Us",
  "content": "<h1>Welcome to Our Church</h1><p>We are a community...</p>"
}
```

**Note**: This will create the page if it doesn't exist, or update if it does.

---

### Create Services Page

```http
PUT http://localhost:6001/api/pages/services
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json

{
  "title": "Our Services & Programs",
  "content": "<h2>Sunday Service</h2><p>10:00 AM every Sunday</p>"
}
```

---

### Delete Page

```http
DELETE http://localhost:6001/api/pages/about-us
Authorization: Bearer YOUR_ADMIN_TOKEN
```

---

## 📅 Events API

### Get All Events (Public)

```http
GET http://localhost:6001/api/events
```

---

### Get Single Event (Public)

```http
GET http://localhost:6001/api/events/EVENT_ID
```

---

### Create Event (Admin)

```http
POST http://localhost:6001/api/events
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json

{
  "title": "Youth Camp 2024",
  "description": "Annual youth summer camp with activities, worship, and fellowship.",
  "date": "2024-07-15T09:00:00.000Z",
  "location": "Mountain View Retreat Center"
}
```

---

### Update Event

```http
PUT http://localhost:6001/api/events/EVENT_ID
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json

{
  "title": "Youth Camp 2024 - Extended",
  "location": "Updated Location"
}
```

---

### Delete Event

```http
DELETE http://localhost:6001/api/events/EVENT_ID
Authorization: Bearer YOUR_ADMIN_TOKEN
```

---

## 🎤 Sermons API (with File Upload)

### Get All Sermons (Public)

```http
GET http://localhost:6001/api/sermons
```

---

### Get Single Sermon (Public)

```http
GET http://localhost:6001/api/sermons/SERMON_ID
```

---

### Upload Sermon (Admin - with File)

**⚠️ This requires multipart/form-data (use Postman/Thunder Client form-data)**

```http
POST http://localhost:6001/api/sermons
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: multipart/form-data

Form Data:
- file: [Select your audio/video file]
- title: "The Power of Faith"
- speaker: "Pastor John Smith"
- date: "2024-12-10"
- fileType: "audio"
- description: "A powerful message about faith and perseverance"
```

**Postman Steps:**
1. Select `POST` method
2. URL: `http://localhost:6001/api/sermons`
3. Headers: `Authorization: Bearer YOUR_ADMIN_TOKEN`
4. Body → select `form-data`
5. Add fields:
   - `file` (type: File) - click and select your mp3/mp4 file
   - `title` (type: Text) - "The Power of Faith"
   - `speaker` (type: Text) - "Pastor John Smith"
   - `date` (type: Text) - "2024-12-10"
   - `fileType` (type: Text) - "audio" or "video"
   - `description` (type: Text) - "Optional description"

**Response:**
```json
{
  "_id": "...",
  "title": "The Power of Faith",
  "speaker": "Pastor John Smith",
  "date": "2024-12-10T00:00:00.000Z",
  "fileUrl": "/uploads/file-1702512345678-123456789.mp3",
  "fileType": "audio",
  "description": "A powerful message...",
  "uploadedBy": {
    "_id": "...",
    "name": "Admin User",
    "email": "admin@church.com"
  },
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

### Update Sermon Metadata (Admin)

```http
PUT http://localhost:6001/api/sermons/SERMON_ID
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description",
  "speaker": "Pastor Mike Johnson"
}
```

**Note**: File cannot be changed via update. Delete and re-upload if needed.

---

### Delete Sermon (Admin)

```http
DELETE http://localhost:6001/api/sermons/SERMON_ID
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**This will delete both the database record AND the file from `/uploads` folder.**

---

## 📧 Contacts API

### Submit Contact Form (Public - No Auth)

```http
POST http://localhost:6001/api/contacts
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "subject": "Prayer Request",
  "message": "Please pray for my family during this difficult time. Thank you."
}
```

**Response:**
```json
{
  "message": "Contact form submitted successfully",
  "contact": {
    "_id": "...",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "subject": "Prayer Request",
    "message": "Please pray for my family...",
    "isRead": false,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

### Get All Contact Submissions (Admin)

```http
GET http://localhost:6001/api/contacts
Authorization: Bearer YOUR_ADMIN_TOKEN
```

---

### Get Single Contact Submission (Admin)

```http
GET http://localhost:6001/api/contacts/CONTACT_ID
Authorization: Bearer YOUR_ADMIN_TOKEN
```

---

### Toggle Read Status (Admin)

```http
PATCH http://localhost:6001/api/contacts/CONTACT_ID/read
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**This toggles `isRead` between `true` and `false`.**

---

### Delete Contact Submission (Admin)

```http
DELETE http://localhost:6001/api/contacts/CONTACT_ID
Authorization: Bearer YOUR_ADMIN_TOKEN
```

---

## 🧪 Complete Test Sequence

Here's a suggested order to test everything:

1. ✅ **Register admin** → Save token
2. ✅ **Register regular user** → Save token
3. ✅ **Test announcements**:
   - Create announcement (public and member-only)
   - Get announcements without token (should only see public)
   - Get announcements with user token (should see all)
4. ✅ **Test pages**:
   - Create "about-us" page
   - Create "services" page
   - Get all pages
   - Get single page by slug
5. ✅ **Test events**:
   - Create event
   - Get all events
   - Update event
6. ✅ **Test sermons**:
   - Upload sermon with audio file
   - Upload sermon with video file
   - Get all sermons
   - Delete sermon (check that file is removed)
7. ✅ **Test contacts**:
   - Submit contact form (no auth)
   - Get all contacts as admin
   - Toggle read status
   - Delete contact

---

## 🛠️ Troubleshooting

### "Not authorized, no token"
- Make sure you're sending the token in the `Authorization` header
- Format: `Bearer YOUR_TOKEN_HERE`

### "Not authorized as admin"
- You're logged in as a regular user, not admin
- Login with admin credentials

### "Page not found" (404)
- Double-check the URL
- Make sure the resource exists (especially for GET/:id routes)

### File upload not working
- Make sure you're using `multipart/form-data`
- Field name for file must be `file`
- Check file size (max 500MB)
- Check file type (audio/video only)

### "Server error" (500)
- Check if MongoDB is running
- Check server console for detailed error logs
- Verify environment variables are set

---

## 📱 Test with Frontend

Once you build the frontend:

1. **Public pages**: Just visit the URLs (no login needed)
2. **Member pages**: Login as regular user
3. **Admin dashboard**: Login as admin user

---

## 🎉 Success Indicators

You know everything is working when:

- ✅ You can register and login users
- ✅ Public users see only public announcements
- ✅ Members see all announcements
- ✅ Admins can create/edit/delete all resources
- ✅ Files upload successfully and are served from `/uploads`
- ✅ Contact forms submit without authentication
- ✅ Proper error messages for invalid requests

**Happy testing!** 🚀
