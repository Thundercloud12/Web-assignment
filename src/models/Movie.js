import mongoose, { Schema, Document } from "mongoose";



const MovieSchema = new Schema(
  {
    tmdbId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    posterPath: String,
    rating: Number,
  },
  { timestamps: true }
);

export default mongoose.models.Movie || mongoose.model("Movie", MovieSchema);
