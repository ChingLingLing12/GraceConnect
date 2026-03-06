import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Admin from "../models/adminModel";

dotenv.config();

const createAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI as string);

  const hashed = await bcrypt.hash("Gr4c3Church26!", 10);

  await Admin.create({
    username: "admin",
    password: hashed,
  });

  console.log("Admin created");
  process.exit();
};

createAdmin();