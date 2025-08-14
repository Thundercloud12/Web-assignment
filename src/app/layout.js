import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import SessionWrapper from "./components/SessionWrapper"; // Your existing SessionWrapper

const geist = Geist({
  subsets: ["latin"],
});

export const metadata = {
  title: "MovieVerse - Your Movie Explorer",
  description: "Discover and save your favorite movies",
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-gray-50 dark:bg-gray-900`}>
        <SessionWrapper>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
        </SessionWrapper>
      </body>
    </html>
  );
}
