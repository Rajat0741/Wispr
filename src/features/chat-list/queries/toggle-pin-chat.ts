"use server";

import { z } from "zod";
import { pinChat } from "@/lib/db/queries/room-members";
import { roomActionClient } from "@/lib/safe-action";

const togglePinChatSchema = z.object({
    roomId: z.uuid(),
    isPinned: z.boolean(),
});

export const togglePinChat = roomActionClient
    .inputSchema(togglePinChatSchema)
    .action(async ({ parsedInput: { roomId, isPinned }, ctx: { user } }) => {
        await pinChat(roomId, user.id, isPinned);
    });
