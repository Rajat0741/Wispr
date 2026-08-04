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
    replyToMessage: {
      columns: {
        id: true,
        type: true,
        content: true,
        isDeleted: true,
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


/**
 * Cursor-based paginated messages for infinite scroll.
 * Fetches `MESSAGE_PAGE_SIZE` messages *older* than `cursor` (a createdAt ISO string),
 * ordered newest-first. The client reverses each page for chronological display.
 */
export const getRoomMessagesPaginated = async (
  roomId: string,
  cursor?: string,
) => {
  const baseWhere = and(
    eq(messages.roomId, roomId),
    eq(messages.isDeleted, false),
  );

  const where = cursor
    ? and(baseWhere, lt(messages.createdAt, new Date(cursor)))
    : baseWhere;

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

export const deleteMessageInRoom = async (
  roomId: string,
  messageId: string,
) => {
  await db
    .update(messages)
    .set({ isDeleted: true, content: "Deleted Message" })
    .where(and(eq(messages.roomId, roomId), eq(messages.id, messageId)));
};
