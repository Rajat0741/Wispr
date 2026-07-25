import type { getRoomMessagesPaginated } from "@/lib/db/queries";

export type MessageWithSender = Awaited<
  ReturnType<typeof getRoomMessagesPaginated>
>["messages"][number];
