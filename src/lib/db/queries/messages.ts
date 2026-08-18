import { and, eq, lt } from "drizzle-orm";
import type z from "zod";
import { db, type TransactionScope } from "@/lib/db";
import { type insertMessageSchema, messages } from "../schema";

const MESSAGE_PAGE_SIZE = 50;

const defaultMessageWithRelations = {
  with: {
    sender: {
      columns: {
        id: true,
        name: true,
        image: true,
        username: true,
        displayUsername: true,
        lastActiveAt: true,
      },
    },
    replyToMessage: {
      columns: {
        id: true,
        displayOrder: true,
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

export const createMessages = async (
  messagesData: z.infer<typeof insertMessageSchema>[],
  executor: TransactionScope = db,
) => {
  if (messagesData.length === 0) return [];
  return executor.insert(messages).values(messagesData).returning();
};

export const getMessageById = async (roomId: string, messageId: string) =>
  db.query.messages.findFirst({
    where: and(eq(messages.roomId, roomId), eq(messages.id, messageId)),
    ...defaultMessageWithRelations,
  });

export const getRoomMessagesPaginated = async (
  roomId: string,
  cursor?: number,
) => {
  const baseWhere = and(
    eq(messages.roomId, roomId),
    eq(messages.isDeleted, false),
  );

  const where = cursor
    ? and(baseWhere, lt(messages.displayOrder, cursor))
    : baseWhere;

  const rows = await db.query.messages.findMany({
    where,
    orderBy: (messages, { desc }) => [desc(messages.displayOrder)],
    limit: MESSAGE_PAGE_SIZE,
    ...defaultMessageWithRelations,
  });

  const nextCursor =
    rows.length === MESSAGE_PAGE_SIZE
      ? rows[rows.length - 1].displayOrder
      : null;

  return { messages: rows, nextCursor };
};

export const deleteMessageInRoom = async (
  roomId: string,
  messageId: string,
  executor: TransactionScope = db,
) => {
  await executor
    .update(messages)
    .set({ isDeleted: true, content: "Deleted Message" })
    .where(and(eq(messages.roomId, roomId), eq(messages.id, messageId)));
};
