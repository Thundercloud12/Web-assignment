import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const movieId = params.id;
    const API_KEY = process.env.OMDB_API_KEY;
    
    const response = await fetch(
      `http://www.omdbapi.com/?i=${movieId}&apikey=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch movie details");
    }

    const data = await response.json();

    if (data.Error) {
      return new NextResponse(JSON.stringify({ error: data.Error }), {
        status: 404,
      });
    }

    return new NextResponse(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error("Error fetching movie:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch movie details" }),
      { status: 500 }
    );
  }
}
