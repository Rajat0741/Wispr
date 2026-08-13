import { NextResponse } from "next/server";
import { z } from "zod";
import { searchUsersByUsername } from "@/lib/db/queries/auth";
import { getUserSession } from "@/lib/getUser";
import { handleRouteError } from "@/utils/handle-error";

const usernameSchema = z
  .string()
  .trim()
  .min(3, "Search requires at least 3 characters.");

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params;

  try {
    const session = await getUserSession(request.headers);
    const query = usernameSchema.parse(username);
    const { searchParams } = new URL(request.url);

    const excludeParam = searchParams.get("exclude");
    const clientExclude = excludeParam
      ? excludeParam
          .split(",")
          .map((id) => id.trim())
          .filter(Boolean)
      : [];

    const excludedUserIds = Array.from(
      new Set([session.user.id, ...clientExclude]),
    );

    const users = await searchUsersByUsername({
      query,
      excludedUserIds,
    });
    return NextResponse.json(users);
  } catch (error) {
    return handleRouteError(error, "Error searching users:");
  }
}
