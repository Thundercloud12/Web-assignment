import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { connectDb, connectDB } from "../../../lib/dbConnect";
import Favorites from "../../../models/Favourites";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: "You must be signed in to manage favorites" }),
        { status: 401 }
      );
    }

    const { movieId } = await request.json();
    
    if (!movieId) {
      return new NextResponse(
        JSON.stringify({ error: "Movie ID is required" }),
        { status: 400 }
      );
    }

    await connectDb()

    // Check if the movie is already in favorites
    const existingFavorite = await Favorites.findOne({
      userId: session.user.id,
      movieId: movieId,
    });

    if (existingFavorite) {
      // If it exists, remove it (toggle off)
      await Favorites.findByIdAndDelete(existingFavorite._id);
      return new NextResponse(
        JSON.stringify({ message: "Removed from favorites", isFavorite: false }),
        { status: 200 }
      );
    } else {
      // If it doesn't exist, add it (toggle on)
      const newFavorite = new Favorites({
        userId: session.user.id,
        movieId: movieId,
      });
      await newFavorite.save();
      return new NextResponse(
        JSON.stringify({ message: "Added to favorites", isFavorite: true }),
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error managing favorites:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to manage favorites" }),
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: "You must be signed in to view favorites" }),
        { status: 401 }
      );
    }

   await connectDb()

    const favorites = await Favorites.find({ userId: session.user.id });
    
    return new NextResponse(
      JSON.stringify({ favorites: favorites.map(f => f.movieId) }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch favorites" }),
      { status: 500 }
    );
  }
}
