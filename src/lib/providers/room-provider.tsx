"use client";

export function RoomProvider({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
