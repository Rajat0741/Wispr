"use server";

import { z } from "zod";
import { CHAT_EVENTS } from "@/features/chat/constants";
import { getRoomMemberIds, updateGroupDescriptionQuery } from "@/lib/db/queries";
import { roomActionClient } from "@/lib/safe-action";
import { broadcastToUsers } from "@/lib/supabase/server";
import { AppError } from "@/utils/app-error";

const updateGroupDescriptionSchema = z.object({
  roomId: z.uuid(),
  description: z
    .string()
    .trim()
    .max(300, "Description cannot exceed 300 characters."),
});

export const updateGroupDescription = roomActionClient
  .inputSchema(updateGroupDescriptionSchema)
  .action(
    async ({ parsedInput: { roomId, description }, ctx: { roomData } }) => {
      if (roomData.roomMember.role !== "admin") {
        throw new AppError(
          "Only group admins can edit the group description.",
          403,
        );
      }

      const updatedGroup = await updateGroupDescriptionQuery(
        roomId,
        description,
      );

      if (!updatedGroup) {
        throw new AppError("Failed to update group description.", 500);
      }

      const memberIds = await getRoomMemberIds(roomId);
      await broadcastToUsers(memberIds, CHAT_EVENTS.CHAT_LIST_UPDATED, {
        roomId,
      });

      return {
        description: updatedGroup.description,
      };
    },
  );
