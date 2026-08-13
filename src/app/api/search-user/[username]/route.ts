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
    await getUserSession(request.headers);
    const query = usernameSchema.parse(username);
    const users = await searchUsersByUsername(query);
    return NextResponse.json(users);
  } catch (error) {
    return handleRouteError(error, "Error searching users:");
  }
}
