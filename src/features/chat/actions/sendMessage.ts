"use server";

import z from "zod";
import { CHAT_EVENTS } from "@/features/chat/constants";
import type { MessageWithSender } from "@/features/chat/types";
import {
  createMessage,
  getMessageById,
  getRoomMemberIds,
} from "@/lib/db/queries";
import { messageTypeSchema } from "@/lib/db/schema";
import { roomActionClient } from "@/lib/safe-action";
import { broadcastToRoom, broadcastToUsers } from "@/lib/supabase/server";
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
      const replyToMessage = replyTo
        ? await getMessageById(roomId, replyTo)
        : undefined;

      if (replyTo && !replyToMessage) {
        throw new AppError(
          "The message you are replying to was not found in this conversation.",
          400,
        );
      }

      const newMessage = await createMessage({
        roomId,
        senderId: user.id,
        content: message,
        type,
        replyTo: replyTo ?? null,
      });

      const messageWithSender: MessageWithSender = {
        ...newMessage,
        sender: {
          id: user.id,
          name: user.name ?? null,
          image: user.image ?? null,
        },
        replyToMessage: replyToMessage ?? null,
      };

      await broadcastToRoom<MessageWithSender>(
        roomId,
        CHAT_EVENTS.MESSAGE_UPDATES,
        messageWithSender,
      );
      await broadcastToUsers(
        await getRoomMemberIds(roomId),
        CHAT_EVENTS.CHAT_LIST_UPDATED,
        { roomId },
      );

      return messageWithSender;
    },
  );
