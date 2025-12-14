# Quick Setup Guide - Church Website Backend

## Step-by-Step Setup

### 1. Install Dependencies
```bash
npm install
```

This will install all required packages:
- express (web framework)
- mongoose (MongoDB ODM)
- jsonwebtoken (JWT authentication)
- bcryptjs (password hashing)
- multer (file uploads)
- dotenv (environment variables)
- cookie-parser (cookie parsing)
- nodemon (development auto-reload)

### 2. Setup MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB locally (if not already installed)
# Visit: https://www.mongodb.com/try/download/community

# Start MongoDB service
# Windows: MongoDB runs as a service automatically
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

**Option B: MongoDB Atlas (Cloud - Recommended)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster (free tier M0)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password
7. Replace `myFirstDatabase` with your database name (e.g., `church_db`)

### 3. Create Environment File

Create a `.env` file in the `backend` directory:

```env
# For Local MongoDB:
NODE_ENV=development
PORT=6001
MONGO_URI=mongodb://localhost:27017/church_db
JWT_SECRET=your_random_secret_key_min_32_characters_long

# For MongoDB Atlas (Cloud):
NODE_ENV=development
PORT=6001
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/church_db?retryWrites=true&w=majority
JWT_SECRET=your_random_secret_key_min_32_characters_long
```

**Important:** Generate a secure JWT secret:
```bash
# Option 1: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 2: Using OpenSSL
openssl rand -hex 32

# Use the output as your JWT_SECRET
```

### 4. Start the Server

**Development Mode (with auto-reload):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

The server will start at: `http://localhost:6001`

You should see:
```
Server is running at port 6001
Connected to MongoDB successfully
```

### 5. Test the API

**Test with cURL:**
```bash
# Health check (if you add one)
curl http://localhost:6001/api/auth/me

# Should return 401 (not authorized) - this means the server is working
```

**Test with Browser:**
- Visit: `http://localhost:6001/uploads/` (should show 404 or directory listing)

### 6. Create Your First Admin User

**Method 1: Register and Update in Database**

Step 1 - Register a user:
```bash
curl -X POST http://localhost:6001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@church.com",
    "password": "SecurePassword123"
  }'
```

Step 2 - Update user role in MongoDB:
```javascript
// Using MongoDB Compass or mongosh:
db.users.updateOne(
  { email: "admin@church.com" },
  { $set: { role: "admin" } }
)
```

**Method 2: Create Admin Script** (recommended)

Create `backend/scripts/createAdmin.js`:
```javascript
import mongoose from "mongoose";
import User from "../src/models/User.js";
import dotenv from "dotenv";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@church.com",
      password: "SecurePassword123",
      role: "admin"
    });

    console.log("Admin user created:", adminUser.email);
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

createAdmin();
```

Run it:
```bash
node scripts/createAdmin.js
```

### 7. Login as Admin

```bash
curl -X POST http://localhost:6001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@church.com",
    "password": "SecurePassword123"
  }'
```

Save the returned token - you'll need it for admin operations!

### 8. Test Admin Operations

**Create an Announcement:**
```bash
curl -X POST http://localhost:6001/api/announcements \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Welcome to Our Church",
    "content": "Join us every Sunday at 10 AM for worship service.",
    "isMemberOnly": false
  }'
```

**Create a Page:**
```bash
curl -X PUT http://localhost:6001/api/pages/about-us \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "About Us",
    "content": "We are a community of believers dedicated to serving God and our community."
  }'
```

**Create an Event:**
```bash
curl -X POST http://localhost:6001/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Youth Bible Study",
    "description": "Weekly Bible study for young adults",
    "date": "2025-12-20T18:00:00.000Z",
    "location": "Youth Center"
  }'
```

**Upload a Sermon (with file):**
```bash
curl -X POST http://localhost:6001/api/sermons \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "file=@/path/to/sermon.mp3" \
  -F "title=The Power of Prayer" \
  -F "speaker=Pastor John" \
  -F "date=2025-12-14" \
  -F "fileType=audio" \
  -F "description=An inspiring sermon about prayer"
```

## Recommended Testing Tools

### 1. Postman (Recommended)
- Download: https://www.postman.com/downloads/
- Import the API endpoints
- Set up environment variables for base URL and token
- Easy file upload testing

### 2. Thunder Client (VS Code Extension)
- Install from VS Code Extensions
- Built into VS Code
- Great for quick API testing

### 3. REST Client (VS Code Extension)
Create a `test.http` file:
```http
### Register User
POST http://localhost:6001/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}

### Login
POST http://localhost:6001/api/auth/login
Content-Type: application/json

{
  "email": "admin@church.com",
  "password": "SecurePassword123"
}

### Get Announcements
GET http://localhost:6001/api/announcements
```

## Project Structure Verification

After setup, your structure should look like:
```
backend/
├── src/
│   ├── config/
│   │   ├── dbConnect.js ✓
│   │   └── multerConfig.js ✓
│   ├── controllers/ (6 files) ✓
│   ├── middleware/ (2 files) ✓
│   ├── models/ (6 files) ✓
│   ├── routes/ (6 files) ✓
│   └── server.js ✓
├── uploads/
│   └── .gitkeep ✓
├── .env (create this)
├── package.json ✓
├── README.md ✓
├── API_DOCUMENTATION.md ✓
└── SETUP_GUIDE.md (this file) ✓
```

## Common Setup Issues

### Issue: "Cannot find module"
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: "MongoNetworkError"
**Solution:**
- Check if MongoDB is running (local)
- Verify MONGO_URI in .env
- Check network/firewall settings
- For Atlas: Whitelist your IP address in Atlas dashboard

### Issue: "JWT_SECRET is not defined"
**Solution:**
- Make sure .env file exists
- Verify JWT_SECRET is set in .env
- Restart the server after changing .env

### Issue: "Cannot POST /api/sermons" (file upload)
**Solution:**
- Make sure you're using `multipart/form-data` (not JSON)
- Use Postman or form-data in your request
- Check that uploads directory exists and is writable

## Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| NODE_ENV | Environment mode | development or production |
| PORT | Server port | 6001 |
| MONGO_URI | MongoDB connection string | mongodb://localhost:27017/church_db |
| JWT_SECRET | Secret key for JWT tokens | 32+ character random string |

## Next Steps

1. ✅ Install dependencies
2. ✅ Setup MongoDB
3. ✅ Create .env file
4. ✅ Start the server
5. ✅ Create admin user
6. ✅ Test API endpoints
7. 📝 Connect frontend (if applicable)
8. 📝 Deploy to production

## Additional Resources

- [MongoDB Atlas Setup](https://www.mongodb.com/docs/atlas/getting-started/)
- [Postman Documentation](https://learning.postman.com/docs/getting-started/introduction/)
- [JWT.io](https://jwt.io/) - Decode and verify JWT tokens
- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)

## Support

- Check the [README.md](./README.md) for general information
- Check the [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed API docs
- Review error messages in the console
- Check MongoDB connection status

---

Happy coding! 🚀
