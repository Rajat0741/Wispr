"use server";

import z from "zod";
import { CHAT_EVENTS } from "@/features/chat/constants";
import type { MessageWithSender } from "@/features/chat/types";
import {
  createMessages,
  getMessageById,
  getRoomMembersForRooms,
} from "@/lib/db/queries";
import { roomActionClient } from "@/lib/safe-action";
import { broadcastToRoom, broadcastToUsers } from "@/lib/supabase/server";
import { AppError } from "@/utils/app-error";

const forwardMessageSchema = z.object({
  roomId: z.uuid("Invalid room ID"),
  messageId: z.uuid("Invalid message ID"),
  targetRoomIds: z
    .array(z.uuid("Invalid room ID"))
    .min(1, "At least one target room is required")
    .max(10, "Cannot forward to more than 10 chats at once"),
});

export const forwardMessage = roomActionClient
  .inputSchema(forwardMessageSchema)
  .action(
    async ({
      ctx: { user },
      parsedInput: { roomId, messageId, targetRoomIds },
    }) => {
      const originalMessage = await getMessageById(roomId, messageId);

      if (!originalMessage) {
        throw new AppError(
          "The message you are trying to forward was not found.",
          404,
        );
      }

      const memberships = await getRoomMembersForRooms(targetRoomIds);

      const userMemberRooms = memberships
        .filter((m) => m.userId === user.id)
        .map((m) => m.roomId);

      if (userMemberRooms.length < targetRoomIds.length) {
        throw new AppError(
          "You can only forward messages to conversations you are a member of.",
          403,
        );
      }

      const insertedMessages = await createMessages(
        targetRoomIds.map((roomId) => ({
          roomId,
          senderId: user.id,
          content: originalMessage.content,
          type: originalMessage.type,
          replyTo: null,
        })),
      );

      const createdMessages: MessageWithSender[] = insertedMessages.map(
        (newMessage) => ({
          ...newMessage,
          sender: {
            id: user.id,
            name: user.name,
            image: user.image ?? null,
            username: user.username ?? null,
            displayUsername: user.displayUsername ?? null,
            lastActiveAt: null,
          },
          replyToMessage: null,
        }),
      );

      const allUserIds = Array.from(new Set(memberships.map((m) => m.userId)));

      const messageBroadcastPromises = createdMessages.map((msg) =>
        broadcastToRoom(msg.roomId, CHAT_EVENTS.MESSAGE_UPDATES, msg),
      );

      const chatListBroadcastPromise = broadcastToUsers(
        allUserIds,
        CHAT_EVENTS.CHAT_LIST_UPDATED,
        { roomIds: targetRoomIds },
      );

      await Promise.all([
        ...messageBroadcastPromises,
        chatListBroadcastPromise,
      ]);

      return {
        messages: createdMessages,
        forwardedTo: targetRoomIds,
      };
    },
  );
