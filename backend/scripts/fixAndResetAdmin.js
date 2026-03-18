import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const fix = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING);
    console.log("Connected to MongoDB");

    const db = mongoose.connection.db;
    const usersCollection = db.collection("users");

    // Drop the stale firebaseUid index
    const indexes = await usersCollection.indexes();
    console.log("Current indexes:", indexes.map(i => i.name).join(", "));

    const staleIndexes = ["firebaseUid_1", "username_1"];
    for (const name of staleIndexes) {
      if (indexes.some(i => i.name === name)) {
        await usersCollection.dropIndex(name);
        console.log(`Dropped stale '${name}' index.`);
      }
    }

    // Now reset or create the admin
    const User = (await import("../src/models/User.js")).default;

    const ADMIN_EMAIL = "admin@church.com";
    const NEW_PASSWORD = "Admin123456";

    const existing = await User.findOne({ email: ADMIN_EMAIL });

    if (existing) {
      existing.password = NEW_PASSWORD;
      existing.role = "admin";
      await existing.save();
      console.log("\nAdmin password reset successfully!");
    } else {
      await User.create({
        name: "Admin",
        email: ADMIN_EMAIL,
        password: NEW_PASSWORD,
        role: "admin",
      });
      console.log("\nAdmin user created successfully!");
    }

    console.log(`\n  Email:    ${ADMIN_EMAIL}`);
    console.log(`  Password: ${NEW_PASSWORD}`);
    console.log("\nChange this password after logging in.\n");

    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

fix();
