import { SignJWT } from "jose";
import { NextResponse } from "next/server";
import { getUserSession } from "@/lib/getUser";
import { AppError } from "@/utils/app-error";

const TOKEN_LIFETIME_SECONDS = 10 * 60;

export interface RealtimeTokenResponse {
  token: string;
  expiresAt: number;
}

export async function GET(request: Request) {
  const jwtSecret = process.env.SUPABASE_JWT_SECRET;

  if (!jwtSecret) {
    return NextResponse.json(
      { error: "Supabase JWT secret is not configured" },
      { status: 500 },
    );
  }

  try {
    const session = await getUserSession(request.headers);
    const expiresAt = Math.floor(Date.now() / 1000) + TOKEN_LIFETIME_SECONDS;
    const token = await new SignJWT({
      role: "authenticated",
      aud: "authenticated",
    })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setSubject(session.user.id)
      .setIssuedAt()
      .setExpirationTime(expiresAt)
      .sign(new TextEncoder().encode(jwtSecret));

    return NextResponse.json<RealtimeTokenResponse>({ token, expiresAt });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode },
      );
    }

    console.error("Failed to mint Supabase Realtime token:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
