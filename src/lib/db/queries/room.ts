import { eq } from "drizzle-orm";
import type z from "zod";
import { db } from "../index";
import {
  dms,
  insertDmSchema,
  insertRoomMemberSchema,
  insertRoomSchema,
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

// Todo: Modify this to return group members data and settings only
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
