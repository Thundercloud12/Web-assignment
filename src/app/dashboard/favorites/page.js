"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      // Fetch user's favorite movie IDs
      const favRes = await fetch('/api/favorites');
      const { favorites: favoriteIds } = await favRes.json();

      // Fetch details for each favorite movie
      const movieDetailsPromises = favoriteIds.map(async (movieId) => {
        const res = await fetch(`/api/movies/${movieId}`);
        return res.json();
      });

      const movieDetails = await Promise.all(movieDetailsPromises);
      setFavorites(movieDetails.map(movie => ({ ...movie, isFavorite: true })));
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (movieId) => {
    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ movieId }),
      });

      if (!res.ok) throw new Error('Failed to remove favorite');

      // Remove from UI using OMDB property (imdbID instead of id)
      setFavorites(favorites.filter(movie => movie.imdbID !== movieId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Your Favorite Movies
      </h1>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
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
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No favorites yet</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Start adding movies to your favorites list!
          </p>
          <div className="mt-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Browse Movies
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((movie) => {
            const posterUrl = movie.Poster && movie.Poster !== "N/A" ? movie.Poster : '/placeholder.png';
            console.log(`🎬 Favorite Movie: ${movie.Title} - Poster: ${posterUrl}`);
            
            return (
              <div key={movie.imdbID} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                {/* Image section - keeping the exact working structure from DashboardPage */}
                <div className="relative aspect-[2/3] bg-gray-100 border-2 border-red-500">
                  {movie.Poster && movie.Poster !== "N/A" ? (
                    <Image
                      src={posterUrl}
                      alt={movie.Title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      onLoadingComplete={() => console.log(`✅ Favorite Loaded: ${movie.Title}`)}
                      onError={() => console.log(`❌ Favorite Failed: ${movie.Title} - ${posterUrl}`)}
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
                      onClick={() => handleRemoveFavorite(movie.imdbID)}
                      className="p-2 rounded-md bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors duration-200"
                      title="Remove from favorites"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
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
    </div>
  );
}
