"use server";

import { z } from "zod";
import { CHAT_EVENTS } from "@/features/chat/constants";
import type { MessageWithSender } from "@/features/chat/types";
import {
  getRoomMemberIds,
  updateGroupDescriptionTransaction,
} from "@/lib/db/queries";
import { roomActionClient } from "@/lib/safe-action";
import { broadcastToRoom, broadcastToUsers } from "@/lib/supabase/server";
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
    async ({
      parsedInput: { roomId, description },
      ctx: { user, roomData },
    }) => {
      if (roomData.roomMember.role !== "admin") {
        throw new AppError(
          "Only group admins can edit the group description.",
          403,
        );
      }

      const result = await updateGroupDescriptionTransaction(
        roomId,
        description,
        `@${user.username}`,
      );

      if (!result) {
        throw new AppError("Failed to update group description.", 500);
      }

      const { updatedGroup, message } = result;

      const memberIds = await getRoomMemberIds(roomId);

      await Promise.all([
        // Append the announcement to the active room's message list
        broadcastToRoom<MessageWithSender>(
          roomId,
          CHAT_EVENTS.MESSAGE_UPDATES,
          {
            ...message,
            sender: null,
            replyToMessage: null,
          },
        ),
        // Signal active room members to refetch group metadata
        broadcastToRoom(roomId, CHAT_EVENTS.ROOM_DATA_UPDATED, { roomId }),
        // Refresh the chat-list sidebar for all members
        broadcastToUsers(memberIds, CHAT_EVENTS.CHAT_LIST_UPDATED, { roomId }),
      ]);

      return {
        description: updatedGroup.description,
      };
    },
  );
