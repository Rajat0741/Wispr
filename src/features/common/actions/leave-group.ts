"use server";

import { z } from "zod";
import { CHAT_EVENTS } from "@/features/chat/constants";
import type { MessageWithSender } from "@/features/chat/types";
import { leaveGroupTransaction } from "@/lib/db/queries";
import { roomActionClient } from "@/lib/safe-action";
import { broadcastToRoom } from "@/lib/supabase/server";

const leaveGroupSchema = z.object({
  roomId: z.uuid(),
});

export const leaveGroup = roomActionClient
  .inputSchema(leaveGroupSchema)
  .action(async ({ parsedInput: { roomId }, ctx: { user } }) => {
    const message = await leaveGroupTransaction(
      roomId,
      user.id,
      user.name ?? "A user",
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
  });
