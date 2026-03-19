import mongoose from "mongoose";
import Verse from "../src/models/Verse.js";
import dotenv from "dotenv";

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING);
    console.log("Connected to MongoDB");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await Verse.create({
      textEnglish: "Jesus Christ is the same yesterday and today and forever.",
      textAmharic: "\u12A2\u12E8\u1231\u1235 \u12AD\u122D\u1235\u1276\u1235 \u1275\u1293\u1295\u1275\u1293 \u12DB\u1234 \u12A5\u1295\u12F2\u1201\u121D \u1208\u12D8\u120B\u1208\u121D \u12A0\u1295\u12F5 \u1290\u12CD::",
      referenceEnglish: "Hebrews 13:8",
      referenceAmharic: "\u12D5\u1265\u122B\u12CD\u12EB\u1295 13:8",
      date: today,
      isActive: true,
    });

    console.log("Verse added successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

run();
