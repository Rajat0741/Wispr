"use server";

import { z } from "zod";
import {
  createDmRecord,
  createRoom,
  createRoomMembers,
  deleteRoom,
  getDmByKey,
  getUserById
} from "@/lib/db/queries";
import { authActionClient } from "@/lib/safe-action";
import { AppError } from "@/utils/app-error";
import { getDmKey } from "@/utils/get-dm-key ";

const createDmSchema = z.object({
  userId: z.string().trim().min(1),
});

/*
* 1. Check duplicate or non-existing user
* 2. Check if DM already exists
* 3. Create new Room and DM record
* 4. Delete Room if DM record creation fails
* 5. Create Room Members and return Room ID
*/

export const createDm = authActionClient
  .inputSchema(createDmSchema)
  .action(async ({ parsedInput: { userId }, ctx: { user } }) => {
    // 1. Check duplicate or non-existing user
    if (userId === user.id) {
      throw new AppError("You cannot start a conversation with yourself.", 400);
    }

    const targetUser = await getUserById(userId);
    if (!targetUser) {
      throw new AppError("That user could not be found.", 404);
    }
    // 2. Check if DM already exists
    const dmKey = getDmKey(user.id, targetUser.id);
    const existingDm = await getDmByKey(dmKey);
    if (existingDm) {
      return { roomId: existingDm.roomId };
    }
    // 3. Create new Room and DM record
    const room = await createRoom({
      roomType: "dm",
    });

    if (!room) {
      throw new AppError("The conversation could not be created.", 500);
    }

    const dm = await createDmRecord({
      roomId: room.id,
      user1Id: user.id,
      user2Id: targetUser.id,
      dmKey,
    });
    // 4. Delete Room if DM record creation fails
    if (!dm) {
      await deleteRoom(room.id);

      const existingDm = await getDmByKey(dmKey);
      if (!existingDm) {
        throw new AppError("The conversation could not be resolved.", 500);
      }

      return { roomId: existingDm.roomId };
    }
    // 5. Create Room Members and return Room ID
    await createRoomMembers([
      {
        roomId: room.id,
        userId: user.id,
        role: "admin",
      },
      {
        roomId: room.id,
        userId: targetUser.id,
        role: "admin",
      },
    ]);

    return { roomId: room.id };
  });
