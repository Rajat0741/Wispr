import { notFound } from "next/navigation";
import { z } from "zod";
import { RoomChat } from "@/features/chat/components/room-chat";
import { getRoomWithMembers } from "@/lib/db/queries/room";
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

  return (
    <RoomChat
      members={roomData.room.members.map(({ user }) => ({
        id: user.id,
        name: user.name,
        username: user.username,
        image: user.image,
      }))}
      roomType={roomData.room.roomType}
    />
  );
}
