"use server";

import { z } from "zod";
import { getUserById } from "@/lib/db/queries/auth";
import { createRoom, createRoomMember } from "@/lib/db/queries/room";
import { authActionClient } from "@/lib/safe-action";
import { AppError } from "@/utils/app-error";
import { getDmKey } from "@/utils/get-dm-key ";

const createDmSchema = z.object({
  userId: z.string().trim().min(1),
});

export const createDm = authActionClient
  .inputSchema(createDmSchema)
  .action(async ({ parsedInput: { userId }, ctx: { user } }) => {
    if (userId === user.id) {
      throw new AppError("You cannot start a conversation with yourself.", 400);
    }

    const targetUser = await getUserById(userId);
    if (!targetUser) {
      throw new AppError("That user could not be found.", 404);
    }

    let room: Awaited<ReturnType<typeof createRoom>>;
    try {
      room = await createRoom({
        roomType: "dm",
        dmKey: getDmKey(user.id, targetUser.id),
      });
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "23505"
      ) {
        throw new AppError(
          "A conversation with this user already exists.",
          409,
        );
      }
      throw error;
    }

    if (!room) {
      throw new AppError("The conversation could not be created.", 500);
    }

    await Promise.all([
      createRoomMember({
        roomId: room.id,
        userId: user.id,
        role: "admin",
      }),
      createRoomMember({
        roomId: room.id,
        userId: targetUser.id,
        role: "admin",
      }),
    ]);

    return { roomId: room.id };
  });
