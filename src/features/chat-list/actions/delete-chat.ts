"use server";

import { z } from "zod";
import {
  deleteRoom,
  deleteRoomMember,
  getRoomWithMembers,
} from "@/lib/db/queries";
import { authActionClient } from "@/lib/safe-action";
import { AppError } from "@/utils/app-error";

const deleteChatSchema = z.object({
  roomId: z.uuid(),
});

export const deleteChat = authActionClient
  .inputSchema(deleteChatSchema)
  .action(async ({ parsedInput: { roomId }, ctx: { user } }) => {
    const roomResult = await getRoomWithMembers(roomId, user.id);

    if (!roomResult) {
      throw new AppError("Conversation not found.", 404);
    }

    if (roomResult.room.roomType === "dm") {
      await deleteRoom(roomId);
      return;
    }

    await deleteRoomMember(roomId, user.id);
  });
