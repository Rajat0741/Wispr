"use server";

import { z } from "zod";
import { deleteRoom, deleteRoomMember, getRoomById } from "@/lib/db/queries";
import { roomActionClient } from "@/lib/safe-action";
import { AppError } from "@/utils/app-error";

const deleteChatSchema = z.object({
  roomId: z.uuid(),
});

export const deleteChat = roomActionClient
  .inputSchema(deleteChatSchema)
  .action(async ({ parsedInput: { roomId }, ctx: { user } }) => {
    const room = await getRoomById(roomId);

    if (!room) {
      throw new AppError("Conversation not found.", 404);
    }

    if (room.roomType === "dm") {
      await deleteRoom(roomId);
      return;
    }

    await deleteRoomMember(roomId, user.id);
  });
