import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  checkUserMembershipInRoom,
  getRoomMessagesPaginated,
} from "@/lib/db/queries";
import { getUserSession } from "@/lib/getUser";
import { AppError } from "@/utils/app-error";

const paramsSchema = z.object({ roomId: z.uuid() });
const querySchema = z.object({
  cursor: z.coerce.number().int().positive().optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ roomId: string }> },
) {
  try {
    const session = await getUserSession(req.headers);
    const { roomId } = paramsSchema.parse(await params);

    const isMember = await checkUserMembershipInRoom(roomId, session.user.id);
    if (!isMember) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { cursor } = querySchema.parse(
      Object.fromEntries(req.nextUrl.searchParams),
    );

    const data = await getRoomMessagesPaginated(roomId, cursor);
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Bad request" }, { status: 400 });
    }
    if (err instanceof AppError) {
      return NextResponse.json(
        { error: err.message },
        { status: err.statusCode },
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
