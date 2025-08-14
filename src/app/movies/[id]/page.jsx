"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

export default function MovieDetail({ params }) {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const movieRes = await fetch(`/api/movies/${params.id}`);
        const movieData = await movieRes.json();
        setMovie(movieData);

        // If user is logged in, check if movie is in favorites
        if (session) {
          const favRes = await fetch('/api/favorites');
          const { favorites } = await favRes.json();
          setIsFavorite(favorites.includes(params.id));
        }
      } catch (err) {
        setError('Failed to load movie details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [params.id, session]);

  const toggleFavorite = async () => {
    if (!session) {
      window.location.href = '/api/auth/signin';
      return;
    }

    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ movieId: params.id }),
      });

      if (res.ok) {
        setIsFavorite(!isFavorite);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Error</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">{error || 'Movie not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="relative h-[60vh] w-full">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder.png'}
            alt={movie.Title}
            fill
            className="object-cover blur-sm opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-12">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Movie Poster */}
            <div className="w-64 flex-shrink-0">
              <div className="aspect-[2/3] relative rounded-lg overflow-hidden shadow-xl">
                <Image
                  src={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder.png'}
                  alt={movie.Title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Movie Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-2">{movie.Title}</h1>
              <div className="flex items-center gap-4 text-gray-300 mb-4">
                <span>{movie.Year}</span>
                <span>•</span>
                <span>{movie.Runtime}</span>
                <span>•</span>
                <span>{movie.Rated}</span>
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="ml-1 text-white">{movie.imdbRating}</span>
                </div>

                {session && (
                  <button
                    onClick={toggleFavorite}
                    className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white transition-colors duration-200"
                  >
                    <svg
                      className={`h-5 w-5 ${isFavorite ? 'fill-current' : 'stroke-current'}`}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <span className="ml-2">{isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</span>
                  </button>
                )}
              </div>

              <p className="text-gray-300 text-lg mb-6">{movie.Plot}</p>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="text-white font-semibold mb-2">Director</h3>
                  <p className="text-gray-300">{movie.Director}</p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Cast</h3>
                  <p className="text-gray-300">{movie.Actors}</p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Genre</h3>
                  <p className="text-gray-300">{movie.Genre}</p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Language</h3>
                  <p className="text-gray-300">{movie.Language}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
