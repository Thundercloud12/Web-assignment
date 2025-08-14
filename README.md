# MovieVerse - Movie Discovery Platform

MovieVerse is a modern web appli## 📁 Project Structure



## 🔐 Authentication Flow

1. Users can register with email and password
2. Passwords are hashed using bcrypt before storage
3. Login validates credentials and creates a session
4. Protected routes require authentication
5. Session management handled by NextAuth.js

## 💾 Database Schema

### User Model

- name: String (required)
- email: String (required, unique)
- password: String (required, hashed)

### Favorites Model

- userId: ObjectId (reference to User)
- movieId: String (required)
- timestamps: true

## 🎯 API Endpoints

### Authentication

- POST `/api/auth/register` - User registration
- POST `/api/auth/login` - User login

### Movies

- GET `/api/movies/popular` - Get popular movies
- GET `/api/movies/search` - Search movies
- GET `/api/movies/[id]` - Get movie details

### Favorites

- GET `/api/favorites` - Get user's favorites
- POST `/api/favorites` - Add/remove favorite

## 🌟 Future Enhancements

- Social authentication (Google, GitHub)
- User reviews and ratings
- Movie recommendations based on favorites
- Watch lists
- Social features (sharing, following)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check [issues page](https://github.com/Thundercloud12/Web-assignment/issues).

## 👨‍💻 Author

**Thundercloud12**

- GitHub: [@Thundercloud12](https://github.com/Thundercloud12)

## 🙏 Acknowledgments

- TMDB API for movie data
- OMDB API for additional movie information
- Next.js team for the amazing framework
- Vercel for hosting capabilitiesh Next.js that allows users to discover, search, and save their favorite movies. The application features user authentication, a personalized dashboard, and integration with TMDB and OMDB APIs for comprehensive movie data.

## 🚀 Features

- **User Authentication**

  - Email and password registration
  - Secure login with password hashing
  - Protected routes for authenticated users

- **Movie Discovery**

  - Browse popular movies
  - Search functionality
  - Infinite scroll for seamless browsing
  - Detailed movie information including plot, cast, and ratings

- **Personal Dashboard**

  - User-specific dashboard with movie recommendations
  - Save movies to favorites
  - Manage favorite movies
  - Modern sidebar navigation

- **Modern UI/UX**
  - Responsive design for all devices
  - Dark mode support
  - Loading states and animations
  - Interactive movie cards with hover effects

## 🛠️ Tech Stack

- **Frontend**

  - Next.js 13+ (App Router)
  - React
  - Tailwind CSS
  - Next-Auth for authentication

- **Backend**

  - MongoDB with Mongoose
  - RESTful API endpoints
  - bcrypt for password hashing

- **APIs**
  - TMDB API for movie data
  - OMDB API for additional movie details

## 🔧 Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Thundercloud12/Web-assignment.git
   cd web-assignment
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:

   ```env
   MONGODB_URL=your_mongodb_url 
   OMDB_API_KEY=your_omdb_key
   NEXTAUTH_SECRET=your_nextauth_secret
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```



