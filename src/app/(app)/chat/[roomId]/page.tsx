import { notFound } from "next/navigation";
import { z } from "zod";
import { ChatHeader } from "@/features/chat/components/chat-header";
import { RoomChat } from "@/features/chat/components/room-chat";
import { getRoomMetadata } from "@/features/chat/utils/getRoomMetadata";
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
  const { title, image, subtitle } = getRoomMetadata(
    room.roomType,
    room.members.map(({ user }) => user),
    session.user.id,
    room.group,
  );

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-background">
      <ChatHeader title={title} image={image} subtitle={subtitle} />
      <RoomChat
        key={roomId}
        roomId={roomId}
        currentUserId={session.user.id}
        roomType={room.roomType}
      />
    </div>
  );
}
