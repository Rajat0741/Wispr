import { and, eq } from "drizzle-orm";
import { db } from "../index";
import { roomMembers } from "../schema";

export const deleteRoomMember = async (roomId: string, userId: string) => {
  await db
    .delete(roomMembers)
    .where(and(eq(roomMembers.roomId, roomId), eq(roomMembers.userId, userId)));
};
