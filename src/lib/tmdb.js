const TMDB_BASE_URL = "https://api.themoviedb.org/3";

async function fetchFromTMDB(endpoint, queryParams= {}) {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);

  Object.keys(queryParams).forEach((key) =>
    url.searchParams.append(key, queryParams[key])
  );

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    cache: "no-store", // skip caching for fresh results
  });

  if (!res.ok) {
    throw new Error(`TMDB API error: ${res.statusText}`);
  }

  return res.json();
}

export async function getPopularMovies(page = 1) {
  return fetchFromTMDB("/movie/popular", { page, language: "en-US" });
}

export async function searchMovies(query, page = 1) {
  return fetchFromTMDB("/search/movie", { query, page, language: "en-US", include_adult: "false" });
}

export async function getMovieDetails(id) {
  return fetchFromTMDB(`/movie/${id}`, { language: "en-US" });
}
