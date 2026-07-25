import type z from "zod";
import { and, eq, lt } from "drizzle-orm";
import { db } from "@/lib/db";
import { type insertMessageSchema, messages } from "../schema";

const MESSAGE_PAGE_SIZE = 50;

export const createMessage = async (
  messageData: z.infer<typeof insertMessageSchema>,
) => {
  const response = await db.insert(messages).values(messageData).returning();
  return response[0];
};

/**
 * Cursor-based paginated messages for infinite scroll.
 * Fetches `MESSAGE_PAGE_SIZE` messages *older* than `cursor` (a createdAt ISO string),
 * ordered newest-first. The client reverses each page for chronological display.
 */
export const getRoomMessagesPaginated = async (
  roomId: string,
  cursor?: string,
) => {
  const where = cursor
    ? and(eq(messages.roomId, roomId), lt(messages.createdAt, new Date(cursor)))
    : eq(messages.roomId, roomId);

  const rows = await db.query.messages.findMany({
    where,
    orderBy: (messages, { desc }) => [desc(messages.createdAt)],
    limit: MESSAGE_PAGE_SIZE,
    with: {
      sender: {
        columns: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  const nextCursor =
    rows.length === MESSAGE_PAGE_SIZE
      ? rows[rows.length - 1].createdAt.toISOString()
      : null;

  return { messages: rows, nextCursor };
};
