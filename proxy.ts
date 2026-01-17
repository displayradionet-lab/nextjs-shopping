import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { NextResponse } from "next/server";

export const { auth } = NextAuth(authConfig);

export default async function proxy(request: Request) {
  const { pathname } = new URL(request.url);
  
  const protectedPaths = [
    /\/checkout(\/.*)?/,
    /\/account(\/.*)?/,
    /\/admin(\/.*)?/,
  ];

  if (protectedPaths.some((p) => p.test(pathname))) {
    const session = await auth();
    if (!session) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
     '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
