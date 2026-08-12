import { getUserById } from "@/lib/db/queries/auth";
import { getUserSession } from "@/lib/getUser";
import { AppError } from "@/utils/app-error";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params;

  try {
    await getUserSession(request.headers);
    const profile = await getUserById(userId);

    if (!profile) {
      return Response.json({ error: "User not found." }, { status: 404 });
    }

    return Response.json(profile);
  } catch (error) {
    if (error instanceof AppError) {
      return Response.json(
        { error: error.message },
        { status: error.statusCode },
      );
    }
    console.error("Error fetching user profile:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
