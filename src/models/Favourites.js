import mongoose, { Schema, Document, Model } from "mongoose";



const FavoriteSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    movieId: { type: String, required: true },
  },
  { timestamps: true }
);

const Favorite=mongoose.models.Favorite || mongoose.model("Favorite", FavoriteSchema);

export default Favorite;
