import { and, eq, lt } from "drizzle-orm";
import type z from "zod";
import { db } from "@/lib/db";
import { type insertMessageSchema, messages } from "../schema";

const MESSAGE_PAGE_SIZE = 50;

const defaultMessageWithRelations = {
  with: {
    sender: {
      columns: {
        id: true,
        name: true,
        image: true,
      },
    },
    replyTo: {
      columns: {
        id: true,
        type: true,
        content: true,
        createdAt: true,
      },
      with: {
        sender: {
          columns: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    },
  },
} as const;

export const createMessage = async (
  messageData: z.infer<typeof insertMessageSchema>,
) => {
  const response = await db.insert(messages).values(messageData).returning();
  return response[0];
};

export const getMessageById = async (roomId: string, messageId: string) =>
  db.query.messages.findFirst({
    where: and(eq(messages.roomId, roomId), eq(messages.id, messageId)),
    ...defaultMessageWithRelations,
  });

export const checkMessageExistsInRoom = async (
  roomId: string,
  messageId: string,
) => {
  const [existing] = await db
    .select({ id: messages.id })
    .from(messages)
    .where(and(eq(messages.roomId, roomId), eq(messages.id, messageId)))
    .limit(1);
  return !!existing;
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
    ...defaultMessageWithRelations,
  });

  const nextCursor =
    rows.length === MESSAGE_PAGE_SIZE
      ? rows[rows.length - 1].createdAt.toISOString()
      : null;

  return { messages: rows, nextCursor };
};
