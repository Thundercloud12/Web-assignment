/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow all domains temporarily for testing
      },
    ],
    // Alternative: specific domains
    domains: [
      'm.media-amazon.com',
      'ia.media-imdb.com', 
      'images-na.ssl-images-amazon.com',
      'image.tmdb.org'
    ],
  },
};

export default nextConfig;
