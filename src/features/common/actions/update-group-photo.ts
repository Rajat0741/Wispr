"use server";

import { z } from "zod";
import { CHAT_EVENTS } from "@/features/chat/constants";
import type { MessageWithSender } from "@/features/chat/types";
import {
  getGroupImageFileId,
  getRoomMemberIds,
  updateGroupImageTransaction,
} from "@/lib/db/queries";
import { deleteImageKitFile } from "@/lib/imagekit/delete";
import { roomActionClient } from "@/lib/safe-action";
import { broadcastToRoom, broadcastToUsers } from "@/lib/supabase/server";
import { AppError } from "@/utils/app-error";

const updateGroupPhotoSchema = z.object({
  roomId: z.uuid(),
  groupImage: z.url().nullable(),
  groupImageFileId: z.string().nullable(),
});

export const updateGroupPhoto = roomActionClient
  .inputSchema(updateGroupPhotoSchema)
  .action(
    async ({
      parsedInput: { roomId, groupImage, groupImageFileId },
      ctx: { user, roomData },
    }) => {
      if (roomData.roomMember.role !== "admin") {
        throw new AppError("Only group admins can edit the group photo.", 403);
      }

      const oldFileId = await getGroupImageFileId(roomId);

      if (oldFileId) {
        await deleteImageKitFile(oldFileId);
      }

      const adminName = user.username
        ? `@${user.username}`
        : (user.name ?? "An admin");

      const result = await updateGroupImageTransaction({
        roomId,
        groupImage,
        groupImageFileId,
        adminName,
      });

      if (!result) {
        throw new AppError("Failed to update group photo.", 500);
      }

      const { updatedGroup, message } = result;

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
        broadcastToUsers(memberIds, CHAT_EVENTS.CHAT_LIST_UPDATED, { roomId }),
      ]);

      return {
        groupImage: updatedGroup.groupImage,
      };
    },
  );
