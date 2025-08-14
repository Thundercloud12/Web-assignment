import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth?.token;
    console.log(token);
    
    const { pathname } = req.nextUrl;

    const isPublicPage = ["/", "/login", "/register", "/movies"].includes(pathname);

    if (!token && !isPublicPage) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Public routes – allow unauthenticated access
        if (["/", "/login", "/register", "/movies"].includes(pathname) || pathname.startsWith("/movies/")) {
          return true;
        }

        // All other routes – require token
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    // More specific matcher that excludes all static assets and API routes
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/).*)",
  ],
};
