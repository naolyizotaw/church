# Church Website Backend

A complete RESTful API backend for a church website built with Node.js, Express, and MongoDB.

## Features

✅ **Authentication & Authorization**
- JWT-based authentication
- Role-based access control (Member/Admin)
- Secure password hashing with bcrypt

✅ **Content Management**
- Announcements (public and member-only)
- Dynamic pages with slug-based routing
- Events management
- Sermon library with audio/video uploads
- Contact form submissions

✅ **File Upload**
- Multer integration for sermon files
- Audio/video file support
- Automatic file cleanup on deletion
- 500MB file size limit

✅ **Security**
- Protected routes with JWT middleware
- Admin-only routes
- Input validation
- Error handling

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **File Upload**: Multer
- **Password Hashing**: bcrypt

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

## Installation

1. **Clone the repository** (if not already done)
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment variables**
   
   Create a `.env` file in the backend root directory:
   ```env
   NODE_ENV=development
   PORT=6001
   MONGO_URI=mongodb://localhost:27017/church_db
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   ```

4. **Ensure uploads directory exists** (already created)
   ```bash
   # The uploads directory should already exist
   # If not, create it:
   mkdir uploads
   ```

## Running the Application

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:6001` (or your specified PORT).

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── dbConnect.js          # MongoDB connection configuration
│   │   └── multerConfig.js       # File upload configuration
│   │
│   ├── controllers/              # Business logic for each resource
│   │   ├── authController.js
│   │   ├── announcementController.js
│   │   ├── pageController.js
│   │   ├── eventController.js
│   │   ├── sermonController.js
│   │   └── contactController.js
│   │
│   ├── middleware/               # Custom middleware
│   │   ├── auth.js              # JWT verification & optional auth
│   │   └── admin.js             # Admin role verification
│   │
│   ├── models/                  # Mongoose schemas
│   │   ├── User.js
│   │   ├── Announcement.js
│   │   ├── Page.js
│   │   ├── Event.js
│   │   ├── Sermon.js
│   │   └── Contact.js
│   │
│   ├── routes/                  # Route definitions
│   │   ├── authRoutes.js
│   │   ├── announcementRoutes.js
│   │   ├── pageRoutes.js
│   │   ├── eventRoutes.js
│   │   ├── sermonRoutes.js
│   │   └── contactRoutes.js
│   │
│   └── server.js                # Application entry point
│
├── uploads/                     # Uploaded sermon files
│   └── .gitkeep
│
├── .env                         # Environment variables (create this)
├── package.json
├── README.md                    # This file
└── API_DOCUMENTATION.md         # Detailed API documentation
```

## API Endpoints Summary

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /me` - Get current user (protected)

### Announcements (`/api/announcements`)
- `GET /` - Get all announcements (public/optional auth)
- `POST /` - Create announcement (admin only)
- `PUT /:id` - Update announcement (admin only)
- `DELETE /:id` - Delete announcement (admin only)

### Pages (`/api/pages`)
- `GET /` - Get all pages (public)
- `GET /:slug` - Get page by slug (public)
- `PUT /:slug` - Create/update page (admin only)
- `DELETE /:slug` - Delete page (admin only)

### Events (`/api/events`)
- `GET /` - Get all events (public)
- `GET /:id` - Get single event (public)
- `POST /` - Create event (admin only)
- `PUT /:id` - Update event (admin only)
- `DELETE /:id` - Delete event (admin only)

### Sermons (`/api/sermons`)
- `GET /` - Get all sermons (public)
- `GET /:id` - Get single sermon (public)
- `POST /` - Upload sermon with file (admin only)
- `PUT /:id` - Update sermon metadata (admin only)
- `DELETE /:id` - Delete sermon and file (admin only)

### Contacts (`/api/contacts`)
- `POST /` - Submit contact form (public)
- `GET /` - Get all submissions (admin only)
- `GET /:id` - Get single submission (admin only)
- `PATCH /:id/read` - Toggle read status (admin only)
- `DELETE /:id` - Delete submission (admin only)

For detailed API documentation with request/response examples, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

## Usage Examples

### 1. Register a User
```bash
curl -X POST http://localhost:6001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:6001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Create Announcement (requires admin token)
```bash
curl -X POST http://localhost:6001/api/announcements \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Sunday Service",
    "content": "Join us this Sunday at 10 AM",
    "isMemberOnly": false
  }'
```

### 4. Upload Sermon (requires admin token)
```bash
curl -X POST http://localhost:6001/api/sermons \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/sermon.mp3" \
  -F "title=The Power of Prayer" \
  -F "speaker=Pastor John" \
  -F "date=2025-12-14" \
  -F "fileType=audio" \
  -F "description=A wonderful sermon about prayer"
```

## Creating Your First Admin User

Since all content creation requires admin access, you'll need to create an admin user. Here are two ways:

### Option 1: MongoDB Compass or mongosh
1. Register a regular user via the API
2. Connect to MongoDB and find the user
3. Update their role field from "member" to "admin"

```javascript
// In mongosh or MongoDB Compass
db.users.updateOne(
  { email: "admin@church.com" },
  { $set: { role: "admin" } }
)
```

### Option 2: Direct Database Insert
```javascript
// In mongosh
db.users.insertOne({
  name: "Admin User",
  email: "admin@church.com",
  password: "$2a$10$...", // You'll need to hash the password first
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

## File Upload Details

### Supported File Types
**Audio:**
- MP3 (.mp3)
- WAV (.wav)
- OGG (.ogg)
- AAC (.aac)
- M4A (.m4a)

**Video:**
- MP4 (.mp4)
- MPEG (.mpeg)
- QuickTime (.mov)
- AVI (.avi)
- WebM (.webm)

### File Size Limit
- Maximum: 500MB per file

### Storage Location
- Files are stored in `/backend/uploads/`
- Accessible via: `http://localhost:6001/uploads/{filename}`

### File Naming
Files are automatically renamed with a unique identifier:
```
{fieldname}-{timestamp}-{random-number}.{extension}
```
Example: `file-1734178620000-123456789.mp3`

## Security Considerations

1. **JWT Secret**: Change `JWT_SECRET` in production to a strong, random string
2. **Password Hashing**: All passwords are hashed with bcrypt (10 salt rounds)
3. **Protected Routes**: Admin routes are protected with both JWT verification and role checking
4. **Input Validation**: Basic validation on all input fields
5. **File Type Validation**: Only audio/video files accepted for sermon uploads

## Database Schema Overview

### User
- name, email (unique), password (hashed), role (member/admin)

### Announcement
- title, content, isMemberOnly (boolean), createdBy (User ref)

### Page
- slug (unique), title, content, lastUpdatedBy (User ref)

### Event
- title, description, date, location, createdBy (User ref)

### Sermon
- title, description, speaker, date, fileUrl, fileType, uploadedBy (User ref)

### Contact
- name, email, subject, message, isRead (boolean)

## Development Tips

### Testing with Postman
1. Create a new collection for the API
2. Set up environment variables for base URL and token
3. Test authentication first, then use the token for protected routes

### Hot Reload
The project uses `nodemon` for development, which automatically restarts the server when files change.

### Debugging
Enable detailed logging by checking console output. All errors are logged with `console.error()`.

## Common Issues & Solutions

### Issue: "Not authorized, no token"
**Solution**: Make sure you're sending the JWT token in the Authorization header as `Bearer {token}`

### Issue: "User already exists"
**Solution**: The email is already registered. Use a different email or login with existing credentials.

### Issue: "Not authorized as admin"
**Solution**: Your user role is not set to "admin". Update the role in the database.

### Issue: File upload fails
**Solution**: 
- Check file size (must be under 500MB)
- Verify file type is audio or video
- Ensure uploads directory exists and is writable

### Issue: Cannot connect to MongoDB
**Solution**: 
- Verify MongoDB is running
- Check MONGO_URI in .env file
- Ensure network connectivity

## Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=6001
MONGO_URI=your_production_mongodb_uri
JWT_SECRET=your_super_secret_production_jwt_key
```

### Recommended Hosting
- **Backend**: Heroku, Railway, Render, DigitalOcean
- **Database**: MongoDB Atlas (free tier available)
- **File Storage**: Consider using AWS S3 or Cloudinary for production file uploads

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for your church or organization.

## Support

For detailed API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

## Changelog

### Version 1.0.0 (Current)
- Initial release
- Complete CRUD operations for all resources
- JWT authentication
- File upload for sermons
- Role-based access control
- Member-only announcements feature

---

Built with ❤️ for churches worldwide
