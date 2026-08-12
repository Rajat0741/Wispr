"use server";

import { z } from "zod";
import { CHAT_EVENTS } from "@/features/chat/constants";
import type { MessageWithSender } from "@/features/chat/types";
import { getRoomMemberIds, leaveGroupTransaction } from "@/lib/db/queries";
import { roomActionClient } from "@/lib/safe-action";
import { broadcastToRoom, broadcastToUsers } from "@/lib/supabase/server";

const leaveGroupSchema = z.object({
  roomId: z.uuid(),
});

export const leaveGroup = roomActionClient
  .inputSchema(leaveGroupSchema)
  .action(async ({ parsedInput: { roomId }, ctx: { user } }) => {
    const memberIds = await getRoomMemberIds(roomId);
    const message = await leaveGroupTransaction(
      roomId,
      user.id,
      `@${user.username}`,
    );

    await broadcastToRoom<MessageWithSender>(
      roomId,
      CHAT_EVENTS.MESSAGE_UPDATES,
      {
        ...message,
        sender: null,
        replyToMessage: null,
      },
    );
    await broadcastToUsers(memberIds, CHAT_EVENTS.CHAT_LIST_UPDATED, {
      roomId,
    });
  });
