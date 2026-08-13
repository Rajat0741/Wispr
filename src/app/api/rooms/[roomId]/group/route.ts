import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getRoomWithMembers } from "@/lib/db/queries";
import { getUserSession } from "@/lib/getUser";
import { handleRouteError } from "@/utils/handle-error";

const paramsSchema = z.object({ roomId: z.uuid() });

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ roomId: string }> },
) {
  try {
    const session = await getUserSession(req.headers);
    const { roomId } = paramsSchema.parse(await params);

    const result = await getRoomWithMembers(roomId, session.user.id);
    if (!result)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { room } = result;
    return NextResponse.json({
      roomType: room.roomType,
      members: room.members.map(({ user, role }) => ({ ...user, role })),
      group: room.group,
    });
  } catch (err) {
    return handleRouteError(err);
  }
}
