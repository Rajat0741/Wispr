"use server";

import z from "zod";
import { checkUserMembershipInRoom, createMessage } from "@/lib/db/queries";
import { messageTypeSchema } from "@/lib/db/schema";
import { authActionClient } from "@/lib/safe-action";
import { broadcastToRoom } from "@/lib/supabase/server";
import { AppError } from "@/utils/app-error";

const sendMessageSchema = z.object({
  message: z.string().trim().min(1, "Message cannot be empty"),
  roomId: z.string().uuid("Invalid room ID"),
  type: messageTypeSchema,
});

export const sendMessage = authActionClient
  .inputSchema(sendMessageSchema)
  .action(async ({ ctx: { user }, parsedInput: { message, roomId, type } }) => {
    const isMember = await checkUserMembershipInRoom(roomId, user.id);

    if (!isMember) {
      throw new AppError("User is not a member of this room", 403);
    }

    const newMessage = await createMessage({
      roomId,
      senderId: user.id,
      content: message,
      type,
    });

    if (!newMessage) {
      throw new AppError("The message could not be created", 500);
    }

    await broadcastToRoom(roomId, "new-message", newMessage);

    return newMessage;
  });
