import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs"


const UserSchema = new Schema(
  {
    name: { type: String, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    favorites: [{ type: String }] 
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
