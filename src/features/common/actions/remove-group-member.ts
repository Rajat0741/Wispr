"use server";

import { z } from "zod";
import { CHAT_EVENTS } from "@/features/chat/constants";
import type { MessageWithSender } from "@/features/chat/types";
import {
  getRoomMemberIds,
  removeGroupMemberTransaction,
} from "@/lib/db/queries";
import { roomActionClient } from "@/lib/safe-action";
import { broadcastToRoom, broadcastToUsers } from "@/lib/supabase/server";
import { AppError } from "@/utils/app-error";

const removeGroupMemberSchema = z.object({
  roomId: z.uuid(),
  userId: z.string().trim().min(1),
});

export const removeGroupMember = roomActionClient
  .inputSchema(removeGroupMemberSchema)
  .action(
    async ({ parsedInput: { roomId, userId }, ctx: { user, roomData } }) => {
      if (roomData.roomMember.role !== "admin") {
        throw new AppError("Only group admins can remove members.", 403);
      }

      if (userId === user.id) {
        throw new AppError(
          "You cannot remove yourself from the group. Use leave group instead.",
          400,
        );
      }

      const allMemberIds = await getRoomMemberIds(roomId);

      const { message } = await removeGroupMemberTransaction({
        roomId,
        targetUserId: userId,
        adminName: `@${user.username}`,
      });

      await Promise.all([
        broadcastToRoom<MessageWithSender>(
          roomId,
          CHAT_EVENTS.MESSAGE_UPDATES,
          {
            ...message,
            sender: null,
            replyToMessage: null,
          },
        ),
        broadcastToRoom(roomId, CHAT_EVENTS.ROOM_DATA_UPDATED, { roomId }),
        broadcastToUsers(allMemberIds, CHAT_EVENTS.CHAT_LIST_UPDATED, {
          roomId,
        }),
      ]);

      return {
        removedUserId: userId,
      };
    },
  );
