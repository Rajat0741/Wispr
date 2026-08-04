"use server";

import { z } from "zod";
import { CHAT_EVENTS } from "@/features/chat/constants";
import { createGroupTransaction, getRoomMemberIds } from "@/lib/db/queries";
import { authActionClient } from "@/lib/safe-action";
import { broadcastToUsers } from "@/lib/supabase/server";
import { AppError } from "@/utils/app-error";

const createGroupSchema = z.object({
  name: z.string().trim().min(1, "Group name is required.").max(100),
  memberIds: z
    .array(z.string().trim().min(1))
    .min(1, "At least one member must be selected."),
});

export const createGroup = authActionClient
  .inputSchema(createGroupSchema)
  .action(async ({ parsedInput: { name, memberIds }, ctx: { user } }) => {
    // Filter out duplicate user IDs and creator ID
    const uniqueMemberIds = Array.from(
      new Set(memberIds.filter((id) => id !== user.id)),
    );

    if (uniqueMemberIds.length === 0) {
      throw new AppError(
        "Please select at least one member for the group.",
        400,
      );
    }

    try {
      const room = await createGroupTransaction({
        name,
        creatorId: user.id,
        memberIds: uniqueMemberIds,
      });

      await broadcastToUsers(
        await getRoomMemberIds(room.id),
        CHAT_EVENTS.CHAT_LIST_UPDATED,
        { roomId: room.id },
      );

      return { roomId: room.id };
    } catch (err) {
      if (err instanceof AppError) throw err;
      console.error("Error creating group:", err);
      throw new AppError("Could not complete group creation.", 500);
    }
  });
