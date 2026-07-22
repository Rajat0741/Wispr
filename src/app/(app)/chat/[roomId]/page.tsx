import { notFound } from "next/navigation";
import { z } from "zod";
import { RoomChat } from "@/features/chat/components/room-chat";
import { getRoomMessages, getRoomWithMembers } from "@/lib/db/queries";
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

  const dbMessages = await getRoomMessages(roomId, 50);

  return (
    <RoomChat
      roomId={roomId}
      currentUserId={session.user.id}
      members={roomData.room.members.map(({ user }) => user)}
      roomType={roomData.room.roomType}
      group={roomData.room.group}
      initialMessages={dbMessages}
    />
  );
}
