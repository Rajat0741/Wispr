import { z } from "zod";
import { searchUsersByUsername } from "@/lib/db/queries/auth";
import { getUserSession } from "@/lib/getUser";
import { AppError } from "@/utils/app-error";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params;

  try {
    await getUserSession(request.headers);
    const query = z.string().trim().min(3).parse(username);
    const users = await searchUsersByUsername(query);
    return Response.json(users);

  } catch (error) {
    if (error instanceof AppError) {
      return Response.json(
        { error: error.message },
        { status: error.statusCode },
      );
    }
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: "Search requires at least 3 characters." },
        { status: 400 },
      );
    }
    console.error("Error searching users:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
