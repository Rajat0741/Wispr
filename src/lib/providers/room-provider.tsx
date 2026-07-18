"use client";
// We cannot use ChatRoomProvider ( client component ) directly in
// layout.tsx ( server component ) because it will cause hydration error
import { ChatRoomProvider } from "@ably/chat/react";

export function RoomProvider({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) {
  return <ChatRoomProvider name={name}>{children}</ChatRoomProvider>;
}
