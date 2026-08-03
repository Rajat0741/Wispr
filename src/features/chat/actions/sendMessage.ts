"use server";

import z from "zod";
import type { MessageWithSender } from "@/features/chat/types";
import {
  checkMessageExistsInRoom,
  createMessage,
  getMessageById,
} from "@/lib/db/queries";
import { messageTypeSchema } from "@/lib/db/schema";
import { roomActionClient } from "@/lib/safe-action";
import { broadcastToRoom } from "@/lib/supabase/server";
import { AppError } from "@/utils/app-error";

const sendMessageSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Message cannot be empty")
    .max(10000, "Message cannot exceed 10,000 characters"),
  roomId: z.uuid("Invalid room ID"),
  type: messageTypeSchema,
  replyTo: z.uuid("Invalid reply target").optional(),
});

export const sendMessage = roomActionClient
  .inputSchema(sendMessageSchema)
  .action(
    async ({
      ctx: { user },
      parsedInput: { message, roomId, type, replyTo },
    }) => {
      if (replyTo) {
        const exists = await checkMessageExistsInRoom(roomId, replyTo);
        if (!exists) {
          throw new AppError(
            "The message you are replying to was not found in this conversation.",
            400,
          );
        }
      }

      const newMessage = await createMessage({
        roomId,
        senderId: user.id,
        content: message,
        type,
        replyTo: replyTo ?? null,
      });

      const messageWithSender = await getMessageById(
        roomId,
        newMessage.id,
      );
      if (!messageWithSender) {
        throw new AppError(
          "The message could not be loaded after sending.",
          500,
        );
      }

      await broadcastToRoom<MessageWithSender>(
        roomId,
        "new-message",
        messageWithSender,
      );

      return messageWithSender;
    },
  );

