import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  checkUserMembershipInRoom,
  getRoomMessagesPaginated,
} from "@/lib/db/queries";
import { getUserSession } from "@/lib/getUser";
import { handleRouteError } from "@/utils/handle-error";

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
    return handleRouteError(err);
  }
}
