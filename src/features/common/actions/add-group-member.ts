"use server";

import { z } from "zod";
import { CHAT_EVENTS } from "@/features/chat/constants";
import type { MessageWithSender } from "@/features/chat/types";
import { addGroupMemberTransaction, getRoomMemberIds } from "@/lib/db/queries";
import { roomActionClient } from "@/lib/safe-action";
import { broadcastToRoom, broadcastToUsers } from "@/lib/supabase/server";
import { AppError } from "@/utils/app-error";

const addGroupMemberSchema = z.object({
  roomId: z.uuid(),
  userIds: z.array(z.string().trim().min(1)).min(1),
});

export const addGroupMember = roomActionClient
  .inputSchema(addGroupMemberSchema)
  .action(
    async ({ parsedInput: { roomId, userIds }, ctx: { user, roomData } }) => {
      if (roomData.roomMember.role !== "admin") {
        throw new AppError("Only group admins can add members.", 403);
      }

      const uniqueUserIds = Array.from(
        new Set(userIds.filter((userId) => userId !== user.id)),
      );

      if (uniqueUserIds.length === 0) {
        throw new AppError("Select at least one user to add.", 400);
      }

      const { members, message } = await addGroupMemberTransaction({
        roomId,
        userIds: uniqueUserIds,
        addedByName: `@${user.username}`,
      });

      if (members.length === 0) {
        throw new AppError("Could not add this user to the group.", 500);
      }

      await broadcastToRoom<MessageWithSender>(
        roomId,
        CHAT_EVENTS.MESSAGE_UPDATES,
        {
          ...message,
          sender: null,
          replyToMessage: null,
        },
      );
      await broadcastToUsers(
        await getRoomMemberIds(roomId),
        CHAT_EVENTS.CHAT_LIST_UPDATED,
        { roomId },
      );

      return {
        userIds: members.map((member) => member.userId),
        addedBy: user.id,
      };
    },
  );
