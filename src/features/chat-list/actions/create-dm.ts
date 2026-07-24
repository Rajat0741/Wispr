"use server";

import { z } from "zod";
import { createDmTransaction, getUserById } from "@/lib/db/queries";
import { authActionClient } from "@/lib/safe-action";
import { AppError } from "@/utils/app-error";
import { getDmKey } from "@/utils/get-dm-key";

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

    const dmKey = getDmKey(user.id, targetUser.id);

    try {
      const { roomId } = await createDmTransaction({
        user1Id: user.id,
        user2Id: targetUser.id,
        dmKey,
      });

      return { roomId };
    } catch (err) {
      if (err instanceof AppError) throw err;
      console.error("Error creating DM:", err);
      throw new AppError("Could not complete DM creation.", 500);
    }
  });
