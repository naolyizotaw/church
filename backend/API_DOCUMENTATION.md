# Church Website Backend - API Documentation

## Overview
This is a RESTful API backend for a church website built with Node.js, Express, and MongoDB.

## Technology Stack
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose**
- **JWT** for authentication
- **Multer** for file uploads
- **bcrypt** for password hashing

## Project Structure
```
backend/
├── src/
│   ├── config/
│   │   ├── dbConnect.js          # MongoDB connection
│   │   └── multerConfig.js       # Multer configuration for file uploads
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── announcementController.js
│   │   ├── pageController.js
│   │   ├── eventController.js
│   │   ├── sermonController.js
│   │   └── contactController.js
│   ├── middleware/
│   │   ├── auth.js               # JWT protection & optional auth
│   │   └── admin.js              # Admin role verification
│   ├── models/
│   │   ├── User.js
│   │   ├── Announcement.js
│   │   ├── Page.js
│   │   ├── Event.js
│   │   ├── Sermon.js
│   │   └── Contact.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── announcementRoutes.js
│   │   ├── pageRoutes.js
│   │   ├── eventRoutes.js
│   │   ├── sermonRoutes.js
│   │   └── contactRoutes.js
│   └── server.js                 # Main application entry point
├── uploads/                      # Uploaded sermon files (audio/video)
│   └── .gitkeep
└── package.json
```

## API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/register` | Public | Register new user |
| POST | `/login` | Public | Login user |
| GET | `/me` | Protected | Get current user profile |

### Announcements (`/api/announcements`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Public/Optional Auth | Get all announcements (filtered by member status) |
| POST | `/` | Admin | Create new announcement |
| PUT | `/:id` | Admin | Update announcement |
| DELETE | `/:id` | Admin | Delete announcement |

**Note:** Public users only see announcements with `isMemberOnly: false`. Logged-in users (members) and admins see all announcements.

### Pages (`/api/pages`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Public | Get all pages |
| GET | `/:slug` | Public | Get page by slug |
| PUT | `/:slug` | Admin | Create or update page by slug (upsert) |
| DELETE | `/:slug` | Admin | Delete page by slug |

**Note:** Pages use slug-based routing (e.g., `about-us`, `services`, `programs`)

### Events (`/api/events`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Public | Get all events (sorted by date) |
| GET | `/:id` | Public | Get single event |
| POST | `/` | Admin | Create new event |
| PUT | `/:id` | Admin | Update event |
| DELETE | `/:id` | Admin | Delete event |

### Sermons (`/api/sermons`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Public | Get all sermons (sorted by date desc) |
| GET | `/:id` | Public | Get single sermon |
| POST | `/` | Admin | Create new sermon with file upload |
| PUT | `/:id` | Admin | Update sermon metadata (no file change) |
| DELETE | `/:id` | Admin | Delete sermon and file |

**Note:** POST endpoint accepts multipart/form-data with field name `file`

### Contacts (`/api/contacts`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/` | Public | Submit contact form |
| GET | `/` | Admin | Get all contact submissions |
| GET | `/:id` | Admin | Get single contact submission |
| PATCH | `/:id/read` | Admin | Toggle read/unread status |
| DELETE | `/:id` | Admin | Delete contact submission |

## Request/Response Examples

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

Response:
```json
{
  "_id": "...",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "member",
  "token": "jwt_token_here"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### Announcements

#### Create Announcement
```http
POST /api/announcements
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "Sunday Service Update",
  "content": "This week's service will be at 10 AM instead of 9 AM.",
  "isMemberOnly": false
}
```

#### Get Announcements
```http
GET /api/announcements
Authorization: Bearer <token> (optional)
```

### Pages

#### Create/Update Page (Upsert)
```http
PUT /api/pages/about-us
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "About Us",
  "content": "Welcome to our church..."
}
```

#### Get Page by Slug
```http
GET /api/pages/about-us
```

### Events

#### Create Event
```http
POST /api/events
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "Youth Bible Study",
  "description": "Join us for an engaging Bible study session",
  "date": "2025-12-20T18:00:00.000Z",
  "location": "Youth Hall"
}
```

### Sermons

#### Upload Sermon
```http
POST /api/sermons
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data

Form Data:
- file: [audio/video file]
- title: "The Power of Prayer"
- description: "A sermon about the importance of prayer"
- speaker: "Pastor John"
- date: "2025-12-14T10:00:00.000Z"
- fileType: "audio" or "video"
```

Response:
```json
{
  "_id": "...",
  "title": "The Power of Prayer",
  "description": "A sermon about the importance of prayer",
  "speaker": "Pastor John",
  "date": "2025-12-14T10:00:00.000Z",
  "fileUrl": "/uploads/file-1734178620000-123456789.mp3",
  "fileType": "audio",
  "uploadedBy": {
    "_id": "...",
    "name": "Admin User",
    "email": "admin@church.com"
  },
  "createdAt": "...",
  "updatedAt": "..."
}
```

### Contacts

#### Submit Contact Form
```http
POST /api/contacts
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "subject": "Prayer Request",
  "message": "Please pray for my family..."
}
```

## Authentication

### JWT Token Usage
All protected routes require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### User Roles
- **member**: Default role for registered users
- **admin**: Required for creating/updating/deleting content

### Middleware
- `protect`: Verifies JWT token and attaches user to `req.user`
- `optionalAuth`: Tries to authenticate but doesn't fail if no token (for public routes with conditional behavior)
- `admin`: Checks if `req.user.role === 'admin'` (must be used after `protect`)

## File Upload Configuration

### Multer Settings
- **Storage**: Disk storage in `/uploads` directory
- **File naming**: `{fieldname}-{timestamp}-{random}-{originalextension}`
- **Accepted types**: Audio (mp3, wav, ogg, aac, m4a) and Video (mp4, mpeg, quicktime, avi, webm)
- **Max file size**: 500MB
- **Field name**: `file`

### Static File Serving
Uploaded files are served statically from `/uploads`:
```
http://localhost:6001/uploads/file-1734178620000-123456789.mp3
```

## Error Handling

### Standard Error Responses
All endpoints return errors in the following format:

```json
{
  "message": "Error description"
}
```

### HTTP Status Codes
- `200`: Success (GET, PUT, PATCH)
- `201`: Created (POST)
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (invalid/missing token)
- `403`: Forbidden (not admin)
- `404`: Not Found
- `500`: Server Error

## Database Models

### User
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['member', 'admin'], default: 'member')
}
```

### Announcement
```javascript
{
  title: String (required),
  content: String (required),
  isMemberOnly: Boolean (default: false),
  createdBy: ObjectId (ref: User, required)
}
```

### Page
```javascript
{
  slug: String (required, unique, lowercase),
  title: String (required),
  content: String (required),
  lastUpdatedBy: ObjectId (ref: User)
}
```

### Event
```javascript
{
  title: String (required),
  description: String (required),
  date: Date (required),
  location: String,
  createdBy: ObjectId (ref: User, required)
}
```

### Sermon
```javascript
{
  title: String (required),
  description: String,
  speaker: String (required),
  date: Date (required),
  fileUrl: String (required),
  fileType: String (enum: ['audio', 'video'], required),
  uploadedBy: ObjectId (ref: User, required)
}
```

### Contact
```javascript
{
  name: String (required),
  email: String (required),
  subject: String,
  message: String (required),
  isRead: Boolean (default: false)
}
```

## Environment Variables

Create a `.env` file in the backend root:

```env
NODE_ENV=development
PORT=6001
CONNECTION_STRING=mongodb://localhost:27017/church_db
JWT_SECRET=your_jwt_secret_key_here
```

## Running the Server

```bash
# Install dependencies
npm install

# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## Testing with Tools

### Recommended Tools
- **Postman**: For API testing
- **Thunder Client** (VS Code): For quick API testing
- **cURL**: For command-line testing

### Example cURL Commands

Register:
```bash
curl -X POST http://localhost:6001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

Create Announcement (requires admin token):
```bash
curl -X POST http://localhost:6001/api/announcements \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"title":"New Announcement","content":"Content here","isMemberOnly":false}'
```

Upload Sermon (requires admin token):
```bash
curl -X POST http://localhost:6001/api/sermons \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "file=@/path/to/sermon.mp3" \
  -F "title=Sunday Sermon" \
  -F "speaker=Pastor John" \
  -F "date=2025-12-14" \
  -F "fileType=audio" \
  -F "description=A great sermon"
```

## Notes

1. **Member-Only Announcements**: Only authenticated users can see announcements with `isMemberOnly: true`
2. **File Cleanup**: When deleting sermons, the associated file is automatically removed from the filesystem
3. **Page Slugs**: Page slugs are lowercase and used as URL-friendly identifiers
4. **Sorting**: Events are sorted by date (ascending), Sermons and Announcements by date (descending)
5. **Password Security**: Passwords are hashed using bcrypt before storage
6. **Token Expiry**: JWT tokens expire after 30 days

## Future Enhancements

Potential features to add:
- Email notifications for contact form submissions
- Pagination for large lists
- Search functionality
- Image uploads for events and pages
- Newsletter subscription
- Calendar integration
- User profile management
- Comments on sermons
