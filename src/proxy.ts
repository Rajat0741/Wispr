import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Add any routes that require authentication here.
  // This is a fast cookie-presence check; the page itself does a full DB session
  // validation as a second layer of protection.
  matcher: ["/profile/:path*"],
};
