"use server";

import { z } from "zod";
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

    await broadcastToRoom(roomId, "new-message", {
      ...message,
      sender: null,
    });
  });
