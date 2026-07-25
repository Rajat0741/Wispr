import { and, eq, exists } from "drizzle-orm";
import { AppError } from "@/utils/app-error";
import { db } from "../index";
import { dms, groups, roomMembers, rooms } from "../schema";

export const createGroupTransaction = async ({
  name,
  creatorId,
  memberIds,
}: {
  name: string;
  creatorId: string;
  memberIds: string[];
}) => {
  return db.transaction(async (tx) => {
    const [room] = await tx
      .insert(rooms)
      .values({ roomType: "group" })
      .returning();

    if (!room) throw new AppError("Failed to create group conversation.", 500);

    await tx.insert(groups).values({
      roomId: room.id,
      name,
      createdBy: creatorId,
    });

    const membersToInsert = [
      {
        roomId: room.id,
        userId: creatorId,
        role: "admin" as const,
      },
      ...memberIds.map((id) => ({
        roomId: room.id,
        userId: id,
        role: "member" as const,
      })),
    ];

    await tx.insert(roomMembers).values(membersToInsert);

    return room;
  });
};

export const createDmTransaction = async ({
  user1Id,
  user2Id,
  dmKey,
}: {
  user1Id: string;
  user2Id: string;
  dmKey: string;
}) => {
  return db.transaction(async (tx) => {
    const existingDm = await tx.query.dms.findFirst({
      where: eq(dms.dmKey, dmKey),
    });

    if (existingDm) {
      return { roomId: existingDm.roomId };
    }

    const [room] = await tx
      .insert(rooms)
      .values({ roomType: "dm" })
      .returning();

    if (!room)
      throw new AppError("The conversation could not be created.", 500);

    const [dm] = await tx
      .insert(dms)
      .values({
        roomId: room.id,
        user1Id,
        user2Id,
        dmKey,
      })
      .onConflictDoNothing({ target: dms.dmKey })
      .returning();

    if (!dm) {
      const concurrentDm = await tx.query.dms.findFirst({
        where: eq(dms.dmKey, dmKey),
      });

      if (concurrentDm) {
        return { roomId: concurrentDm.roomId };
      }
      throw new AppError("The conversation could not be resolved.", 500);
    }

    await tx.insert(roomMembers).values([
      { roomId: room.id, userId: user1Id, role: "admin" },
      { roomId: room.id, userId: user2Id, role: "admin" },
    ]);

    return { roomId: room.id };
  });
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

export const checkUserMembershipInRoom = async (
  roomId: string,
  userId: string,
) => {
  const membership = await db.query.roomMembers.findFirst({
    where: and(eq(roomMembers.roomId, roomId), eq(roomMembers.userId, userId)),
  });

  return membership !== undefined;
};
