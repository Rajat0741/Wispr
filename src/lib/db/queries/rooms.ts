import { and, count, eq, exists, inArray } from "drizzle-orm";
import { AppError } from "@/utils/app-error";
import { db } from "../index";
import {
  user as authUser,
  dms,
  groups,
  messages,
  roomMembers,
  rooms,
} from "../schema";

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

export const addGroupMemberTransaction = async ({
  roomId,
  userIds,
  addedByName,
}: {
  roomId: string;
  userIds: string[];
  addedByName: string;
}) => {
  return db.transaction(async (tx) => {
    const group = await tx.query.groups.findFirst({
      where: eq(groups.roomId, roomId),
    });

    if (!group) {
      throw new AppError(
        "Members can only be added to group conversations.",
        400,
      );
    }

    const members = await tx
      .insert(roomMembers)
      .values(
        userIds.map((userId) => ({
          roomId,
          userId,
          role: "member" as const,
        })),
      )
      .onConflictDoNothing()
      .returning();

    if (members.length === 0) {
      throw new AppError(
        "The selected users are already members of the group.",
        400,
      );
    }

    const addedUsers = await tx.query.user.findMany({
      where: inArray(
        authUser.id,
        members.map((member) => member.userId),
      ),
      columns: { id: true, username: true },
    });

    const addedUserNames = addedUsers
      .map((addedUser) => `@${addedUser.username}`)
      .join(", ");

    const [message] = await tx
      .insert(messages)
      .values({
        roomId,
        type: "announcement",
        content: `${addedByName} added ${addedUserNames} to the group.`,
      })
      .returning();

    return { members, message };
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

export const leaveGroupTransaction = async (
  roomId: string,
  userId: string,
  userName: string,
) => {
  return db.transaction(async (tx) => {
    const leavingMember = await tx.query.roomMembers.findFirst({
      where: and(
        eq(roomMembers.roomId, roomId),
        eq(roomMembers.userId, userId),
      ),
    });

    if (leavingMember?.role === "admin") {
      const [result] = await tx
        .select({ count: count() })
        .from(roomMembers)
        .where(
          and(eq(roomMembers.roomId, roomId), eq(roomMembers.role, "admin")),
        );

      if ((result?.count ?? 0) <= 1) {
        throw new AppError(
          "You are the only admin. Assign another admin before leaving or delete the group instead.",
          400,
        );
      }
    }

    const [message] = await tx
      .insert(messages)
      .values({
        roomId,
        type: "announcement",
        content: `${userName} left the group.`,
      })
      .returning();

    await tx
      .delete(roomMembers)
      .where(
        and(eq(roomMembers.roomId, roomId), eq(roomMembers.userId, userId)),
      );

    return message;
  });
};

export const getRoomById = async (roomId: string) => {
  return db.query.rooms.findFirst({
    where: eq(rooms.id, roomId),
  });
};

export const getGroupImageFileId = async (
  roomId: string,
): Promise<string | null> => {
  const group = await db.query.groups.findFirst({
    where: eq(groups.roomId, roomId),
    columns: { groupImageFileId: true },
  });
  return group?.groupImageFileId ?? null;
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
            orderBy: (messages, { desc }) => [desc(messages.displayOrder)],
            limit: 1,
          },
        },
      },
    },
  });
};

export const getRoomMemberIds = async (roomId: string) => {
  const members = await db
    .select({ userId: roomMembers.userId })
    .from(roomMembers)
    .where(eq(roomMembers.roomId, roomId));

  return members.map(({ userId }) => userId);
};

export const checkUserMembershipInRoom = async (
  roomId: string,
  userId: string,
) => {
  const roomMember = await db.query.roomMembers.findFirst({
    where: and(eq(roomMembers.roomId, roomId), eq(roomMembers.userId, userId)),
  });

  return roomMember;
};

export const updateGroupDescriptionTransaction = async (
  roomId: string,
  description: string,
  adminName: string,
) => {
  return db.transaction(async (tx) => {
    const [updatedGroup] = await tx
      .update(groups)
      .set({ description })
      .where(eq(groups.roomId, roomId))
      .returning();

    if (!updatedGroup) return null;

    const [message] = await tx
      .insert(messages)
      .values({
        roomId,
        type: "announcement",
        content: `${adminName} updated the group description.`,
      })
      .returning();

    return { updatedGroup, message };
  });
};

export const updateGroupImageTransaction = async ({
  roomId,
  groupImage,
  groupImageFileId,
  adminName,
}: {
  roomId: string;
  groupImage: string | null;
  groupImageFileId: string | null;
  adminName: string;
}) => {
  return db.transaction(async (tx) => {
    const [updatedGroup] = await tx
      .update(groups)
      .set({ groupImage, groupImageFileId })
      .where(eq(groups.roomId, roomId))
      .returning();

    if (!updatedGroup) return null;

    const content = groupImage
      ? `${adminName} updated the group photo.`
      : `${adminName} removed the group photo.`;

    const [message] = await tx
      .insert(messages)
      .values({
        roomId,
        type: "announcement",
        content,
      })
      .returning();

    return { updatedGroup, message };
  });
};

export const removeGroupMemberTransaction = async ({
  roomId,
  targetUserId,
  adminName,
}: {
  roomId: string;
  targetUserId: string;
  adminName: string;
}) => {
  return db.transaction(async (tx) => {
    const group = await tx.query.groups.findFirst({
      where: eq(groups.roomId, roomId),
    });

    if (!group) {
      throw new AppError("Group not found.", 404);
    }

    if (targetUserId === group.createdBy) {
      throw new AppError("The group creator cannot be removed.", 400);
    }

    const targetMember = await tx.query.roomMembers.findFirst({
      where: and(
        eq(roomMembers.roomId, roomId),
        eq(roomMembers.userId, targetUserId),
      ),
      with: {
        user: true,
      },
    });

    if (!targetMember) {
      throw new AppError("Member not found in group.", 404);
    }

    if (targetMember.role === "admin") {
      const [result] = await tx
        .select({ count: count() })
        .from(roomMembers)
        .where(
          and(eq(roomMembers.roomId, roomId), eq(roomMembers.role, "admin")),
        );

      if ((result?.count ?? 0) <= 1) {
        throw new AppError("Cannot remove the only admin in the group.", 400);
      }
    }

    const targetUserName = targetMember.user?.username
      ? `@${targetMember.user.username}`
      : (targetMember.user?.name ?? "a member");

    const [message] = await tx
      .insert(messages)
      .values({
        roomId,
        type: "announcement",
        content: `${adminName} removed ${targetUserName} from the group.`,
      })
      .returning();

    await tx
      .delete(roomMembers)
      .where(
        and(
          eq(roomMembers.roomId, roomId),
          eq(roomMembers.userId, targetUserId),
        ),
      );

    return { message, targetUserId };
  });
};

export const updateGroupMemberRoleTransaction = async ({
  roomId,
  targetUserId,
  adminName,
  newRole,
}: {
  roomId: string;
  targetUserId: string;
  adminName: string;
  newRole: "admin" | "member";
}) => {
  return db.transaction(async (tx) => {
    const group = await tx.query.groups.findFirst({
      where: eq(groups.roomId, roomId),
    });

    if (!group) {
      throw new AppError("Group not found.", 404);
    }

    const targetMember = await tx.query.roomMembers.findFirst({
      where: and(
        eq(roomMembers.roomId, roomId),
        eq(roomMembers.userId, targetUserId),
      ),
      with: {
        user: true,
      },
    });

    if (!targetMember) {
      throw new AppError("Member not found in group.", 404);
    }

    if (targetMember.role === newRole) {
      throw new AppError(
        newRole === "admin"
          ? "User is already an admin."
          : "User is already a regular member.",
        400,
      );
    }

    if (newRole === "member") {
      if (targetUserId === group.createdBy) {
        throw new AppError(
          "The group creator cannot be dismissed as admin.",
          400,
        );
      }

      const [result] = await tx
        .select({ count: count() })
        .from(roomMembers)
        .where(
          and(eq(roomMembers.roomId, roomId), eq(roomMembers.role, "admin")),
        );

      if ((result?.count ?? 0) <= 1) {
        throw new AppError("Cannot dismiss the only admin in the group.", 400);
      }
    }

    await tx
      .update(roomMembers)
      .set({ role: newRole })
      .where(
        and(
          eq(roomMembers.roomId, roomId),
          eq(roomMembers.userId, targetUserId),
        ),
      );

    const targetUserName = targetMember.user?.username
      ? `@${targetMember.user.username}`
      : (targetMember.user?.name ?? "a member");

    const content =
      newRole === "admin"
        ? `${adminName} made ${targetUserName} a group admin.`
        : `${adminName} dismissed ${targetUserName} as group admin.`;

    const [message] = await tx
      .insert(messages)
      .values({
        roomId,
        type: "announcement",
        content,
      })
      .returning();

    return { message, targetUserId, newRole };
  });
};
