import { notFound } from "next/navigation";
import { z } from "zod";
import { RoomChat } from "@/features/chat/components/room-chat";
import { RoomChatProvider } from "@/features/chat/context/room-context";
import { getRoomWithMembers } from "@/lib/db/queries";
import { getUserSession } from "@/lib/getUser";

export default async function RoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const session = await getUserSession();
  const { roomId } = await params;
  if (!z.uuid().safeParse(roomId).success) notFound();

  const roomData = await getRoomWithMembers(roomId, session.user.id);
  if (!roomData) notFound();

  const { room } = roomData;

  return (
    <RoomChatProvider
      roomId={roomId}
      currentUserId={session.user.id}
      roomType={room.roomType}
      members={room.members.map(({ user, role }) => ({ ...user, role }))}
      group={room.group}
    >
      <RoomChat key={roomId} />
    </RoomChatProvider>
  );
}
