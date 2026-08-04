"use server";

import z from "zod";
import { CHAT_EVENTS } from "@/features/chat/constants";
import type { MessageWithSender } from "@/features/chat/types";
import {
  deleteMessageInRoom,
  getMessageById,
} from "@/lib/db/queries";
import { roomActionClient } from "@/lib/safe-action";
import { broadcastToRoom } from "@/lib/supabase/server";
import { AppError } from "@/utils/app-error";

const deleteMessageSchema = z.object({
  roomId: z.string().uuid("Invalid room ID"),
  messageId: z.string().uuid("Invalid message ID"),
});

export const deleteMessage = roomActionClient
  .inputSchema(deleteMessageSchema)
  .action(
    async ({
      ctx: { user, roomData: { roomMember } },
      parsedInput: { roomId, messageId },
    }) => {
      const existingMessage = await getMessageById(roomId, messageId);
      if (!existingMessage) {
        throw new AppError("Message not found", 404);
      }

      const isSender = existingMessage.senderId === user.id;
      const isAdmin = roomMember.role === "admin";

      if (!isSender && !isAdmin) {
        throw new AppError(
          "Unauthorized Access",
          403,
        );
      }

      await deleteMessageInRoom(roomId, messageId);
      const updatedMessage = await getMessageById(roomId, messageId);

      if (updatedMessage) {
        await broadcastToRoom<MessageWithSender>(
          roomId,
          CHAT_EVENTS.MESSAGE_UPDATES,
          updatedMessage,
        );
      }

      return { messageId };
    },
  );
