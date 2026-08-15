import { and, eq } from "drizzle-orm";
import { db, type TransactionScope } from "@/lib/db";
import { roomMembers } from "../schema";

export const deleteRoomMember = async (
  roomId: string,
  userId: string,
  executor: TransactionScope = db,
) => {
  await executor
    .delete(roomMembers)
    .where(and(eq(roomMembers.roomId, roomId), eq(roomMembers.userId, userId)));
};

export const pinChat = async (
  roomId: string,
  userId: string,
  isPinned: boolean,
  executor: TransactionScope = db,
) => {
  await executor
    .update(roomMembers)
    .set({ isPinned })
    .where(and(eq(roomMembers.roomId, roomId), eq(roomMembers.userId, userId)));
};
