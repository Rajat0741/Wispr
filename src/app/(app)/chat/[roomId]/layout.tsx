import { RoomProvider } from "../../../../lib/providers/room-provider";

export default async function Page({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;

  return (
    <div className="flex">
      <RoomProvider name={roomId}>{children}</RoomProvider>
    </div>
  );
}
