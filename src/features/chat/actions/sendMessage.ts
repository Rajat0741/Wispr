"use server";

import z from "zod";
import type { MessageWithSender } from "@/features/chat/types";
import { createMessage } from "@/lib/db/queries";
import { messageTypeSchema } from "@/lib/db/schema";
import { roomActionClient } from "@/lib/safe-action";
import { broadcastToRoom } from "@/lib/supabase/server";

const sendMessageSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Message cannot be empty")
    .max(10000, "Message cannot exceed 10,000 characters"),
  roomId: z.uuid("Invalid room ID"),
  type: messageTypeSchema,
});

export const sendMessage = roomActionClient
  .inputSchema(sendMessageSchema)
  .action(async ({ ctx: { user }, parsedInput: { message, roomId, type } }) => {
    const newMessage = await createMessage({
      roomId,
      senderId: user.id,
      content: message,
      type,
    });

    const messageWithSender: MessageWithSender = {
      ...newMessage,
      sender: {
        id: user.id,
        name: user.name ?? null,
        image: user.image ?? null,
      },
    };

    await broadcastToRoom(roomId, "new-message", messageWithSender);

    return messageWithSender;
  });
