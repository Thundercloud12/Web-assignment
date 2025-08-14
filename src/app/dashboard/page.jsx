"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function DashboardPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchMovies();
  }, [page, searchQuery]);

  const fetchMovies = async () => {
    console.log('🚀 fetchMovies called with state:', {
      page,
      searchQuery,
      currentMoviesLength: movies.length
    });

    try {
      const endpoint = searchQuery
        ? `/api/movies/search?query=${encodeURIComponent(searchQuery)}&page=${page}`
        : `/api/movies/popular?page=${page}`;
      
      console.log('📡 Fetching from endpoint:', endpoint);
      
      const res = await fetch(endpoint);
      console.log('📨 Response received:', {
        status: res.status,
        statusText: res.statusText,
        ok: res.ok
      });

      if (!res.ok) {
        console.error('❌ Fetch failed with status:', res.status, res.statusText);
        setLoading(false);
        return;
      }

      const data = await res.json();
      console.log('📄 Raw data received:', data);

      // Handle both OMDB and TMDB API formats
      let moviesArray = [];
      if (data.Response === "True" && Array.isArray(data.Search)) {
        // OMDB API format
        moviesArray = data.Search;
        console.log('✅ OMDB format detected, using Search array');
      } else if (data && Array.isArray(data.results)) {
        // TMDB API format
        moviesArray = data.results;
        console.log('✅ TMDB format detected, using results array');
      } else {
        console.error('❌ Unsupported data format:', data);
        if (page === 1) {
          setMovies([]);
        }
        return;
      }

      console.log('📊 Movies array info:', {
        length: moviesArray.length,
        firstMovieKeys: moviesArray[0] ? Object.keys(moviesArray[0]) : 'No movies',
        firstMoviePoster: moviesArray[0] ? moviesArray[0].Poster : 'No poster info'
      });
      
      const newMovies = page === 1 ? moviesArray : [...movies, ...moviesArray];
      console.log('✅ Setting movies:', {
        previousMoviesLength: movies.length,
        newResultsLength: moviesArray.length,
        finalMoviesLength: newMovies.length,
        isFirstPage: page === 1
      });
      
      setMovies(newMovies);

    } catch (error) {
      console.error('❌ Error in fetchMovies:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      if (page === 1) {
        console.log('🔄 Resetting movies to empty array due to error (first page)');
        setMovies([]);
      }
    } finally {
      console.log('🏁 fetchMovies completed, setting loading to false');
      setLoading(false);
    }
  };

  const handleFavorite = async (movieId) => {
    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ movieId }),
      });

      if (!res.ok) throw new Error('Failed to toggle favorite');

      // Update using OMDB property names (imdbID instead of id)
      setMovies(prevMovies => 
        Array.isArray(prevMovies) 
          ? prevMovies.map(movie => 
              movie.imdbID === movieId 
                ? { ...movie, isFavorite: !movie.isFavorite }
                : movie
            )
          : []
      );
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to Your Dashboard
        </h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
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

      {loading && page === 1 ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies?.map((movie) => {
            const posterUrl = movie.Poster && movie.Poster !== "N/A" ? movie.Poster : '/placeholder.png';
            console.log(`🎬 ${movie.Title} - Poster: ${posterUrl}`);
            
            return (
              <div key={movie.imdbID} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                {/* Image section - keeping the exact working structure */}
                <div className="relative aspect-[2/3] bg-gray-100 border-2 border-red-500">
                  {movie.Poster && movie.Poster !== "N/A" ? (
                    <Image
                      src={posterUrl}
                      alt={movie.Title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      onLoadingComplete={() => console.log(`✅ Loaded: ${movie.Title}`)}
                      onError={() => console.log(`❌ Failed: ${movie.Title} - ${posterUrl}`)}
                      priority={false}
                      unoptimized // Bypass Next.js optimization for testing
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                </div>

                {/* Extended content section below image */}
                <div className="p-4 space-y-3">
                  {/* Movie title and year */}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                      {movie.Title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {movie.Year}
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex space-x-2">
                    <Link
                      href={`/dashboard/movies/${movie.imdbID}`}
                      className="flex-1 bg-indigo-600 text-white px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200 text-xs text-center"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleFavorite(movie.imdbID)}
                      className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 text-red-500 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                      title="Add to favorites"
                    >
                      <svg
                        className={`w-4 h-4 ${movie.isFavorite ? 'fill-current' : 'stroke-current'}`}
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
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && movies?.length > 0 && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setPage(p => p + 1)}
            className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition-colors duration-200"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
