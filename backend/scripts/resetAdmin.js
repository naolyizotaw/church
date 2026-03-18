import mongoose from "mongoose";
import User from "../src/models/User.js";
import dotenv from "dotenv";

dotenv.config();

const ADMIN_EMAIL = "admin@church.com";
const NEW_PASSWORD = "Admin123456";

const resetAdmin = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING);
    console.log("Connected to MongoDB");

    const existing = await User.findOne({ email: ADMIN_EMAIL });

    if (existing) {
      existing.password = NEW_PASSWORD;
      existing.role = "admin";
      await existing.save();
      console.log(`\nAdmin password reset successfully!`);
    } else {
      await User.create({
        name: "Admin",
        email: ADMIN_EMAIL,
        password: NEW_PASSWORD,
        role: "admin",
      });
      console.log(`\nAdmin user created successfully!`);
    }

    console.log(`\n  Email:    ${ADMIN_EMAIL}`);
    console.log(`  Password: ${NEW_PASSWORD}`);
    console.log(`\nChange this password after logging in.\n`);

    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

resetAdmin();
