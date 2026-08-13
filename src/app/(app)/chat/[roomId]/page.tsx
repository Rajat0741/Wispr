import { notFound } from "next/navigation";
import { z } from "zod";
import { ChatProvider } from "@/features/chat/components/layout/chat-provider";
import { RoomChat } from "@/features/chat/components/layout/room-chat";
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

  if (!(await getRoomWithMembers(roomId, session.user.id))) notFound();

  return (
    <ChatProvider roomId={roomId}>
      <RoomChat key={roomId} />
    </ChatProvider>
  );
}
