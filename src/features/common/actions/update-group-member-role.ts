"use server";

import { z } from "zod";
import { CHAT_EVENTS } from "@/features/chat/constants";
import type { MessageWithSender } from "@/features/chat/types";
import {
  getRoomMemberIds,
  updateGroupMemberRoleTransaction,
} from "@/lib/db/queries";
import { roomActionClient } from "@/lib/safe-action";
import { broadcastToRoom, broadcastToUsers } from "@/lib/supabase/server";
import { AppError } from "@/utils/app-error";

const updateGroupMemberRoleSchema = z.object({
  roomId: z.uuid(),
  userId: z.string().trim().min(1),
  role: z.enum(["admin", "member"]),
});

export const updateGroupMemberRole = roomActionClient
  .inputSchema(updateGroupMemberRoleSchema)
  .action(
    async ({
      parsedInput: { roomId, userId, role },
      ctx: { user, roomData },
    }) => {
      if (roomData.roomMember.role !== "admin") {
        throw new AppError("Only group admins can change member roles.", 403);
      }

      if (userId === user.id) {
        throw new AppError("You cannot change your own role.", 400);
      }

      const { message } = await updateGroupMemberRoleTransaction({
        roomId,
        targetUserId: userId,
        adminName: `@${user.username}`,
        newRole: role,
      });

      const memberIds = await getRoomMemberIds(roomId);

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
        broadcastToUsers(memberIds, CHAT_EVENTS.CHAT_LIST_UPDATED, {
          roomId,
        }),
      ]);

      return {
        userId,
        role,
      };
    },
  );
