import type { getRoomMessages } from "@/lib/db/queries";

export type MessageWithSender = Awaited<
  ReturnType<typeof getRoomMessages>
>[number];
