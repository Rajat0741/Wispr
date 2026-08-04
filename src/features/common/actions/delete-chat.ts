"use server";

import { z } from "zod";
import { CHAT_EVENTS } from "@/features/chat/constants";
import { deleteRoom, getRoomById, getRoomMemberIds } from "@/lib/db/queries";
import { roomActionClient } from "@/lib/safe-action";
import { broadcastToUsers } from "@/lib/supabase/server";
import { AppError } from "@/utils/app-error";

const deleteChatSchema = z.object({
  roomId: z.uuid(),
});

export const deleteChat = roomActionClient
  .inputSchema(deleteChatSchema)
  .action(async ({ parsedInput: { roomId }, ctx: { roomData } }) => {
    const room = await getRoomById(roomId);

    if (!room) {
      throw new AppError("Conversation not found.", 404);
    }

    if (roomData?.roomMember.role !== "admin") {
      throw new AppError("Unauthorized access", 401);
    }

    const memberIds = await getRoomMemberIds(roomId);

    await deleteRoom(roomId);

    await broadcastToUsers(memberIds, CHAT_EVENTS.CHAT_LIST_UPDATED, {
      roomId,
    });
  });
