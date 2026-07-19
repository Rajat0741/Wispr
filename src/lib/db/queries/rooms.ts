import { and, eq, exists } from "drizzle-orm";
import type z from "zod";
import { db } from "../index";
import {
  dms,
  insertDmSchema,
  insertRoomMemberSchema,
  insertRoomSchema,
  messages,
  roomMembers,
  rooms,
} from "../schema";

export const createRoom = async (data: z.infer<typeof insertRoomSchema>) => {
  const { roomType } = insertRoomSchema.parse(data);
  const [room] = await db
    .insert(rooms)
    .values({
      roomType,
    })
    .returning();

  return room;
};

export const createRoomMembers = async (
  data: z.infer<typeof insertRoomMemberSchema>[],
) => {
  const parsedData = data.map((item) => insertRoomMemberSchema.parse(item));
  const members = await db.insert(roomMembers).values(parsedData).returning();

  return members;
};

export const createDmRecord = async (data: z.infer<typeof insertDmSchema>) => {
  const [dm] = await db
    .insert(dms)
    .values(insertDmSchema.parse(data))
    .onConflictDoNothing({ target: dms.dmKey })
    .returning();

  return dm;
};

export const getDmByKey = async (dmKey: string) => {
  const dm = await db.query.dms.findFirst({
    where: eq(dms.dmKey, dmKey),
  });

  return dm ?? null;
};

export const deleteRoom = async (roomId: string) => {
  await db.delete(rooms).where(eq(rooms.id, roomId));
};

// exists check for room membership of user
export const getRoomWithMembers = async (roomId: string, userId: string) => {
  const room = await db.query.rooms.findFirst({
    where: and(
      eq(rooms.id, roomId),
      exists(
        db
          .select({ roomId: roomMembers.roomId })
          .from(roomMembers)
          .where(
            and(
              eq(roomMembers.roomId, rooms.id),
              eq(roomMembers.userId, userId),
            ),
          ),
      ),
    ),
    with: {
      members: {
        with: {
          user: true,
        },
      },
      group: true,
    },
  });

  if (!room) return null;

  return {
    room,
  };
};

export const getRoomsForUser = async (userId: string) => {
  return db.query.roomMembers.findMany({
    where: eq(roomMembers.userId, userId),
    with: {
      room: {
        with: {
          dm: {
            with: {
              user1: true,
              user2: true,
            },
          },
          group: true,
          messages: {
            orderBy: (messages, { desc }) => [desc(messages.createdAt)],
            limit: 1,
          },
        },
      },
    },
  });
};

export const getRoomMessages = async (roomId: string, limit = 50) => {
  return db.query.messages.findMany({
    where: eq(messages.roomId, roomId),
    orderBy: (messages, { desc }) => [desc(messages.createdAt)],
    limit,
    with: {
      sender: true,
    },
  });
};

export const checkUserMembershipInRoom = async (roomId: string, userId: string) => {
  const membership = await db.query.roomMembers.findFirst({
    where: and(
      eq(roomMembers.roomId, roomId),
      eq(roomMembers.userId, userId),
    ),
  });
  
  return membership !== null;
}
