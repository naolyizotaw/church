import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Event from "./models/Event.js";
import User from "./models/User.js";
import { dbConnect } from "./config/dbConnect.js";

const seedEvents = async () => {
  await dbConnect();

  const admin = await User.findOne({ role: "admin" });
  if (!admin) {
    console.error("No admin user found. Create an admin user first.");
    process.exit(1);
  }

  const existing = await Event.countDocuments();
  if (existing > 0) {
    console.log(`Already ${existing} events in database. Skipping seed.`);
    process.exit(0);
  }

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const events = [
    {
      title: "Sunday Worship Service / ጠባበት",
      description: "Join us for a time of powerful worship and sermon. Let's come together to praise His name.",
      date: new Date(year, month, 15, 9, 0),
      location: "Main Sanctuary, Addis Ababa",
      posterUrl: null,
      createdBy: admin._id,
    },
    {
      title: "Youth Night: Faith & Future / ወጣቶች ፕሮግራም",
      description: "An evening of fellowship, music, and discussion about navigating life with faith.",
      date: new Date(year, month, 20, 17, 0),
      location: "Youth Hall, Building B",
      posterUrl: null,
      createdBy: admin._id,
    },
    {
      title: "Community Outreach / የማህበረሰብ አገልግሎት",
      description: "We are visiting the local shelter to provide food and clothes. Volunteers needed.",
      date: new Date(year, month, 28, 8, 0),
      location: "Meeting Point: Church Parking",
      posterUrl: null,
      createdBy: admin._id,
    },
    {
      title: "All Night Prayer / የሌሊት ጸሎት",
      description: "Dedicated time for intercession and spiritual breakthrough.",
      date: new Date(year, month + 1, 1, 22, 0),
      location: "Prayer Hall / የጸሎት ቤት",
      posterUrl: null,
      createdBy: admin._id,
    },
  ];

  await Event.insertMany(events);
  console.log(`Seeded ${events.length} events successfully.`);
  process.exit(0);
};

seedEvents().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
