import { notFound } from "next/navigation";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getRoomWithMembers } from "@/lib/db/queries/room";
import { getUserSession } from "@/lib/getUser";

export default async function RoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  await getUserSession();
  const { roomId } = await params;
  if (!z.uuid().safeParse(roomId).success) notFound();

  const roomData = await getRoomWithMembers(roomId);
  const members = roomData?.room.members.map((member) => member.user) ?? [];

  if (!roomData) notFound();

  return (
    <section className="flex min-h-screen flex-1 flex-col bg-background">
      <header className="border-b px-6 py-5">
        <p className="text-xs font-medium text-muted-foreground">Room ID</p>
        <h1 className="break-all font-mono text-sm">{roomData.room.id}</h1>
      </header>
      <div className="flex flex-col gap-3 p-6">
        <h2 className="text-sm font-medium">Members</h2>
        <div className="flex flex-col gap-2">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-3 rounded-xl border p-3"
            >
              <Avatar>
                <AvatarImage
                  src={member.image ?? undefined}
                  alt={`${member.name}'s avatar`}
                />
                <AvatarFallback>
                  {member.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate font-medium">{member.name}</p>
                <p className="truncate text-sm text-muted-foreground">
                  @{member.username ?? "username unavailable"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
