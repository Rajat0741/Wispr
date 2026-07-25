import { getRoomsForUser } from "@/lib/db/queries";
import { getUserSession } from "@/lib/getUser";
import { AppError } from "@/utils/app-error";

export async function GET(request: Request) {
  try {
    const session = await getUserSession(request.headers);
    const rooms = await getRoomsForUser(session.user.id);

    const sortedRooms = [...rooms].sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;

      const aTimestamp = a.room.messages[0]?.createdAt ?? a.room.createdAt;
      const bTimestamp = b.room.messages[0]?.createdAt ?? b.room.createdAt;

      return bTimestamp.getTime() - aTimestamp.getTime();
    });

    // Extract room display metadata strictly based on room type
    const chatRooms = sortedRooms.map(({ room, isPinned }) => {
      const latestMessage = room.messages[0];
      const isDm = room.roomType === "dm";

      let name = "Conversation";
      let image: string | null = null;

      if (isDm && room.dm) {
        const partner = room.dm.user1Id === session.user.id ? room.dm.user2 : room.dm.user1;
        name = partner?.name ?? "Direct Message";
        image = partner?.image ?? null;
      } else if (room.group) {
        name = room.group.name;
        image = room.group.groupImage ?? null;
      }

      return {
        roomId: room.id,
        roomType: room.roomType,
        name,
        image,
        lastMessage: latestMessage?.content ?? null,
        lastMessageCreatedAt: latestMessage?.createdAt ?? null,
        isPinned,
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
