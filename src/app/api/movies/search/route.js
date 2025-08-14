import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    
    const query = searchParams.get("query") || "";
    console.log(query);
    const page = parseInt(searchParams.get("page") || "1");

    if (!query.trim()) {
      return NextResponse.json({ Search: [], totalResults: "0" });
    }

    const apiKey = process.env.OMDB_API_KEY;
    const url = `http://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(query)}&type=movie`;

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`OMDb API error: ${res.statusText}`);
    }

    const data = await res.json();
    if (data.Response === "False") {
      return NextResponse.json({ Search: [], totalResults: "0" });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("OMDb fetch error:", error);
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
