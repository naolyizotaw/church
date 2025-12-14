import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dbConnect } from "./config/dbConnect.js";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import pageRoutes from "./routes/pageRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import sermonRoutes from "./routes/sermonRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/pages", pageRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/sermons", sermonRoutes);
app.use("/api/contacts", contactRoutes);






if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
    });
}



const PORT = process.env.PORT || 6001;
app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`)
    dbConnect();
});