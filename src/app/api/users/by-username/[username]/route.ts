import { NextResponse } from "next/server";
import { getUserByUsername } from "@/lib/db/queries/auth";
import { getUserSession } from "@/lib/getUser";
import { handleRouteError } from "@/utils/handle-error";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params;

  try {
    await getUserSession(request.headers);
    const profile = await getUserByUsername(username);

    if (!profile) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    return handleRouteError(error, "Error fetching user profile:");
  }
}
