"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useInView } from "react-intersection-observer";
import { useSession } from "next-auth/react";

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView();
  const { data: session } = useSession();

  // Fetch movies based on page and query (OMDb)
  const fetchMovies = useCallback(async () => {
    setLoading(true);
    try {
      const endpoint = query
        ? `/api/movies/search?query=${encodeURIComponent(query)}`
        : `/api/movies/popular?page=${page}`;
      const res = await fetch(endpoint);
      const data = await res.json();
      console.log("OMDb response:", data);

      // OMDb uses Search array
      const newResults = Array.isArray(data.Search) ? data.Search : [];
      console.log(newResults);
      
      if (page === 1) {
        setMovies(newResults);
      } else {
        setMovies((prev) => [...prev, ...newResults]);
      }

      // OMDb pagination calculation
      const totalResults = parseInt(data.totalResults || "0", 10);
      const totalPages = Math.ceil(totalResults / 10);
      setHasMore(page < totalPages);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  }, [page, query]);

  // Fetch when page or query changes
  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  // Reset pagination when query changes
  useEffect(() => {
    setPage(1);
    setHasMore(true);
  }, [query]);

  // Infinite scroll
  useEffect(() => {
    if (inView && !loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [inView, loading, hasMore]);

  const toggleFavorite = async (movieId) => {
    if (!session) {
      // Redirect to sign in if not authenticated
      window.location.href = '/api/auth/signin';
      return;
    }

    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ movieId }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle favorite');
      }

      // Update UI to reflect the change
      setMovies(movies.map(movie => {
        if (movie.imdbID === movieId) {
          return { ...movie, isFavorite: !movie.isFavorite };
        }
        return movie;
      }));
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search bar */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search movies..."
              className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors duration-200"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
            />
            <svg
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Movie grid */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {movies.length === 0 && !loading && (
            <div className="col-span-full text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No movies found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Try adjusting your search terms</p>
            </div>
          )}

          {movies.map((movie) => (
            <div key={movie.imdbID} className="group relative">
              <Link href={`/movies/${movie.imdbID}`}>
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800">
                  <Image
                    src={movie.Poster && movie.Poster !== "N/A" ? movie.Poster : "/placeholder.png"}
                    alt={movie.Title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </Link>
              
              <div className="mt-2">
                <Link href={`/movies/${movie.imdbID}`}>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    {movie.Title}
                  </h3>
                </Link>
                <p className="text-sm text-gray-500 dark:text-gray-400">{movie.Year}</p>
              </div>

              {session && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFavorite(movie.imdbID);
                  }}
                  className="absolute top-2 right-2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors duration-200"
                >
                  <svg
                    className={`h-5 w-5 ${
                      movie.isFavorite
                        ? "text-red-500 fill-current"
                        : "text-white stroke-current"
                    }`}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center mt-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        )}

        {/* Infinite scroll trigger */}
        <div ref={ref} className="h-10" />
      </div>
    </div>
  );
}
