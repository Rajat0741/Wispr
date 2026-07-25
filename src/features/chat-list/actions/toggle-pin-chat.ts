"use server";

import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { checkUserMembershipInRoom } from "@/lib/db/queries";
import { roomMembers } from "@/lib/db/schema";
import { authActionClient } from "@/lib/safe-action";
import { AppError } from "@/utils/app-error";

const togglePinChatSchema = z.object({
  roomId: z.uuid(),
  isPinned: z.boolean(),
});

export const togglePinChat = authActionClient
  .inputSchema(togglePinChatSchema)
  .action(async ({ parsedInput: { roomId, isPinned }, ctx: { user } }) => {
    if (!(await checkUserMembershipInRoom(roomId, user.id))) {
      throw new AppError("Conversation not found.", 404);
    }

    await db
      .update(roomMembers)
      .set({ isPinned })
      .where(
        and(eq(roomMembers.roomId, roomId), eq(roomMembers.userId, user.id)),
      );
  });
