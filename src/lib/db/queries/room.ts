import { eq } from "drizzle-orm";
import type z from "zod";
import { db } from "../index";
import {
    insertRoomMemberSchema,
    insertRoomSchema,
    roomMembers,
    rooms,
} from "../schema";
import { user } from "../schema/auth-schema";

export const createRoom = async (data: z.infer<typeof insertRoomSchema>) => {
  const { dmKey, roomType } = insertRoomSchema.parse(data);
  const [room] = await db
    .insert(rooms)
    .values({
      roomType,
      dmKey,
    })
    .returning();

  return room;
};

export const createRoomMember = async (data: z.infer<typeof insertRoomMemberSchema>) => {
  const { roomId, userId, role } = insertRoomMemberSchema.parse(data);
  const [roomMember] = await db
    .insert(roomMembers)
    .values({
      roomId,
      userId,
      role,
    })
    .returning();

  return roomMember;
};

export const getRoomWithMembers = async (roomId: string) => {
  const room = await db.query.rooms.findFirst({
    where: eq(rooms.id, roomId),
    with: {
      members: {
        with: {
          user: true,
        },
      },
    },
  });

  if (!room) return null;

  return {
    room,
  };
};
