import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");

    // OMDb returns 10 results per page, page param supported
    const apiKey = process.env.OMDB_API_KEY;

    // Search popular movies by keyword (example: "marvel")
    const url = `http://www.omdbapi.com/?apikey=${apiKey}&s=marvel&type=movie&page=${page}`;

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`OMDb API error: ${res.statusText}`);
    }
    const data = await res.json();

    // OMDb returns Response field for success or failure
    if (data.Response === "False") {
      return NextResponse.json({ Search: [], totalResults: "0" });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("OMDb fetch error:", error);
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
