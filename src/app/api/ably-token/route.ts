import * as Ably from "ably";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rest = new Ably.Rest({ key: process.env.ABLY_API_KEY });
    const tokenRequest = await rest.auth.createTokenRequest({
      clientId: session.user.id,
      capability: {
        "*": ["publish", "subscribe", "presence", "history"],
      },
    });
    return NextResponse.json(tokenRequest);
  } catch (err) {
    console.error("Ably token creation failed:", err);
    return NextResponse.json(
      { error: "Failed to create token" },
      { status: 500 },
    );
  }
}
