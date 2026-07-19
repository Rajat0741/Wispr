import { getRoomsForUser } from "@/lib/db/queries";
import { getUserSession } from "@/lib/getUser";
import { AppError } from "@/utils/app-error";

export async function GET(request: Request) {
  try {
    const session = await getUserSession(request.headers);
    const rooms = await getRoomsForUser(session.user.id);
    const sortedRooms = [...rooms].sort((a, b) => {
      const aTimestamp = a.room.messages[0]?.createdAt ?? a.room.createdAt;
      const bTimestamp = b.room.messages[0]?.createdAt ?? b.room.createdAt;

      return bTimestamp.getTime() - aTimestamp.getTime();
    });

    // Filter out other users from DM rooms
    const chatRooms = sortedRooms.map(({ room }) => {
      const otherDmUser =
        room.dm?.user1Id === session.user.id ? room.dm.user2 : room.dm?.user1;
      const latestMessage = room.messages[0];

      return {
        roomId: room.id,
        name: room.group?.name ?? otherDmUser?.name ?? "Conversation",
        image: room.group?.groupImage ?? otherDmUser?.image ?? null,
        lastMessage: latestMessage?.content ?? null,
        lastMessageCreatedAt: latestMessage?.createdAt ?? null,
      };
    });

    return Response.json(chatRooms);
  } catch (error) {
    if (error instanceof AppError) {
      return Response.json(
        { error: error.message },
        { status: error.statusCode },
      );
    }

    console.error("Error loading chat rooms:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
