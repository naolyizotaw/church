import mongoose from "mongoose";
import Leader from "../src/models/Leader.js";
import dotenv from "dotenv";

dotenv.config();

const leaders = [
  {
    name: "Pastor Daniel Ababe",
    role: "Senior Pastor",
    roleAm: "ዋና ፓስተር",
    bio: "Pastor Daniel has been leading the congregation for over 15 years with dedication and wisdom.",
    photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=260&h=260&fit=crop&crop=face",
    phone: "+251 911 000 001",
    email: "daniel@kerabufgbc.org",
    facebook: "https://facebook.com/",
    twitter: "https://x.com/",
    linkedin: "https://linkedin.com/",
    displayOrder: 1,
    isActive: true,
  },
  {
    name: "Sorah Kebede",
    role: "Worship Leader",
    roleAm: "የአምልኮ መሪ",
    bio: "Sorah leads our worship ministry with passion and a heart for praise.",
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=260&h=260&fit=crop&crop=face",
    phone: "+251 911 000 002",
    email: "sorah@kerabufgbc.org",
    facebook: "https://facebook.com/",
    twitter: "https://x.com/",
    linkedin: "https://linkedin.com/",
    displayOrder: 2,
    isActive: true,
  },
  {
    name: "Markos Tesfaye",
    role: "Youth Pastor",
    roleAm: "የወጣቶች ፓስተር",
    bio: "Markos is passionate about mentoring the next generation of believers.",
    photoUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=260&h=260&fit=crop&crop=face",
    phone: "+251 911 000 003",
    email: "markos@kerabufgbc.org",
    facebook: "https://facebook.com/",
    twitter: "https://x.com/",
    linkedin: "https://linkedin.com/",
    displayOrder: 3,
    isActive: true,
  },
  {
    name: "Hanna Alemayahu",
    role: "Women's Ministry",
    roleAm: "የሴቶች አገልግሎት",
    bio: "Hanna faithfully serves and empowers the women of our church community.",
    photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=260&h=260&fit=crop&crop=face",
    phone: "+251 911 000 004",
    email: "hanna@kerabufgbc.org",
    facebook: "https://facebook.com/",
    twitter: "https://x.com/",
    linkedin: "https://linkedin.com/",
    displayOrder: 4,
    isActive: true,
  },
];

const seedLeaders = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING);
    console.log("Connected to MongoDB");

    const existing = await Leader.countDocuments();
    if (existing > 0) {
      console.log(`\nThere are already ${existing} leaders in the database.`);
      console.log("Clearing existing leaders and re-seeding...\n");
      await Leader.deleteMany({});
    }

    const created = await Leader.insertMany(leaders);
    console.log(`Successfully seeded ${created.length} leaders:\n`);
    created.forEach((l, i) => {
      console.log(`  ${i + 1}. ${l.name} — ${l.role}`);
    });
    console.log("\nDone!\n");

    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

seedLeaders();
