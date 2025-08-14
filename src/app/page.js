import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/movies-bg.jpg"
          alt="Background"
          fill
          className="object-cover blur-sm opacity-30"
          priority
        />
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-20 pb-24 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-8">
            Your Gateway to the
            <span className="text-indigo-600 dark:text-indigo-400"> World of Movies</span>
          </h1>
          
          <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover thousands of movies, save your favorites, and keep track of what you want to watch.
            Join our community of movie enthusiasts today.
          </p>

          {/* Action Buttons */}
          <div className="mt-12 flex justify-center gap-6 flex-col sm:flex-row">
            <Link
              href="/movies"
              className="px-8 py-3 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-200"
            >
              Explore Movies
            </Link>
            <Link
              href="/api/auth/signin"
              className="px-8 py-3 rounded-full border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors duration-200"
            >
              Sign In
            </Link>
          </div>

          {/* Features Grid */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">Discover Movies</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">Browse through our extensive collection of movies</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">Save Favorites</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">Keep track of movies you love and want to watch</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">Join Community</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">Connect with other movie enthusiasts worldwide</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
