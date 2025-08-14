"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              MovieVerse
            </Link>
            <div className="ml-10 space-x-8">
              <Link href="/movies" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
                Movies
              </Link>
              {session && (
                <Link href="/favorites" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
                  My Favorites
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center">
            {status === "loading" ? (
              <div className="text-gray-700 dark:text-gray-300">Loading...</div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 dark:text-gray-300">{session.user?.name}</span>
                <button
                  onClick={() => signOut()}
                  className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link href="/api/auth/signin" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
